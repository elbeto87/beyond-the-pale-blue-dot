import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ProceduralAsteroid } from './ProceduralAsteroid';
import { Starfield } from './Starfield';
import { useSelectedAsteroid } from '../selectedAsteroid.store';

export default function Scene() {
  const selected = useSelectedAsteroid((state) => state.selected);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.6} />

      <Starfield />
      <ProceduralAsteroid asteroid={selected} />

      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}