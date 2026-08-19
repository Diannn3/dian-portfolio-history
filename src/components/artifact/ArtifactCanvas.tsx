import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createArtifact } from './ArtifactObject';
import { ArtifactFallback } from './ArtifactFallback';
import { subscribeTick } from '../../lib/motion/ticker';

interface Props {
  reduced: boolean;
  lowQuality: boolean;
  /** rendering stops entirely when false */
  active: boolean;
  /** 0–4, which annotation row the scroll stage is currently on */
  focus: number;
}

export function ArtifactCanvas({ reduced, lowQuality, active, focus }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const activeRef = useRef(active);
  const focusRef = useRef(focus);
  const [failed, setFailed] = useState(false);

  activeRef.current = active;
  focusRef.current = focus;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !lowQuality, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowQuality ? 1 : 1.7));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearAlpha(0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.1, 40);
    camera.position.set(0, 0.9, 4.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(2.4, 3.2, 2.4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.2);
    fill.position.set(-2, -1, -2);
    scene.add(fill);

    const artifact = createArtifact(reduced);
    scene.add(artifact.object);

    const unsub = subscribeTick((_time, deltaMs) => {
      if (!activeRef.current) return;
      artifact.update(deltaMs / 1000, pointer.current, focusRef.current);
      renderer.render(scene, camera);
    });

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = (e.clientX - r.left) / r.width * 2 - 1;
      pointer.current.y = (e.clientY - r.top) / r.height * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener('resize', onResize);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      scene.remove(artifact.object);
      artifact.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [reduced, lowQuality]);

  if (failed) return <ArtifactFallback />;

  return <div ref={host} className="h-full w-full" data-cursor="rotate" />;
}