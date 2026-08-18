import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { Suspense } from 'react';

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
