/**
 * Motion profiles. Every animated surface asks the profile what it is allowed
 * to do instead of re-deriving breakpoints and media queries locally.
 */
export type MotionProfileName =
'DESKTOP_RICH' |
'TABLET_MODERATE' |
'MOBILE_LIGHT' |
'REDUCED_MOTION';

export interface MotionProfile {
  name: MotionProfileName;
  /** scrubbed / parallax choreography allowed at all */
  scrub: boolean;
  /** pointer-reactive effects (magnetism, probes, cursor) */
  pointer: boolean;
  /** hover may reveal information that is not otherwise reachable — never true */
  hoverOnlyInfo: false;
  /** secondary WebGL beyond the hero */
  spatial: boolean;
  /** multiplier applied to travel distances */
  travel: number;
  /** multiplier applied to durations */
  time: number;
  /** how many spatial scenes may be live at once */
  maxScenes: number;
  /** upper bound for renderer pixel ratio */
  dprCap: number;
}

const PROFILES: Record<MotionProfileName, MotionProfile> = {
  DESKTOP_RICH: {
    name: 'DESKTOP_RICH',
    scrub: true,
    pointer: true,
    hoverOnlyInfo: false,
    spatial: true,
    travel: 1,
    time: 1,
    maxScenes: 2,
    dprCap: 1.75
  },
  TABLET_MODERATE: {
    name: 'TABLET_MODERATE',
    scrub: true,
    pointer: false,
    hoverOnlyInfo: false,
    spatial: true,
    travel: 0.6,
    time: 0.9,
    maxScenes: 1,
    dprCap: 1.5
  },
  MOBILE_LIGHT: {
    name: 'MOBILE_LIGHT',
    scrub: false,
    pointer: false,
    hoverOnlyInfo: false,
    spatial: false,
    travel: 0.4,
    time: 0.8,
    maxScenes: 0,
    dprCap: 1.25
  },
  REDUCED_MOTION: {
    name: 'REDUCED_MOTION',
    scrub: false,
    pointer: false,
    hoverOnlyInfo: false,
    spatial: false,
    travel: 0,
    time: 0.001,
    maxScenes: 0,
    dprCap: 1
  }
};

export function resolveProfile(): MotionProfile {
  if (typeof window === 'undefined') return PROFILES.DESKTOP_RICH;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return PROFILES.REDUCED_MOTION;
  }
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = window.matchMedia('(min-width: 1024px)').matches;
  if (fine && wide) return PROFILES.DESKTOP_RICH;
  if (wide || window.matchMedia('(min-width: 768px)').matches) return PROFILES.TABLET_MODERATE;
  return PROFILES.MOBILE_LIGHT;
}

/** Media queries whose changes can flip the active profile. */
export const PROFILE_QUERIES = [
'(prefers-reduced-motion: reduce)',
'(hover: hover) and (pointer: fine)',
'(min-width: 1024px)',
'(min-width: 768px)'];


export { PROFILES };