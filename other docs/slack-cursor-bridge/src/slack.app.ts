import { App, LogLevel } from "@slack/bolt";
import dotenv from "dotenv";
import path from "node:path";
import {
  loadWorkspacesMap,
  parseSlackMessage,
  resolveWorkspacePath,
  stripSlackMentions,
} from "./parseRequest.js";
import { parseAllowlistRoots } from "./validatePath.js";
import { runAgentCli, formatSlackExcerpt } from "./runAgent.js";
import { appendAuditLine, hashPrompt } from "./auditLog.js";
import { withWorkspaceLock } from "./queue.js";

dotenv.config();

function parseIdList(s: string | undefined): string[] {
  if (!s?.trim()) {
    return [];
  }
  return s
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

const allowedUserIds = parseIdList(process.env.ALLOWED_SLACK_USER_IDS);
const allowedChannelIds = parseIdList(process.env.ALLOWED_SLACK_CHANNEL_IDS);
const allowlistRoots = parseAllowlistRoots(process.env.ALLOWLIST_ROOTS);
const workspacesPath = process.env.WORKSPACES_JSON;
const auditPath =
  process.env.AUDIT_LOG_FILE ??
  path.join(process.cwd(), ".cursor-bridge", "audit.log");
const logDir = process.env.BRIDGE_LOG_DIR ?? path.join(process.cwd(), ".cursor-bridge", "agent-logs");
const agentCommand = process.env.CURSOR_AGENT_CMD;
const timeoutMs = Math.max(0, parseInt(process.env.AGENT_TIMEOUT_MS ?? "0", 10) || 0);
const appLogLevel = (process.env.SLACK_LOG_LEVEL as keyof typeof LogLevel) ?? "INFO";

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;
const appToken = process.env.SLACK_APP_TOKEN;

if (!token || !signingSecret || !appToken) {
  // eslint-disable-next-line no-console
  console.error(
    "Set SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, and SLACK_APP_TOKEN in the environment (see .env.example)."
  );
  process.exit(1);
}

const app = new App({
  token,
  signingSecret,
  socketMode: true,
  appToken,
  logLevel: LogLevel[appLogLevel] ?? LogLevel.INFO,
});

function isUserAllowed(slackUserId: string | undefined): boolean {
  if (!slackUserId) {
    return false;
  }
  if (allowedUserIds.length === 0) {
    // Plan recommends default-deny: require at least one user; document in README
    return false;
  }
  return allowedUserIds.includes(slackUserId);
}

function isChannelAllowed(channel: string | undefined): boolean {
  if (!channel) {
    return false;
  }
  if (allowedChannelIds.length === 0) {
    return true;
  }
  return allowedChannelIds.includes(channel);
}

app.event("app_mention", async ({ event, client, logger }) => {
  if (event.type !== "app_mention" || "subtype" in event) {
    return;
  }
  if (!isChannelAllowed(event.channel) || !isUserAllowed(event.user)) {
    await client.chat
      .postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts ?? event.ts,
        text:
          "You are not allowed to use this bridge, or the channel is not on the allowlist. Ask the admin to set `ALLOWED_SLACK_USER_IDS` and optionally `ALLOWED_SLACK_CHANNEL_IDS` in the bridge `.env`.",
      })
      .catch((e) => logger.error(e));
    return;
  }

  const rawText = (event as { text?: string }).text ?? "";
  const text = stripSlackMentions(rawText);
  const threadTs = event.thread_ts ?? event.ts;

  await client.chat
    .postMessage({
      channel: event.channel,
      thread_ts: threadTs,
      text: "Received. Starting local `agent` run…",
    })
    .catch((e) => logger.error(e));

  const workspaces = loadWorkspacesMap(workspacesPath);
  const parsed = parseSlackMessage(text);
  if (!parsed.ok) {
    await client.chat
      .postMessage({
        channel: event.channel,
        thread_ts: threadTs,
        text: `Parse error: ${parsed.error}`,
      })
      .catch((e) => logger.error(e));
    return;
  }

  const { result } = resolveWorkspacePath(parsed, allowlistRoots, workspaces);
  if (!result.ok) {
    await client.chat
      .postMessage({
        channel: event.channel,
        thread_ts: threadTs,
        text: `Path error: ${result.error}`,
      })
      .catch((e) => logger.error(e));
    return;
  }

  const workspace = result.resolved;
  const prompt = parsed.prompt;
  const userId = event.user!;

  appendAuditLine(auditPath, {
    slackUser: userId,
    workspace,
    promptHash: hashPrompt(prompt),
  });

  setImmediate(() => {
    void (async () => {
      const r = await withWorkspaceLock(workspace, () =>
        runAgentCli(workspace, prompt, { command: agentCommand, timeoutMs, logDir })
      );
      if (r && typeof r === "object" && "blocked" in r && (r as { blocked: boolean }).blocked) {
        const msg = (r as { message: string }).message;
        await client.chat
          .postMessage({
            channel: event.channel,
            thread_ts: threadTs,
            text: `Skipped: ${msg}`,
          })
          .catch((e) => logger.error(e));
        return;
      }
      const out = r as Awaited<ReturnType<typeof runAgentCli>>;
      const body = formatSlackExcerpt(out) + (out.logFile ? `\n\n_log: ${out.logFile}_` : "");
      await client.chat
        .postMessage({
          channel: event.channel,
          thread_ts: threadTs,
          text: body,
        })
        .catch((e) => logger.error(e));
    })();
  });
});

(async () => {
  const port = parseInt(process.env.PORT ?? "0", 10) || 0;
  await app.start(port);
  // eslint-disable-next-line no-console
  console.log("Slack Cursor bridge is running (Socket Mode).");
})().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
