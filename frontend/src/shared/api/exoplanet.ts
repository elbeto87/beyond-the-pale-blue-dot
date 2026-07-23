import { API_CONFIG } from './config';
import { fetchWithCache } from './cache';
import type { Exoplanet } from './types';

const API_BASE = API_CONFIG.baseUrl;

/**
 * Searches exoplanets by (partial, case-insensitive) name.
 * Returns an empty list when the query is blank.
 */
export async function searchExoplanets(query: string, count = 10): Promise<Exoplanet[]> {
  const term = query.trim();
  if (!term) return [];

  const params = new URLSearchParams({ q: term, count: String(count) });
  return fetchWithCache<Exoplanet[]>(`${API_BASE}/exoplanet/search?${params}`);
}

