import { describe, expect, it } from 'vitest';
import type { Exoplanet } from '../../../shared/api/types';
import {
  classifyPlanet,
  computePlanetVisuals,
  heatFactor,
  radiusToSceneRadius,
  starTemperatureToColor,
  temperatureToColor,
} from './exoplanetVisuals';

function makeExoplanet(overrides: Partial<Exoplanet> = {}): Exoplanet {
  return {
    name: 'Test-1 b',
    host_name: 'Test-1',
    discovery_year: 2020,
    discovery_pubdate: null,
    discovery_method: 'Transit',
    radius: null,
    mass: null,
    density: null,
    temperature: null,
    insolation: null,
    orbit_period: null,
    orbit_eccentricity: null,
    orbit_smax: null,
    star_temperature: null,
    ...overrides,
  };
}

describe('temperatureToColor', () => {
  it('returns blue-ish for frozen planets', () => {
    const c = temperatureToColor(50);
    expect(c.b).toBeGreaterThan(c.r);
  });

  it('returns red-ish for molten planets', () => {
    const c = temperatureToColor(3000);
    expect(c.r).toBeGreaterThan(c.b);
  });

  it('returns neutral grey when temperature is unknown', () => {
    expect(temperatureToColor(null).getHexString()).toBe('8a93a6');
  });

  it('interpolates between stops for intermediate temperatures', () => {
    const cold = temperatureToColor(150);
    const warm = temperatureToColor(400);
    expect(cold.getHexString()).not.toBe(warm.getHexString());
  });
});

describe('classifyPlanet', () => {
  it('classifies high density as rocky', () => {
    expect(classifyPlanet(makeExoplanet({ density: 5.5 })).kind).toBe('rocky');
  });

  it('classifies low density as gaseous', () => {
    expect(classifyPlanet(makeExoplanet({ density: 0.7, radius: 11 }))).toEqual({
      kind: 'gaseous',
      label: 'Gas giant',
    });
  });

  it('classifies cold intermediate density as icy', () => {
    expect(classifyPlanet(makeExoplanet({ density: 2.0, temperature: 150 })).kind).toBe('icy');
  });

  it('falls back to radius when density is missing', () => {
    expect(classifyPlanet(makeExoplanet({ radius: 1.0 })).kind).toBe('rocky');
    expect(classifyPlanet(makeExoplanet({ radius: 12 })).kind).toBe('gaseous');
  });

  it('falls back to mass when density and radius are missing', () => {
    expect(classifyPlanet(makeExoplanet({ mass: 2 })).kind).toBe('rocky');
    expect(classifyPlanet(makeExoplanet({ mass: 300 })).kind).toBe('gaseous');
  });

  it('returns unknown when no physical data exists', () => {
    expect(classifyPlanet(makeExoplanet()).kind).toBe('unknown');
  });
});

describe('radiusToSceneRadius', () => {
  it('grows with planet radius but stays within bounds', () => {
    const small = radiusToSceneRadius(0.5);
    const earth = radiusToSceneRadius(1);
    const giant = radiusToSceneRadius(20);
    expect(small).toBeLessThan(earth);
    expect(earth).toBeLessThan(giant);
    expect(small).toBeGreaterThanOrEqual(0.7);
    expect(giant).toBeLessThanOrEqual(2.3);
  });

  it('defaults to Earth size when radius is unknown', () => {
    expect(radiusToSceneRadius(null)).toBe(radiusToSceneRadius(1));
  });
});

describe('heatFactor', () => {
  it('is zero for temperate planets and grows for hot ones', () => {
    expect(heatFactor(300)).toBe(0);
    expect(heatFactor(null)).toBe(0);
    expect(heatFactor(1500)).toBeGreaterThan(0);
    expect(heatFactor(99999)).toBe(1);
  });
});

describe('starTemperatureToColor', () => {
  it('is warm-toned for cool M dwarfs and cool-toned for hot stars', () => {
    const m = starTemperatureToColor(3000);
    const b = starTemperatureToColor(20000);
    expect(m.r).toBeGreaterThan(m.b);
    expect(b.b).toBeGreaterThan(b.r);
  });
});

describe('computePlanetVisuals', () => {
  it('is deterministic for the same planet', () => {
    const planet = makeExoplanet({ radius: 9, density: 0.8, temperature: 900 });
    const a = computePlanetVisuals(planet);
    const b = computePlanetVisuals(planet);
    expect(a.seed).toBe(b.seed);
    expect(a.color.getHexString()).toBe(b.color.getHexString());
    expect(a.hasRings).toBe(b.hasRings);
  });

  it('only allows rings on cold gaseous giants (beyond the frost line)', () => {
    const coldGiant = computePlanetVisuals(makeExoplanet({ density: 0.7, radius: 11, temperature: 120 }));
    expect(coldGiant.hasRings).toBe(true);

    const hotJupiter = computePlanetVisuals(makeExoplanet({ density: 0.7, radius: 11, temperature: 1400 }));
    expect(hotJupiter.hasRings).toBe(false);

    const coldSmallGaseous = computePlanetVisuals(makeExoplanet({ density: 0.7, radius: 3, temperature: 120 }));
    expect(coldSmallGaseous.hasRings).toBe(false);

    const unknownTemperature = computePlanetVisuals(makeExoplanet({ density: 0.7, radius: 11, temperature: null }));
    expect(unknownTemperature.hasRings).toBe(false);

    const rocky = computePlanetVisuals(makeExoplanet({ density: 5, radius: 1, temperature: 120 }));
    expect(rocky.hasRings).toBe(false);
  });
});

