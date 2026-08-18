import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CoordinateGrid({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!);
  const grid = useMemo(() => new THREE.GridHelper(16, 32, '#bdb8af', '#d8d4cc'), []);

  useEffect(() => () => {
    grid.geometry.dispose();
    const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
    materials.forEach((material) => material.dispose());
  }, [grid]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const progress = progressRef.current;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -Math.PI / 2 + 0.98 - progress * 0.62, 3.5, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -2.1 + progress * 0.3, 3.5, delta);
    group.current.scale.z = THREE.MathUtils.damp(group.current.scale.z, 1 - progress * 0.58, 3.5, delta);
  });

  return <group ref={group}><primitive object={grid} dispose={null} /></group>;
}
