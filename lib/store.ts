import type { AnalysisResult } from "@/types";

// Simple in-memory store with LRU-style eviction. Results are also cached on
// the client, but this lets a freshly-generated share link resolve
// server-side within the same runtime instance.
// For production, swap this for Redis / a KV store / a database.

declare global {
  // eslint-disable-next-line no-var
  var __metaviewStore: Map<string, { result: AnalysisResult; ts: number }> | undefined;
}

const MAX_ENTRIES = 500;
const TTL_MS = 60 * 60 * 1000; // 1 hour

const store: Map<string, { result: AnalysisResult; ts: number }> =
  global.__metaviewStore ?? new Map<string, { result: AnalysisResult; ts: number }>();

if (!global.__metaviewStore) {
  global.__metaviewStore = store;
}

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.ts > TTL_MS) store.delete(key);
  }
  // If still over capacity, remove oldest entries
  if (store.size > MAX_ENTRIES) {
    const iter = store.keys();
    while (store.size > MAX_ENTRIES) {
      const next = iter.next();
      if (next.done) break;
      store.delete(next.value);
    }
  }
}

export function saveResult(result: AnalysisResult): void {
  evictExpired();
  store.set(result.id, { result, ts: Date.now() });
}

export function getResult(id: string): AnalysisResult | undefined {
  evictExpired();
  const entry = store.get(id);
  return entry?.result;
}
