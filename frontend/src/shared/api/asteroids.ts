import { API_CONFIG } from './config';
import type { Asteroid } from './types';

export async function fetchAsteroids(count = 100): Promise<Asteroid[]> {
  const response = await fetch(`${API_CONFIG.baseUrl}/asteroid?count=${count}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch asteroids: ${response.status}`);
  }
  return (await response.json()) as Asteroid[];
}

export async function fetchAsteroidByName(name: string): Promise<Asteroid> {
  const response = await fetch(`${API_CONFIG.baseUrl}/asteroid/${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch asteroid "${name}": ${response.status}`);
  }
  return (await response.json()) as Asteroid;
}

