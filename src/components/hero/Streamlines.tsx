import * as THREE from 'three';
import { seeded, streamline } from '../../lib/math/field';
import { sceneState } from '../../lib/webgl/sceneState';
import type { SceneNode } from './ParametricManifold';

/**
 * Trajectories through the field, integrated once with RK4 from a seeded set of
 * launch points. Geometry is never rebuilt; the only motion is a set of tracers
 * advancing along the precomputed polylines, which gives the scene direction.
 */
export function createStreamlines(count: number, reduced: boolean): SceneNode {
  const group = new THREE.Group();
  const rnd = seeded(773311);
  const lines: THREE.Line[] = [];
  const paths: THREE.Vector3[][] = [];

  for (let i = 0; i < count; i++) {
    const start = new THREE.Vector3((rnd() - 0.5) * 5.4, (rnd() - 0.5) * 2.8, (rnd() - 0.5) * 4.6);
    const pts = streamline(start, 200, 0.05, i * 1.7);
    if (pts.length < 24) continue;
    paths.push(pts);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const accent = i % 3 === 0;
    const mat = new THREE.LineBasicMaterial({
      color: accent ? '#d94f2b' : '#111111',
      transparent: true,
      opacity: accent ? 0.46 : 0.2
    });
    const line = new THREE.Line(geo, mat);
    lines.push(line);
    group.add(line);
  }

  const tracerArray = new Float32Array(Math.max(paths.length, 1) * 3);
  const tracerGeo = new THREE.BufferGeometry();
  tracerGeo.setAttribute('position', new THREE.BufferAttribute(tracerArray, 3));
  const tracerMat = new THREE.PointsMaterial({
    color: '#d94f2b',
    size: 0.055,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85
  });
  const tracers = new THREE.Points(tracerGeo, tracerMat);
  tracers.frustumCulled = false;
  group.add(tracers);

  const cursor = paths.map((_, i) => i * 37 % 180);

  return {
    object: group,
    update(delta) {
      const p = sceneState.progress;
      const d = reduced ? 0 : delta;

      if (paths.length) {
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          cursor[i] = (cursor[i] + d * (14 + i * 1.6)) % (path.length - 1);
          const idx = Math.floor(cursor[i]);
          const frac = cursor[i] - idx;
          const a = path[idx];
          const b = path[Math.min(idx + 1, path.length - 1)];
          tracerArray[i * 3] = a.x + (b.x - a.x) * frac;
          tracerArray[i * 3 + 1] = a.y + (b.y - a.y) * frac;
          tracerArray[i * 3 + 2] = a.z + (b.z - a.z) * frac;
        }
        ;(tracerGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
        tracerMat.opacity = 0.85 * (1 - THREE.MathUtils.smoothstep(p, 0.6, 1));
      }

      lines.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        const accent = i % 3 === 0;
        mat.opacity =
        (accent ? 0.46 : 0.2) * (
        1 + THREE.MathUtils.smoothstep(p, 0.2, 0.62) * 0.5) * (
        1 - THREE.MathUtils.smoothstep(p, 0.9, 1) * 0.6);
      });

      group.rotation.y += d * 0.012;
      group.scale.y = 1 - p * 0.72;
      group.position.y = p * 0.22;
    },
    dispose() {
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      tracerGeo.dispose();
      tracerMat.dispose();
    }
  };
}