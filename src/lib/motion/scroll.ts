import Lenis from 'lenis';
import { registerGsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;
let rafFn: ((time: number) => void) | null = null;

/**
 * ONE source of truth for smooth scrolling.
 *
 * Lenis is only used where it earns its place: fine-pointer devices with motion
 * allowed. Touch keeps native scrolling. Timing is delegated to GSAP's ticker —
 * Lenis never runs its own requestAnimationFrame loop, so there is exactly one
 * clock in the application.
 *
 * The page remains fully usable with Lenis disabled: anchors fall back to
 * scrollIntoView, keyboard scrolling stays native, and nothing reads scroll
 * position from Lenis alone.
 */
export function initSmoothScroll(): () => void {
  const gsap = registerGsap();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || coarse) return () => undefined;

  lenis = new Lenis({ duration: 0.95, wheelMultiplier: 0.92, smoothWheel: true, touchMultiplier: 1 });
  const instance = lenis;
  instance.on('scroll', ScrollTrigger.update);
  rafFn = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(rafFn);
  gsap.ticker.lagSmoothing(0);

  return () => {
    if (rafFn) gsap.ticker.remove(rafFn);
    instance.destroy();
    lenis = null;
    rafFn = null;
  };
}

export const getLenis = () => lenis;

/**
 * Anchor navigation that works with or without Lenis, and keeps the URL hash
 * so deep links and browser history stay correct.
 */
export function scrollToTarget(target: string | HTMLElement, offset = -24) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return false;
  const instance = getLenis();
  if (instance) instance.scrollTo(el, { offset });else
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}