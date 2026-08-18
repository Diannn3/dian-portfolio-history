import React, { useEffect, useRef } from 'react';
import { fieldComponents } from '../../lib/math/fieldCore';
import { sceneState } from '../../lib/webgl/sceneState';

const v = { x: 0, y: 0, z: 0 };

/**
 * Analytical readout of the field under the pointer. Written straight to the DOM
 * on a single throttled rAF — no React state per frame.
 */
export function PointerProbe() {
  const x = useRef<HTMLSpanElement>(null);
  const y = useRef<HTMLSpanElement>(null);
  const z = useRef<HTMLSpanElement>(null);
  const mag = useRef<HTMLSpanElement>(null);
  const theta = useRef<HTMLSpanElement>(null);
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const fmt = (n: number) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(3);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 66) return;
      last = t;
      const px = sceneState.pointerX * 3.1;
      const py = -sceneState.pointerY * 2.1;
      fieldComponents(px, py, 0.4, t * 0.001, v);
      if (x.current) x.current.textContent = fmt(v.x * 0.34);
      if (y.current) y.current.textContent = fmt(v.y * 0.34);
      if (z.current) z.current.textContent = fmt(v.z * 0.34);
      if (mag.current) mag.current.textContent = (Math.hypot(v.x, v.y, v.z) * 0.34).toFixed(3);
      if (theta.current)
      theta.current.textContent =
      (Math.atan2(v.y, v.x) * 180 / Math.PI).toFixed(1).padStart(5, ' ') + '°';
      if (shell.current)
      shell.current.style.opacity = sceneState.probing ? '1' : '0.28';
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={shell}
      aria-hidden="true"
      className="hidden font-mono text-micro uppercase tracking-[0.16em] text-graphite transition-opacity duration-500 md:block">
      
      <div className="flex flex-col gap-[0.35rem]">
        <div className="flex gap-4">
          <span>
            X <span ref={x} className="text-ink">+0.000</span>
          </span>
          <span>
            Y <span ref={y} className="text-ink">+0.000</span>
          </span>
          <span>
            Z <span ref={z} className="text-ink">+0.000</span>
          </span>
        </div>
        <div className="flex gap-4">
          <span>
            MAG <span ref={mag} className="text-ink">0.000</span>
          </span>
          <span>
            θ <span ref={theta} className="text-ink">0.0°</span>
          </span>
        </div>
      </div>
    </div>);

}