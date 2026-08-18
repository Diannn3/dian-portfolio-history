import { useThree, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { vectorField, integrateStreamline, seededRandom } from './heroMath';
import CoordinateGrid from './CoordinateGrid';
import Streamlines from './Streamlines';
import ParticleField from './ParticleField';
import PointerProbe from './PointerProbe';
import { PerformanceMonitor } from '@react-three/drei';

export default function Scene() {
  const { camera, pointer } = useThree();
  const [quality, setQuality] = useState<'low'|'medium'|'high'>('medium');
  const pointerUniform = useRef({ value: new THREE.Vector3(0, 0, 0) });

  // Update pointer uniform
  useFrame((state) => {
    const { x, y } = state.pointer;
    pointerUniform.current.value.set(x * 3, y * 2, 1);
  });

  const streamlines = useMemo(() => {
    const rand = seededRandom(42);
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < 12; i++) {
      const start = new THREE.Vector3(
        (rand() - 0.5) * 4,
        (rand() - 0.5) * 4,
        (rand() - 0.5) * 4
      );
      lines.push(integrateStreamline(start, 80, 0.05));
    }
    return lines;
  }, []);

  return (
    <>
      <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => setQuality('high')}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <CoordinateGrid />
        <Streamlines streamlines={streamlines} quality={quality} />
        <ParticleField quality={quality} pointerUniform={pointerUniform.current} />
        <PointerProbe pointerUniform={pointerUniform.current} />
      </PerformanceMonitor>
    </>
  );
}
