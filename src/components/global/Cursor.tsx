import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

const labels: Record<string, string> = {
  view: 'VIEW',
  probe: 'PROBE',
  external: '↗',
  rotate: 'ROTATE',
  drag: 'DRAG'
};

/**
 * The native cursor stays. This adds a small analytical marker that follows it
 * with inertia and names the current affordance. Desktop only, off for reduced
 * motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced || !dot.current) return;
    const el = dot.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]') as HTMLElement | null;
      const key = target?.dataset.cursor ?? '';
      const text = labels[key] ?? '';
      if (label.current && label.current.textContent !== text) {
        label.current.textContent = text;
        gsap.to(el, { scale: text ? 1 : 0.6, duration: 0.4, ease: 'power3.out' });
      }
    };
    const onLeave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.25 });
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex scale-[0.6] items-center gap-2 opacity-0">
      
      <span className="block h-[6px] w-[6px] translate-y-[0.5px] bg-accent" />
      <span
        ref={label}
        className="font-mono text-micro uppercase tracking-[0.18em] text-ink" />
      
    </div>);

}