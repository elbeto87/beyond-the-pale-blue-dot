import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { IcosahedronGeometry, type Mesh } from 'three';
import type { Asteroid } from '../../../shared/api/types';
import { hashStringToSeed } from '../utils/seededRandom';
import { fbm3D } from '../utils/valueNoise';
import {
  getAsteroidMaterial,
  getRotationSpeed,
  parseExtentScale,
} from '../utils/asteroidVisuals';

interface Props {
  asteroid: Asteroid | null;
  radius?: number;
  detail?: number;
}

const DEFAULT_SEED_ID = 'default-asteroid';

function buildAsteroidGeometry(seedId: string, radius: number, detail: number): IcosahedronGeometry {
  const seed = hashStringToSeed(seedId);
  const geometry = new IcosahedronGeometry(radius, detail);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const length =
      Math.sqrt(position.getX(i) ** 2 + position.getY(i) ** 2 + position.getZ(i) ** 2) || 1;
    const nx = position.getX(i) / length;
    const ny = position.getY(i) / length;
    const nz = position.getZ(i) / length;

    const lobes = fbm3D(nx * 1.5, ny * 1.5, nz * 1.5, seed, 3);
    const detailNoise = fbm3D(nx * 4, ny * 4, nz * 4, seed + 99, 4);
    const displacement = 1 + (lobes - 0.5) * 0.5 + (detailNoise - 0.5) * 0.18;

    position.setXYZ(i, nx * radius * displacement, ny * radius * displacement, nz * radius * displacement);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export function ProceduralAsteroid({ asteroid, radius = 2, detail = 5 }: Props) {
  const meshRef = useRef<Mesh>(null);
  const seedId = asteroid?.asteroid_id ?? DEFAULT_SEED_ID;

  const geometry = useMemo(
    () => buildAsteroidGeometry(seedId, radius, detail),
    [seedId, radius, detail],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(() => getAsteroidMaterial(asteroid), [asteroid]);
  const scale = useMemo(() => parseExtentScale(asteroid?.extent ?? null), [asteroid]);
  const rotationSpeed = useMemo(
    () => getRotationSpeed(asteroid?.rotation_period_hours ?? null),
    [asteroid],
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color={material.color}
        roughness={material.roughness}
        metalness={material.metalness}
        emissive={material.emissive}
        emissiveIntensity={material.emissiveIntensity}
        flatShading
      />
    </mesh>
  );
}

