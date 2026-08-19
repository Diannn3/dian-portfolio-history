import * as THREE from 'three';

const dummy = new THREE.Object3D();
const COUNT = 68;

export interface ArtifactHandle {
  object: THREE.Object3D;
  update: (delta: number, pointer: {x: number;y: number;}, focus: number) => void;
  dispose: () => void;
}

/**
 * OBJECT / 001 — an armillary instrument: three coordinate rings built from
 * instanced plates around a section of a knotted curve. One draw call per ring.
 *
 * FROZEN GEOMETRY. The only addition is `focus`, a 0–4 index from the scroll
 * staging that biases orientation toward whichever part is being annotated. No
 * geometry was added to make it busier.
 */
export function createArtifact(reduced: boolean): ArtifactHandle {
  const group = new THREE.Group();
  group.rotation.x = 0.22;

  const ringSpec: {radius: number;tilt: number;size: [number, number, number];color: string;}[] = [
  { radius: 1.0, tilt: 0, size: [0.012, 0.09, 0.012], color: '#111111' },
  { radius: 1.28, tilt: Math.PI / 2.4, size: [0.01, 0.06, 0.01], color: '#555555' },
  { radius: 1.5, tilt: -Math.PI / 3.1, size: [0.009, 0.045, 0.009], color: '#d94f2b' }];


  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  ringSpec.forEach(({ radius, tilt, size, color }) => {
    const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 });
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    mesh.frustumCulled = false;
    for (let i = 0; i < COUNT; i++) {
      const a = i / COUNT * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, 1 + Math.sin(a * 3) * 0.35, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.x = tilt;
    group.add(mesh);
    disposables.push(geo, mat);
  });

  const coreGeo = new THREE.TorusKnotGeometry(0.34, 0.026, 128, 8, 2, 3);
  const coreMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.75, metalness: 0.05 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);
  disposables.push(coreGeo, coreMat);

  const baseGeo = new THREE.RingGeometry(1.72, 1.735, 96);
  const baseMat = new THREE.MeshBasicMaterial({
    color: '#111111',
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.rotation.x = -Math.PI / 2;
  base.position.y = -0.02;
  group.add(base);
  disposables.push(baseGeo, baseMat);

  let time = 0;

  return {
    object: group,
    update(delta, pointer, focus) {
      const d = reduced ? 0 : Math.min(delta, 0.05);
      time += d;
      group.rotation.y += d * 0.16;
      const bias = focus * 0.06;
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        0.22 + pointer.y * 0.22 + bias,
        reduced ? 1 : 0.06
      );
      group.rotation.z = THREE.MathUtils.lerp(
        group.rotation.z,
        pointer.x * 0.2 - bias * 0.4,
        reduced ? 1 : 0.06
      );
      core.rotation.y -= d * 0.4;
      core.rotation.x = Math.sin(time * 0.4) * 0.22;
    },
    dispose() {
      disposables.forEach((item) => item.dispose());
    }
  };
}