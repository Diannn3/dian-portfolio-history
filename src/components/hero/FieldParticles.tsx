import * as THREE from 'three';
import { fieldAt, seeded } from '../../lib/math/field';
import { sceneState } from '../../lib/webgl/sceneState';
import type { SceneNode } from './ParametricManifold';

const v = new THREE.Vector3();

/**
 * Particles advected by the same field F: each point's velocity is F at its own
 * position, so nothing floats randomly. Respawn is deterministic.
 */
export function createParticles(count: number, reduced: boolean): SceneNode {
  const rnd = seeded(9182736);
  const positions = new Float32Array(count * 3);
  const seeds: number[] = [];
  for (let i = 0; i < count; i++) {
    const r = 1.2 + rnd() * 3.4;
    const a = rnd() * Math.PI * 2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (rnd() - 0.5) * 3.2;
    positions[i * 3 + 2] = Math.sin(a) * r * 0.8;
    seeds.push(rnd());
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: '#111111',
    size: 0.019,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  let time = 0;

  return {
    object: points,
    update(delta) {
      const d = reduced ? 0 : delta;
      time += d;
      const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        fieldAt(arr[ix], arr[ix + 1], arr[ix + 2], time, v);
        arr[ix] += v.x * d * 0.22;
        arr[ix + 1] += v.y * d * 0.22;
        arr[ix + 2] += v.z * d * 0.22;
        if (Math.hypot(arr[ix], arr[ix + 1], arr[ix + 2]) > 4.9) {
          const s = seeds[i];
          const a = s * Math.PI * 2 + time * 0.1;
          arr[ix] = Math.cos(a) * 1.3;
          arr[ix + 1] = (s - 0.5) * 2.4;
          arr[ix + 2] = Math.sin(a) * 1.1;
        }
      }
      attr.needsUpdate = true;
      material.opacity = 0.5 * (1 - THREE.MathUtils.smoothstep(sceneState.progress, 0.55, 1));
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    }
  };
}