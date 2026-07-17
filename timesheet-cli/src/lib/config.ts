import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";

export interface TimesheetConfig {
  account: string;
  password: string;
  token?: string;
  tokenExpiry?: number;
}

function getConfigDir(): string {
  const home = homedir();
  if (!home) throw new Error("Unable to resolve home directory for timesheet config.");
  return join(home, ".config", "timesheet");
}

export function getConfigPath(): string {
  return join(getConfigDir(), "config.json");
}

export function loadConfig(): TimesheetConfig | null {
  const path = getConfigPath();
  if (!existsSync(path)) return null;
  const parsed = JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>;
  if (typeof parsed.account !== "string" || typeof parsed.password !== "string") {
    throw new Error(`Invalid timesheet config at ${path}.`);
  }
  const cfg: TimesheetConfig = { account: parsed.account, password: parsed.password };
  if (typeof parsed.token === "string") cfg.token = parsed.token;
  if (typeof parsed.tokenExpiry === "number") cfg.tokenExpiry = parsed.tokenExpiry;
  return cfg;
}

export function saveConfig(cfg: TimesheetConfig): void {
  const dir = getConfigDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const path = getConfigPath();
  writeFileSync(path, JSON.stringify(cfg, null, 2) + "\n", "utf-8");
  chmodSync(path, 0o600);
}
