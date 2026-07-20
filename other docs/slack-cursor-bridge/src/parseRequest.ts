import path from "node:path";
import { joinUnderRoot, isPathUnderAllowlist, type ValidateResult } from "./validatePath.js";
import { readFileSync, existsSync } from "node:fs";

export type WorkspacesMap = Record<string, string>;

export function loadWorkspacesMap(configPath: string | undefined): WorkspacesMap {
  if (!configPath || !existsSync(configPath)) {
    return {};
  }
  const raw = readFileSync(configPath, "utf8");
  const data = JSON.parse(raw) as WorkspacesMap;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data;
  }
  return {};
}

/**
 * Strips <@U...> and <@U...|name> from Slack app mention text.
 * Newlines are preserved; only horizontal whitespace is tidied so WORKSPACE: / PROMPT: blocks stay on separate lines.
 */
export function stripSlackMentions(text: string): string {
  return text
    .replace(/<@[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export type ParseResult =
  | { ok: true; mode: "alias" | "path"; workspaceValue: string; prompt: string }
  | { ok: false; error: string };

/**
 * Message format (after optional mention strip):
 *
 * ```
 * WORKSPACE_ALIAS: myapp
 * PROMPT:
 * Your instructions here
 * ```
 *
 * Or:
 * ```
 * WORKSPACE: subdir\\myapp
 * PROMPT:
 * ...
 * ```
 */
export function parseSlackMessage(body: string): ParseResult {
  const text = body.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return { ok: false, error: "Empty message" };
  }

  const hasAlias = /^\s*WORKSPACE_ALIAS:/im.test(text);
  const hasWorkspace = /^\s*WORKSPACE:/im.test(text);
  if (hasAlias && hasWorkspace) {
    return { ok: false, error: "Use only one of WORKSPACE_ALIAS or WORKSPACE" };
  }
  if (!hasAlias && !hasWorkspace) {
    return {
      ok: false,
      error: 'Include WORKSPACE_ALIAS: (or WORKSPACE:) and a PROMPT: block (see README).',
    };
  }

  const mode = hasAlias ? "alias" : "path";
  const firstLineRe =
    mode === "alias"
      ? /^\s*WORKSPACE_ALIAS:\s*(.*)$/im
      : /^\s*WORKSPACE:\s*(.*)$/im;
  const wm = text.match(firstLineRe);
  const workspaceValue = wm?.[1]?.trim() ?? "";
  if (!workspaceValue) {
    return { ok: false, error: "WORKSPACE / WORKSPACE_ALIAS value is empty" };
  }

  // Line-anchored; case-insensitive. Fallback: PROMPT: mid-line (e.g. if mention-strip once flattened lines).
  const pm =
    /^\s*PROMPT:\s*([\s\S]+)/im.exec(text) ?? /\bPROMPT:\s*([\s\S]+)/i.exec(text);
  if (!pm) {
    return { ok: false, error: "Missing PROMPT: section" };
  }
  const prompt = (pm[1] ?? "").trim();
  if (!prompt) {
    return { ok: false, error: "PROMPT body is empty" };
  }

  return { ok: true, mode, workspaceValue, prompt };
}

/**
 * Resolves `parseSlackMessage` result to a filesystem path using allowlist + optional workspaces.json.
 */
export function resolveWorkspacePath(
  parse: Extract<ParseResult, { ok: true }>,
  allowlistRoots: string[],
  workspaces: WorkspacesMap
): { result: ValidateResult; resolution: "alias" | "relative" | "absolute" } {
  if (parse.mode === "alias") {
    const key = parse.workspaceValue;
    const sub = workspaces[key];
    if (!sub) {
      return {
        result: { ok: false, error: `Unknown WORKSPACE_ALIAS "${key}" in workspaces.json` },
        resolution: "alias",
      };
    }
    if (path.isAbsolute(sub)) {
      return {
        result: isPathUnderAllowlist(allowlistRoots, sub),
        resolution: "absolute",
      };
    }
    if (allowlistRoots.length === 0) {
      return { result: { ok: false, error: "ALLOWLIST_ROOTS not set" }, resolution: "alias" };
    }
    let joined: string;
    try {
      joined = joinUnderRoot(allowlistRoots[0]!, sub);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid path";
      return { result: { ok: false, error: msg }, resolution: "alias" };
    }
    return { result: isPathUnderAllowlist(allowlistRoots, joined), resolution: "alias" };
  }

  const ws = parse.workspaceValue;
  if (path.isAbsolute(ws)) {
    return { result: isPathUnderAllowlist(allowlistRoots, ws), resolution: "absolute" };
  }
  if (allowlistRoots.length === 0) {
    return { result: { ok: false, error: "ALLOWLIST_ROOTS not set" }, resolution: "relative" };
  }
  let joined: string;
  try {
    joined = joinUnderRoot(allowlistRoots[0]!, ws);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid path";
    return { result: { ok: false, error: msg }, resolution: "relative" };
  }
  return { result: isPathUnderAllowlist(allowlistRoots, joined), resolution: "relative" };
}
