import { loadConfig, saveConfig, type TimesheetConfig } from "./config";

const BASE_URL = "https://timesheet-api.shoalter.com";
const WEB_ORIGIN = "https://timesheet.shoalter.com";
const WEB_REFERER = "https://timesheet.shoalter.com/";

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtExp(token: string): number {
  const [, payload] = token.split(".");
  if (!payload) throw new Error("Invalid JWT: missing payload.");
  const decoded = JSON.parse(decodeBase64Url(payload));
  if (typeof decoded !== "object" || decoded === null || typeof decoded.exp !== "number") {
    throw new Error("Invalid JWT: missing numeric exp claim.");
  }
  return decoded.exp;
}

function isTokenValid(cfg: TimesheetConfig): boolean {
  if (!cfg.token || !cfg.tokenExpiry) return false;
  const now = Math.floor(Date.now() / 1000);
  return cfg.tokenExpiry > now + 60;
}

export async function authenticate(account: string, password: string): Promise<{ token: string; tokenExpiry: number }> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: WEB_ORIGIN,
      Referer: WEB_REFERER,
    },
    body: JSON.stringify({ data: { account, password } }),
  });

  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Login failed (${response.status}): ${text}`);
  }

  const data = payload as Record<string, unknown>;
  if (!response.ok) {
    const status = data.status as Record<string, unknown> | undefined;
    const msg = status?.message ?? status?.msg ?? data.message ?? data.error;
    throw new Error(typeof msg === "string" ? msg : `Login failed with HTTP ${response.status}`);
  }

  const status = data.status as Record<string, unknown> | undefined;
  if (status && status.code !== "success") {
    const msg = status.message ?? status.msg ?? status.error;
    throw new Error(typeof msg === "string" ? msg : "Login failed");
  }

  const responseData = data.data as Record<string, unknown> | undefined;
  const token = (responseData?.token ?? data.token) as string | undefined;
  if (!token) throw new Error("Login response did not include a token.");

  return { token, tokenExpiry: decodeJwtExp(token) };
}

export async function ensureAuth(cfg: TimesheetConfig): Promise<TimesheetConfig> {
  if (isTokenValid(cfg)) return cfg;
  const auth = await authenticate(cfg.account, cfg.password);
  const updated = { ...cfg, ...auth };
  saveConfig(updated);
  return updated;
}

export async function checkAuth(token: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${BASE_URL}/auth/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Origin: WEB_ORIGIN,
      Referer: WEB_REFERER,
    },
  });
  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Auth check failed (${response.status}): ${text}`);
  }
  const data = payload as Record<string, unknown>;
  if (!response.ok) {
    const status = data.status as Record<string, unknown> | undefined;
    const msg = status?.message ?? status?.msg ?? data.message ?? data.error;
    throw new Error(typeof msg === "string" ? msg : `Auth check failed with HTTP ${response.status}`);
  }
  const responseData = data.data as Record<string, unknown> | undefined;
  return responseData ?? data;
}
