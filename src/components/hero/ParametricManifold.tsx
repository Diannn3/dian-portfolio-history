import * as THREE from 'three';
import { manifoldFragment, manifoldVertex } from './shaders/manifold';
import { sceneState } from '../../lib/webgl/sceneState';

const INK = new THREE.Color('#111111');
const CANVAS = new THREE.Color('#f4f2ed');
const ACCENT = new THREE.Color('#d94f2b');

export interface SceneNode {
  object: THREE.Object3D;
  update: (delta: number) => void;
  dispose: () => void;
}

/**
 * The hero's focal object: a folded saddle manifold generated from the site's
 * height function and deformed continuously on the GPU. Not a primitive.
 */
export function createManifold(
segments: [number, number],
reduced: boolean,
contourDensity: number)
: SceneNode {
  const geometry = new THREE.PlaneGeometry(5.6, 4.2, segments[0], segments[1]);

  const uniforms = {
    uTime: { value: 0 },
    uFlatten: { value: 0 },
    uDecompose: { value: 0 },
    uProbe: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uInk: { value: INK },
    uCanvas: { value: CANVAS },
    uAccent: { value: ACCENT },
    uOpacity: { value: 1 },
    uContour: { value: 0 },
    uDensity: { value: contourDensity }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: manifoldVertex,
    fragmentShader: manifoldFragment,
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(-Math.PI / 2 + 0.62, 0, -0.18);

  return {
    object: mesh,
    update(delta) {
      const p = sceneState.progress;
      uniforms.uTime.value += reduced ? 0 : delta;
      uniforms.uPointer.value.set(sceneState.pointerX, -sceneState.pointerY);
      uniforms.uProbe.value +=
      ((sceneState.probing && !reduced ? 1 : 0) - uniforms.uProbe.value) * 0.06;
      // scroll choreography: 0 volumetric → 0.5 decomposing → 1 diagrammatic
      uniforms.uFlatten.value = THREE.MathUtils.smoothstep(p, 0.42, 1);
      uniforms.uDecompose.value = Math.sin(THREE.MathUtils.clamp(p, 0, 1) * Math.PI) * 0.85;
      uniforms.uContour.value = THREE.MathUtils.smoothstep(p, 0.28, 0.86);
      uniforms.uOpacity.value = 1 - THREE.MathUtils.smoothstep(p, 0.86, 1) * 0.42;
      mesh.rotation.z = -0.18 + sceneState.pointerX * 0.05;
      mesh.rotation.x = -Math.PI / 2 + 0.62 - p * 0.52 + sceneState.pointerY * 0.05;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    }
  };
}