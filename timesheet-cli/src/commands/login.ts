import { createInterface } from "readline";
import { authenticate, checkAuth } from "../lib/auth";
import { saveConfig, loadConfig } from "../lib/config";

function envValue(name: string): string | undefined {
  const val = process.env[name];
  return val && val.length > 0 ? val : undefined;
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function loginCommand(): Promise<void> {
  const envAccount = envValue("TIMESHEET_ACCOUNT");
  const envPassword = envValue("TIMESHEET_PASSWORD");

  const account = envAccount ?? (await prompt("Account: "));
  const password = envPassword ?? (await prompt("Password: "));

  if (!account || !password) {
    console.error("Account and password are required.");
    process.exit(1);
  }

  const auth = await authenticate(account, password);
  const existing = loadConfig();
  const cfg = { ...existing, account, password, ...auth };
  saveConfig(cfg);

  // Fetch user profile
  try {
    const profile = (await checkAuth(auth.token)) as Record<string, unknown>;
    console.log(`\nLogin successful.`);
    console.log(`Name:       ${profile.englishName ?? "?"}`);
    console.log(`Account:    ${profile.account ?? account}`);
    console.log(`Title:      ${profile.title ?? "?"}`);
    console.log(`Department: ${Array.isArray(profile.department) ? profile.department.join(", ") : profile.department ?? "?"}`);
  } catch {
    console.log("Login successful.");
  }
}
