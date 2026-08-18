import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 400;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.01;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.position.setFromMatrixPosition(dummy.matrix);
      // integrate simple field
      dummy.position.x += velocities[i * 3] + Math.sin(time + i) * 0.0005;
      dummy.position.y += velocities[i * 3 + 1] + Math.cos(time + i) * 0.0005;
      dummy.position.z += velocities[i * 3 + 2] + Math.sin(time * 0.5 + i) * 0.0005;
      // wrap around
      if (Math.abs(dummy.position.x) > 6) dummy.position.x *= -0.9;
      if (Math.abs(dummy.position.y) > 5) dummy.position.y *= -0.9;
      if (Math.abs(dummy.position.z) > 4) dummy.position.z *= -0.9;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#555555" transparent opacity={0.6} />
    </instancedMesh>
  );
}