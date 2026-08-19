import gsap from 'gsap';

type Fn = (time: number, deltaMs: number) => void;

const subs = new Set<Fn>();
let attached = false;

function handler(time: number, deltaMs: number) {
  subs.forEach((fn) => fn(time, deltaMs));
}

/**
 * One timing source for all frame work, driven by GSAP's ticker so we never
 * spin up competing requestAnimationFrame loops.
 */
export function subscribeTick(fn: Fn) {
  subs.add(fn);
  if (!attached) {
    gsap.ticker.add(handler);
    attached = true;
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && attached) {
      gsap.ticker.remove(handler);
      attached = false;
    }
  };
}