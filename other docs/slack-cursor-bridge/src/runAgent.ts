import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  augmentPathForAgent,
  resolveAgentCommand,
  AGENT_NOT_FOUND_HINT,
} from "./resolveAgent.js";

export type RunAgentOptions = {
  command?: string;
  /** Milliseconds; 0 = no timeout */
  timeoutMs: number;
  logDir: string;
};

export type RunAgentResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  logFile: string;
};

/**
 * Spawns `agent` in non-interactive print mode. Resolves the executable via
 * `CURSOR_AGENT_CMD`, or `%USERPROFILE%\.local\bin\agent*`, or `agent` on PATH
 * (PATH is augmented with `.local\bin` on Windows when that folder exists).
 */
export function runAgentCli(
  workspace: string,
  userPrompt: string,
  options: RunAgentOptions
): Promise<RunAgentResult> {
  const cmd = resolveAgentCommand(options.command);
  const childEnv = augmentPathForAgent(process.env);
  const isWin = process.platform === "win32";
  const useShell =
    isWin &&
    !(
      path.isAbsolute(cmd) ||
      /^[A-Za-z]:[\\/]/.test(cmd) ||
      cmd.startsWith("\\\\")
    );
  const args = [
    "-p",
    userPrompt,
    "--workspace",
    workspace,
    "--output-format",
    "text",
    "--trust",
  ];

  fs.mkdirSync(options.logDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(options.logDir, `run-${stamp}.log`);

  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: childEnv,
      shell: useShell,
    });
    const chunks: Buffer[] = [];
    const errChunks: Buffer[] = [];
    child.stdout?.on("data", (d) => chunks.push(d));
    child.stderr?.on("data", (d) => errChunks.push(d));

    const killTimer =
      options.timeoutMs > 0
        ? setTimeout(() => {
            child.kill("SIGTERM");
            errChunks.push(Buffer.from("\n[bridge] Killed: timeout"));
          }, options.timeoutMs)
        : null;

    child.on("close", (code) => {
      if (killTimer) {
        clearTimeout(killTimer);
      }
      const stdout = Buffer.concat(chunks).toString("utf8");
      let stderr = Buffer.concat(errChunks).toString("utf8");
      if (
        code !== 0 &&
        isWin &&
        /is not recognized as an internal or external command|not find.*\bagent\b/i.test(
          stderr
        )
      ) {
        stderr += "\n[bridge] " + AGENT_NOT_FOUND_HINT;
      }
      const logBody = `cmd=${cmd} shell=${useShell}\nexit=${code}\n\n--- STDOUT ---\n${stdout}\n\n--- STDERR ---\n${stderr}\n`;
      try {
        fs.appendFileSync(logFile, logBody, "utf8");
      } catch {
        // ignore
      }
      resolve({
        exitCode: code,
        stdout,
        stderr,
        logFile,
      });
    });

    child.on("error", (err) => {
      if (killTimer) {
        clearTimeout(killTimer);
      }
      const msg = err instanceof Error ? err.message : String(err);
      const logBody = `spawn error: ${msg}\n`;
      try {
        fs.appendFileSync(logFile, logBody, "utf8");
      } catch {
        // ignore
      }
      resolve({
        exitCode: null,
        stdout: "",
        stderr: logBody,
        logFile,
      });
    });
  });
}

/**
 * Trims output for Slack; max length to avoid API limits.
 */
export function formatSlackExcerpt(
  out: { stdout: string; stderr: string; exitCode: number | null },
  max = 3500
): string {
  const head = (s: string) => (s.length > max ? s.slice(0, max) + "\n…(truncated)" : s);
  const parts = [
    `exit code: ${out.exitCode === null ? "n/a" : out.exitCode}`,
    out.stderr.trim() ? `--- stderr ---\n${head(out.stderr)}` : "",
    out.stdout.trim() ? `--- stdout ---\n${head(out.stdout)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  return head(parts);
}
