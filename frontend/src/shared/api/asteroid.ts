import { API_CONFIG } from './config';
import { fetchWithCache } from './cache';
import type { Asteroid, ImpactEvent } from './types';

const API_BASE = API_CONFIG.baseUrl;

/**
 * Searches asteroids by (partial, case-insensitive) name.
 * Returns an empty list when the query is blank.
 */
export async function searchAsteroids(query: string, count = 10): Promise<Asteroid[]> {
  const term = query.trim();
  if (!term) return [];

  const params = new URLSearchParams({ q: term, count: String(count) });
  return fetchWithCache<Asteroid[]>(`${API_BASE}/asteroid/search?${params}`);
}

/**
 * Fetches the impact events linked to an asteroid, ordered by risk (most
 * dangerous first). Returns an empty list when the asteroid has no impact
 * events registered.
 */
export async function fetchImpactEventsByAsteroid(
  asteroidId: string,
  count = 10,
): Promise<ImpactEvent[]> {
  const params = new URLSearchParams({ count: String(count) });
  try {
    return await fetchWithCache<ImpactEvent[]>(
      `${API_BASE}/impact_event/by_asteroid/${encodeURIComponent(asteroidId)}?${params}`,
    );
  } catch {
    return [];
  }
}

