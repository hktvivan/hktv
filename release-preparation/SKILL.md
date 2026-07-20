---
name: release-preparation
description: >-
  Release preparation: GitLab release/{release_datetime} from staging; Jira MCP
  (getJiraIssue, createJiraIssue, editJiraIssue, createIssueLink Cloners); HTML
  build-approval email. REST fallback script optional. Use for release prep, AUTOBUILD,
  KOC build email, Shoalter build approval.
disable-model-invocation: true
---

# Release preparation (GitLab ← staging → Jira → email)

## Conventions

- **Branch from `staging`** only (unless user names another integration ref). Confirm branch name per repo.
- **Revision** in Jira = **full 40-char GitLab SHA**, never `short_id`.
- **`release_datetime`** token must match **everywhere**: GitLab branch `release/{release_datetime}`, Jira **Tag/Branch**, email subject/table (same logical build window).

### Multi-repo

| Source ticket | GitLab `project_id` | Tip SHA for this ticket only |
|---------------|---------------------|------------------------------|
| (map each)    | (backend vs frontend, etc.) | From **that** repo’s new branch |

One **create** (+ link) pass **per** source key when SHAs differ.

### HKTV KOC GitLab paths (confirmed)

| Role | `project_id` |
|------|----------------|
| **Backend** | `hktv/tw/koc/hktv_koc` |
| **Frontend** | `hktv/tw/koc/hktv_koc_frontend_v2` ← default “koc-frontend” |

Shorthand `hktv/koc` **404s** on `ite-git01` API — always use full path.

### MCP approval gate

When the user wants **per-call approval**: state **server**, **tool**, **exact arguments**, **why** → wait for **`yes` / `go`** → one tool per approval unless they allow batch. REST fallback is **not** MCP — confirm separately if required.

---

## Ordered pipeline

### A) Inputs

`gitlab_project_id` (per repo), `staging_ref`, `build_date`, `build_time`, `release_datetime`, `source_build_keys`, email vars (see **Email parameters**).

### B) Branch name

**`release/{release_datetime}`**. Default token: **`YYYYMMDD_HHmmss`** (e.g. `20260511054500`). Optional readable: `20260511_054500` — **same string** in GitLab + Jira.

### C) GitLab MCP (`user-gitlab`)

1. **`create_branch`**: `project_id`, `branch`, `ref` = staging (or `staging_ref`).
2. **SHA:** Prefer **`commit.id`** from the **`create_branch`** response → no extra call. Else **`get_commit`** / **`list_commits`** on the new branch name → full **`id`**.

Record **`revision`** (SHA) + **`tag_branch`** string per repo.

### D) Jira — Atlassian MCP (preferred)

**Resolve `cloudId`:** `getAccessibleAtlassianResources` (or site hostname, e.g. `hongkongtv.atlassian.net`).

Inspect MCP tool schemas before calling.

#### D1) Read source (critical)

**`getJiraIssue`** often returns **only core fields** if you omit `fields`. Always request **explicit `fields`** including every `customfield_*` you must copy (Build Time, Revision, Tag/Branch, Fall Backs, GitLab Project, Domain, Contact, radios, GitLab ScheduleId, pipeline URLs, etc.).

If unsure what’s required, **`getJiraIssueTypeMetaWithFields`** (`projectIdOrKey`, `issueTypeId` from source, e.g. GitLab Ticket) lists **required** fields.

**Stash for fallbacks** — from the **source** issue:

- **Fall Back Revision** ← current **Revision** field (`customfield_*` name “Revision”), not an older unrelated SHA.
- **Fall Back Tag/Branch** ← current **Tag/Branch** field.

Do **not** use **`fetch`** ARI-only views for values — they lack custom fields.

#### D2) Create new issue

**`createJiraIssue`**: `projectKey`, `issueTypeName` (match source, e.g. **GitLab Ticket**), new `summary` / schedule line, `description` (match ADF vs markdown via `contentFormat`).

**`additional_fields`:** Copy **required** radios, Contact (often **ADF object**), GitLab Project URL, Domain, pipeline schedule **page** URL, assignee, priority, labels, `GitLab ScheduleId`, etc., from source — then **override**:

- **Build Time** → this release
- **Revision** → GitLab **full** SHA
- **Tag/Branch** → `release/{release_datetime}`
- **Fall Back Revision** / **Fall Back Tag/Branch** → stashed values

