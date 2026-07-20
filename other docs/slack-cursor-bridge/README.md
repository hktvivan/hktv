# Slack → local PC → Cursor CLI bridge

A small [Socket Mode](https://slack.dev/bolt-js/concepts#socket-mode) app that listens for **app mentions** in Slack, validates a local workspace path or alias, then runs the Cursor [`agent` CLI](https://www.cursor.com/docs/cli/overview) in **print** mode and posts the result (trimmed) back in the same thread.

**This is not an official Cursor product.** Run it only on a machine you control, with strict allowlists.

## Prerequisites

- **Node.js 18+** on the PC that will run the bridge (must stay on for Slack to work).
- **Slack** workspace permission to create/install an app (or an admin to approve it).
- **Cursor CLI** installed and authenticated for your user, for example:

  ```powershell
  irm 'https://cursor.com/install?win32=true' | iex
  agent login
  ```

  Ensure the CLI works for the same Windows user that runs the bridge. The installer often puts the binary under `%USERPROFILE%\.local\bin`. If `agent` is not on your system `PATH` for non-interactive processes, set **`CURSOR_AGENT_CMD` in `.env` to the full path** to `agent.exe`, for example:

  `C:\Users\You\.local\bin\agent.exe`

  The bridge prepends `.local\bin` to the child `PATH` when that folder exists, but a full path in `CURSOR_AGENT_CMD` is the most reliable. If the CLI is only installed inside **WSL**, the bridge (running in Node on Windows) cannot use it; install the Windows native script above or point `CURSOR_AGENT_CMD` at a wrapper you control.

## Slack app (dashboard)

1. Open [https://api.slack.com/apps](https://api.slack.com/create) and create an app (from scratch is fine for development).
2. **Socket Mode**: enable it and create an **App-Level Token** with the `connections:write` scope. Put it in `SLACK_APP_TOKEN` (`xapp-...`).
3. **OAuth & Permissions** — **Bot Token Scopes** (suggested):
   - `app_mentions:read`
   - `chat:write`
   - `channels:history` (if the bot must read prior thread context; optional for this bridge)
   - `im:read` / `im:write` (only if you use DMs)
4. **Event Subscriptions**: enable **app_mention** in **Subscribe to bot events**.
5. **Install the app** to the workspace, copy the **Bot User OAuth Token** into `SLACK_BOT_TOKEN` (`xoxb-...`).
6. In **Basic Information** → **App Credentials**, copy **Signing Secret** to `SLACK_SIGNING_SECRET`.
7. In Slack, **invite the bot** to a channel: `/invite @YourBotName`.

## Configuration

1. Copy `.env.example` to `.env` in this folder and fill in tokens and allowlists.
2. `ALLOWED_SLACK_USER_IDS` is **required** and must list your Slack user ID (Profile → … → **Copy member ID**). If empty, the bridge **denies everyone**.
3. `ALLOWED_SLACK_CHANNEL_IDS` is optional. If set, the bot only responds in those channel IDs; leave unset to allow any channel where the bot is present.
4. `ALLOWLIST_ROOTS`: absolute paths. Any resolved workspace (relative path, alias, or allowed absolute) must end up under one of these roots after `realpath` matching.
5. **Aliases (recommended):** copy [config/workspaces.example.json](config/workspaces.example.json) to `config/workspaces.json`, edit mappings, and set `WORKSPACES_JSON=config/workspaces.json` in `.env`.

## Message format (in the mention text)

Mention the bot, then use **either** `WORKSPACE:` **or** `WORKSPACE_ALIAS:`, and a `PROMPT:` block:

```text
@YourBot
WORKSPACE_ALIAS: myapp
PROMPT:
Describe what you want the local agent to do in one or more lines.
```

Or, relative to the first allowlist root:

```text
@YourBot
WORKSPACE: myrepo\api
PROMPT:
List files in src
```

An absolute `WORKSPACE:` is allowed only if the resolved path remains under an allowlist root.

Use line breaks between `WORKSPACE:` / `PROMPT:` and the prompt body. The bridge removes `@mention` tags but **keeps newlines** so `PROMPT:` is still recognized on its own line.

## Build and run

```powershell
cd slack-cursor-bridge
npm install
npm run build
npm start
```

Keep this process running (a terminal, `nssm`, a scheduled “at logon” job, or similar) while you use the bridge from Slack.

- **PORT**: the Bolt app still starts a small HTTP server; default `0` (OS-assigned) is enough for Socket Mode. Change if your environment needs a fixed port.
- **AGENT_TIMEOUT_MS**: optional; `0` means no kill timeout.

## Security

- Treat all Slack text as **untrusted**. The bridge enforces `ALLOWLIST_ROOTS`, rejects `..` in relative paths, and logs a **SHA-256 (short) hash** of the prompt, not the full text, to `audit.log` by default.
- **Concurrent runs**: a single **in-process lock** per resolved workspace path prevents two overlapping `agent` runs in the same folder. A second request gets a “Skipped” message.
- For teams, add per-user and per-channel restrictions and only install the app where needed.

## Development

```powershell
npm test
```

## Troubleshooting (Windows)

- If `agent` is not found, add it to `PATH` or set `CURSOR_AGENT_CMD` to a full path.
- The bridge spawns the CLI with your user environment. Run `agent status` in the same account before relying on the bridge.
- `shell: true` is used on Windows when spawning the CLI to improve PATH resolution for `agent.cmd`‐style shims. Prefer explicit `CURSOR_AGENT_CMD` if you want a fixed binary.

## License

The bridge code in this directory is part of the repository that contains it; use and modify it under the same terms as the parent project, or add a license of your choice.
