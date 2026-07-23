import * as THREE from 'three';
import { makeRng, type PlanetKind } from './exoplanetVisuals';

const TEXTURE_SIZE = 512;

function createCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE / 2;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

function shade(color: THREE.Color, amount: number): string {
  const c = color.clone();
  if (amount >= 0) c.lerp(new THREE.Color('#ffffff'), amount);
  else c.lerp(new THREE.Color('#000000'), -amount);
  return `#${c.getHexString()}`;
}

/** Latitudinal cloud bands with turbulent edges — Jupiter/Neptune style. */
function paintGaseous(ctx: CanvasRenderingContext2D, color: THREE.Color, rng: () => number): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = shade(color, -0.1);
  ctx.fillRect(0, 0, w, h);

  const bandCount = 6 + Math.floor(rng() * 8);
  let y = 0;
  for (let i = 0; i < bandCount && y < h; i++) {
    const bandHeight = (h / bandCount) * (0.5 + rng());
    const tone = (rng() - 0.5) * 0.55;
    ctx.fillStyle = shade(color, tone);
    // wavy band edges
    ctx.beginPath();
    ctx.moveTo(0, y);
    const waveAmp = 2 + rng() * 6;
    const waveFreq = 2 + rng() * 4;
    const phase = rng() * Math.PI * 2;
    for (let x = 0; x <= w; x += 8) {
      ctx.lineTo(x, y + Math.sin((x / w) * Math.PI * 2 * waveFreq + phase) * waveAmp);
    }
    ctx.lineTo(w, y + bandHeight);
    for (let x = w; x >= 0; x -= 8) {
      ctx.lineTo(x, y + bandHeight + Math.sin((x / w) * Math.PI * 2 * waveFreq + phase + 1.3) * waveAmp);
    }
    ctx.closePath();
    ctx.fill();
    y += bandHeight;
  }

  // storm ovals
  const storms = 1 + Math.floor(rng() * 4);
  for (let i = 0; i < storms; i++) {
    const sx = rng() * w;
    const sy = h * (0.25 + rng() * 0.5);
    const rx = 10 + rng() * 26;
    const ry = rx * (0.4 + rng() * 0.3);
    ctx.fillStyle = shade(color, rng() > 0.5 ? 0.4 : -0.4);
    ctx.beginPath();
    ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Noisy continents / craters — rocky worlds. */
function paintRocky(ctx: CanvasRenderingContext2D, color: THREE.Color, rng: () => number, heat: number): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = shade(color, -0.2);
  ctx.fillRect(0, 0, w, h);

  // terrain splotches
  for (let i = 0; i < 900; i++) {
    const x = rng() * w;
    const yy = rng() * h;
    const r = 2 + rng() * 22;
    ctx.fillStyle = shade(color, (rng() - 0.45) * 0.6);
    ctx.globalAlpha = 0.25 + rng() * 0.35;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // craters
  const craters = 12 + Math.floor(rng() * 24);
  for (let i = 0; i < craters; i++) {
    const x = rng() * w;
    const yy = rng() * h;
    const r = 3 + rng() * 9;
    ctx.strokeStyle = shade(color, -0.5);
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // lava cracks on very hot rocky worlds
  if (heat > 0.25) {
    ctx.strokeStyle = '#ff5a1f';
    ctx.globalAlpha = Math.min(heat, 0.9);
    ctx.lineWidth = 1.6;
    const cracks = 14 + Math.floor(heat * 26);
    for (let i = 0; i < cracks; i++) {
      let x = rng() * w;
      let yy = rng() * h;
      ctx.beginPath();
      ctx.moveTo(x, yy);
      const segments = 4 + Math.floor(rng() * 8);
      for (let s = 0; s < segments; s++) {
        x += (rng() - 0.5) * 60;
        yy += (rng() - 0.5) * 30;
        ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

/** Pale surface with fracture lines — Europa/Enceladus style ice worlds. */
function paintIcy(ctx: CanvasRenderingContext2D, color: THREE.Color, rng: () => number): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = shade(color, 0.45);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 500; i++) {
    const x = rng() * w;
    const yy = rng() * h;
    const r = 4 + rng() * 30;
    ctx.fillStyle = shade(color, 0.15 + rng() * 0.4);
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // fracture lines
  ctx.strokeStyle = shade(color, -0.35);
  ctx.lineWidth = 1;
  const cracks = 24 + Math.floor(rng() * 20);
  for (let i = 0; i < cracks; i++) {
    let x = rng() * w;
    let yy = rng() * h;
    ctx.globalAlpha = 0.35 + rng() * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, yy);
    const segments = 5 + Math.floor(rng() * 10);
    for (let s = 0; s < segments; s++) {
      x += (rng() - 0.5) * 120;
      yy += (rng() - 0.5) * 40;
      ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Builds a procedural equirectangular texture for the planet. Deterministic
 * per planet thanks to the seeded RNG, so a planet always looks the same.
 */
export function createPlanetTexture(
  kind: PlanetKind,
  color: THREE.Color,
  seed: number,
  heat: number,
): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas();
  const rng = makeRng(seed);

  switch (kind) {
    case 'gaseous':
      paintGaseous(ctx, color, rng);
      break;
    case 'icy':
      paintIcy(ctx, color, rng);
      break;
    case 'rocky':
    case 'unknown':
    default:
      paintRocky(ctx, color, rng, heat);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Bump map with random noise; stronger relief for rocky worlds. */
export function createBumpTexture(kind: PlanetKind, seed: number): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas();
  const rng = makeRng(seed ^ 0x9e3779b9);
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, w, h);

  const blobs = kind === 'gaseous' ? 120 : 700;
  for (let i = 0; i < blobs; i++) {
    const x = rng() * w;
    const yy = rng() * h;
    const r = 2 + rng() * (kind === 'gaseous' ? 30 : 16);
    const v = Math.floor(96 + rng() * 128);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

