import * as THREE from 'three';
import { ACCENT, Disposables, INK, catmull, lattice, line, marker } from './shared';
import type { StageNode } from './shared';

/**
 * PASADA — one route curve, timing bands standing off it as uncertainty
 * windows, and units advancing along the line. No numbers are shown: the
 * concept has no measured data behind it.
 */
export function createPasadaScene(reduced: boolean): StageNode {
  const d = new Disposables();
  const group = new THREE.Group();

  group.add(lattice(d, 3.4, 10));

  const path = catmull(
    [
    new THREE.Vector3(-1.55, 0.02, 0.85),
    new THREE.Vector3(-0.7, 0.02, 0.15),
    new THREE.Vector3(0.05, 0.02, 0.42),
    new THREE.Vector3(0.8, 0.02, -0.2),
    new THREE.Vector3(1.5, 0.02, -0.85)],

    180
  );
  group.add(line(d, path, INK, 0.6));

  /* timing bands: vertical hairlines whose height is a bounded window, not a metric */
  const bandCount = 9;
  const bands: THREE.Line[] = [];
  for (let i = 0; i < bandCount; i++) {
    const p = path[Math.floor(i / (bandCount - 1) * (path.length - 1))];
    const h = 0.16 + i % 3 * 0.12;
    const l = line(
      d,
      [new THREE.Vector3(p.x, 0.02, p.z), new THREE.Vector3(p.x, h, p.z)],
      i % 3 === 0 ? ACCENT : INK,
      0.5
    );
    bands.push(l);
    group.add(l);
  }

  const units = [0.1, 0.42, 0.78].map(() => {
    const m = marker(d, ACCENT, 0.065);
    m.rotation.x = -Math.PI / 2;
    group.add(m);
    return m;
  });
  const offsets = [0.1, 0.42, 0.78];

  let t = 0;

  return {
    object: group,
    update(delta, elapsed) {
      if (!reduced) t = (t + delta * 0.1) % 1;
      units.forEach((u, i) => {
        const pos = (t + offsets[i]) % 1;
        u.position.copy(path[Math.floor(pos * (path.length - 1))]);
      });
      bands.forEach((b, i) => {
        const mat = b.material as THREE.LineBasicMaterial;
        mat.opacity = reduced ? 0.5 : 0.32 + Math.abs(Math.sin(elapsed * 0.6 + i)) * 0.34;
      });
      group.rotation.y = -0.28;
      group.rotation.x = 0.05;
    },
    dispose() {
      d.disposeAll();
    }
  };
}