If `createJiraIssue` returns the new key with all fields correct, **skip D3**. Otherwise **`editJiraIssue`** with `fields` for missing keys only.

#### D3) `editJiraIssue` (if needed)

`issueIdOrKey` = **new key from create response**. Patch any fields not applied in D2.

#### D4) **Clone relationship (default — keep)**

After the new issue exists, record **clone** traceability in Jira:

1. **`getIssueLinkTypes`** — confirm **`Cloners`** exists (`inward` ≈ “is cloned by”, `outward` ≈ “clones”).
2. **`createIssueLink`**: `type` = **`Cloners`**, **`inwardIssue`** = **source** (original), **`outwardIssue`** = **new issue** (clone).  
   - Verified on **hongkongtv** · if the API rejects, **swap** inward/outward once (instances vary).

Repeat **D1–D4** for each source key / repo SHA pair.

**Post-copy hygiene:** **GitLab ScheduleId** and schedule-driven **Bot Comment** / cron text copied from an **old** ticket may be **stale** after you create a **new** GitLab pipeline schedule for this release — **update** those fields when your process links live schedules to AUTOBUILD tickets.

### D-alt) REST fallback

[scripts/jira_build_flow.py](scripts/jira_build_flow.py) — same semantics; env `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`. Use when MCP cannot satisfy required ADF/shape or permissions.

### E) Build approval email

Use **new** issue keys in **Jira Link**; align date/time/subject with Jira + branch.

---

## HKTV AUTOBUILD “GitLab Ticket” — field id quick reference

*Site-specific; always confirm with **`getJiraIssueTypeMetaWithFields` + live issue** if behavior drifts.*

| Meaning | Example `customfield_*` (hongkongtv) |
|---------|--------------------------------------|
| Build Time | `customfield_11599` |
| Revision | `customfield_11887` |
| Tag/Branch | `customfield_11870` |
| Fall Back Revision | `customfield_11873` |
| Fall Back Tag/Branch | `customfield_11865` |
| GitLab Project | `customfield_11884` |
| Service Interruption (radio) | `customfield_11871` |
| Can fall back | `customfield_11889` |
| Before SQL N/A (radio) | `customfield_11896` |
| Contact | `customfield_11890` (often ADF) |
| Domain | `customfield_11876` |
| GitLab Pipeline Schedules URL | `customfield_11878` |
| GitLab ScheduleId | `customfield_11869` |

---

## Email parameters (full template)

| Variable | Role |
|----------|------|
| `subject_system`, `subject_datetime` | Subject `{system} - Production Build [{subject_datetime}]` |
| `to_lines`, `cc_lines`, `approver_first_name`, `system` | Headers + greeting |
| `build_ticket_urls` | **New** clone URLs only |
| `build_date`, `build_time` | Table A |
| `release_label`, `release_report_url` | Release line |
| `ticket_rows` | Table B rows |
| `noc_approver_name` | Default Anthony |

**Verbatim:** `Would you please approve the following build ticket(s)?` · after `---`: `Dear NOC,` + `Upon {noc_approver_name}'s approval, please help to setup for production build, thanks.`

**Default To / Cc / signature** — same as earlier org template ([example-output.html](example-output.html)).

---

## MCP capability matrix

| Step | GitLab | Atlassian | REST |
|------|--------|-----------|------|
| Branch from staging | `create_branch` | — | — |
| Tip SHA | response / `get_commit` / `list_commits` | — | — |
| Read customs | `getJiraIssue` **with `fields` array** | — | — |
| New issue | — | `createJiraIssue` (+ `editJiraIssue` if needed) | `jira_build_flow.py` |
| **Clone link** | — | **`createIssueLink` · Cloners** | — |

---

## Checks

- [ ] Every GitLab `project_id` is the **full** path (`hktv/tw/koc/...`).
- [ ] **Revision** = full SHA; **Tag/Branch** = `release/...` string.
- [ ] Fall backs = source’s **previous** Revision + Tag/Branch (not mixed with other fields).
- [ ] **Cloners** link: source ↔ new issue.
- [ ] ScheduleId / bot / pipeline copy: **refresh** if new GitLab schedules were created for this build.
- [ ] Email uses **new** keys only.

## Fallback scripts (REST)

- [scripts/jira_build_flow.py](scripts/jira_build_flow.py)
- [scripts/requirements.txt](scripts/requirements.txt)
