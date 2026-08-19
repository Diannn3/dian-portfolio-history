import { useEffect, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildReveals, registerGsap } from '../lib/motion/reveal';
import { useReducedMotion } from './useEnvironment';

/** Scoped reveal lifecycle: everything created here is reverted on unmount. */
export function useReveals(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const gsap = registerGsap();
    const el = scope.current;
    if (!el) return;
    const ctx = gsap.context(() => buildReveals(el, reduced), el);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}