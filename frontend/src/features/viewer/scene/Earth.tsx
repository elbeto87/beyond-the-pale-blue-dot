import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, type Mesh } from 'three';

export function Earth() {
  const earthRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Planeta */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#1d4e78" emissive="#0a2236" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Atmósfera: esfera levemente mayor renderizada por dentro */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.12} side={BackSide} />
      </mesh>
    </group>
  );
}