/**
 * Shared mutable hero state. All R3F frame loops read from this single object
 * via refs/uniforms — we never call setState per frame. Scroll progress is
 * pushed in from GSAP ScrollTrigger; pointer is smoothed here.
 */
export interface HeroState {
  progress: number // 0..1 scroll through hero
  pointer: { x: number; y: number } // smoothed, -1..1
  pointerTarget: { x: number; y: number }
  pointerActive: number // 0..1 (0 when idle)
  reducedMotion: boolean
}

const state: HeroState = {
  progress: 0,
  pointer: { x: 0, y: 0 },
  pointerTarget: { x: 0, y: 0 },
  pointerActive: 0,
  reducedMotion: false,
}

export function useHeroState(): HeroState {
  return state
}

export function setHeroProgress(p: number) {
  state.progress = Math.max(0, Math.min(1, p))
}

export function setHeroPointer(x: number, y: number, active: boolean) {
  state.pointerTarget.x = x
  state.pointerTarget.y = y
  state.pointerActive = active ? 1 : 0
}
