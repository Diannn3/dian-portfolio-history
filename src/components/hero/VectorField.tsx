import * as THREE from 'three';
import { fieldAt, seeded } from '../../lib/math/field';
import { sceneState } from '../../lib/webgl/sceneState';
import type { SceneNode } from './ParametricManifold';

const dummy = new THREE.Object3D();
const dir = new THREE.Vector3();
const up = new THREE.Vector3(0, 0, 1);
const quat = new THREE.Quaternion();
const probe = new THREE.Vector3();

/**
 * Instanced vector glyphs sampled on a seeded lattice. Orientation is the field
 * direction at that point, length is |F|. One draw call, zero allocation.
 */
export function createVectorField(count: number, reduced: boolean): SceneNode {
  const geometry = new THREE.BoxGeometry(0.008, 0.008, 0.2);
  const material = new THREE.MeshBasicMaterial({ color: '#111111', transparent: true, opacity: 0.18 });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;

  const rnd = seeded(20260318);
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const r = 1.6 + rnd() * 2.9;
    const theta = rnd() * Math.PI * 2;
    const y = (rnd() - 0.5) * 3.1;
    points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r * 0.78));
  }

  let time = 0;

  return {
    object: mesh,
    update(delta) {
      if (!reduced) time += delta;
      const p = sceneState.progress;
      probe.set(sceneState.pointerX * 3.2, -sceneState.pointerY * 2.2, 0.4);

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        fieldAt(pt.x, pt.y, pt.z, time, dir);
        // the pointer perturbs the local field like an instrument inserted in it
        const d = probe.distanceTo(pt);
        const infl = sceneState.probing ? Math.exp(-d * d * 0.32) : 0;
        dir.x += (probe.x - pt.x) * infl * 0.9;
        dir.y += (probe.y - pt.y) * infl * 0.9;

        const mag = dir.length();
        dir.normalize();
        quat.setFromUnitVectors(up, dir);

        dummy.position.set(pt.x, pt.y * (1 - p * 0.72), pt.z * (1 - p * 0.34));
        dummy.quaternion.copy(quat);
        const len = THREE.MathUtils.clamp(mag * 0.42, 0.16, 0.9);
        dummy.scale.set(1, 1, len * (1 + infl * 0.7));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      material.opacity =
      0.16 +
      THREE.MathUtils.smoothstep(p, 0.15, 0.6) * 0.24 -
      THREE.MathUtils.smoothstep(p, 0.9, 1) * 0.3;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    }
  };
}