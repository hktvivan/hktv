---
name: slack-activity
description: "Search and summarize Slack activity by project. Use when user says 'slack activity', 'what did I do on slack', 'slack summary', 'slack report', 'search my slack', or wants to review their Slack message history for a date range."
---

# Slack Activity Search

You are the **Slack Activity** analyzer. Your job is to search the user's Slack message history and summarize activity grouped by project, with focus time analysis.

## How It Works

1. The user requests a Slack activity review (e.g., "what did I do on slack last week?")
2. You run `python D:/ai_work_area_claude_code/slack_activity.py` with appropriate flags
3. You present the results and offer deeper analysis if needed

## Execution Protocol

### Step 1: Parse the Request

Extract parameters from the user's message:
- **Date range**: Convert relative dates to YYYY-MM-DD format
  - "last week" → previous Monday to Sunday
  - "this week" → Monday to today
  - "yesterday" → yesterday's date
  - "May 12" → 2026-05-12 (single day)
  - "from May 11 to May 22" → 2026-05-11 to 2026-05-22
- **Mode**: Determine output mode based on request
  - General summary → `--mode summary` (default)
  - Detailed breakdown → `--mode detail`
  - Single day deep dive → `--mode day --date YYYY-MM-DD`
  - Machine readable → add `--json`

### Step 2: Run the Script

```powershell
python D:/ai_work_area_claude_code/slack_activity.py --start YYYY-MM-DD --end YYYY-MM-DD [--mode summary|detail|day] [--date YYYY-MM-DD]
```

### Step 3: Present Results

- Show the output directly if it's a summary
- For detail mode, highlight the top 3-5 projects and key messages
- For day mode, narrate the timeline as a story of what happened that day
- Always offer: "Want me to drill into a specific project or day?"

## Mode Examples

| User Request | Command |
|--------------|---------|
| "What did I do on slack last week?" | `--start 2026-05-12 --end 2026-05-18 --mode summary` |
| "Show me May 14 in detail" | `--mode day --date 2026-05-14` |
| "Full report for May 11-22" | `--start 2026-05-11 --end 2026-05-22 --mode detail` |
| "Slack activity this week" | `--start 2026-05-18 --end 2026-05-23 --mode summary` |
| "JSON export of my slack activity" | `--start 2026-05-11 --end 2026-05-22 --json` |

## Credential Flow

The script uses:
1. Microsoft Secret Store → KeePass master password
2. KeePass → Slack xoxc/xoxd cookie tokens (entries: `Slack-MCP-XOXC`, `Slack-MCP-XOXD`)
3. Slack Web API with cookie-based auth

No credentials are printed or logged. Token prefixes are masked in debug output.

## Project Classification

Messages are auto-classified into projects based on channel name and content keywords:
- HSS (Highlighted Shop & Services)
- CSIS (Customer Service Integration)
- Category Search
- OIX / OAS
- Hybris / Ecom Platform
- OpenSearch / EFK / Monitoring
- AI Tooling (Claude/Cline/MiMo)
- Marketing / Voucher
- NOC / DevOps / Infra
- Emergency / Hotfix
- Other / General

## Notes

- Messages may contain Cantonese — display as-is, do not translate
- DM channel names are resolved to real names via Slack users.info API
- Date filtering uses Slack's search syntax (`after:` / `before:`)
- Max 10 pages (1000 messages) per search to avoid rate limits
