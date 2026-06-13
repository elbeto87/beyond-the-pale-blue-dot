import { useGLTF } from '@react-three/drei';

interface AsteroidProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
}

export function Asteroid({ url, position = [0, 0, 0], scale = 1 }: AsteroidProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} />;
}