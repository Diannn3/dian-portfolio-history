import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32, vectorField } from './field';
import type { Quality } from './Scene';

export function VectorField({ quality, progressRef }: { quality: Quality; progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!);
  const count = quality === 'low' ? 28 : quality === 'high' ? 72 : 48;
  const { geometry, material } = useMemo(() => {
    const random = mulberry32(5219);
    const vertices = new Float32Array(count * 6);
    const point = new THREE.Vector3();
    const direction = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      point.set((random() - 0.5) * 8.4, (random() - 0.5) * 5.4, (random() - 0.5) * 3.2);
      vectorField(point, direction).normalize().multiplyScalar(0.42 + random() * 0.34);
      const offset = i * 6;
      vertices.set([
        point.x, point.y, point.z,
        point.x + direction.x, point.y + direction.y, point.z + direction.z,
      ], offset);
    }

    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const nextMaterial = new THREE.LineBasicMaterial({ color: '#6f6a63', transparent: true, opacity: 0.27 });
    return { geometry: nextGeometry, material: nextMaterial };
  }, [count]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const progress = progressRef.current;
    group.current.scale.z = THREE.MathUtils.damp(group.current.scale.z, 1 - progress * 0.72, 4, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, -progress * 0.35, 4, delta);
  });

  return <group ref={group}><lineSegments geometry={geometry} material={material} /></group>;
}
