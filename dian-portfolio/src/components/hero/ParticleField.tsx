import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vectorField, seededRandom } from './heroMath';

interface ParticleFieldProps {
  quality: 'low' | 'medium' | 'high';
  pointerUniform: { value: THREE.Vector3 };
}

export default function ParticleField({ quality, pointerUniform }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const particles = useMemo(() => {
    const count = quality === 'low' ? 300 : quality === 'medium' ? 800 : 1500;
    const rand = seededRandom(7);
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 6;
      const y = (rand() - 0.5) * 6;
      const z = (rand() - 0.5) * 6;
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      const vel = vectorField(x, y, z);
      velocities[i*3] = vel.x;
      velocities[i*3+1] = vel.y;
      velocities[i*3+2] = vel.z;
    }
    return { count, positions, velocities };
  }, [quality]);

  useFrame((state, delta) => {
    const { count, positions, velocities } = particles;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let x = positions[i*3];
      let y = positions[i*3+1];
      let z = positions[i*3+2];
      // Compute field at current position, including pointer influence
      const base = vectorField(x, y, z);
      const pointerInfluence = pointerUniform.value.clone().sub(new THREE.Vector3(x, y, z)).normalize().multiplyScalar(0.3);
      const dir = base.add(pointerInfluence).normalize();
      x += dir.x * delta * 0.3;
      y += dir.y * delta * 0.3;
      z += dir.z * delta * 0.3;
      if (Math.abs(x) > 4) x = -x * 0.9;
      if (Math.abs(y) > 4) y = -y * 0.9;
      if (Math.abs(z) > 4) z = -z * 0.9;
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      arr[i*3] = x;
      arr[i*3+1] = y;
      arr[i*3+2] = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#555555" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
