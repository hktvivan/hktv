"""
Slack Activity Search — Reusable tool for searching and summarizing Slack messages.

Usage:
    python slack_activity.py --start 2026-05-11 --end 2026-05-22 [--mode summary|detail|day] [--date 2026-05-14] [--json]

Modes:
    summary  — Project-level summary with message counts and focus time (default)
    detail   — Full message list grouped by project
    day      — Detailed timeline for a single day (requires --date)

Output: UTF-8 text to stdout. Use --json for machine-readable output.
"""
import subprocess
import sys
import json
import time
import io
import argparse
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.parse import urlencode

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

DB_PATH = r'C:\Users\likc\Desktop\記事\AI_Access_Tokens.kdbx'
SECRET_NAME = "AI-AccessTokens-DB"
SECRET_VAULT = "LocalStore"
ENTRIES = ['Slack-MCP-XOXC', 'Slack-MCP-XOXD']
HKT = timezone(timedelta(hours=8))

# Project classification rules
PROJECT_KEYWORDS = {
    "HSS (Highlighted Shop & Services)": ["hss", "highlighted shop", "cashback", "message_subtype", "message_type", "template", "harness"],
    "CSIS (Customer Service Integration)": ["csis", "customer service integration"],
    "Category Search": ["category search", "cat-search", "cat_seach", "search revamp", "search-revamp", "cat-search-query"],
    "OIX (Order Integration)": ["oix", "order integration"],
    "OAS (Order Allocation)": ["oas", "order allocation", "fulfillment"],
    "Hybris / Ecom Platform": ["hybris", "ecom", "staging", "mall-staging", "ecomtest"],
    "OpenSearch / EFK / Monitoring": ["opensearch", "efk", "glowroot", "grafana", "rproxy", "monitoring"],
    "AI Tooling (Claude/Cline/MiMo)": ["claude", "cline", "mimo", "ai", "token plan", "api url", "glm", "hermes", "superpowers"],
    "Marketing / Voucher": ["marketing", "voucher", "mk team", "mkt", "mkgb"],
    "NOC / DevOps / Infra": ["noc", "devops", "deploy", "build", "infra"],
    "Emergency / Hotfix": ["emergency", "hotfix", "救火", "urgent"],
}


def get_master_password() -> str:
    result = subprocess.run(
        ["powershell", "-NoProfile", "-Command",
         f"Get-Secret -Name '{SECRET_NAME}' -Vault '{SECRET_VAULT}' -AsPlainText"],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Failed to retrieve master password: {result.stderr.strip()}")
    pw = result.stdout.strip()
    if not pw:
        raise RuntimeError("Master password is empty")
    return pw


def load_credentials():
    from pykeepass import PyKeePass
    master = get_master_password()
    kp = PyKeePass(DB_PATH, password=master)
    tokens = {}
    for title in ENTRIES:
        entry = kp.find_entries(title=title, first=True)
        if not entry:
            raise RuntimeError(f"'{title}' entry not found in KeePass")
        tokens[title] = entry.password
    # KeePass entries are swapped: XOXC entry holds xoxd- token, XOXD holds xoxc-
    return tokens['Slack-MCP-XOXD'], tokens['Slack-MCP-XOXC']


def slack_api(xoxc, xoxd, method, params=None):
    url = f"https://slack.com/api/{method}"
    if params:
        url += "?" + urlencode(params)
    req = Request(url)
    req.add_header("Cookie", f"d={xoxd}")
    req.add_header("Authorization", f"Bearer {xoxc}")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    req.add_header("User-Agent", "Mozilla/5.0")
    try:
        with urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except HTTPError as e:
        return {"ok": False, "error": str(e)}


def get_user_id(xoxc, xoxd):
    resp = slack_api(xoxc, xoxd, "auth.test")
    if not resp.get("ok"):
        raise RuntimeError(f"auth.test failed: {resp}")
    return resp["user_id"], resp.get("user", "unknown")


def get_channels(xoxc, xoxd):
    channels = []
    cursor = ""
    while True:
        params = {"types": "public_channel,private_channel", "limit": "200", "exclude_archived": "true"}
        if cursor:
            params["cursor"] = cursor
        resp = slack_api(xoxc, xoxd, "users.conversations", params)
        if not resp.get("ok"):
            break
        channels.extend(resp.get("channels", []))
        cursor = resp.get("response_metadata", {}).get("next_cursor", "")
        if not cursor:
            break
        time.sleep(0.3)
    return channels


def get_users_info(xoxc, xoxd, user_ids):
    users = {}
    for uid in set(user_ids):
        resp = slack_api(xoxc, xoxd, "users.info", {"user": uid})
        if resp.get("ok"):
            u = resp["user"]
            users[uid] = u.get("real_name") or u.get("profile", {}).get("display_name") or uid
        time.sleep(0.2)
    return users


def search_messages(xoxc, xoxd, user_id, after_date, before_date):
    all_messages = []
    query = f"from:<@{user_id}> after:{after_date} before:{before_date}"
    page = 1
    while page <= 10:
        resp = slack_api(xoxc, xoxd, "search.messages", {
            "query": query,
            "sort": "timestamp",
            "sort_dir": "asc",
            "count": "100",
            "page": str(page),
        })
        if not resp.get("ok"):
            print(f"WARNING: search failed: {resp.get('error')}", file=sys.stderr)
            break
        matches = resp.get("messages", {}).get("matches", [])
        if not matches:
            break
        all_messages.extend(matches)
        total_pages = resp.get("messages", {}).get("paging", {}).get("pages", 1)
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.8)
    return all_messages


