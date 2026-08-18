import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

export function Scene() {
  const { camera } = useThree();
  const sceneProgress = useRef(0);

  // GSAP ScrollTrigger to update uniform for scroll transformation
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          sceneProgress.current = self.progress;
        },
      },
    });
    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <ParametricManifold progressRef={sceneProgress} />
      <VectorField />
      <Streamlines />
      <CoordinateGrid />
      <ParticleField />
      <PointerProbe />
      <CameraRig progressRef={sceneProgress} />
    </>
  );
}