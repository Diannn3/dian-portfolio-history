import * as THREE from 'three';
import { sceneState } from '../../lib/webgl/sceneState';

const target = new THREE.Vector3();

/**
 * A composed camera. Pointer nudges it; scroll walks it from a low three-quarter
 * view to a near-plan projection so the field ends up reading as a diagram.
 * No orbit controls — the frame is art-directed.
 */
export function createCameraRig(camera: THREE.PerspectiveCamera, reduced: boolean, compact: boolean) {
  const current = new THREE.Vector3(0, 1.4, compact ? 6.8 : 5.5);
  camera.position.copy(current);

  return {
    update() {
      const p = sceneState.progress;
      const px = reduced ? 0 : sceneState.pointerX;
      const py = reduced ? 0 : sceneState.pointerY;

      const y = THREE.MathUtils.lerp(compact ? 1.15 : 1.4, compact ? 3.4 : 4.1, p) + py * 0.28;
      const z = THREE.MathUtils.lerp(compact ? 6.8 : 5.5, compact ? 5.0 : 3.7, p) + px * 0.16;
      const x = px * (compact ? 0.1 : 0.5) + THREE.MathUtils.lerp(0, -0.5, p);

      current.lerp(target.set(x, y, z), reduced ? 1 : 0.055);
      camera.position.copy(current);
      camera.lookAt(0, THREE.MathUtils.lerp(-0.1, -0.55, p), 0);
    }
  };
}