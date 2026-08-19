import * as THREE from 'three';
import { ACCENT, Disposables, INK, line, marker, segments } from './shared';
import type { StageNode } from './shared';

/**
 * IMS — three stacked floor plates with a waypoint graph and one cross-floor
 * route segment. Schematic on purpose: the underlying floor geometry is
 * unverified, and the stage should not imply survey accuracy.
 */
export function createImsScene(reduced: boolean): StageNode {
  const d = new Disposables();
  const group = new THREE.Group();

  const plate = (y: number, opacity: number) => {
    const pts = [
    new THREE.Vector3(-1.2, y, -0.75),
    new THREE.Vector3(1.2, y, -0.75),
    new THREE.Vector3(1.2, y, 0.75),
    new THREE.Vector3(-1.2, y, 0.75),
    new THREE.Vector3(-1.2, y, -0.75)];

    return line(d, pts, INK, opacity);
  };

  const floors = [-0.52, 0, 0.52];
  floors.forEach((y, i) => {
    group.add(plate(y, i === 1 ? 0.7 : 0.3));
    /* rooms as short interior partitions */
    const pts: THREE.Vector3[] = [];
    for (let r = 0; r < 5; r++) {
      const x = -0.9 + r * 0.45;
      pts.push(new THREE.Vector3(x, y, -0.75), new THREE.Vector3(x, y, -0.3));
      pts.push(new THREE.Vector3(x, y, 0.32), new THREE.Vector3(x, y, 0.75));
    }
    group.add(segments(d, pts, INK, i === 1 ? 0.34 : 0.16));
  });

  /* route: enters on the middle plate, climbs one level */
  const route = [
  new THREE.Vector3(-1.0, 0, 0.6),
  new THREE.Vector3(-0.35, 0, 0.1),
  new THREE.Vector3(0.2, 0, 0.02),
  new THREE.Vector3(0.2, 0.52, 0.02),
  new THREE.Vector3(0.78, 0.52, -0.42)];

  group.add(line(d, route, ACCENT, 0.9));

  const waypoint = marker(d, ACCENT, 0.075);
  waypoint.position.copy(route[route.length - 1]);
  group.add(waypoint);

  const start = marker(d, INK, 0.06);
  start.position.copy(route[0]);
  group.add(start);

  let t = 0;

  return {
    object: group,
    update(delta) {
      if (!reduced) t += delta;
      group.rotation.y = reduced ? -0.5 : -0.5 + Math.sin(t * 0.22) * 0.12;
      group.rotation.x = 0.16;
    },
    dispose() {
      d.disposeAll();
    }
  };
}