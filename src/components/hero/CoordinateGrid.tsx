import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CoordinateGrid() {
  const groupRef = useRef<THREE.Group>(null);
  const gridSize = 10;
  const divisions = 20;

  const gridHelper = useMemo(() => new THREE.GridHelper(gridSize, divisions, '#D8D4CC', '#D8D4CC'), []);
  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#D8D4CC', transparent: true, opacity: 0.35 });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]}>
      <primitive object={gridHelper} />
    </group>
  );
}