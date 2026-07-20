#!/usr/bin/env python3
"""
Clone build tickets (REST fallback when Atlassian MCP create/edit is not used).
Prefer release-preparation skill: getJiraIssue → createJiraIssue → editJiraIssue.

Env:
  JIRA_URL           e.g. https://hongkongtv.atlassian.net
  JIRA_EMAIL         Atlassian account email
  JIRA_API_TOKEN     API token (see Atlassian account security settings)

Optional explicit field ids (customfield_…); otherwise names are matched from /rest/api/3/field:
  JIRA_FIELD_BUILD_TIME
  JIRA_FIELD_REVISION
  JIRA_FIELD_TAG_BRANCH
  JIRA_FIELD_FALLBACK_REVISION
  JIRA_FIELD_FALLBACK_TAG_BRANCH

Usage:
  python jira_build_flow.py discover
  python jira_build_flow.py clone AUTOBUILD-3614 --build-time "..." \\
    --revision <40_char_git_sha> --tag-branch release/20260511054500

  # Second column in output is the NEW key returned by Jira — not configurable here.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Any

import requests

SESSION = requests.Session()


def auth() -> tuple[str, str]:
    email = os.environ.get("JIRA_EMAIL", "").strip()
    token = os.environ.get("JIRA_API_TOKEN", "").strip()
    if not email or not token:
        sys.stderr.write("Set JIRA_EMAIL and JIRA_API_TOKEN\n")
        sys.exit(1)
    return email, token


def base_url() -> str:
    u = os.environ.get("JIRA_URL", "").strip().rstrip("/")
    if not u:
        sys.stderr.write("Set JIRA_URL (e.g. https://your-site.atlassian.net)\n")
        sys.exit(1)
    return u


def fetch_all_fields(base: str, email: str, token: str) -> dict[str, str]:
    r = SESSION.get(
        f"{base}/rest/api/3/field",
        auth=(email, token),
        timeout=60,
    )
    r.raise_for_status()
    return {row["id"]: row.get("name") or row["id"] for row in r.json()}


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def pick_field(
    fields_map: dict[str, str],
    *candidates: str,
    mode: str = "normal",
) -> str | None:
    """
    mode:
      normal       — first exact normalized match on any candidate
      no_fallback  — exclude field names containing 'fallback' / 'fall back'
      fallback_ok  — only fields whose name contains 'fallback' or 'fall back'
    """
    for cand in candidates:
        cn = norm(cand)
        for fid, name in fields_map.items():
            low = name.lower()
            if mode == "no_fallback" and ("fallback" in low or "fall back" in low):
                continue
            if mode == "fallback_ok":
                if "fallback" not in low and "fall back" not in low:
                    continue
            if norm(name) == cn:
                return fid
    for cand in candidates:
        cn = norm(cand)
        for fid, name in fields_map.items():
            low = name.lower()
            if mode == "no_fallback" and ("fallback" in low or "fall back" in low):
                continue
            if mode == "fallback_ok":
                if "fallback" not in low and "fall back" not in low:
                    continue
            nn = norm(name)
            if cn in nn or nn in cn:
                return fid
    return None


DENY_KEYS = frozenset(
    {
        "summary",
        "description",
        "issuetype",
        "project",
        "status",
        "resolution",
        "created",
        "updated",
        "creator",
        "reporter",
        "comment",
        "attachment",
        "issuelinks",
        "worklog",
        "subtasks",
        "votes",
        "watches",
        "lastViewed",
        "aggregateprogress",
        "progress",
        "timetracking",
        "security",
        "duedate",
        "environment",
    }
)


def get_issue(base: str, email: str, token: str, key: str) -> dict[str, Any]:
    r = SESSION.get(
        f"{base}/rest/api/3/issue/{key}",
        auth=(email, token),
        params={"expand": "renderedFields,names"},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()


def create_clone_issue(
    base: str,
    email: str,
    token: str,
    src: dict[str, Any],
    summary_suffix: str,
) -> str:
    fields = src["fields"]
    project = fields.get("project") or {}
    it = fields.get("issuetype") or {}
    summ = (fields.get("summary") or "Clone") + summary_suffix
    payload: dict[str, Any] = {
        "fields": {
            "project": {"key": project.get("key")},
            "issuetype": {"id": str(it.get("id"))},
            "summary": summ[:254],
        }
    }
    if fields.get("description") is not None:
        payload["fields"]["description"] = fields["description"]
    r = SESSION.post(
        f"{base}/rest/api/3/issue", auth=(email, token), json=payload, timeout=60
    )
    if r.status_code >= 400:
        sys.stderr.write(r.text + "\n")
        r.raise_for_status()
    return r.json()["key"]


def put_fields(
    base: str,
    email: str,
    token: str,
    issue_key: str,
    field_updates: dict[str, Any],
) -> None:
    if not field_updates:
        return
    r = SESSION.put(
        f"{base}/rest/api/3/issue/{issue_key}",
        auth=(email, token),
        json={"fields": field_updates},
        timeout=60,
    )
    if r.status_code >= 400:
        sys.stderr.write(r.text + "\n")
        r.raise_for_status()


def copy_custom_fields(
    src_fields: dict[str, Any],
    skip: set[str],
) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for k, v in src_fields.items():
        if k in DENY_KEYS or k in skip:
            continue
        if k.startswith("customfield_") and v is not None:
            out[k] = v
    return out


def cmd_discover(_args: argparse.Namespace) -> None:
    email, token = auth()
    base = base_url()
    fm = fetch_all_fields(base, email, token)
    rows = [
        ("Build Time", "normal"),
        ("Revision", "no_fallback"),
        ("Tag/Branch", "no_fallback"),
        ("Fall Back Revision", "fallback_ok"),
        ("Fall Back Tag/Branch", "fallback_ok"),
    ]
    print("# Field id hints (verify in Jira admin if wrong):\n")
    for label, mode in rows:
        p = pick_field(fm, label, mode=mode)
        if p:
            print(f"# {label}: {fm[p]} -> {p}")
        else:
            print(f"# {label}: NOT FOUND")


def cmd_clone(args: argparse.Namespace) -> None:
    gl_rev = (args.revision or "").strip()
    gl_tag = (args.tag_branch or "").strip()
    if bool(gl_rev) ^ bool(gl_tag):
        sys.stderr.write("Provide both --revision and --tag-branch (GitLab), or neither.\n")
        sys.exit(1)

    email, token = auth()
    base = base_url()
    fm = fetch_all_fields(base, email, token)

    def fid(env_key: str, *labels: str, mode: str = "normal") -> str:
        e = os.environ.get(env_key, "").strip()
        if e:
            return e
        for lb in labels:
            p = pick_field(fm, lb, mode=mode)
            if p:
                return p
        sys.stderr.write(
            f"Could not resolve field for {labels}. Set {env_key} or run discover.\n"
        )
        sys.exit(1)

    f_time = fid("JIRA_FIELD_BUILD_TIME", "Build Time")
    f_rev = fid("JIRA_FIELD_REVISION", "Revision", mode="no_fallback")
    f_tag = fid(
        "JIRA_FIELD_TAG_BRANCH",
        "Tag/Branch",
        "Tag Branch",
        mode="no_fallback",
    )
    f_frev = fid(
        "JIRA_FIELD_FALLBACK_REVISION",
        "Fall Back Revision",
        mode="fallback_ok",
    )
    f_ftag = fid(
        "JIRA_FIELD_FALLBACK_TAG_BRANCH",
        "Fall Back Tag/Branch",
        "Fall Back Tag Branch",
        mode="fallback_ok",
    )

    suffix = args.summary_suffix or ""
    results: list[tuple[str, str]] = []

    for src_key in args.source_keys:
        src = get_issue(base, email, token, src_key)
        sf = src["fields"]
        rev_val = sf.get(f_rev)
        tag_val = sf.get(f_tag)

        new_key = create_clone_issue(base, email, token, src, suffix)
        skip = {f_time, f_frev, f_ftag}
        if gl_rev and gl_tag:
            skip |= {f_rev, f_tag}
        bulk = copy_custom_fields(sf, skip)
        bulk[f_frev] = rev_val
        bulk[f_ftag] = tag_val
        bulk[f_time] = args.build_time
        if gl_rev and gl_tag:
            bulk[f_rev] = gl_rev
            bulk[f_tag] = gl_tag

        put_fields(base, email, token, new_key, bulk)
        extra = " + GitLab Rev/Tag" if gl_rev else ""
        print(f"{src_key} -> {new_key} (Build Time + Fall Backs{extra})")
        results.append((src_key, new_key))

    if args.print_json:
        print(json.dumps({"cloned": results}, indent=2))


def main() -> None:
    p = argparse.ArgumentParser(
        description="Clone Jira build tickets; optional GitLab Revision/Tag; Fall Backs from source."
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    d = sub.add_parser("discover", help="List field ids for Build/Revision/Tag/Fall Back")
    d.set_defaults(func=cmd_discover)

    c = sub.add_parser("clone", help="Clone each source issue one-by-one")
    c.add_argument("source_keys", nargs="+", help="Issue keys, e.g. AUTOBUILD-3614")
    c.add_argument(
        "--build-time",
        required=True,
        help="Value for Build Time on the clone (Jira datetime string or plain text per field config)",
    )
    c.add_argument(
        "--revision",
        default="",
        help="Git tip full SHA (40 hex) for Jira Revision (use with --tag-branch)",
    )
    c.add_argument(
        "--tag-branch",
        default="",
        help='Branch name e.g. release/20260511054500 (use with --revision)',
    )
    c.add_argument(
        "--summary-suffix",
        default="",
        help="Appended to cloned summary (default empty)",
    )
    c.add_argument(
        "--print-json",
        action="store_true",
        help="Print source->new key JSON at end",
    )
    c.set_defaults(func=cmd_clone)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
