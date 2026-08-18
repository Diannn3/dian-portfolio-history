import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface StreamlinesProps {
  streamlines: THREE.Vector3[][];
  quality: 'low' | 'medium' | 'high';
}

export default function Streamlines({ streamlines, quality }: StreamlinesProps) {
  const visibleCount = quality === 'low' ? 6 : streamlines.length;
  return (
    <group>
      {streamlines.slice(0, visibleCount).map((points, i) => (
        <Line key={i} points={points} color="#555555" lineWidth={0.5} transparent opacity={0.4} />
      ))}
    </group>
  );
}
