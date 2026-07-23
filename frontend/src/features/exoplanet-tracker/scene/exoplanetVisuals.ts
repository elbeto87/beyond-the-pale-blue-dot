import * as THREE from 'three';
import type { Exoplanet } from '../../../shared/api/types';

export type PlanetKind = 'rocky' | 'gaseous' | 'icy' | 'unknown';

export interface PlanetVisuals {
  /** Base surface color derived from equilibrium temperature. */
  color: THREE.Color;
  /** Rocky, gaseous or icy composition. */
  kind: PlanetKind;
  /** Human readable label for the UI. */
  kindLabel: string;
  /** Sphere radius in scene units. */
  sceneRadius: number;
  /** 0..1 how "hot" the planet is (drives emissive lava glow). */
  heat: number;
  /** Whether to render a ring system (large gas giants only). */
  hasRings: boolean;
  /** Deterministic seed derived from the planet name. */
  seed: number;
  /** Color of the host star light. */
  starColor: THREE.Color;
}

/** Deterministic 32-bit hash of a string, used to seed procedural details. */
export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Cheap deterministic PRNG (mulberry32). */
export function makeRng(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Maps an equilibrium temperature (Kelvin) to a color:
 * deep blue (frozen) -> cyan -> pale -> yellow -> orange -> red (molten).
 */
export function temperatureToColor(kelvin: number | null): THREE.Color {
  if (kelvin == null) return new THREE.Color('#8a93a6'); // neutral grey when unknown

  const stops: Array<[number, string]> = [
    [50, '#2b4bd6'],   // deep frozen blue
    [150, '#3f7bdc'],  // cold blue
    [230, '#5fb4d8'],  // icy cyan
    [288, '#7fc8a8'],  // temperate (Earth-like)
    [400, '#d8c37a'],  // warm sand
    [700, '#e09a4a'],  // hot orange
    [1200, '#e0632e'], // scorching
    [2500, '#d6202a'], // molten red
  ];

  if (kelvin <= stops[0][0]) return new THREE.Color(stops[0][1]);
  if (kelvin >= stops[stops.length - 1][0]) return new THREE.Color(stops[stops.length - 1][1]);

  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (kelvin >= t0 && kelvin <= t1) {
      const t = (kelvin - t0) / (t1 - t0);
      return new THREE.Color(c0).lerp(new THREE.Color(c1), t);
    }
  }
  return new THREE.Color('#8a93a6');
}

/** Approximate blackbody color of the host star from its temperature (Kelvin). */
export function starTemperatureToColor(kelvin: number | null): THREE.Color {
  if (kelvin == null) return new THREE.Color('#fff4e0');
  if (kelvin < 3500) return new THREE.Color('#ffb46b'); // M dwarf, orange-red
  if (kelvin < 5000) return new THREE.Color('#ffd9a0'); // K, orange
  if (kelvin < 6000) return new THREE.Color('#fff3d6'); // G, sun-like
  if (kelvin < 7500) return new THREE.Color('#ffffff'); // F, white
  if (kelvin < 10000) return new THREE.Color('#cfe0ff'); // A, blue-white
  return new THREE.Color('#9fbfff'); // B/O, blue
}

/**
 * Classifies the planet composition from density (g/cm^3), mass (Earth masses)
 * and radius (Earth radii). Falls back gracefully when data is missing.
 */
export function classifyPlanet(exoplanet: Exoplanet): { kind: PlanetKind; label: string } {
  const { density, mass, radius, temperature } = exoplanet;

  if (density != null) {
    if (density >= 3) {
      return { kind: 'rocky', label: 'Rocky world' };
    }
    if (density >= 1.8) {
      // Between rock and gas: icy / water worlds when cold, mini-Neptunes otherwise
      if (temperature != null && temperature < 250) return { kind: 'icy', label: 'Icy world' };
      return { kind: 'gaseous', label: 'Mini-Neptune' };
    }
    return {
      kind: 'gaseous',
      label: radius != null && radius > 6 ? 'Gas giant' : 'Gaseous planet',
    };
  }

  // No density: infer from size / mass thresholds
  if (radius != null) {
    if (radius <= 1.7) return { kind: 'rocky', label: 'Rocky world' };
    if (radius <= 3.5) return { kind: 'gaseous', label: 'Mini-Neptune' };
    return { kind: 'gaseous', label: 'Gas giant' };
  }
  if (mass != null) {
    if (mass <= 5) return { kind: 'rocky', label: 'Rocky world' };
    if (mass <= 30) return { kind: 'gaseous', label: 'Mini-Neptune' };
    return { kind: 'gaseous', label: 'Gas giant' };
  }

  return { kind: 'unknown', label: 'Unknown composition' };
}

/** Maps radius (Earth radii) to a scene radius using a compressed log scale. */
export function radiusToSceneRadius(radius: number | null): number {
  const r = radius ?? 1;
  const scaled = 0.9 + Math.log2(Math.max(r, 0.3) + 1) * 0.42;
  return THREE.MathUtils.clamp(scaled, 0.7, 2.3);
}

/** 0..1 heat factor used for the emissive lava glow on very hot planets. */
export function heatFactor(kelvin: number | null): number {
  if (kelvin == null) return 0;
  return THREE.MathUtils.clamp((kelvin - 700) / 1800, 0, 1);
}

/**
 * Icy ring systems only survive far from the star: beyond the frost line the
 * equilibrium temperature stays below ~200 K, so water ice is stable. Hot
 * Jupiters would have their rings sublimated/destroyed, so they get none.
 */
export function canHaveRings(kind: PlanetKind, radius: number | null, temperature: number | null): boolean {
  const isGiant = (radius ?? 0) > 6;
  return kind === 'gaseous' && isGiant && temperature != null && temperature < 200;
}

/** Aggregates every visual property derived from the exoplanet data. */
export function computePlanetVisuals(exoplanet: Exoplanet): PlanetVisuals {
  const seed = hashString(exoplanet.name);
  const { kind, label } = classifyPlanet(exoplanet);
  const sceneRadius = radiusToSceneRadius(exoplanet.radius);

  return {
    color: temperatureToColor(exoplanet.temperature),
    kind,
    kindLabel: label,
    sceneRadius,
    heat: heatFactor(exoplanet.temperature),
    hasRings: canHaveRings(kind, exoplanet.radius, exoplanet.temperature),
    seed,
    starColor: starTemperatureToColor(exoplanet.star_temperature),
  };
}

