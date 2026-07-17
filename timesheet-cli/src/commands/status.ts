import { loadConfig, getConfigPath } from "../lib/config";

export async function statusCommand(): Promise<void> {
  const cfg = loadConfig();
  if (!cfg) {
    console.log(`Config: ${getConfigPath()}`);
    console.log("Not logged in. Run 'timesheet login' to authenticate.");
    return;
  }

  console.log(`Config: ${getConfigPath()}`);
  console.log(`Account: ${cfg.account}`);

  if (cfg.token) {
    const now = Math.floor(Date.now() / 1000);
    const valid = cfg.tokenExpiry !== undefined && cfg.tokenExpiry > now;
    console.log(`Token:  ${cfg.token.slice(0, 8)}...`);
    console.log(`Expiry: ${cfg.tokenExpiry ? new Date(cfg.tokenExpiry * 1000).toISOString() : "unknown"} (${valid ? "valid" : "EXPIRED"})`);
  } else {
    console.log("Token:  (none)");
  }
}
