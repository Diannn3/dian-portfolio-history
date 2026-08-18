import * as THREE from 'three';
import { createCameraRig } from './CameraRig';
import { createLattice } from './CoordinateLattice';
import { createParticles } from './FieldParticles';
import { createManifold, type SceneNode } from './ParametricManifold';
import { createStreamlines } from './Streamlines';
import { createVectorField } from './VectorField';
import type { QualityProfile } from '../../lib/webgl/sceneState';

export interface HeroScene {
  render: (delta: number) => void;
  resize: () => void;
  dispose: () => void;
}

interface Options {
  profile: QualityProfile;
  reduced: boolean;
  compact: boolean;
}

/**
 * Assembles the hero: renderer, camera rig and the five coordinated systems that
 * all derive from the same field. Returns an imperative handle — the React layer
 * only mounts and unmounts it.
 */
export function createHeroScene(container: HTMLElement, { profile, reduced, compact }: Options): HeroScene {
  const renderer = new THREE.WebGLRenderer({
    antialias: profile.tier !== 'low',
    alpha: true,
    powerPreference: 'high-performance'
  });
  const dprMax = profile.dpr[1];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprMax));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearAlpha(0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#f4f2ed', 6.2, 13);

  const camera = new THREE.PerspectiveCamera(
    compact ? 46 : 40,
    container.clientWidth / container.clientHeight,
    0.1,
    40
  );
  const rig = createCameraRig(camera, reduced, compact);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(2.4, 4.2, 2.8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.18);
  fill.position.set(-3, 1.2, -2);
  scene.add(fill);

  const nodes: SceneNode[] = [
  createManifold(compact ? [48, 36] : profile.segments, reduced, profile.tier === 'high' ? 13 : 9),
  createStreamlines(compact ? Math.min(4, profile.streamlines) : profile.streamlines, reduced),
  createVectorField(compact ? Math.min(70, profile.vectors) : profile.vectors, reduced)];

  if (profile.lattice) nodes.push(createLattice(reduced));
  const particleCount = compact ? 0 : profile.particles;
  if (particleCount > 0) nodes.push(createParticles(particleCount, reduced));

  nodes.forEach((n) => scene.add(n.object));

  return {
    render(delta) {
      const d = Math.min(delta, 0.05);
      rig.update();
      for (let i = 0; i < nodes.length; i++) nodes[i].update(d);
      renderer.render(scene, camera);
    },
    resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprMax));
      renderer.setSize(w, h);
    },
    dispose() {
      nodes.forEach((n) => {
        scene.remove(n.object);
        n.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    }
  };
}