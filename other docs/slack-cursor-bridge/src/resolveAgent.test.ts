import { describe, it, expect } from "vitest";
import { resolveAgentCommand, augmentPathForAgent } from "./resolveAgent.js";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

describe("resolveAgentCommand", () => {
  it("uses explicit when set", () => {
    expect(
      resolveAgentCommand("C:\\nope\\agent.exe")
    ).toBe("C:\\nope\\agent.exe");
  });
  it("returns a path if agent exists in .local\\bin (when present on this machine)", () => {
    const home = os.homedir();
    const p = path.join(home, ".local", "bin", "agent.exe");
    if (fs.existsSync(p)) {
      expect(resolveAgentCommand(undefined).toLowerCase()).toContain("agent");
    } else {
      expect(resolveAgentCommand(undefined)).toBe("agent");
    }
  });
});

describe("augmentPathForAgent", () => {
  it("adds .local\\bin to Path when the directory exists", () => {
    const home = os.homedir();
    const localBin = path.join(home, ".local", "bin");
    if (!fs.existsSync(localBin)) {
      return;
    }
    const e = augmentPathForAgent({ Path: "C:\\Windows" });
    expect(
      (e.PATH ?? e.Path ?? "")
        .toLowerCase()
        .startsWith(localBin.toLowerCase() + path.delimiter.toLowerCase()) ||
        (e.PATH ?? e.Path ?? "")
          .toLowerCase()
          .includes(path.delimiter + localBin.toLowerCase() + path.delimiter)
    ).toBe(true);
  });
});
