/**
 * Frame-rate readouts for the header. Written by ScrollTrigger, read by the rail
 * on the shared ticker so per-frame values never enter React state.
 */
export const railState = {
  /** whole-document scroll progress 0 → 1 */
  progress: 0,
  /** hero exit progress 0 → 1 (0 while the hero owns the viewport) */
  heroExit: 0
};