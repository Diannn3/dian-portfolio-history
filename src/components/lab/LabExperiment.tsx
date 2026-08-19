import React, { useEffect, useRef, useState } from 'react';
import { fieldComponents } from '../../lib/math/fieldCore';
import { subscribeTick } from '../../lib/motion/ticker';
import { SPLINE_SCENE_URL } from '../../data/site';
import { useMotion } from '../../lib/motion/MotionProvider';

export type ExperimentKind = 'field' | 'hands' | 'spline' | 'motion';

/* ------------------------------------------------------------------ L01 */

/**
 * The hero's field, made directly touchable at a fraction of the cost. This is
 * the same F(x,y,z,t) from lib/math/fieldCore — no second WebGL context, because
 * the hero already owns one and the work stage owns the other. Glyph orientation
 * is written straight into SVG transforms on the shared ticker.
 */
function FieldPlayground() {
  const host = useRef<HTMLDivElement>(null);
  const glyphs = useRef<(SVGLineElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, on: false });
  const { reduced } = useMotion();

  const cols = 16;
  const rowsN = 9;
  const cells = Array.from({ length: cols * rowsN }, (_, i) => ({
    i,
    cx: i % cols / (cols - 1),
    cy: Math.floor(i / cols) / (rowsN - 1)
  }));

  useEffect(() => {
    const v = { x: 0, y: 0, z: 0 };
    let t = 0;
    return subscribeTick((_time, deltaMs) => {
      if (!reduced) t += deltaMs / 1000;
      for (const cell of cells) {
        const el = glyphs.current[cell.i];
        if (!el) continue;
        const gx = (cell.cx - 0.5) * 6;
        const gy = (0.5 - cell.cy) * 4;
        fieldComponents(gx, gy, 0.4, t, v);
        let ax = v.x;
        let ay = v.y;
        if (pointer.current.on) {
          const dx = pointer.current.x * 6 - gx * 1;
          const dy = pointer.current.y * 4 - gy * 1;
          const infl = Math.exp(-(dx * dx + dy * dy) * 0.16);
          ax += dx * infl * 1.6;
          ay += dy * infl * 1.6;
        }
        const angle = Math.atan2(-ay, ax) * 180 / Math.PI;
        const mag = Math.min(1.6, Math.hypot(ax, ay)) / 1.6;
        el.setAttribute(
          'transform',
          `rotate(${angle.toFixed(1)}) scale(${(0.45 + mag * 0.9).toFixed(2)})`
        );
        el.setAttribute('stroke-opacity', (0.22 + mag * 0.7).toFixed(2));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      ref={host}
      className="border border-hairline bg-surface"
      data-cursor="explore"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current.x = (e.clientX - r.left) / r.width - 0.5;
        pointer.current.y = 0.5 - (e.clientY - r.top) / r.height;
        pointer.current.on = true;
      }}
      onPointerLeave={() => {
        pointer.current.on = false;
      }}>
      
      <svg viewBox="0 0 640 360" className="block h-full w-full" aria-hidden="true">
        <g stroke="var(--hairline)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) =>
          <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="360" />
          )}
        </g>
        {cells.map((cell) =>
        <g key={cell.i} transform={`translate(${20 + cell.cx * 600} ${24 + cell.cy * 312})`}>
            <line
            ref={(el) => {glyphs.current[cell.i] = el;}}
            x1="-11"
            y1="0"
            x2="11"
            y2="0"
            stroke={cell.i % 7 === 0 ? 'var(--accent)' : 'var(--ink)'}
            strokeWidth="1.4"
            strokeOpacity="0.4" />
          
          </g>
        )}
      </svg>
      <p className="border-t border-hairline px-3 py-2 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
        MOVE THE POINTER — THE FIELD IS PERTURBED LOCALLY, NOT REPLACED
      </p>
    </div>);

}

/* ------------------------------------------------------------------ L02 */

function HandsAbstraction() {
  const [pinch, setPinch] = useState(false);
  return (
    <div className="border border-hairline bg-surface" data-cursor="drag">
      <svg viewBox="0 0 640 360" className="block h-full w-full" role="img" aria-label="Abstraction of pinch-and-drag hand tracking moving a window in space">
        <g stroke="var(--hairline)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) =>
          <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="360" />
          )}
        </g>
        <g
          style={{ transition: 'transform 620ms cubic-bezier(0.16,0.84,0.24,1)' }}
          transform={pinch ? 'translate(56 -18)' : 'translate(0 0)'}>
          
          <rect x="188" y="96" width="264" height="168" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
          <line x1="188" y1="130" x2="452" y2="130" stroke="var(--ink)" strokeOpacity="0.4" />
          <rect x="200" y="142" width="110" height="8" fill="var(--ink)" fillOpacity="0.3" />
          <rect x="200" y="160" width="180" height="8" fill="var(--ink)" fillOpacity="0.16" />
        </g>
        <g stroke="var(--accent)" strokeWidth="1.6" fill="none">
          <path d={pinch ? 'M120 250 L168 214 L206 216' : 'M120 250 L156 226 L198 240'}
          style={{ transition: 'all 480ms cubic-bezier(0.16,0.84,0.24,1)' }} />
          <path d={pinch ? 'M120 250 L172 246 L204 224' : 'M120 250 L164 258 L200 250'}
          style={{ transition: 'all 480ms cubic-bezier(0.16,0.84,0.24,1)' }} />
        </g>
        <circle cx={pinch ? 206 : 199} cy={pinch ? 220 : 245} r="5" fill="var(--accent)"
        style={{ transition: 'all 480ms cubic-bezier(0.16,0.84,0.24,1)' }} />
      </svg>
      <div className="flex items-center justify-between gap-4 border-t border-hairline px-3 py-2">
        <span className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
          PINCH → TRANSFORM
        </span>
        <button
          type="button"
          onClick={() => setPinch((p) => !p)}
          className="font-mono text-micro uppercase tracking-[0.16em] text-ink underline decoration-accent decoration-1 underline-offset-4">
          
          {pinch ? 'Release' : 'Simulate pinch'}
        </button>
      </div>
    </div>);

}