def classify_project(channel_name, message_text):
    combined = f"{channel_name} {message_text}".lower()
    for project, keywords in PROJECT_KEYWORDS.items():
        for kw in keywords:
            if kw in combined:
                return project
    return "Other / General"


def resolve_channel_name(ch, channels_map, user_names):
    ch_id = ch.get("id", "unknown")
    ch_name = ch.get("name", channels_map.get(ch_id, ch_id))
    if ch_name.startswith("U") and ch_name in user_names:
        return f"DM:{user_names[ch_name]}"
    if ch_name.startswith("U"):
        return f"DM:{ch_name}"
    return f"#{ch_name}"


def build_timeline(messages, channels_map, user_names):
    timeline = []
    for msg in messages:
        ch = msg.get("channel", {})
        ch_display = resolve_channel_name(ch, channels_map, user_names)
        ts = float(msg.get("ts", 0))
        dt = datetime.fromtimestamp(ts, tz=HKT)
        text = msg.get("text", "").replace("\n", " ").strip()
        timeline.append({"dt": dt, "channel": ch_display, "text": text, "ts": ts})
    timeline.sort(key=lambda x: x["ts"])
    return timeline


def group_by_project(timeline):
    project_data = {}
    channel_msgs = {}
    for item in timeline:
        ch = item["channel"]
        if ch not in channel_msgs:
            channel_msgs[ch] = []
        channel_msgs[ch].append(item)

    for ch_name, msgs in channel_msgs.items():
        sample_text = " ".join(m["text"] for m in msgs[:5])
        project = classify_project(ch_name, sample_text)
        if project not in project_data:
            project_data[project] = {"channels": {}, "total_msgs": 0, "date_range": None}
        project_data[project]["channels"][ch_name] = msgs
        project_data[project]["total_msgs"] += len(msgs)
        for m in msgs:
            if project_data[project]["date_range"] is None:
                project_data[project]["date_range"] = (m["dt"], m["dt"])
            else:
                earliest, latest = project_data[project]["date_range"]
                if m["dt"] < earliest:
                    earliest = m["dt"]
                if m["dt"] > latest:
                    latest = m["dt"]
                project_data[project]["date_range"] = (earliest, latest)

    return sorted(project_data.items(), key=lambda x: x[1]["total_msgs"], reverse=True)


