import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { subscribeTick } from '../../lib/motion/ticker';
import { createArtifact, type ArtifactHandle } from './ArtifactObject';
import { ArtifactFallback } from './ArtifactFallback';
import { artifactState } from '../../lib/atlas/artifactState';

interface Props {
  reduced: boolean;
}

/**
 * Viewport-aware renderer for the artifact. One context, capped DPR, paused the
 * moment it scrolls out of view, and fully disposed on unmount.
 */
export function ArtifactCanvas({ reduced }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const reducedRef = useRef(reduced);
  const visible = useRef(false);
  const dirty = useRef(true);

  useEffect(() => {
    reducedRef.current = reduced;
    dirty.current = true;
  }, [reduced]);

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(el.clientWidth || 1, el.clientHeight || 1);
    renderer.setClearAlpha(0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(1.8, 3.2, 2.4);
    scene.add(key);

    const camera = new THREE.PerspectiveCamera(
      36,
      (el.clientWidth || 1) / (el.clientHeight || 1),
      0.1,
      30
    );
    camera.position.set(0, 0.9, 3.4);
    camera.lookAt(0, 0, 0);

    let artifact: ArtifactHandle | null = null;
    try {
      artifact = createArtifact(reducedRef.current);
      scene.add(artifact.object);
    } catch {
      setFailed(true);
      renderer.dispose();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0]?.isIntersecting ?? false;
        dirty.current = true;
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(w, h);
      dirty.current = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let elapsed = 0;
    const unsub = subscribeTick((_time, deltaMs) => {
      if (!artifact || !visible.current) return;
      if (reducedRef.current && !dirty.current) return;
      const delta = Math.min(deltaMs / 1000, 0.05);
      elapsed += delta;
      /* the object drifts toward the step's camera distance rather than cutting */
      const targetZ = 3.4 - Math.min(artifactState.step, 4) * 0.16;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);
      artifact.update(delta, elapsed, artifactState.step, artifactState.progress);
      renderer.render(scene, camera);
      dirty.current = false;
    });

    return () => {
      unsub();
      io.disconnect();
      ro.disconnect();
      if (artifact) {
        scene.remove(artifact.object);
        artifact.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  if (failed)
  return (
    <div className="h-full w-full p-4">
        <ArtifactFallback />
      </div>);


  return <div ref={host} className="h-full w-full" aria-hidden="true" />;
}