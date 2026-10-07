/**
 * Small sliding-window limiter. Lives in memory, so each serverless instance
 * keeps its own count: enough to slow down a single abuser, not a botnet.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return { ok: false as const, retryAfterMs: WINDOW_MS - (now - recent[0]) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return { ok: true as const };
}

export function resetRateLimit() {
  hits.clear();
}
