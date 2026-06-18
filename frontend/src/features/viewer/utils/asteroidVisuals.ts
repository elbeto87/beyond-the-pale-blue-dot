import type { Asteroid } from '../../../shared/api/types';

export interface AsteroidMaterialConfig {
  color: string;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
}

/**
 * Approximate surface colors per SMASS spectral class.
 * Real asteroids are dark; these are stylized but composition-aware.
 */
const SPECTRAL_COLOR_MAP: Record<string, string> = {
  C: '#33312c', // carbonaceous - very dark
  B: '#3a3d40', // bluish carbonaceous
  D: '#4a3a30', // dark reddish (organics)
  P: '#4a4438', // primitive
  G: '#46443c',
  F: '#3e4042',
  S: '#8a7a5c', // silicaceous - greenish brown
  Q: '#9c8a64',
  V: '#8f8a78', // basaltic
  M: '#b0aca0', // metallic - bright grey
  E: '#cfc9bb', // enstatite - bright
  X: '#7a756c', // mixed
};

const NEUTRAL_ROCKY_COLOR = '#6b6256';

function normalizeSpectralType(spectralType: string | null): string | null {
  if (!spectralType) {
    return null;
  }
  const key = spectralType.trim().charAt(0).toUpperCase();
  return key.length > 0 ? key : null;
}

function colorFromAlbedo(albedo: number): string {
  const clamped = Math.max(0.02, Math.min(0.4, albedo));
  const t = (clamped - 0.02) / (0.4 - 0.02);
  const channel = Math.round(35 + t * 150);
  const r = channel;
  const g = Math.round(channel * 0.95);
  const b = Math.round(channel * 0.82);
  return `rgb(${r}, ${g}, ${b})`;
}

export function getAsteroidMaterial(asteroid: Asteroid | null): AsteroidMaterialConfig {
  const spectralKey = normalizeSpectralType(asteroid?.spectral_type ?? null);
  const albedo = asteroid?.albedo ?? null;

  let color = NEUTRAL_ROCKY_COLOR;
  let roughness = 0.9;
  let metalness = 0.1;

  if (spectralKey && SPECTRAL_COLOR_MAP[spectralKey]) {
    color = SPECTRAL_COLOR_MAP[spectralKey];
    if (spectralKey === 'M') {
      metalness = 0.75;
      roughness = 0.45;
    } else if (spectralKey === 'E') {
      metalness = 0.3;
      roughness = 0.55;
    }
  } else if (albedo !== null) {
    color = colorFromAlbedo(albedo);
    if (albedo > 0.3) {
      metalness = 0.45;
      roughness = 0.55;
    }
  }

  return {
    color,
    roughness,
    metalness,
    emissive: '#0a0a0a',
    emissiveIntensity: 0.15,
  };
}

/**
 * Maps a rotation period (hours) to a pleasant visual angular speed (rad/s).
 * Shorter periods spin faster; missing data falls back to a slow drift.
 */
export function getRotationSpeed(rotationPeriodHours: number | null): number {
  if (!rotationPeriodHours || rotationPeriodHours <= 0) {
    return 0.12;
  }
  const speed = Math.PI / rotationPeriodHours;
  return Math.max(0.03, Math.min(0.6, speed));
}

/**
 * Parses SBDB "extent" (e.g. "14.9x8.2" or "14.9x8.2x6.0") into a normalized
 * non-uniform scale so elongated bodies look elongated. Defaults to uniform.
 */
export function parseExtentScale(extent: string | null): [number, number, number] {
  if (!extent) {
    return [1, 1, 1];
  }
  const parts = extent
    .split('x')
    .map((part) => Number.parseFloat(part.trim()))
    .filter((value) => !Number.isNaN(value) && value > 0);

  if (parts.length < 2) {
    return [1, 1, 1];
  }

  const max = Math.max(...parts);
  const x = parts[0] / max;
  const y = parts[1] / max;
  const z = (parts[2] ?? parts[1]) / max;
  return [x, y, z];
}

