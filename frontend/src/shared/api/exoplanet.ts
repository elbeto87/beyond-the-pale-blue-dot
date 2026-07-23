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

/**
 * Fetches the latest discovered exoplanets, ordered by discovery year
 * (most recent first).
 */
export async function fetchLatestExoplanetDiscoveries(count = 10): Promise<Exoplanet[]> {
  const params = new URLSearchParams({ count: String(count) });
  return fetchWithCache<Exoplanet[]>(`${API_BASE}/exoplanet/latest_discoveries?${params}`);
}

/**
 * Fetches potentially habitable exoplanets (Earth-like radius and insolation),
 * ordered by discovery date (most recent first).
 */
export async function fetchHabitableExoplanetDiscoveries(count = 1000): Promise<Exoplanet[]> {
  const params = new URLSearchParams({ count: String(count) });
  return fetchWithCache<Exoplanet[]>(`${API_BASE}/exoplanet/latest_habitable_discoveries?${params}`);
}

/** Fetches the list of distinct discovery methods present in the catalog. */
export async function fetchExoplanetDiscoveryMethods(): Promise<string[]> {
  return fetchWithCache<string[]>(`${API_BASE}/exoplanet/discovery_methods`);
}

export interface ExoplanetAdvancedFilters {
  yearMin?: number;
  yearMax?: number;
  discoveryMethods?: string[];
  insolationMin?: number;
  insolationMax?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  orbitPeriodMin?: number;
  orbitPeriodMax?: number;
  starTemperatureMin?: number;
  starTemperatureMax?: number;
  planetTypes?: string[];
}

/**
 * Advanced exoplanet search with range and category filters.
 * Returns at most `count` results (capped at 100 by the backend).
 */
export async function advancedSearchExoplanets(
  filters: ExoplanetAdvancedFilters,
  count = 100,
): Promise<Exoplanet[]> {
  const params = new URLSearchParams({ count: String(count) });
  const setNum = (key: string, value?: number) => {
    if (value != null && Number.isFinite(value)) params.set(key, String(value));
  };
  setNum('year_min', filters.yearMin);
  setNum('year_max', filters.yearMax);
  setNum('insolation_min', filters.insolationMin);
  setNum('insolation_max', filters.insolationMax);
  setNum('temperature_min', filters.temperatureMin);
  setNum('temperature_max', filters.temperatureMax);
  setNum('orbit_period_min', filters.orbitPeriodMin);
  setNum('orbit_period_max', filters.orbitPeriodMax);
  setNum('star_temperature_min', filters.starTemperatureMin);
  setNum('star_temperature_max', filters.starTemperatureMax);
  filters.discoveryMethods?.forEach((method) => params.append('discovery_methods', method));
  filters.planetTypes?.forEach((type) => params.append('planet_types', type));
  return fetchWithCache<Exoplanet[]>(`${API_BASE}/exoplanet/advanced_search?${params}`);
}