def format_summary(sorted_projects, timeline, username, start_date, end_date):
    lines = []
    lines.append("=" * 80)
    lines.append(f"  SLACK ACTIVITY REPORT: {start_date} to {end_date} (HKT)")
    lines.append(f"  User: {username} | Total: {len(timeline)} messages")
    lines.append("=" * 80)

    lines.append(f"\n  {'Project':<45} {'Msgs':>5}  {'Channels':>8}  {'Active Period'}")
    lines.append(f"  {'-'*45} {'-'*5}  {'-'*8}  {'-'*30}")
    for project, data in sorted_projects:
        ch_count = len(data["channels"])
        period = ""
        if data["date_range"]:
            e, l = data["date_range"]
            period = f"{e.strftime('%m/%d')} - {l.strftime('%m/%d')}"
        lines.append(f"  {project:<45} {data['total_msgs']:>5}  {ch_count:>8}  {period}")

    # Hourly heatmap
    hourly = {}
    daily = {}
    for item in timeline:
        h = item["dt"].hour
        hourly[h] = hourly.get(h, 0) + 1
        day_key = item["dt"].strftime("%Y-%m-%d (%a)")
        daily[day_key] = daily.get(day_key, 0) + 1

    max_h = max(hourly.values()) if hourly else 1
    lines.append(f"\n  Hourly Focus Time (HKT):")
    for h in range(24):
        c = hourly.get(h, 0)
        if c > 0:
            bar = "#" * int(30 * c / max_h) if max_h > 0 else ""
            lines.append(f"    {h:02d}:00  {c:3d}  {bar}")

    lines.append(f"\n  Daily Breakdown:")
    for day in sorted(daily.keys()):
        c = daily[day]
        bar = "#" * min(c, 40)
        lines.append(f"    {day}  {c:3d}  {bar}")

    return "\n".join(lines)


def format_detail(sorted_projects, username, start_date, end_date, total_msgs):
    lines = []
    lines.append("=" * 80)
    lines.append(f"  SLACK ACTIVITY DETAIL: {start_date} to {end_date} (HKT)")
    lines.append(f"  User: {username} | Total: {total_msgs} messages")
    lines.append("=" * 80)

    for project, data in sorted_projects:
        lines.append(f"\n{'=' * 80}")
        lines.append(f"  PROJECT: {project}")
        lines.append(f"  Messages: {data['total_msgs']}")
        if data["date_range"]:
            earliest, latest = data["date_range"]
            lines.append(f"  Active: {earliest.strftime('%Y-%m-%d %H:%M')} -> {latest.strftime('%Y-%m-%d %H:%M')} HKT")
        lines.append(f"{'=' * 80}")

        sorted_ch = sorted(data["channels"].items(), key=lambda x: len(x[1]), reverse=True)
        for ch_name, msgs in sorted_ch:
            lines.append(f"\n  --- {ch_name} ({len(msgs)} msgs) ---")
            msgs_sorted = sorted(msgs, key=lambda x: x["ts"])
            for m in msgs_sorted:
                time_str = m["dt"].strftime("%m/%d %H:%M")
                text = m["text"].replace("\n", " ").strip()
                if text:
                    lines.append(f"    [{time_str}] {text}")

    return "\n".join(lines)


