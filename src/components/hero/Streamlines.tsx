import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function field(pos: THREE.Vector3): THREE.Vector3 {
  // deterministic vector field
  return new THREE.Vector3(
    -pos.y * 0.5 + Math.sin(pos.z * 0.5) * 0.3,
    pos.x * 0.5 + Math.cos(pos.z * 0.4) * 0.2,
    pos.z * 0.1 + Math.sin(pos.x * 0.3) * 0.2
  );
}

function rk4Step(pos: THREE.Vector3, dt: number): THREE.Vector3 {
  const k1 = field(pos);
  const k2 = field(pos.clone().addScaledVector(k1, dt / 2));
  const k3 = field(pos.clone().addScaledVector(k2, dt / 2));
  const k4 = field(pos.clone().addScaledVector(k3, dt));
  const step = new THREE.Vector3()
    .addScaledVector(k1, dt / 6)
    .addScaledVector(k2, dt / 3)
    .addScaledVector(k3, dt / 3)
    .addScaledVector(k4, dt / 6);
  return step;
}

export function Streamlines() {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const numStreamlines = 8;
    const pointsPerLine = 80;
    const dt = 0.05;
    const allPoints: THREE.Vector3[][] = [];

    for (let i = 0; i < numStreamlines; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      const points: THREE.Vector3[] = [start.clone()];
      let current = start.clone();
      for (let j = 0; j < pointsPerLine; j++) {
        const step = rk4Step(current, dt);
        current.add(step);
        points.push(current.clone());
      }
      allPoints.push(points);
    }
    return allPoints;
  }, []);

  const geometries = useMemo(() => {
    return lines.map(points => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
    });
  }, [lines]);

  const material = useMemo(() => new THREE.LineBasicMaterial({ color: '#D94F2B', transparent: true, opacity: 0.6 }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geometry, i) => (
        <primitive key={i} object={new THREE.Line(geometry, material)} />
      ))}
    </group>
  );
}