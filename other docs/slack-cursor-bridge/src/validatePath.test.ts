import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  joinUnderRoot,
  isPathUnderAllowlist,
  parseAllowlistRoots,
} from "./validatePath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmp = path.join(
  __dirname,
  "..",
  "tmp-validatePath-test"
);
const rootA = path.join(tmp, "rootA");
const rootB = path.join(tmp, "rootB");

beforeAll(() => {
  fs.mkdirSync(path.join(rootA, "sub", "ok"), { recursive: true });
  fs.mkdirSync(rootB, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("parseAllowlistRoots", () => {
  it("splits on comma/semicolon", () => {
    const r = parseAllowlistRoots("C:\\a, C:\\b;C:\\c");
    expect(r.length).toBe(3);
  });
});

describe("joinUnderRoot", () => {
  it("rejects .. in segments", () => {
    expect(() => joinUnderRoot(rootA, "..\\x")).toThrow();
  });
  it("rejects absolute paths", () => {
    expect(() => joinUnderRoot(rootA, "C:\\x")).toThrow();
  });
});

describe("isPathUnderAllowlist", () => {
  it("accepts subpath under first root", () => {
    const p = path.join(rootA, "sub", "ok");
    const r = isPathUnderAllowlist([rootA, rootB], p);
    expect(r.ok).toBe(true);
  });
  it("rejects path outside roots", () => {
    const outside = path.join(tmp, "escape");
    fs.mkdirSync(outside, { recursive: true });
    const r = isPathUnderAllowlist([rootA], outside);
    expect(r.ok).toBe(false);
  });
});
