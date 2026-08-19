import React, { useEffect, useRef } from 'react';
import { gsap, registerGsap } from '../../lib/motion/gsap';
import { useMotion } from '../../lib/motion/MotionProvider';

/**
 * Semantic cursor. It never replaces the pointer's meaning — links and buttons
 * keep native behaviour and native focus — it only names the action the surface
 * under the pointer affords. Disabled on touch, coarse pointers and reduced
 * motion.
 */
const labels: Record<string, string> = {
  view: 'VIEW',
  probe: 'PROBE',
  external: '↗',
  rotate: 'ROTATE',
  drag: 'DRAG',
  open: 'OPEN',
  explore: 'EXPLORE',
  copy: 'COPY'
};

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const { fine, reduced } = useMotion();

  useEffect(() => {
    const el = dot.current;
    if (!fine || reduced || !el) return;
    registerGsap();
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
      <span ref={label} className="font-mono text-micro uppercase tracking-[0.18em] text-ink" />
    </div>);

}