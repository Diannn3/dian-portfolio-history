import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { Scene } from './Scene';
import HeroFallback from './HeroFallback';

type Quality = 'low' | 'medium' | 'high';

export default function HeroCanvas() {
  const [quality, setQuality] = useState<Quality>('medium');
  const [dpr, setDpr] = useState(1.35);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <Suspense fallback={<HeroFallback />}>
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0.2, 6.8], fov: 42, near: 0.1, far: 80 }}
        dpr={dpr}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ alpha: true, antialias: quality !== 'low', powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor
          flipflops={3}
          onChange={({ factor }) => {
            setDpr(Math.min(1.8, 0.9 + factor * 0.8));
            setQuality(factor < 0.34 ? 'low' : factor > 0.72 ? 'high' : 'medium');
          }}
          onFallback={() => { setQuality('low'); setDpr(1); }}
        />
        <Scene quality={quality} reducedMotion={reducedMotion} />
      </Canvas>
    </Suspense>
  );
}
