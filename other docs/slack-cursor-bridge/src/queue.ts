const locks = new Set<string>();

/**
 * Runs `fn` while holding a per-workspace global lock. If already locked,
 * returns a rejection message.
 */
export async function withWorkspaceLock<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T | { blocked: true; message: string }> {
  if (locks.has(key)) {
    return {
      blocked: true,
      message:
        "Another run is in progress for this workspace. Try again when it finishes.",
    };
  }
  locks.add(key);
  try {
    return await fn();
  } finally {
    locks.delete(key);
  }
}
