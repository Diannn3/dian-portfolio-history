import * as THREE from 'three';
import { ACCENT, Disposables, INK, line, marker, segments } from './shared';
import type { StageNode } from './shared';

/**
 * DISASTER RESPONSE — inbound signal lines converging on a gateway, then
 * fanning into grouped incident candidates. Layered vertically because the
 * pipeline's whole point is that each stage stays separately inspectable.
 */
export function createDisasterScene(reduced: boolean): StageNode {
  const d = new Disposables();
  const group = new THREE.Group();

  /* inbound reports: sparse, irregular */
  const inbound: THREE.Vector3[] = [];
  const gateway = new THREE.Vector3(0, 0, 0);
  const sources: THREE.Vector3[] = [];
  for (let i = 0; i < 7; i++) {
    const y = -0.6 + i * 0.2;
    const s = new THREE.Vector3(-1.45, y * 0.5, -0.6 + i * 0.2);
    sources.push(s);
    inbound.push(s.clone(), gateway.clone());
  }
  group.add(segments(d, inbound, INK, 0.28));

  /* gateway plate */
  group.add(
    line(
      d,
      [
      new THREE.Vector3(-0.18, -0.18, -0.18),
      new THREE.Vector3(0.18, -0.18, -0.18),
      new THREE.Vector3(0.18, 0.18, 0.18),
      new THREE.Vector3(-0.18, 0.18, 0.18),
      new THREE.Vector3(-0.18, -0.18, -0.18)],

      INK,
      0.75
    )
  );

  /* grouped incident candidates */
  const clusters = [
  new THREE.Vector3(1.15, 0.34, -0.45),
  new THREE.Vector3(1.3, -0.05, 0.15),
  new THREE.Vector3(1.05, -0.34, 0.55)];

  const outbound: THREE.Vector3[] = [];
  clusters.forEach((c) => outbound.push(gateway.clone(), c.clone()));
  group.add(segments(d, outbound, ACCENT, 0.6));

  const pulses = clusters.map((c, i) => {
    const m = marker(d, ACCENT, 0.09 - i * 0.015);
    m.position.copy(c);
    group.add(m);
    /* corroborating reports around each candidate */
    const ring = line(
      d,
      Array.from({ length: 33 }, (_, k) => {
        const a = k / 32 * Math.PI * 2;
        return new THREE.Vector3(c.x + Math.cos(a) * 0.16, c.y + Math.sin(a) * 0.16, c.z);
      }),
      INK,
      0.22
    );
    group.add(ring);
    return m;
  });

  const source = marker(d, INK, 0.05);
  source.position.copy(sources[3]);
  group.add(source);

  return {
    object: group,
    update(_delta, elapsed) {
      pulses.forEach((p, i) => {
        const mat = p.material as THREE.MeshBasicMaterial;
        mat.opacity = reduced ? 0.9 : 0.55 + Math.abs(Math.sin(elapsed * 0.9 + i * 1.3)) * 0.45;
      });
      group.rotation.y = reduced ? -0.42 : -0.42 + Math.sin(elapsed * 0.18) * 0.08;
      group.rotation.x = 0.1;
    },
    dispose() {
      d.disposeAll();
    }
  };
}