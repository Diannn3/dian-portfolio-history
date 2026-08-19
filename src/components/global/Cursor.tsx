import React, { useEffect, useRef, useState } from 'react';
import { subscribeTick } from '../../lib/motion/ticker';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

type CursorState = 'default' | 'probe' | 'link' | 'row';

const LABEL: Record<CursorState, string> = {
  default: '',
  probe: 'PROBE',
  link: 'OPEN',
  row: 'VIEW'
};

/**
 * A single instrument cursor. State comes from [data-cursor] on hovered
 * elements; position is written directly to the node on the shared ticker.
 * Never shown on coarse pointers or under reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      const next = el?.getAttribute('data-cursor') as CursorState | null ?? 'default';
      setState((prev) => prev === next ? prev : next);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    const unsub = subscribeTick(() => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (dot.current)
      dot.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      unsub();
    };
  }, [enabled]);

  if (!enabled) return null;

  const active = state !== 'default';

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[65] hidden md:block">

      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span
          className={`block h-[9px] w-[9px] border transition-all duration-300 ease-atlas ${
          active ? 'scale-[1.9] border-accent bg-transparent' : 'border-ink bg-ink'}`
          } />

        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-micro uppercase tracking-[0.16em] text-graphite transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-0'}`
          }>

          {LABEL[state]}
        </span>
      </div>
    </div>);

}