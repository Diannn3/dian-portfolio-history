import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionFrame } from '../ui/SectionFrame';
import { ArtifactFallback } from './ArtifactFallback';
import { useCompact, useQuality, useReducedMotion } from '../../hooks/useEnvironment';

const ArtifactCanvas = lazy(() =>
  import('./ArtifactCanvas').then((module) => ({ default: module.ArtifactCanvas }))
);

const CHAPTERS = [
  {
    key: 'GEOMETRY',
    body:
      'Three instanced coordinate rings build the outer instrument. Each ring reuses one small plate geometry instead of duplicating dozens of meshes.',
  },
  {
    key: 'CORE',
    body:
      'A compact torus-knot section sits at the centre, giving the rigid coordinate frames a second, continuous geometric reference.',
  },
  {
    key: 'INPUT',
    body:
      'Pointer position changes the instrument orientation through damped rotation; the interaction changes the view, not the underlying geometry.',
  },
  {
    key: 'STATE',
    body:
      'This remains an experiment rather than a product surface. Reduced-motion and low-capability states keep the presentation legible without requiring continuous animation.',
  },
  {
    key: 'SOURCE',
    body:
      'The object is procedural Three.js: instanced rings, a torus-knot core and a thin reference ring. Spline is deliberately reserved for the Lab instead.',
  },
] as const;

/**
 * Sticky editorial staging wrapped around the existing lazy procedural artifact.
 * The geometry itself remains untouched; only the surrounding reading sequence
 * changes as the reader advances through the plate.
 */
export function DigitalArtifact() {
  const shell = useRef<HTMLDivElement>(null);
  const canvasShell = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const { supported, profile } = useQuality();
  const sticky = !compact && !reduced;

  useEffect(() => {
    const el = canvasShell.current;
    if (!el) return;
    const preload = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          preload.disconnect();
        }
      },
      { rootMargin: '240px' }
    );
    const activity = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.05 }
    );
    preload.observe(el);
    activity.observe(el);
    return () => {
      preload.disconnect();
      activity.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      if (!sticky || !shell.current) return;
      ScrollTrigger.create({
        trigger: shell.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const next = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
          setStep((previous) => (previous === next ? previous : next));
        },
      });
    },
    { dependencies: [sticky], scope: shell, revertOnUpdate: true }
  );

  return (
    <SectionFrame
      id="artifact"
      index="04"
      title="Digital Artifact"
      coordinate="PLATE 04 / PROCEDURAL"
      lede="The existing Three.js instrument, staged as a five-part reading rather than replaced by another 3D asset."
    >
      <div ref={shell} className={sticky ? 'relative h-[360vh]' : 'relative'}>
        <div className={sticky ? 'atlas-grid sticky top-24 items-start gap-y-8 pb-10' : 'atlas-grid items-start gap-y-8 pb-10'}>
          <div className="col-span-4 md:col-span-4 xl:col-span-6">
            <div ref={canvasShell} className="aspect-square w-full border border-hairline bg-surface/30">
              {supported && visible ? (
                <Suspense
                  fallback={
                    <div className="h-full w-full p-4 opacity-60">
                      <ArtifactFallback />
                    </div>
                  }
                >
                  <ArtifactCanvas
                    reduced={reduced}
                    lowQuality={profile.tier === 'low'}
                    active={inView}
                  />
                </Suspense>
              ) : (
                <div className="h-full w-full p-4 opacity-70">
                  <ArtifactFallback />
                </div>
              )}
            </div>
            <p className="mono-label mt-3">PROCEDURAL THREE.JS — ONE VIEWPORT-AWARE CONTEXT</p>
          </div>

          <ol className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-8">
            {CHAPTERS.map((chapter, index) => {
              const active = sticky ? index === step : true;
              return (
                <li
                  key={chapter.key}
                  className={`border-t border-hairline py-5 transition-opacity duration-500 ease-atlas ${
                    sticky && !active ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`mono-label w-7 shrink-0 ${sticky && active ? 'text-accent' : ''}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mono-label text-ink">{chapter.key}</h3>
                  </div>
                  <p className="mt-3 max-w-[52ch] text-read text-graphite md:pl-11">{chapter.body}</p>
                </li>
              );
            })}
            <li className="border-t border-hairline pt-4">
              <p className="mono-label">
                {sticky
                  ? `STEP ${String(step + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')}`
                  : 'STATIC PRESENTATION — REDUCED MOTION OR COMPACT VIEWPORT'}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </SectionFrame>
  );
}
