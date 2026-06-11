import { useGLTF } from '@react-three/drei';

interface AsteroidProps {
  url: string; // ej: '/assets/asteroid.glb' (poné el archivo en frontend/public/assets/)
  position?: [number, number, number];
  scale?: number;
}

// Para usarlo: <Asteroid url="/assets/asteroid.glb" position={[4, 0, 0]} scale={0.5} />
// y montalo dentro de <Scene/>. Acordate de comprimir el modelo con Draco.
export function Asteroid({ url, position = [0, 0, 0], scale = 1 }: AsteroidProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} />;
}