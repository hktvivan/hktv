import { describe, it, expect } from "vitest";
import {
  parseSlackMessage,
  resolveWorkspacePath,
  stripSlackMentions,
} from "./parseRequest.js";
import { isPathUnderAllowlist } from "./validatePath.js";
import path from "node:path";
import os from "node:os";

describe("stripSlackMentions", () => {
  it("removes user mentions", () => {
    expect(stripSlackMentions("<@U123> hello")).toBe("hello");
  });
  it("keeps newlines so WORKSPACE / PROMPT blocks still parse (regression: do not use /\\s+/g on full text)", () => {
    const raw = `<@U999>
WORKSPACE: C:\\Users\\u\\comms\\app
PROMPT:
List files in src`;
    const text = stripSlackMentions(raw);
    expect(text).toContain("\n");
    const r = parseSlackMessage(text);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.workspaceValue).toContain("comms");
      expect(r.prompt).toContain("List files");
    }
  });
});

describe("parseSlackMessage", () => {
  it("parses WORKSPACE + PROMPT", () => {
    const r = parseSlackMessage("WORKSPACE: sub\nPROMPT:\nDo the thing");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.mode).toBe("path");
      expect(r.workspaceValue).toBe("sub");
      expect(r.prompt).toBe("Do the thing");
    }
  });
  it("parses WORKSPACE_ALIAS + PROMPT", () => {
    const r = parseSlackMessage("WORKSPACE_ALIAS: myapp\nPROMPT:\nrefactor");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.mode).toBe("alias");
      expect(r.workspaceValue).toBe("myapp");
    }
  });
  it("accepts WORKSPACE_ALIAS without confusing with WORKSPACE", () => {
    const r = parseSlackMessage("WORKSPACE_ALIAS: x\nPROMPT:\ny");
    expect(r.ok).toBe(true);
  });
});

describe("resolveWorkspacePath", () => {
  it("rejects traversal in relative segment", () => {
    const p = parseSlackMessage("WORKSPACE: ..\\..\nPROMPT:\nx");
    expect(p.ok).toBe(true);
    if (p.ok) {
      const { result } = resolveWorkspacePath(
        p,
        [path.join(os.tmpdir(), "bridge-allow-test")],
        {}
      );
      expect(result.ok).toBe(false);
    }
  });
  it("rejects unknown alias", () => {
    const p = parseSlackMessage("WORKSPACE_ALIAS: no_such\nPROMPT:\nhi");
    expect(p.ok).toBe(true);
    if (p.ok) {
      const { result } = resolveWorkspacePath(p, [path.join(os.tmpdir(), "a")], {});
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/Unknown WORKSPACE_ALIAS/);
      }
    }
  });
});

describe("isPathUnderAllowlist", () => {
  it("fails when path is not under any root", () => {
    const root = path.join(os.tmpdir(), "root-only");
    const r = isPathUnderAllowlist([root], path.join(os.tmpdir(), "other-place", "x"));
    expect(r.ok).toBe(false);
  });
});
