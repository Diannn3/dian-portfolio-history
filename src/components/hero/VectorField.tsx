import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function VectorField() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 50;
  const lines = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // position around the manifold
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.6;
    }
    return positions;
  }, []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    // Each line is a segment from point to point + direction
    const vertices = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const x = lines[i * 3];
      const y = lines[i * 3 + 1];
      const z = lines[i * 3 + 2];
      const dir = new THREE.Vector3(-y, x, z * 0.5).normalize().multiplyScalar(0.8);
      vertices[i * 6] = x;
      vertices[i * 6 + 1] = y;
      vertices[i * 6 + 2] = z;
      vertices[i * 6 + 3] = x + dir.x;
      vertices[i * 6 + 4] = y + dir.y;
      vertices[i * 6 + 5] = z + dir.z;
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [lines, count]);

  const material = useMemo(() => new THREE.LineBasicMaterial({ color: '#555555', transparent: true, opacity: 0.4 }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry} material={material} />
    </group>
  );
}