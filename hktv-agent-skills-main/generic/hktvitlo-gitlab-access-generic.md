# HKTV ITLO - GitLab MCP Access (Generic)

> **TO THE NEXT AGENT: Before doing anything with this document, you MUST enter Plan Mode.**
> Present a plan to your owner covering: what you intend to do, which files will you touch,
> and how you will verify the result. **Do not execute until your owner approves.**
> Follow the Planning & Execution Protocol: Analysis → Proposed Changes → Verification.

## Credential Security Rules

When working with credentials (username, password, tokens, API keys), agents must ONLY use one of these two approaches:

- **Broker**: Retrieve credentials through a credential broker or secret manager (e.g., Microsoft Secret Store, KeePassXC) — never hardcode or inline them.
- **Proxy**: Pass credentials to commands exclusively via pipe (`|`) — e.g., `Get-Secret -Name "X" | some-command`. Never pass credentials as command-line arguments, environment variables, or inline in scripts.
- **Never** embed credentials in source code, config files, scripts, command-line arguments, or chat output.

A secret named **"AI-AccessTokens-DB"** is stored in the **Microsoft Secret Store**, Vault **LocalStore**. It provides access to the **KDBX** database on this PC.
**Do NOT echo the secret directly or with `-Verbose` in the Claude session.** Always mask or suppress the secret value when retrieving it.

## Planning & Execution Protocol (Human Drive Pattern)

- **Always Plan First**: For any task more complex than a typo fix, you must enter "Plan Mode" first.
- **The Planning Template**: Every plan must include:
  1. **Analysis**: Current state of the relevant files.
  2. **Proposed Changes**: Specific logic changes per file.
  3. **Verification**: How you will test the change (specific commands).
- **Wait for Approval**: Do not execute shell commands or write files until I explicitly say "Proceed" or "Approved."
- **Cursor-Style Reasoning**: Think step-by-step about side effects and potential breaking changes before proposing.

---

## Context

The `/release` skill (CATSEARCH project) depends on GitLab MCP tools to manage merge requests, branches, and diffs against a self-hosted GitLab instance. The official GitLab plugin is hardcoded to `gitlab.com` and cannot target the self-hosted instance. This document covers the setup and configuration of the correct GitLab MCP server.

---

## 1. Problem: Official GitLab Plugin Is Incompatible

- The official GitLab plugin (`claude-plugins-official`) points to `https://gitlab.com/api/v4/mcp`
- It **cannot** be configured to target a self-hosted instance
- Your self-hosted instance: `https://ite-git01.hktv.com.hk/`
- Confirmed: API v4 returns 401 (exists), API v3 returns 410 (gone)

## 2. Solution: `@zereight/mcp-gitlab`

- A local stdio MCP server that translates to REST API v4 calls
- GitHub: https://github.com/zereight/gitlab-mcp
- Supports self-hosted GitLab instances

### Install Command

```bash
claude mcp add gitlab-catsearch --scope user -- npx -y @zereight/mcp-gitlab
```

### Required Environment Variables

| Variable | Value |
|---|---|
| `GITLAB_API_URL` | `https://ite-git01.hktv.com.hk/api/v4` |
| `GITLAB_TOKEN` | Your GitLab personal access token |

### Optional Environment Variables

| Variable | Purpose |
|---|---|
| `GITLAB_READ_ONLY_MODE` | Set to `true` for read-only access |
| `GITLAB_CA_CERT_PATH` | Path to CA cert if instance uses self-signed certificates |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` as alternative for self-signed certs |

## 3. Current Status

- `@zereight/mcp-gitlab` is **not yet installed or configured** in `settings.json`
- Two prior plans documented the setup but were not executed:
  - `plans/async-popping-russell.md` — prerequisites for `VERSION_RELEASE/SKILL.md`
  - `plans/temporal-inventing-frost.md` — prerequisites for `hktv-agent-skills/README.md`

## 4. Required MCP Tools

The release skill needs these 7 GitLab MCP tools:

| Tool | Purpose |
|---|---|
| `list_merge_requests` | List MRs by branch/state |
| `get_merge_request` | Check MR existence and merge status |
| `create_merge_request` | Create MR from feature branch to staging |
| `get_merge_request_diffs` | Get MR diffs by IID |
| `get_branch_diffs` | Get diffs between branches |
| `merge_merge_request` | Merge MR (with pipeline) |
| `create_branch` | Create release branch from staging |
