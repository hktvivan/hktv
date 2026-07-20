import path from "node:path";
import fs from "node:fs";

/**
 * Normalizes and validates that `candidate` is under one of the allowlist roots
 * (after resolving to absolute paths and checking real path when the path exists).
 */
export function parseAllowlistRoots(
  envValue: string | undefined
): string[] {
  if (!envValue?.trim()) {
    return [];
  }
  return envValue
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => path.resolve(p));
}

/**
 * Resolves a relative segment under a single root (no ".." in segments).
 * `relativeSegment` uses system separators; reject any ".." or absolute paths.
 */
export function joinUnderRoot(
  root: string,
  relativeSegment: string
): string {
  if (path.isAbsolute(relativeSegment)) {
    throw new Error("Relative path must not be absolute");
  }
  if (relativeSegment.split(/[/\\]/).some((p) => p === "..")) {
    throw new Error("Path must not contain ..");
  }
  return path.resolve(root, relativeSegment);
}

export type ValidateResult =
  | { ok: true; resolved: string; matchedRoot: string }
  | { ok: false; error: string };

/**
 * `resolvedPath` is already absolute, normalized. Ensures it lies under
 * at least one allowlist root and does not escape via symlinks when possible.
 */
export function isPathUnderAllowlist(
  allowlistRoots: string[],
  absolutePath: string
): ValidateResult {
  if (allowlistRoots.length === 0) {
    return { ok: false, error: "ALLOWLIST_ROOTS is not configured" };
  }

  let realTarget: string;
  try {
    if (fs.existsSync(absolutePath)) {
      realTarget = fs.realpathSync(absolutePath);
    } else {
      realTarget = path.resolve(absolutePath);
    }
  } catch {
    return { ok: false, error: "Path could not be resolved" };
  }

  for (const root of allowlistRoots) {
    let realRoot: string;
    try {
      realRoot = fs.existsSync(root) ? fs.realpathSync(root) : path.resolve(root);
    } catch {
      continue;
    }

    const rel = path.relative(realRoot, realTarget);
    if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
      return { ok: true, resolved: realTarget, matchedRoot: realRoot };
    }
    if (rel === "") {
      return { ok: true, resolved: realTarget, matchedRoot: realRoot };
    }
  }

  return { ok: false, error: "Path is not under any allowed root" };
}
