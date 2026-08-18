import * as THREE from 'three';
import { manifoldHeight } from '../../lib/math/field';
import { sceneState } from '../../lib/webgl/sceneState';
import type { SceneNode } from './ParametricManifold';

/**
 * A coordinate lattice bent by the manifold's height function, so it establishes
 * scale and belongs to the same system. Collapses toward a flat plan grid as the
 * page scrolls — the 3D world becoming a diagram.
 */
export function createLattice(reduced: boolean): SceneNode {
  const n = 18;
  const size = 7.2;
  const pos: number[] = [];
  const push = (x: number, z: number) => pos.push(x, manifoldHeight(x * 0.8, z * 0.8, 0) * 0.55, z);

  for (let i = 0; i <= n; i++) {
    const c = -size / 2 + size * i / n;
    const steps = 24;
    for (let s = 0; s < steps; s++) {
      const a = -size / 2 + size * s / steps;
      const b = -size / 2 + size * (s + 1) / steps;
      push(a, c);
      push(b, c);
      push(c, a);
      push(c, b);
    }
  }

  const array = new Float32Array(pos);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
  const bent = array.slice();
  const flatArr = array.slice();
  for (let i = 1; i < flatArr.length; i += 3) flatArr[i] = 0;

  const material = new THREE.LineBasicMaterial({ color: '#111111', transparent: true, opacity: 0.2 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.position.y = -1.55;
  lines.rotation.y = 0.32;

  let flat = 0;

  return {
    object: lines,
    update() {
      const p = sceneState.progress;
      const target = THREE.MathUtils.smoothstep(p, 0.2, 0.92);
      flat += (target - flat) * (reduced ? 1 : 0.12);
      const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] = bent[i] * (1 - flat) + flatArr[i] * flat;
      }
      attr.needsUpdate = true;
      lines.position.y = -1.55 + p * 0.5;
      lines.rotation.y = 0.32 + sceneState.pointerX * 0.02;
      material.opacity = 0.2 + THREE.MathUtils.smoothstep(p, 0.1, 0.7) * 0.16;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    }
  };
}