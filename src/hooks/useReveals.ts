import { useEffect, type RefObject } from 'react';
import { ScrollTrigger } from '../lib/motion/gsap';
import { buildReveals, registerGsap } from '../lib/motion/reveal';
import { useMotion } from '../lib/motion/MotionProvider';

/**
 * Scopes every declarative reveal inside `scope` to a single gsap.context, so
 * unmounting the page reverts all tweens and kills all ScrollTriggers. No stale
 * selectors, no leaked triggers.
 */
export function useReveals(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  const { reduced } = useMotion();
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

/** Registers a DOM section with the contextual rail. */
export function useSectionRegistration(
ref: RefObject<HTMLElement>,
meta: {id: string;index: string;label: string;nav?: string;})
{
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let dispose: (() => void) | undefined;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    import('../lib/motion/section-state').then(({ registerSection }) => {
      if (!ref.current) return;
      dispose = registerSection(ref.current, meta);
    });
    return () => dispose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, meta.id, meta.index, meta.label, meta.nav]);
}