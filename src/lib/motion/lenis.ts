import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface LenisController {
  lenis: Lenis;
  destroy: () => void;
}

export function initLenis(): LenisController | null {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || coarsePointer) return null;

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    anchors: true,
    stopInertiaOnNavigate: true,
  });

  const update = (time: number) => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(update);
      lenis.destroy();
    },
  };
}
