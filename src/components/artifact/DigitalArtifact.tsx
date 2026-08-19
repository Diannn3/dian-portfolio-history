import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionFrame } from '../ui/SectionFrame';
import { ArtifactCanvas } from './ArtifactCanvas';
import { ArtifactFallback } from './ArtifactFallback';
import { artifactState } from '../../lib/atlas/artifactState';
import { useCompact, useQuality, useReducedMotion } from '../../hooks/useEnvironment';

const CHAPTERS = [
{
  key: 'GEOMETRY',
  body:
  'The form is swept along a trajectory of the same vector field the hero renders. Nothing here was modelled by hand.'
},
{
  key: 'CORE',
  body:
  'A lattice cage sits underneath it, displaced by the manifold height function so the object and its ground share one equation.'
},
{
  key: 'INPUT',
  body:
  'Sample points mark where the field was evaluated during integration — the visible object is a record of a computation.'
},
{
  key: 'STATE',
  body:
  'As the sequence advances the object aligns toward plan orientation, the same field-to-diagram move the hero makes.'
},
{
  key: 'SOURCE',
  body:
  'Finally the solid resolves into its own wireframe: the construction, not the render, is the point.'
}];


/**
 * Sticky presentation of one procedural object. On compact screens and under
 * reduced motion the long scroll collapses into a short static plate — the same
 * five chapters, no pinning.
 */
export function DigitalArtifact() {
  const shell = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const { supported } = useQuality();
  const sticky = !compact && !reduced;

  useGSAP(
    () => {
      if (!sticky || !shell.current) return;
      ScrollTrigger.create({
        trigger: shell.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const raw = self.progress * CHAPTERS.length;
          const next = Math.min(CHAPTERS.length - 1, Math.floor(raw));
          /* per-frame value stays outside React; only the chapter index re-renders */
          artifactState.step = next;
          artifactState.progress = raw - next;
          setStep((prev) => prev === next ? prev : next);
        }
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
      lede="One object, generated from the site's own equations and taken apart in five steps.">

      <div
        ref={shell}
        className={sticky ? 'relative h-[420vh]' : 'relative'}>

        <div
          className={
          sticky ?
          'atlas-grid sticky top-24 items-start gap-y-8 pb-10' :
          'atlas-grid items-start gap-y-8 pb-10'
          }>

          <div className="col-span-4 md:col-span-4 xl:col-span-6">
            <div className="aspect-square w-full border border-hairline bg-surface/30">
              {supported && !reduced ?
              <ArtifactCanvas reduced={reduced} /> :

              <div className="h-full w-full p-4">
                  <ArtifactFallback />
                </div>
              }
            </div>
            <p className="mono-label mt-3">
              PROCEDURAL THREE.JS — DERIVED FROM THE SITE FIELD EQUATIONS
            </p>
          </div>

          <ol className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-8">
            {CHAPTERS.map((c, i) => {
              const on = sticky ? i === step : true;
              return (
                <li
                  key={c.key}
                  className={`border-t border-hairline py-5 transition-opacity duration-500 ease-atlas ${
                  sticky && !on ? 'opacity-35' : 'opacity-100'}`
                  }>

                  <div className="flex items-baseline gap-4">
                    <span
                      className={`mono-label w-7 shrink-0 ${
                      sticky && on ? 'text-accent' : ''}`
                      }>

                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mono-label text-ink">{c.key}</h3>
                  </div>
                  <p className="mt-3 max-w-[52ch] pl-0 text-read text-graphite md:pl-11">{c.body}</p>
                </li>);

            })}
            <li className="border-t border-hairline pt-4">
              <p className="mono-label" aria-live="polite">
                {sticky ?
                `STEP ${String(step + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')}` :
                'STATIC PRESENTATION — REDUCED MOTION OR COMPACT VIEWPORT'}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </SectionFrame>);

}