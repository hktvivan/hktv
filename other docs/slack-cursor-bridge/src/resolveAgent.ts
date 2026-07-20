import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const AGENT_CANDIDATE_NAMES = [
  "agent.exe",
  "agent.cmd",
  "agent",
] as const;

/**
 * Returns the first path that exists under `~/.local/bin` (per Cursor CLI install docs),
 * or `null` if none found.
 */
function findInLocalBin(): string | null {
  const home = os.homedir();
  if (!home) {
    return null;
  }
  const dir = path.join(home, ".local", "bin");
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return null;
  }
  for (const name of AGENT_CANDIDATE_NAMES) {
    const full = path.join(dir, name);
    if (fs.existsSync(full)) {
      return full;
    }
  }
  return null;
}

/**
 * Resolves the agent executable. Order: explicit `CURSOR_AGENT_CMD`, then
 * `~/.local/bin` on this machine, then the bare `agent` name (relies on PATH).
 */
export function resolveAgentCommand(explicit: string | undefined): string {
  if (explicit?.trim()) {
    return explicit.trim();
  }
  const inBin = findInLocalBin();
  if (inBin) {
    return inBin;
  }
  return "agent";
}

/**
 * If we run a bare `agent` name, prepend Cursor's default Windows install directory
 * to `PATH` so `cmd.exe` can find it when `shell: true` (per docs, `~/.local/bin` on Windows
 * is the typical install path).
 */
export function augmentPathForAgent(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const home = os.homedir();
  if (!home) {
    return { ...env };
  }
  const localBin = path.join(home, ".local", "bin");
  if (!fs.existsSync(localBin) || !fs.statSync(localBin).isDirectory()) {
    return { ...env };
  }
  const prefix = localBin + path.delimiter;
  const next: NodeJS.ProcessEnv = { ...env };
  const p = String(next.Path ?? next.PATH ?? "");
  if (p.toLowerCase().includes(localBin.toLowerCase())) {
    return next;
  }
  const merged = prefix + p;
  next.Path = merged;
  next.PATH = merged;
  return next;
}

/**
 * Suggested one-line for Slack or logs when the resolved command is the bare `agent` name
 * and we still expect the user to fix PATH or set CURSOR_AGENT_CMD.
 */
export const AGENT_NOT_FOUND_HINT =
  "The Cursor `agent` CLI was not found. On Windows, run `irm https://cursor.com/install?win32=true | iex` " +
  "or set CURSOR_AGENT_CMD in .env to the full path to agent.exe (often %USERPROFILE%\\\\.local\\\\bin\\\\agent.exe). " +
  "The bridge prepends .local\\\\bin to PATH, but a full path is the most reliable.";
