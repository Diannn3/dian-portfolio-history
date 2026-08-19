import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { SPLINE_SCENE_URL } from '../../data/site';
import { useCompact, usePointerFine, useQuality, useReducedMotion } from '../../hooks/useEnvironment';

const SplineScene = lazy(() =>
import('./SplineScene').then((m) => ({ default: m.SplineScene }))
);

/**
 * L03 — the intentional home for a Spline scene. The URL is empty in data/site.ts
 * and no substitute is invented, so this renders an honest empty state. When a
 * real published scene is added the viewer loads lazily, in view only, and never
 * replaces the procedural Digital Artifact.
 */
export function SplineStudy() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const fine = usePointerFine();
  const { profile } = useQuality();
  const configured = SPLINE_SCENE_URL.trim().length > 0;

  useEffect(() => {
    if (!configured || !host.current) return;
    const el = host.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [configured]);

  const shouldMount = configured && near && !reduced && !compact && fine && profile.tier !== 'low';

  return (
    <div ref={host}>
      <div className="border border-hairline bg-surface/30">
        <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
          <span className="mono-label">FIG / SPLINE SCENE</span>
          <span className="mono-label">
            {configured ? shouldMount ? 'LAZY MOUNT' : 'DEFERRED' : 'NOT CONFIGURED'}
          </span>
        </div>

        <div className="aspect-[16/10] w-full">
          {shouldMount ?
          <Suspense fallback={<p className="mono-label p-4">PREPARING SCENE…</p>}>
              <SplineScene url={SPLINE_SCENE_URL} />
            </Suspense> :

          <div className="flex h-full w-full items-center justify-center p-6">
              <div className="max-w-[46ch] text-center">
                <p className="mono-label text-accent">{configured ? 'SCENE DEFERRED' : 'NO SCENE CONFIGURED'}</p>
                <p className="mt-3 text-read-sm text-graphite">
                  {configured ?
                reduced || compact || !fine || profile.tier === 'low' ?
                'A scene exists but is not mounted here: reduced motion, touch/coarse input or a constrained capability tier keeps this slot static.' :
                'The scene will load as this entry enters the viewport.' :
                'The loading infrastructure is in place and waiting for a published scene of my own. No borrowed or example asset stands in for one.'}
                </p>
              </div>
            </div>
          }
        </div>
      </div>

      <p className="mono-label mt-3">
        LOADED ONLY IN VIEW · NEVER IN THE INITIAL ROUTE BUNDLE
      </p>
    </div>);

}