import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32, vectorField } from './field';
import type { Quality } from './Scene';

function integrate(start: THREE.Vector3, steps: number, dt: number) {
  const points = [start.clone()];
  const point = start.clone();
  const k1 = new THREE.Vector3();
  const k2 = new THREE.Vector3();
  const midpoint = new THREE.Vector3();

  for (let i = 0; i < steps; i++) {
    vectorField(point, k1);
    midpoint.copy(point).addScaledVector(k1, dt * 0.5);
    vectorField(midpoint, k2);
    point.addScaledVector(k2, dt);
    points.push(point.clone());
  }
  return points;
}

export function Streamlines({ quality, progressRef, reducedMotion }: { quality: Quality; progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const count = quality === 'low' ? 5 : quality === 'high' ? 11 : 8;
  const { lines, material } = useMemo(() => {
    const random = mulberry32(90210);
    const sharedMaterial = new THREE.LineBasicMaterial({ color: '#d94f2b', transparent: true, opacity: 0.62 });
    const generatedLines = Array.from({ length: count }, () => {
      const start = new THREE.Vector3((random() - 0.5) * 5.4, (random() - 0.5) * 3.4, (random() - 0.5) * 1.8);
      const geometry = new THREE.BufferGeometry().setFromPoints(integrate(start, quality === 'low' ? 48 : 74, 0.052));
      return new THREE.Line(geometry, sharedMaterial);
    });
    return { lines: generatedLines, material: sharedMaterial };
  }, [count, quality]);

  useEffect(() => () => {
    lines.forEach((line) => line.geometry.dispose());
    material.dispose();
  }, [lines, material]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const progress = progressRef.current;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, progress * 0.22, 4, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, -progress * 0.8, 4, delta);
    group.current.scale.z = THREE.MathUtils.damp(group.current.scale.z, 1 - progress * 0.7, 4, delta);
    if (!reducedMotion) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.018;
  });

  return <group ref={group}>{lines.map((line, index) => <primitive key={index} object={line} dispose={null} />)}</group>;
}
