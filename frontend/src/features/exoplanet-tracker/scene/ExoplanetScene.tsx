import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Exoplanet } from '../../../shared/api/types';
import { computePlanetVisuals, type PlanetVisuals } from './exoplanetVisuals';
import { createBumpTexture, createPlanetTexture } from './planetTextures';

/** The planet sphere with a procedural texture, slowly rotating. */
function Planet({ visuals }: { visuals: PlanetVisuals }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { map, bumpMap } = useMemo(
    () => ({
      map: createPlanetTexture(visuals.kind, visuals.color, visuals.seed, visuals.heat),
      bumpMap: createBumpTexture(visuals.kind, visuals.seed),
    }),
    [visuals],
  );

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
  });

  const emissiveColor = useMemo(
    () => new THREE.Color('#ff3b00').lerp(new THREE.Color('#ffb300'), visuals.heat * 0.5),
    [visuals.heat],
  );

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[visuals.sceneRadius, 96, 96]} />
      <meshStandardMaterial
        map={map}
        bumpMap={bumpMap}
        bumpScale={visuals.kind === 'rocky' ? 0.06 : 0.015}
        roughness={visuals.kind === 'icy' ? 0.35 : visuals.kind === 'gaseous' ? 0.9 : 0.8}
        metalness={0.05}
        emissive={emissiveColor}
        emissiveIntensity={visuals.heat * 0.55}
      />
    </mesh>
  );
}

/** Soft additive halo giving the impression of an atmosphere. */
function Atmosphere({ visuals }: { visuals: PlanetVisuals }) {
  const color = useMemo(() => {
    const c = visuals.color.clone().lerp(new THREE.Color('#ffffff'), 0.35);
    if (visuals.heat > 0.4) c.lerp(new THREE.Color('#ff6a00'), visuals.heat * 0.6);
    return c;
  }, [visuals]);

  const thickness = visuals.kind === 'gaseous' ? 1.09 : 1.045;

  return (
    <mesh scale={thickness}>
      <sphereGeometry args={[visuals.sceneRadius, 48, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={visuals.kind === 'gaseous' ? 0.16 : 0.1}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Ring system for large gas giants. */
function Rings({ visuals }: { visuals: PlanetVisuals }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    // Rings only appear on cold giants, so tint them like water ice
    const base = visuals.color.clone().lerp(new THREE.Color('#e3ecf5'), 0.7);
    for (let x = 0; x < 256; x++) {
      const alpha = 0.25 + 0.5 * Math.abs(Math.sin(x * 0.22) * Math.sin(x * 0.045));
      ctx.fillStyle = `rgba(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)},${alpha.toFixed(3)})`;
      ctx.fillRect(x, 0, 1, 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [visuals.color]);

  const inner = visuals.sceneRadius * 1.45;
  const outer = visuals.sceneRadius * 2.35;

  // Remap ring UVs so the texture follows the radial direction
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 128, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos as THREE.BufferAttribute, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return geo;
  }, [inner, outer]);

  return (
    <mesh geometry={geometry} rotation={[Math.PI / 2.35, 0, 0]}>
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Full 3D scene: star light tinted by the host star, planet, atmosphere, rings. */
export function ExoplanetScene({ exoplanet }: { exoplanet: Exoplanet }) {
  const visuals = useMemo(() => computePlanetVisuals(exoplanet), [exoplanet]);

  return (
    <Canvas
      key={exoplanet.name}
      camera={{ position: [0, 1.2, 6.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.12} color={visuals.starColor} />
      <directionalLight position={[6, 2.5, 4]} intensity={2.2} color={visuals.starColor} />
      <pointLight position={[-6, -2, -4]} intensity={0.25} color="#3050a0" />

      <Stars radius={60} depth={30} count={2500} factor={3} saturation={0} fade speed={0.4} />

      <group>
        <Planet visuals={visuals} />
        <Atmosphere visuals={visuals} />
        {visuals.hasRings && <Rings visuals={visuals} />}
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={visuals.sceneRadius * 1.8}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

