interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

// Default time-to-live for cached responses (5 minutes).
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Returns the cached value for `url` if it exists and has not expired.
 */
export function getCached<T>(url: string): T | undefined {
  const entry = store.get(url) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(url);
    return undefined;
  }
  return entry.data;
}

/**
 * Fetches `url` as JSON, caching successful responses in memory.
 * Subsequent calls for the same URL (within `ttlMs`) resolve instantly
 * without hitting the network.
 */
export async function fetchWithCache<T>(url: string, ttlMs: number = DEFAULT_TTL_MS): Promise<T> {
  const cached = getCached<T>(url);
  if (cached !== undefined) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as T;

  store.set(url, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

