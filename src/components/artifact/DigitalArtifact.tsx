import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { SPLINE_SCENE_URL } from '../../data/site';
import { gsap, registerGsap, ScrollTrigger } from '../../lib/motion/gsap';
import { useInViewport, useNearViewport, useQuality } from '../../hooks/useEnvironment';
import { useMotion } from '../../lib/motion/MotionProvider';
import { useSectionRegistration } from '../../hooks/useReveals';
import { ArtifactFallback } from './ArtifactFallback';

const ArtifactCanvas = lazy(() =>
import('./ArtifactCanvas').then((m) => ({ default: m.ArtifactCanvas }))
);
/** Mounted only when a published scene URL is supplied — no invented asset URLs. */
const SplineScene = lazy(() => import('./SplineScene').then((m) => ({ default: m.SplineScene })));

const ROWS = [
{ key: 'GEOMETRY', value: 'Three coordinate rings, instanced' },
{ key: 'CORE', value: 'Parametric knot section' },
{ key: 'INPUT', value: 'Pointer orientation, damped' },
{ key: 'STATE', value: 'EXPERIMENT' },
{ key: 'SOURCE', value: '' }];


/**
 * The object was already strong; what it lacked was staging. It now holds a
 * sticky 100svh stage: the artifact on the left, the annotation panel on the
 * right, and the five properties highlight in sequence as the reader moves
 * through the section. The geometry itself is untouched.
 */
export function DigitalArtifact() {
  const section = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const { reduced, profile } = useMotion();
  const { supported, profile: quality } = useQuality();
  const near = useNearViewport(shell, '200px');
  const inView = useInViewport(stage, 0.05);

  useSectionRegistration(section, {
    id: 'artifact',
    index: '04',
    label: 'OBJECT / 001'
  });

  const useSpline = Boolean(SPLINE_SCENE_URL);
  const rows = ROWS.map((row) =>
  row.key === 'SOURCE' ?
  { ...row, value: useSpline ? 'Spline scene, lazy embedded' : 'Procedural / Three.js' } :
  row
  );

  /* scroll staging: five discrete steps, not a continuous scrub */
  useEffect(() => {
    const el = section.current;
    if (!el || reduced || !profile.scrub) {
      setStep(0);
      return;
    }
    registerGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const next = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
          setStep((prev) => prev === next ? prev : next);
        }
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, profile.scrub]);

  return (
    <section
      ref={section}
      id="artifact"
      className="anchor-offset relative mt-28 md:mt-44 md:h-[240vh]"
      aria-labelledby="artifact-heading">
      
      <div ref={stage} className="md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center">
        <div className="atlas-grid">
          <div className="col-span-4 flex items-baseline justify-between gap-6 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
            <h2 id="artifact-heading" className="mono-label flex items-baseline gap-3 text-ink">
              <span className="text-graphite">04</span>
              <span>OBJECT / 001 — COMPUTATIONAL ARTIFACT</span>
            </h2>
            <span className="mono-label hidden shrink-0 md:inline">
              {useSpline ? 'AUTHORED / SPLINE' : 'PROCEDURAL / INSTANCED'}
            </span>
          </div>
        </div>

        <div className="atlas-grid mt-8 items-center md:mt-12">
          <div
            ref={shell}
            className="col-span-4 aspect-square md:col-span-5 xl:col-span-6 xl:col-start-1">
            
            {supported && near ?
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
                lowQuality={quality.tier === 'low'}
                active={inView}
                focus={step} />

              }
              </Suspense> :

            <div className="h-full w-full opacity-70">
                <ArtifactFallback />
              </div>
            }
          </div>

          <div className="col-span-4 mt-8 md:col-span-3 md:mt-0 xl:col-span-4 xl:col-start-8">
            <p className="font-heading text-display-3">
              “An experiment in translating mathematical structure into spatial interfaces.”
            </p>

            <dl className="mt-8 border-t border-hairline">
              {rows.map((row, i) => {
                const on = i === step;
                return (
                  <div
                    key={row.key}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 transition-opacity duration-500 ease-atlas"
                    style={{ opacity: on ? 1 : 0.45 }}>
                    
                    <dt className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="block h-[1px] w-4 origin-left bg-accent transition-transform duration-500 ease-atlas"
                        style={{ transform: `scaleX(${on ? 1 : 0})` }} />
                      
                      <span className="mono-label" style={{ color: on ? 'var(--ink)' : undefined }}>
                        {row.key}
                      </span>
                    </dt>
                    <dd className="text-right text-note text-graphite">{row.value}</dd>
                  </div>);

              })}
            </dl>

            <p className="mt-6 text-note text-graphite">
              An instrument, not an ornament: the rings are coordinate frames, the core is a section
              through a knotted curve. Rotate it with the pointer.
            </p>
          </div>
        </div>
      </div>
    </section>);

}