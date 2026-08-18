import * as THREE from 'three';

export function vectorField(x: number, y: number, z: number): THREE.Vector3 {
  const v = new THREE.Vector3();
  // Blended rotational + saddle field
  v.x = -y + x * z;
  v.y = x + y * z;
  v.z = -z + (x * x - y * y);
  return v.normalize();
}

export function integrateStreamline(
  start: THREE.Vector3,
  steps: number = 100,
  stepSize: number = 0.05
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [start.clone()];
  const pos = start.clone();
  for (let i = 1; i < steps; i++) {
    const dir = vectorField(pos.x, pos.y, pos.z).multiplyScalar(stepSize);
    pos.add(dir);
    if (pos.length() > 10) break;
    points.push(pos.clone());
  }
  return points;
}

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
