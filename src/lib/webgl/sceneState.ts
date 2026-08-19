/**
 * One mutable module-level record shared between GSAP/ScrollTrigger, the pointer
 * listener and the render loops. Frame-rate work never touches React state.
 *
 * FROZEN SURFACE — hero scroll decomposition and pointer probe read this.
 */
export const sceneState = {
  /** hero scroll progress 0 → 1 */
  progress: 0,
  /** normalised pointer, -1 → 1, already smoothed by the probe */
  pointerX: 0,
  pointerY: 0,
  /** raw pointer target */
  targetX: 0,
  targetY: 0,
  /** pointer is over the hero */
  probing: false
};

export type QualityTier = 'low' | 'medium' | 'high';

export interface QualityProfile {
  tier: QualityTier;
  dpr: [number, number];
  segments: [number, number];
  vectors: number;
  streamlines: number;
  particles: number;
  lattice: boolean;
  wire: boolean;
}

export const profiles: Record<QualityTier, QualityProfile> = {
  low: {
    tier: 'low',
    dpr: [1, 1],
    segments: [40, 30],
    vectors: 90,
    streamlines: 4,
    particles: 0,
    lattice: false,
    wire: false
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.5],
    segments: [72, 54],
    vectors: 200,
    streamlines: 7,
    particles: 160,
    lattice: true,
    wire: false
  },
  high: {
    tier: 'high',
    dpr: [1, 1.8],
    segments: [104, 78],
    vectors: 300,
    streamlines: 9,
    particles: 240,
    lattice: true,
    wire: true
  }
};