def format_day(timeline, username, target_date):
    lines = []
    lines.append("=" * 80)
    lines.append(f"  {target_date} - FULL TIMELINE")
    lines.append(f"  User: {username} | Total: {len(timeline)} messages")
    lines.append("=" * 80)

    current_hour = -1
    for item in timeline:
        h = item["dt"].hour
        if h != current_hour:
            current_hour = h
            lines.append(f"\n  {'─' * 70}")
            lines.append(f"  {h:02d}:00 - {h:02d}:59 HKT")
            lines.append(f"  {'─' * 70}")
        time_str = item["dt"].strftime("%H:%M")
        lines.append(f"    [{time_str}] {item['channel']}")
        lines.append(f"      {item['text']}")

    # Channel summary
    channel_count = {}
    for item in timeline:
        channel_count[item["channel"]] = channel_count.get(item["channel"], 0) + 1

    lines.append(f"\n{'=' * 80}")
    lines.append(f"  CHANNEL BREAKDOWN")
    lines.append(f"{'=' * 80}")
    for ch, c in sorted(channel_count.items(), key=lambda x: -x[1]):
        lines.append(f"    {ch:<40} {c:3d} msgs")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Search and summarize Slack activity")
    parser.add_argument("--start", required=True, help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", required=True, help="End date (YYYY-MM-DD)")
    parser.add_argument("--mode", choices=["summary", "detail", "day"], default="summary",
                        help="Output mode: summary (default), detail, or day")
    parser.add_argument("--date", help="Specific date for day mode (YYYY-MM-DD)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    # Parse dates
    start = datetime.strptime(args.start, "%Y-%m-%d").replace(tzinfo=HKT)
    end = datetime.strptime(args.end, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=HKT)
    after_date = (start - timedelta(days=1)).strftime("%Y-%m-%d")
    before_date = (end + timedelta(days=1)).strftime("%Y-%m-%d")

    # Load credentials
    print("Loading credentials...", file=sys.stderr)
    xoxc, xoxd = load_credentials()

    # Authenticate
    print("Authenticating...", file=sys.stderr)
    user_id, username = get_user_id(xoxc, xoxd)
    print(f"User: {username} ({user_id})", file=sys.stderr)

    # Get channels
    print("Fetching channels...", file=sys.stderr)
    channels = get_channels(xoxc, xoxd)
    channels_map = {c["id"]: c.get("name", "unknown") for c in channels}
    print(f"Found {len(channels)} channels", file=sys.stderr)

    # Search messages
    print(f"Searching messages ({args.start} to {args.end})...", file=sys.stderr)
    messages = search_messages(xoxc, xoxd, user_id, after_date, before_date)
    print(f"Found {len(messages)} messages", file=sys.stderr)

    # Collect DM user IDs
    dm_user_ids = set()
    for msg in messages:
        ch_name = msg.get("channel", {}).get("name", "")
        if ch_name.startswith("U") and len(ch_name) > 5:
            dm_user_ids.add(ch_name)

    print(f"Resolving {len(dm_user_ids)} DM names...", file=sys.stderr)
    user_names = get_users_info(xoxc, xoxd, dm_user_ids)

    # Build timeline
    timeline = build_timeline(messages, channels_map, user_names)

    # Filter to date range
    timeline = [t for t in timeline if start.replace(hour=0, minute=0, second=0) <= t["dt"] <= end]

    # Filter to specific day if day mode
    if args.mode == "day":
        if not args.date:
            print("ERROR: --date required for day mode", file=sys.stderr)
            sys.exit(1)
        target = datetime.strptime(args.date, "%Y-%m-%d")
        timeline = [t for t in timeline if t["dt"].month == target.month and t["dt"].day == target.day]

    if args.json:
        output = {
            "user": username,
            "user_id": user_id,
            "date_range": {"start": args.start, "end": args.end},
            "total_messages": len(timeline),
            "messages": [
                {"time": t["dt"].isoformat(), "channel": t["channel"], "text": t["text"]}
                for t in timeline
            ],
        }
        if args.mode in ("summary", "detail"):
            sorted_projects = group_by_project(timeline)
            output["projects"] = [
                {
                    "name": p,
                    "messages": d["total_msgs"],
                    "channels": list(d["channels"].keys()),
                    "active_from": d["date_range"][0].isoformat() if d["date_range"] else None,
                    "active_to": d["date_range"][1].isoformat() if d["date_range"] else None,
                }
                for p, d in sorted_projects
            ]
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        sorted_projects = group_by_project(timeline)
        if args.mode == "summary":
            print(format_summary(sorted_projects, timeline, username, args.start, args.end))
        elif args.mode == "detail":
            print(format_detail(sorted_projects, username, args.start, args.end, len(timeline)))
        elif args.mode == "day":
            print(format_day(timeline, username, args.date))


if __name__ == "__main__":
    main()
