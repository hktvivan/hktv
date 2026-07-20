import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function appendAuditLine(
  logFile: string,
  line: { slackUser: string; workspace: string; promptHash: string }
): void {
  const dir = path.dirname(logFile);
  fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString();
  const rec = { ts, ...line };
  fs.appendFileSync(logFile, JSON.stringify(rec) + "\n", "utf8");
}

export function hashPrompt(prompt: string): string {
  return crypto.createHash("sha256").update(prompt, "utf8").digest("hex").slice(0, 16);
}
