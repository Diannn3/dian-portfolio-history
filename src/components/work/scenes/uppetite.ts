import * as THREE from 'three';
import { ACCENT, Disposables, INK, catmull, lattice, line, marker } from './shared';
import type { StageNode } from './shared';

/**
 * UPPETITE — a plan lattice, one supported walking route across it, verified
 * place markers, and a single tracer showing progress along the route. The
 * geometry is a diagram of the routing model, not a screenshot of the product.
 */
export function createUppetiteScene(reduced: boolean): StageNode {
  const d = new Disposables();
  const group = new THREE.Group();

  group.add(lattice(d, 3.4, 12));

  const control = [
  new THREE.Vector3(-1.5, 0.02, 1.1),
  new THREE.Vector3(-0.6, 0.02, 0.35),
  new THREE.Vector3(0.15, 0.02, 0.5),
  new THREE.Vector3(0.85, 0.02, -0.35),
  new THREE.Vector3(1.5, 0.02, -0.95)];

  const path = catmull(control, 160);
  group.add(line(d, path, ACCENT, 0.85));

  /* verified nodes sit on the route; the unsupported one is deliberately open */
  control.forEach((p, i) => {
    const m = marker(d, i === 3 ? ACCENT : INK, i === 3 ? 0.1 : 0.07);
    m.position.copy(p);
    m.rotation.x = -Math.PI / 2;
    group.add(m);
  });

  const ring = line(
    d,
    Array.from({ length: 65 }, (_, i) => {
      const a = i / 64 * Math.PI * 2;
      return new THREE.Vector3(0.85 + Math.cos(a) * 0.3, 0.02, -0.35 + Math.sin(a) * 0.3);
    }),
    ACCENT,
    0.4
  );
  group.add(ring);

  const tracer = marker(d, ACCENT, 0.06);
  tracer.rotation.x = -Math.PI / 2;
  group.add(tracer);

  let t = 0;

  return {
    object: group,
    update(delta) {
      if (!reduced) t = (t + delta * 0.16) % 1;
      const idx = Math.floor(t * (path.length - 1));
      tracer.position.copy(path[idx]);
      group.rotation.y = reduced ? -0.32 : -0.32 + Math.sin(t * Math.PI * 2) * 0.05;
    },
    dispose() {
      d.disposeAll();
    }
  };
}