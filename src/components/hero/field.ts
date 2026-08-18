import * as THREE from 'three';

export function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function vectorField(position: THREE.Vector3, target = new THREE.Vector3()) {
  const { x, y, z } = position;
  target.set(
    -0.44 * y + 0.18 * Math.sin(z * 1.4),
    0.52 * x - 0.14 * Math.sin(y * 1.2),
    -0.18 * z + 0.12 * Math.sin(x * 1.7) * Math.cos(y * 1.1),
  );
  return target;
}

export function manifoldPoint(u: number, v: number, target = new THREE.Vector3()) {
  const x = u * 2.2;
  const y = v * 1.55;
  const saddle = 0.52 * (u * u - v * v);
  const fold = 0.38 * Math.sin((u + 0.25) * Math.PI) * Math.cos(v * Math.PI * 0.75);
  const twist = 0.22 * u * v;
  return target.set(x, y, saddle + fold + twist);
}
