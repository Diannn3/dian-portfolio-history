import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { SPLINE_SCENE_URL } from '../../data/site';
import { useQuality, useReducedMotion } from '../../hooks/useEnvironment';
import { ArtifactFallback } from './ArtifactFallback';

const ArtifactCanvas = lazy(() =>
import('./ArtifactCanvas').then((m) => ({ default: m.ArtifactCanvas }))
);
/** Mounted only when a published scene URL is supplied — no invented asset URLs. */
const SplineScene = lazy(() => import('./SplineScene').then((m) => ({ default: m.SplineScene })));

export function DigitalArtifact() {
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { supported, profile } = useQuality();

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const preload = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          preload.disconnect();
        }
      },
      { rootMargin: '200px' }
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

  const useSpline = Boolean(SPLINE_SCENE_URL);

  return (
    <section className="pt-28 md:pt-44" aria-labelledby="artifact-heading">
      <div className="atlas-grid">
        <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="artifact-heading" className="mono-label text-ink">
            OBJECT / 001 — COMPUTATIONAL ARTIFACT
          </h2>
          <span className="mono-label hidden md:inline">
            {useSpline ? 'AUTHORED / SPLINE' : 'PROCEDURAL / INSTANCED'}
          </span>
        </div>
      </div>

      <div className="atlas-grid mt-8 items-center md:mt-12">
        <div
          ref={shell}
          className="col-span-4 aspect-square md:col-span-5 xl:col-span-6 xl:col-start-1">
          
          {supported && visible ?
          <Suspense
            fallback={
            <div className="h-full w-full opacity-40">
                  <ArtifactFallback />
                </div>
            }>
            
              {useSpline ?
            <SplineScene url={SPLINE_SCENE_URL} reduced={reduced} /> :

            <ArtifactCanvas
              reduced={reduced}
              lowQuality={profile.tier === 'low'}
              active={inView} />

            }
            </Suspense> :

          <div className="h-full w-full opacity-70">
              <ArtifactFallback />
            </div>
          }
        </div>

        <div className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-8">
          <p className="font-heading text-display-3">
            “An experiment in translating mathematical structure into spatial interfaces.”
          </p>
          <div className="mt-8 space-y-3 border-t border-hairline pt-4">
            {[
            ['GEOMETRY', 'Three coordinate rings, instanced'],
            ['CORE', 'Parametric knot section'],
            ['INPUT', 'Pointer orientation, damped'],
            ['STATE', 'EXPERIMENT'],
            ['SOURCE', useSpline ? 'Spline scene, lazy embedded' : 'Spline slot empty — procedural stand-in']].
            map(([k, v]) =>
            <div key={k} className="flex items-baseline justify-between gap-4">
                <span className="mono-label">{k}</span>
                <span className="text-right text-[0.85rem] text-graphite">{v}</span>
              </div>
            )}
          </div>
          <p className="mt-6 text-[0.85rem] leading-relaxed text-graphite">
            An instrument, not an ornament: the rings are coordinate frames, the core is a section
            through a knotted curve. Rotate it with the pointer.
          </p>
        </div>
      </div>
    </section>);

}