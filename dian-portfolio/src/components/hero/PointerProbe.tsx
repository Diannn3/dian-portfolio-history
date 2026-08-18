import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PointerProbeProps {
  pointerUniform: { value: THREE.Vector3 };
}

export default function PointerProbe({ pointerUniform }: PointerProbeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(pointerUniform.value);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#D94F2B" />
    </mesh>
  );
}
