import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { subscribeTick } from '../../lib/motion/ticker';
import { createStageScene, type StageNode } from './scenes';
import { ProjectPreview } from './ProjectPreview';
import type { PreviewKey } from '../../types/project';

interface Props {
  variant: PreviewKey;
  reduced: boolean;
}

interface Runtime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  node: StageNode | null;
  elapsed: number;
}

/**
 * The shared spatial stage for SELECTED WORK. Exactly one WebGL context for the
 * whole ledger: the geometry inside it is swapped as rows become active, the
 * renderer sleeps whenever the stage is out of view, and under reduced motion it
 * draws single frames instead of animating.
 */
export function ProjectStage({ variant, reduced }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<Runtime | null>(null);
  const visible = useRef(false);
  const dirty = useRef(true);
  const reducedRef = useRef(reduced);
  const [failed, setFailed] = useState(false);

  reducedRef.current = reduced;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth || 1, el.clientHeight || 1);
    renderer.setClearAlpha(0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      (el.clientWidth || 1) / (el.clientHeight || 1),
      0.1,
      24
    );
    camera.position.set(0.15, 1.45, 2.95);
    camera.lookAt(0, 0, 0);

    runtime.current = { renderer, scene, camera, node: null, elapsed: 0 };

    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0]?.isIntersecting ?? false;
        dirty.current = true;
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const resize = () => {
      const rt = runtime.current;
      if (!rt) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      rt.camera.aspect = w / h;
      rt.camera.updateProjectionMatrix();
      rt.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      rt.renderer.setSize(w, h);
      dirty.current = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const unsub = subscribeTick((_time, deltaMs) => {
      const rt = runtime.current;
      if (!rt || !rt.node || !visible.current) return;
      if (reducedRef.current && !dirty.current) return;
      const delta = Math.min(deltaMs / 1000, 0.05);
      rt.elapsed += delta;
      rt.node.update(delta, rt.elapsed);
      rt.renderer.render(rt.scene, rt.camera);
      dirty.current = false;
    });

    return () => {
      unsub();
      io.disconnect();
      ro.disconnect();
      const rt = runtime.current;
      if (rt) {
        if (rt.node) {
          rt.scene.remove(rt.node.object);
          rt.node.dispose();
        }
        rt.renderer.dispose();
        if (rt.renderer.domElement.parentNode === el) el.removeChild(rt.renderer.domElement);
      }
      runtime.current = null;
    };
  }, []);

  /* swap the geometry inside the existing context — never a new canvas */
  useEffect(() => {
    const rt = runtime.current;
    if (!rt) return;
    if (rt.node) {
      rt.scene.remove(rt.node.object);
      rt.node.dispose();
    }
    rt.node = createStageScene(variant, reduced);
    rt.scene.add(rt.node.object);
    dirty.current = true;
  }, [variant, reduced, failed]);

  if (failed)
  return (
    <div className="h-full w-full p-2">
        <ProjectPreview preview={variant} />
      </div>);


  return <div ref={host} data-project-stage className="h-full w-full" aria-hidden="true" />;
}