/* ------------------------------------------------------------------ L03 */

function SplineStudy() {
  if (!SPLINE_SCENE_URL) {
    return (
      <div className="border border-hairline bg-surface p-5">
        <span className="mono-label block text-ink">NO SCENE CONFIGURED</span>
        <p className="mt-3 max-w-[52ch] text-note text-graphite">
          The loader, viewport activation, Suspense boundary, poster path, error state and
          reduced-motion fallback all exist. What does not exist is a published scene, so nothing is
          embedded here. A placeholder URL would be a fabricated asset, and the procedural artifact
          in section 04 is the honest stand-in until a real scene is authored.
        </p>
        <dl className="mt-5 border-t border-hairline">
          {[
          ['LOADER', 'Dynamic import on intersection'],
          ['BUNDLE', 'Never in the route graph'],
          ['FALLBACK', 'Procedural artifact']].
          map(([k, v]) =>
          <div key={k} className="flex items-baseline justify-between gap-4 border-b border-hairline py-2">
              <dt className="mono-label">{k}</dt>
              <dd className="text-note text-graphite">{v}</dd>
            </div>
          )}
        </dl>
      </div>);

  }
  return (
    <div className="aspect-[16/9] border border-hairline bg-surface">
      <p className="p-5 text-note text-graphite">Scene configured — loaded lazily on view.</p>
    </div>);

}

/* ------------------------------------------------------------------ L04 */

const VERBS = [
{ id: 'A', name: 'VECTOR DRAW', note: 'A line grows along an axis.' },
{ id: 'B', name: 'FIELD SETTLE', note: 'Damped arrival at a coordinate.' },
{ id: 'C', name: 'INDEX SHIFT', note: 'One grid unit, no more.' },
{ id: 'D', name: 'CLIP REVEAL', note: 'Content through a straight mask.' },
{ id: 'E', name: 'DEPTH FOCUS', note: 'One object forward, others recede.' },
{ id: 'F', name: 'ROUTE', note: 'A point travels between nodes.' },
{ id: 'G', name: 'DECOMPOSE', note: 'An object separates into layers.' }];


function MotionStudies() {
  const [on, setOn] = useState<string | null>(null);
  return (
    <div className="border border-hairline">
      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {VERBS.map((verb) => {
          const live = on === verb.id;
          return (
            <li key={verb.id} className="border-b border-hairline last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <button
                type="button"
                className="group flex w-full items-center gap-4 px-4 py-4 text-left"
                onPointerEnter={() => setOn(verb.id)}
                onPointerLeave={() => setOn(null)}
                onFocus={() => setOn(verb.id)}
                onBlur={() => setOn(null)}
                onClick={() => setOn((p) => p === verb.id ? null : verb.id)}>
                
                <span className="font-mono text-micro tracking-[0.18em] text-graphite">{verb.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-label uppercase tracking-[0.14em] text-ink">
                    {verb.name}
                  </span>
                  <span className="mt-1 block text-note text-graphite">{verb.note}</span>
                </span>
                <span aria-hidden="true" className="relative block h-8 w-16 shrink-0 overflow-hidden bg-surface">
                  <span
                    className="absolute left-0 top-1/2 block h-[1px] bg-accent transition-all duration-[620ms] ease-atlas"
                    style={{ width: live ? '100%' : '18%' }} />
                  
                  <span
                    className="absolute top-1/2 block h-[6px] w-[6px] -translate-y-1/2 bg-ink transition-all duration-[620ms] ease-atlas"
                    style={{ left: live ? 'calc(100% - 6px)' : '0px' }} />
                  
                </span>
              </button>
            </li>);

        })}
      </ul>
      <p className="border-t border-hairline px-4 py-2 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
        THESE ARE THE SEVEN VERBS USED ELSEWHERE ON THIS PAGE — NOT A SEPARATE LIBRARY
      </p>
    </div>);

}

export function LabExperiment({ kind }: {kind: ExperimentKind;}) {
  if (kind === 'field') return <FieldPlayground />;
  if (kind === 'hands') return <HandsAbstraction />;
  if (kind === 'spline') return <SplineStudy />;
  return <MotionStudies />;
}