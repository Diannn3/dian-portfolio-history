import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useEnvironment';

const VERBS = [
{ id: 'vector-draw', label: 'VECTOR DRAW', note: 'A rule draws from its origin. Used for section hairlines.' },
{ id: 'field-settle', label: 'FIELD SETTLE', note: 'Marks arrive slightly out of place, then settle onto the grid.' },
{ id: 'index-shift', label: 'INDEX SHIFT', note: 'Notation swaps register without morphing. Used by the header.' },
{ id: 'clip-reveal', label: 'CLIP REVEAL', note: 'A figure is uncovered by its own frame, never faded in.' },
{ id: 'depth-focus', label: 'DEPTH FOCUS', note: 'One element sharpens while its neighbours recede in weight.' },
{ id: 'route', label: 'ROUTE', note: 'A sheet wipes across the canvas on navigation.' },
{ id: 'decompose', label: 'DECOMPOSE', note: 'A solid separates into the parts that generated it.' }];


/** L04 — the site's seven motion verbs, demonstrated in isolation. */
export function MotionStudies() {
  const shell = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP({ scope: shell });

  const play = contextSafe((id: string) => {
    if (reduced) return;
    const scope = shell.current?.querySelector<HTMLElement>(`[data-study="${id}"]`);
    if (!scope) return;
    const marks = scope.querySelectorAll<HTMLElement>('[data-mark]');
    const rule = scope.querySelector<HTMLElement>('[data-rule]');

    switch (id) {
      case 'vector-draw':
        gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut', transformOrigin: 'left center' });
        break;
      case 'field-settle':
        gsap.fromTo(marks, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05 });
        break;
      case 'index-shift':
        gsap.fromTo(marks, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.04 });
        break;
      case 'clip-reveal':
        gsap.fromTo(
          marks,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', stagger: 0.06 }
        );
        break;
      case 'depth-focus':
        gsap.fromTo(marks, { opacity: 0.25 }, { opacity: (i: number) => i === 1 ? 1 : 0.25, duration: 0.7, ease: 'power3.out' });
        break;
      case 'route':
        gsap.fromTo(rule, { scaleY: 1, transformOrigin: 'top center' }, { scaleY: 0, transformOrigin: 'bottom center', duration: 0.7, ease: 'expo.inOut' });
        break;
      case 'decompose':
        gsap.fromTo(
          marks,
          { x: 0, y: 0, rotate: 0 },
          {
            x: (i: number) => (i - 2) * 14,
            y: (i: number) => i % 2 === 0 ? -8 : 8,
            rotate: (i: number) => (i - 2) * 4,
            duration: 0.8,
            ease: 'expo.out',
            yoyo: true,
            repeat: 1
          }
        );
        break;
      default:
        break;
    }
  });

  return (
    <div ref={shell}>
      <ul className="grid grid-cols-1 gap-0 border-t border-hairline sm:grid-cols-2">
        {VERBS.map((v) =>
        <li key={v.id} className="border-b border-hairline sm:odd:border-r">
            <div className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="mono-label text-ink">{v.label}</span>
                <button
                type="button"
                onClick={() => play(v.id)}
                disabled={reduced}
                className="mono-label border border-hairline px-2 py-1 text-ink transition-colors duration-300 ease-atlas hover:border-ink disabled:opacity-40"
                data-cursor="link">

                  {reduced ? 'STATIC' : 'PLAY'}
                </button>
              </div>

              <div
              data-study={v.id}
              className="relative flex h-16 items-center gap-2 overflow-hidden border border-hairline bg-surface/40 px-3"
              aria-hidden="true">

                {v.id === 'vector-draw' || v.id === 'route' ?
              <span
                data-rule
                className={
                v.id === 'route' ?
                'absolute inset-0 origin-top bg-canvas' :
                'block h-[1px] w-full origin-left bg-accent'
                } /> :


              Array.from({ length: 5 }).map((_, i) =>
              <span
                key={i}
                data-mark
                className={`block h-4 w-4 ${i === 1 ? 'bg-accent' : 'bg-ink'}`} />

              )
              }
              </div>

              <p className="text-read-sm text-graphite">{v.note}</p>
            </div>
          </li>
        )}
      </ul>
      {reduced &&
      <p className="mono-label mt-4">
          REDUCED MOTION ACTIVE — DEMONSTRATIONS HELD AT THEIR END STATE
        </p>
      }
    </div>);

}