import * as THREE from 'three';
import { fieldComponents } from './fieldCore';

export { A, B, C, manifoldHeight, seeded } from './fieldCore';

/**
 * Three.js adapter for the site's pure mathematical field.
 * The equations live in fieldCore.ts so non-WebGL UI can use them without
 * synchronously loading Three.js.
 */
export function fieldAt(x: number, y: number, z: number, t: number, out: THREE.Vector3) {
  fieldComponents(x, y, z, t, out);
  return out;
}

/** RK4 integration of F, used to precompute streamlines on the CPU once. */
export function streamline(
start: THREE.Vector3,
steps: number,
h: number,
t: number)
: THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const p = start.clone();
  const k1 = new THREE.Vector3();
  const k2 = new THREE.Vector3();
  const k3 = new THREE.Vector3();
  const k4 = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  for (let i = 0; i < steps; i++) {
    pts.push(p.clone());
    fieldAt(p.x, p.y, p.z, t, k1);
    tmp.copy(p).addScaledVector(k1, h / 2);
    fieldAt(tmp.x, tmp.y, tmp.z, t, k2);
    tmp.copy(p).addScaledVector(k2, h / 2);
    fieldAt(tmp.x, tmp.y, tmp.z, t, k3);
    tmp.copy(p).addScaledVector(k3, h);
    fieldAt(tmp.x, tmp.y, tmp.z, t, k4);
    p.addScaledVector(k1, h / 6).
    addScaledVector(k2, h / 3).
    addScaledVector(k3, h / 3).
    addScaledVector(k4, h / 6);
    if (p.length() > 6) break;
  }
  return pts;
}