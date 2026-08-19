import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;
let rafFn: ((time: number) => void) | null = null;

/**
 * Lenis is only used where it earns its place: fine-pointer devices with motion
 * allowed. Touch keeps native scrolling. Timing is delegated to GSAP's ticker.
 */
export function initSmoothScroll(): () => void {
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