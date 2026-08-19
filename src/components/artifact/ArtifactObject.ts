import * as THREE from 'three';
import { fieldAt } from '../../lib/math/field';
import { manifoldHeight } from '../../lib/math/fieldCore';

export interface ArtifactHandle {
  object: THREE.Object3D;
  update: (delta: number, elapsed: number, step: number, progress: number) => void;
  dispose: () => void;
}

/**
 * The digital artifact is generated, not modelled: a tube swept along a
 * trajectory of the site's own vector field, wrapped in a lattice cage whose
 * vertices are displaced by the manifold height function. Every visible element
 * is derived from the same two equations the hero uses.
 */
export function createArtifact(reduced: boolean): ArtifactHandle {
  const group = new THREE.Group();

  /* 01 GEOMETRY — the swept core */
  const p = new THREE.Vector3(0.6, 0.2, 0.4);
  const v = new THREE.Vector3();
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 220; i++) {
    points.push(p.clone().multiplyScalar(0.34));
    fieldAt(p.x, p.y, p.z, 0, v);
    p.addScaledVector(v, 0.045);
    if (p.length() > 5) p.multiplyScalar(0.42);
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 260, 0.028, 10, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.62,
    metalness: 0.05,
    transparent: true,
    opacity: 0.92
  });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tube);

  const wireGeo = new THREE.WireframeGeometry(tubeGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: '#d94f2b',
    transparent: true,
    opacity: 0
  });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wire);

  /* 02 CORE — lattice cage displaced by the height function */
  const cagePts: THREE.Vector3[] = [];
  const n = 9;
  const size = 1.9;
  for (let i = 0; i <= n; i++) {
    const c = -size / 2 + size * i / n;
    for (let s = 0; s < 12; s++) {
      const a = -size / 2 + size * s / 12;
      const b = -size / 2 + size * (s + 1) / 12;
      const h = (x: number, z: number) => manifoldHeight(x * 1.4, z * 1.4, 0) * 0.22;
      cagePts.push(new THREE.Vector3(a, h(a, c), c), new THREE.Vector3(b, h(b, c), c));
      cagePts.push(new THREE.Vector3(c, h(c, a), a), new THREE.Vector3(c, h(c, b), b));
    }
  }
  const cageGeo = new THREE.BufferGeometry().setFromPoints(cagePts);
  const cageMat = new THREE.LineBasicMaterial({ color: '#111111', transparent: true, opacity: 0.18 });
  const cage = new THREE.LineSegments(cageGeo, cageMat);
  cage.position.y = -0.62;
  group.add(cage);

  /* 03 INPUT — sample markers on the curve */
  const markerGeo = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 26 }, (_, i) => curve.getPoint(i / 25))
  );
  const markerMat = new THREE.PointsMaterial({
    color: '#d94f2b',
    size: 0.05,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0
  });
  const markers = new THREE.Points(markerGeo, markerMat);
  group.add(markers);

  return {
    object: group,
    update(delta, elapsed, step, progress) {
      const spin = reduced ? 0 : delta * 0.12;
      group.rotation.y += spin;

      /* 04 STATE — the object aligns to plan as the sequence advances */
      const align = THREE.MathUtils.clamp(step / 4, 0, 1);
      group.rotation.x += (align * -0.55 - group.rotation.x) * 0.06;
      const scale = 1 + align * 0.12;
      group.scale.setScalar(scale);

      cageMat.opacity = step >= 1 ? 0.28 : 0.12;
      markerMat.opacity = step >= 2 ? 0.85 : 0;

      /* 05 SOURCE — the solid resolves into its own wireframe */
      const source = step >= 4 ? THREE.MathUtils.clamp(progress, 0, 1) : 0;
      tubeMat.opacity = 0.92 - source * 0.72;
      wireMat.opacity = source * 0.7;

      if (!reduced && step === 2) {
        markerMat.size = 0.045 + Math.abs(Math.sin(elapsed * 1.6)) * 0.02;
      }
    },
    dispose() {
      tubeGeo.dispose();
      tubeMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
    }
  };
}