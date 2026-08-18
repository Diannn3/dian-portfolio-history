import { Canvas } from '@react-three/fiber';
import { Suspense, lazy } from 'react';
import { Scene } from './Scene';
import { HeroFallback } from './HeroFallback';

export default function HeroCanvas() {
  return (
    <Suspense fallback={null}>
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
      >
        <Scene />
      </Canvas>
    </Suspense>
  );
}