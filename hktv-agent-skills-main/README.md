# HKTV Agent Skills

A collection of reusable skill configurations and reference documents for AI coding agents (Claude Code, Cursor, etc.) used at HKTVITLO.
 
---

## Table of Contents

- [Pre-requisite 1 - Install Claude Code](#pre-requisite-1---install-claude-code)
  - [Claude Code Download Link](#claude-code-download-link)
  - [Prepare Your Local Work Folder For Claude Code](#prepare-your-local-work-folder-for-claude-code)
  - [How to Open Claude Code](#how-to-open-claude-code)
  - [Replace Claude Code Model](#replace-claude-code-model)
- [Pre-requisite - Install KeePassXC](#pre-requisite---install-keepassxc)
- [Pre-requisite - Install KeePassXC CLI](#pre-requisite---install-keepassxc-cli)
- [Pre-requisite - Windows Platform - Microsoft Secret Store for Automation](#pre-requisite---windows-platform---microsoft-secret-store-for-automation)
- [Pre-requisite - Install Chrome Dev Tools MCP Server](#pre-requisite---install-chrome-dev-tools-mcp-server)
- [Pre-requisite - Install Playwright MCP Server](#pre-requisite---install-playwright-mcp-server)
- [Email Template for NOC](#email-template-for-noc)
- [Folder Structure](#folder-structure)
- [Hyper Agent Team - Claude Code Setup](#hyper-agent-team---claude-code-setup)

---

## Pre-requisite 1 - Install Claude Code

### Claude Code Download Link

https://claude.com/download

### Prepare Your Local Work Folder For Claude Code

Create a dedicated folder on your machine for Claude Code projects. Example:

```
D:\ai_work_area_claude_code
```

### How to Open Claude Code

1. **Open the Folder in Your Windows Desktop** — Navigate to your work folder in File Explorer.
2. **Type "cmd" In The Search Bar** — In the folder's address bar (or Windows search), type `cmd` and press Enter.
3. **After a Black Command Line Pops Up** — Type `claude` and press Enter.
4. **Claude Code Is Started If You See This Screen** — The Claude Code CLI interface will appear.

### Replace Claude Code Model

There is no login required to Claude Code after replacing the API Key. Below are guides for alternative model providers.

#### Xiaomi-v2-Pro Guide

> **Note:** This option requires payment — NOC is not currently using this model.

**Full Documentation:** https://platform.xiaomimimo.com/#/docs/integration/claudecode

**Steps:**

1. **Obtain MiMo API Key:** Sign up at [platform.xiaomimimo.com](https://platform.xiaomimimo.com) to get your API key.
2. **Installed Claude Code:** Make sure the `claude` CLI is installed (`npm install -g @anthropic-ai/claude-code`).

**Method:** Update `~/.claude/settings.json` (macOS/Linux) or `%USERPROFILE%\.claude\settings.json` (Windows).

**JSON Structure Example:**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.xiaomimimo.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_MIMO_API_KEY",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "mimo-v2-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "mimo-v2-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "mimo-v2-pro",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "hasCompletedOnboarding": true
}
```

**Key Considerations:**
- **Model Name:** Use `mimo-v2-flash` or `mimo-v2-pro` based on your access. MiMo-V2-Pro is noted for having strong coding abilities comparable to Claude Opus 4.6.
- **Base URL:** `https://api.xiaomimimo.com/anthropic` ensures requests formatted for Claude are accepted by the MiMo backend.
- **Functionality:** MiMo-V2 models are specifically trained for agentic tasks, meaning tool-calling (file edits, terminal commands) should work within the `claude` CLI environment.

#### Qwen Guide (NOC Way)

**JSON Structure Example:**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_QWEN_API_KEY",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen3.5-plus",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen3.5-plus",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen3.5-plus",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "hasCompletedOnboarding": true
}
```

#### Side Cut: Replace Cursor AI Model

The same MiMo API key and custom base URL can also be used to replace Cursor's AI model. Configure it in Cursor's settings using the same `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` values.

---

## Pre-requisite - Install KeePassXC

**Download Link:** https://keepassxc.org/download/

### KeePassXC Description

**What it does:**
KeePassXC is a free, open-source password manager that stores credentials in encrypted `.kdbx` database files. Databases are unlocked with a master password.

**How it differs from "cloud" managers:**
The default model is local — users control their vault file. No cloud sync unless you configure it yourself (e.g., via a shared drive).

**Security idea:**
The `.kdbx` file is encrypted at rest. Even if someone obtains the file, they cannot access its contents without the master password.

**KeePass vs KeePassXC:**
KeePassXC is a community fork of KeePass with a modern UI, cross-platform support, and CLI capabilities built in.

### After Download

1. Open KeePassXC.
2. Create a new database (KDBX 4 format).
3. Set a strong master password.
4. Choose a storage location for the `.kdbx` file.

---

## Pre-requisite - Install KeePassXC CLI (Command Line Interface) For Claude Code to Access

### Simply Ask In Claude Code

You can simply ask Claude Code to install the KeePassXC CLI companion tool for command-line access to your database.

---

## Pre-requisite - Windows Platform - Microsoft Secret Store for Automation

This setup enables Claude Code to retrieve secrets (like API tokens from KeePass) without manual password prompts.

### Installation Powershell Command

```powershell
Install-Module -Name Microsoft.PowerShell.SecretManagement -Force
Install-Module -Name Microsoft.PowerShell.SecretStore -Force
```

### Enter this to your Local Powershell to Store your KeePass DB Password

```powershell
Set-Secret -Name 'AI-AccessTokens-DB' -Secret 'YOUR_KEEPASS_MASTER_PASSWORD' -Vault LocalStore
```

### Then, Configure the Secret Store so No Password Prompt or Login Required, but Also Have Windows User Level Encryption to Protect The Secret

```powershell
Set-SecretStoreConfiguration -Authentication None -Interaction None -Confirm:$false
```

This configures the SecretStore to auto-unlock for the current Windows user without prompting for a password, while still encrypting secrets with Windows user-level credentials (DPAPI).

### Methodology

- `Microsoft.PowerShell.SecretManagement` provides the vault abstraction layer.
- `Microsoft.PowerShell.SecretStore` is the local encrypted vault backend.
- Secrets are protected by Windows DPAPI tied to the current user account.

### Microsoft Reference

https://learn.microsoft.com/en-us/powershell/utility-modules/secretmanagement/

---

## Pre-requisite - Install Chrome Dev Tools MCP Server (Use When HTML is Small)

For smaller HTML pages and quick inspections, use the Chrome DevTools MCP server.

### Install Chrome Dev Tools MCP Server

Ask Claude Code to install the Chrome DevTools MCP server from the [ChromeDevTools GitHub repository](https://github.com/ChromeDevTools).

---

## Pre-requisite - Install Playwright MCP Server (Use When HTML is LARGE => Consume Token)

For larger web pages where full HTML content would consume excessive tokens, Playwright MCP is the recommended alternative. It provides structured access to page content without dumping the entire HTML.

Ask Claude Code to install the Playwright MCP server.

---

## Email Template for NOC

Use this template to request NOC to set up a teammate's computer.

### Email To

`noc@hktv.com.hk, pc_support@hktv.com.hk`

**Subject:** Request to Install Claude Code and Dependencies on [Teammate's Name]'s Computer

**Body:**

Dear NOC / PC Support,

Please install the following on [Teammate's Name]'s computer, with approval from [Department Head's Name]:

1. **Claude Code CLI** — https://claude.com/download
2. **Claude Code API Key Configuration** — Custom API key setup (details to follow)
3. **KeePassXC** — https://keepassxc.org/download/
4. **KeePassXC CLI** — Command-line companion for KeePassXC
5. **Python 3** — Required for various automation scripts

Please confirm once completed.

Thank you.

---

## Folder Structure

```
hktv-agent-skills/
├── README.md                          # This file
├── generic/
│   └── hktvitlo-confluence-access-generic.md   # Confluence API access template
└── hktv-hyper-agent-team/             # Hyper agent team harness (staging / source)
    └── .claude/                       # Pack contents to deploy into Claude Code
        ├── agents/                    # → copy to ~/.claude/agents/agents/
        ├── instructions/              # → copy to ~/.claude/agents/instructions/
        ├── prompts/                   # → copy to ~/.claude/agents/prompts/
        └── .agent_plan/               # → copy to ~/.claude/agents/.agent_plan/
```

### generic/

Contains generic, reusable reference documents that apply across projects.

- **`hktvitlo-confluence-access-generic.md`** — Template for accessing the HKTVITLO Confluence/Jira API. Uses `${VARIABLE}` placeholders — fill in your own credentials before use.

---

## Hyper Agent Team - Claude Code Setup

Claude Code loads the Hyper agent pack from your **user-level agent directory**. On Windows that is `%USERPROFILE%\.claude\agents\`; on macOS/Linux it is `~/.claude/agents/`.

You must place these **four folders together** under that directory (paths are relative to the agent pack root):

```
~/.claude/agents/
├── .agent_plan/       # Planning artifacts (day_dream templates, red_team, expedition, etc.)
├── agents/            # Subagent definitions (*.agent.md)
├── instructions/      # Instruction files (*.instructions.md)
└── prompts/           # Prompt files (*.prompt.md)
```

### Deploy from this repo

Copy the contents of `hktv-hyper-agent-team/.claude/` into `~/.claude/agents/` so the layout matches the tree above. Example on Windows (PowerShell):

```powershell
$packRoot = Join-Path $env:USERPROFILE ".claude\agents"
$source   = "path\to\hktv-agent-skills\hktv-hyper-agent-team\.claude"

New-Item -ItemType Directory -Force -Path $packRoot | Out-Null
Copy-Item -Path (Join-Path $source "agents")       -Destination (Join-Path $packRoot "agents")       -Recurse -Force
Copy-Item -Path (Join-Path $source "instructions") -Destination (Join-Path $packRoot "instructions") -Recurse -Force
Copy-Item -Path (Join-Path $source "prompts")      -Destination (Join-Path $packRoot "prompts")      -Recurse -Force
Copy-Item -Path (Join-Path $source ".agent_plan")  -Destination (Join-Path $packRoot ".agent_plan")  -Recurse -Force
```

Replace `path\to\hktv-agent-skills` with your local clone path.

### After copying

1. **Restart Claude Code** (or start a new session) so updated subagent definitions are loaded.
2. Confirm subagents appear via `/agents` → **Library**.
3. Internal references in the pack assume this layout — for example `agents/hyper_orchestrator.agent.md` and `instructions/workflows/orch_routing_preset.instructions.md` are resolved relative to `~/.claude/agents/`.

### Do not split the pack across unrelated paths

- Do not leave agent files only in the git repo without copying them to `~/.claude/agents/agents/`.
- Do not mix `%USERPROFILE%\.claude\agents\` (runtime pack) with project-only `.claude/` folders unless you intentionally maintain two copies.
- All four folders (`.agent_plan`, `agents`, `instructions`, `prompts`) must sit under the same agent pack root for routing, presets, and templates to work.
