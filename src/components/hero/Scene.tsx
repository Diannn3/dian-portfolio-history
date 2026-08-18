import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParametricManifold } from './ParametricManifold';
import { VectorField } from './VectorField';
import { Streamlines } from './Streamlines';
import { CoordinateGrid } from './CoordinateGrid';
import { ParticleField } from './ParticleField';
import { PointerProbe } from './PointerProbe';
import { CameraRig } from './CameraRig';

gsap.registerPlugin(ScrollTrigger);
export type Quality = 'low' | 'medium' | 'high';

export function Scene({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const progress = useRef(0);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (reducedMotion) {
      progress.current = 0.18;
      invalidate();
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => { progress.current = self.progress; },
      });
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [invalidate, reducedMotion]);

  return (
    <>
      <CoordinateGrid progressRef={progress} />
      <VectorField quality={quality} progressRef={progress} />
      <Streamlines quality={quality} progressRef={progress} reducedMotion={reducedMotion} />
      <ParticleField quality={quality} progressRef={progress} reducedMotion={reducedMotion} />
      <ParametricManifold progressRef={progress} reducedMotion={reducedMotion} />
      {!reducedMotion && <PointerProbe />}
      <CameraRig progressRef={progress} reducedMotion={reducedMotion} />
    </>
  );
}
