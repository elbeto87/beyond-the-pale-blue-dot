/**
 * Lightweight deterministic 3D value noise + fractal Brownian motion (fBm).
 * Used to displace the asteroid mesh vertices into an irregular rocky body
 * without pulling in an external noise dependency.
 */

function hashCell(x: number, y: number, z: number, seed: number): number {
  let h = seed >>> 0;
  h = Math.imul(h ^ (x | 0), 0x27d4eb2d);
  h = Math.imul(h ^ (y | 0), 0x85ebca6b);
  h = Math.imul(h ^ (z | 0), 0xc2b2ae35);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967295;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function valueNoise3D(x: number, y: number, z: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smoothstep(x - xi);
  const v = smoothstep(y - yi);
  const w = smoothstep(z - zi);

  const c000 = hashCell(xi, yi, zi, seed);
  const c100 = hashCell(xi + 1, yi, zi, seed);
  const c010 = hashCell(xi, yi + 1, zi, seed);
  const c110 = hashCell(xi + 1, yi + 1, zi, seed);
  const c001 = hashCell(xi, yi, zi + 1, seed);
  const c101 = hashCell(xi + 1, yi, zi + 1, seed);
  const c011 = hashCell(xi, yi + 1, zi + 1, seed);
  const c111 = hashCell(xi + 1, yi + 1, zi + 1, seed);

  const x00 = lerp(c000, c100, u);
  const x10 = lerp(c010, c110, u);
  const x01 = lerp(c001, c101, u);
  const x11 = lerp(c011, c111, u);
  const y0 = lerp(x00, x10, v);
  const y1 = lerp(x01, x11, v);

  return lerp(y0, y1, w);
}

export function fbm3D(
  x: number,
  y: number,
  z: number,
  seed: number,
  octaves = 4,
): number {
  let total = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / maxValue;
}

