import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Single registration point for GSAP plugins. Everything in the site — the
 * frozen hero included — goes through this so plugins are registered exactly
 * once and the ticker stays the only timing source.
 */
export function registerGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

/** The site's easing set. Nothing else is allowed in. */
export const EASE = {
  /** VECTOR DRAW / CLIP REVEAL — decisive, geometric */
  draw: 'expo.inOut',
  /** FIELD SETTLE — arrives and stops */
  settle: 'expo.out',
  /** INDEX SHIFT — one grid unit, no bounce */
  shift: 'power3.out',
  /** scrubbed choreography */
  linear: 'none'
} as const;

/** Durations, in seconds. Keep the family small. */
export const DUR = {
  micro: 0.32,
  shift: 0.55,
  reveal: 1.05,
  draw: 1.2,
  route: 0.72
} as const;