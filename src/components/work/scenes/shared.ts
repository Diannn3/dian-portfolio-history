import * as THREE from 'three';

export interface StageNode {
  object: THREE.Object3D;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

export const INK = '#111111';
export const ACCENT = '#d94f2b';
export const GRAPHITE = '#555555';

/** Tracks every material/geometry a scene creates so disposal is exhaustive. */
export class Disposables {
  private items: {dispose: () => void;}[] = [];
  track<T extends {dispose: () => void;}>(item: T): T {
    this.items.push(item);
    return item;
  }
  disposeAll() {
    this.items.forEach((i) => i.dispose());
    this.items = [];
  }
}

export function line(
d: Disposables,
points: THREE.Vector3[],
color: string,
opacity: number,
width = 1)
: THREE.Line {
  const geo = d.track(new THREE.BufferGeometry().setFromPoints(points));
  const mat = d.track(
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: width })
  );
  return new THREE.Line(geo, mat);
}

export function segments(
d: Disposables,
points: THREE.Vector3[],
color: string,
opacity: number)
: THREE.LineSegments {
  const geo = d.track(new THREE.BufferGeometry().setFromPoints(points));
  const mat = d.track(new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  return new THREE.LineSegments(geo, mat);
}

export function marker(d: Disposables, color: string, size = 0.075, opacity = 1): THREE.Mesh {
  const geo = d.track(new THREE.PlaneGeometry(size, size));
  const mat = d.track(
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide })
  );
  return new THREE.Mesh(geo, mat);
}

/** A flat plan lattice, the shared vocabulary element across all four stages. */
export function lattice(d: Disposables, size: number, divisions: number): THREE.LineSegments {
  const pts: THREE.Vector3[] = [];
  const half = size / 2;
  for (let i = 0; i <= divisions; i++) {
    const c = -half + size * i / divisions;
    pts.push(new THREE.Vector3(-half, 0, c), new THREE.Vector3(half, 0, c));
    pts.push(new THREE.Vector3(c, 0, -half), new THREE.Vector3(c, 0, half));
  }
  return segments(d, pts, INK, 0.14);
}

export function catmull(points: THREE.Vector3[], divisions: number): THREE.Vector3[] {
  return new THREE.CatmullRomCurve3(points).getPoints(divisions);
}