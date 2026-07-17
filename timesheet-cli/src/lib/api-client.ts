import { loadConfig, saveConfig, type TimesheetConfig } from "./config";
import { authenticate } from "./auth";

const BASE_URL = "https://timesheet-api.shoalter.com";
const WEB_ORIGIN = "https://timesheet.shoalter.com";
const WEB_REFERER = "https://timesheet.shoalter.com/";

function requestUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function envValue(name: string): string | undefined {
  const val = process.env[name];
  return val && val.length > 0 ? val : undefined;
}

async function resolveCredentials(): Promise<{ config: TimesheetConfig; persist: boolean }> {
  const envAccount = envValue("TIMESHEET_ACCOUNT");
  const envPassword = envValue("TIMESHEET_PASSWORD");

  if (envAccount && envPassword) {
    return { config: { account: envAccount, password: envPassword }, persist: false };
  }

  const diskConfig = loadConfig();
  const envUsed = envAccount !== undefined || envPassword !== undefined;
  const account = envAccount ?? diskConfig?.account;
  const password = envPassword ?? diskConfig?.password;

  if (!account || !password) {
    throw new Error("Not logged in. Run `timesheet login` or set TIMESHEET_ACCOUNT and TIMESHEET_PASSWORD.");
  }

  return {
    config: {
      account,
      password,
      token: envUsed ? undefined : diskConfig?.token,
      tokenExpiry: envUsed ? undefined : diskConfig?.tokenExpiry,
    },
    persist: !envUsed,
  };
}

async function sendRequest(method: string, path: string, body: unknown, cfg: TimesheetConfig): Promise<Response> {
  if (!cfg.token) throw new Error("Missing authentication token.");
  return fetch(requestUrl(path), {
    method,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
      Origin: WEB_ORIGIN,
      Referer: WEB_REFERER,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function unwrapResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    if (!response.ok) throw new Error(`API request failed with HTTP ${response.status}`);
    return text;
  }

  const data = payload as Record<string, unknown>;
  if (!response.ok) {
    const status = data.status as Record<string, unknown> | undefined;
    const msg = status?.message ?? status?.msg ?? data.message ?? data.error;
    throw new Error(typeof msg === "string" ? msg : `API request failed with HTTP ${response.status}`);
  }

  if (typeof data === "object" && data !== null) {
    const status = data.status as Record<string, unknown> | undefined;
    if (status && status.code !== "success") {
      const msg = status.message ?? status.msg ?? status.error;
      throw new Error(typeof msg === "string" ? msg : "API request failed");
    }
    if ("data" in data) return data.data;
  }

  return payload;
}

async function refreshAuth(cfg: TimesheetConfig, persist: boolean): Promise<TimesheetConfig> {
  const auth = await authenticate(cfg.account, cfg.password);
  const updated = { ...cfg, ...auth };
  if (persist) saveConfig(updated);
  return updated;
}

export async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const credentials = await resolveCredentials();
  let cfg = credentials.config;

  // Ensure we have a valid token
  if (!cfg.token || !cfg.tokenExpiry || cfg.tokenExpiry <= Math.floor(Date.now() / 1000) + 60) {
    cfg = await refreshAuth(cfg, credentials.persist);
  }

  let response = await sendRequest(method, path, body, cfg);

  // Retry on auth failure
  if (response.status === 401 || response.status === 403) {
    cfg = await refreshAuth(cfg, credentials.persist);
    response = await sendRequest(method, path, body, cfg);
  }

  return unwrapResponse(response);
}
