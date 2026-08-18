import { useMemo } from 'react';
import * as THREE from 'three';

export default function CoordinateGrid() {
  const gridGeometry = useMemo(() => {
    const points: number[] = [];
    const size = 8;
    const divisions = 20;
    const step = size / divisions;
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      points.push(i * step, 0, -size / 2, i * step, 0, size / 2);
      points.push(-size / 2, 0, i * step, size / 2, 0, i * step);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={gridGeometry}>
      <lineBasicMaterial color="#DDD8D0" transparent opacity={0.4} />
    </lineSegments>
  );
}
