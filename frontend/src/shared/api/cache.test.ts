import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCached, fetchWithCache } from './cache';

describe('cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined for a URL that was never cached', () => {
    expect(getCached('/never-fetched')).toBeUndefined();
  });

  it('fetches over the network and returns parsed JSON', async () => {
    const payload = { hello: 'world' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchWithCache('/api/one');

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('serves subsequent calls from cache without hitting the network', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ n: 1 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchWithCache('/api/two');
    const second = await fetchWithCache('/api/two');

    expect(second).toEqual({ n: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getCached('/api/two')).toEqual({ n: 1 });
  });

  it('re-fetches after the TTL expires', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ v: 'first' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ v: 'second' }) });
    vi.stubGlobal('fetch', fetchMock);

    const first = await fetchWithCache('/api/ttl', 1000);
    expect(first).toEqual({ v: 'first' });

    // Move past the TTL so the cached entry is considered stale.
    vi.advanceTimersByTime(1001);

    const second = await fetchWithCache('/api/ttl', 1000);
    expect(second).toEqual({ v: 'second' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws on a non-ok HTTP response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchWithCache('/api/error')).rejects.toThrow('HTTP 503');
  });
});

