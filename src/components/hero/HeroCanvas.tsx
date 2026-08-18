import React, { useEffect, useRef, useState } from 'react';
import { createHeroScene, type HeroScene } from './Scene';
import { HeroFallback } from './HeroFallback';
import { subscribeTick } from '../../lib/motion/ticker';
import type { QualityProfile } from '../../lib/webgl/sceneState';

interface Props {
  profile: QualityProfile;
  reduced: boolean;
  compact: boolean;
  /** rendering stops entirely once the hero leaves the viewport */
  active: boolean;
}

export function HeroCanvas({ profile, reduced, compact, active }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const activeRef = useRef(active);
  const [failed, setFailed] = useState(false);

  activeRef.current = active;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let instance: HeroScene | null = null;
    try {
      instance = createHeroScene(el, { profile, reduced, compact });
    } catch {
      setFailed(true);
      return;
    }
    scene.current = instance;

    const unsub = subscribeTick((_time, deltaMs) => {
      if (!activeRef.current || !instance) return;
      instance.render(deltaMs / 1000);
    });

    const onResize = () => instance?.resize();
    window.addEventListener('resize', onResize);

    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
      instance?.dispose();
      scene.current = null;
    };
  }, [profile, reduced, compact]);

  if (failed) return <HeroFallback />;

  return <div ref={host} className="h-full w-full" style={{ pointerEvents: 'none' }} />;
}