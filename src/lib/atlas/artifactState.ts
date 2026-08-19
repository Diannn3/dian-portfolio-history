/**
 * Scroll readout for the Digital Artifact sequence. The sticky ScrollTrigger
 * writes here every frame; only the discrete chapter index is mirrored into
 * React state, so scrubbing never re-renders the section.
 */
export const artifactState = {
  /** current chapter index 0 → 4 */
  step: 0,
  /** progress within the current chapter 0 → 1 */
  progress: 0
};