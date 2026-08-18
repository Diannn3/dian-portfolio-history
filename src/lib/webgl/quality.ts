export type Quality = "low" | "medium" | "high"

export interface QualityConfig {
  tier: Quality
  dpr: [number, number]
  manifoldSegments: number
  streamlines: number
  streamlineSteps: number
  particles: number
}

const CONFIGS: Record<Quality, QualityConfig> = {
  low: {
    tier: "low",
    dpr: [1, 1],
    manifoldSegments: 44,
    streamlines: 5,
    streamlineSteps: 90,
    particles: 260,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.5],
    manifoldSegments: 80,
    streamlines: 9,
    streamlineSteps: 150,
    particles: 620,
  },
  high: {
    tier: "high",
    dpr: [1, 2],
    manifoldSegments: 120,
    streamlines: 13,
    streamlineSteps: 200,
    particles: 900,
  },
}

/**
 * Estimate a starting quality tier. Not derived from viewport width alone —
 * we look at device memory, logical cores and coarse-pointer signals. The
 * R3F <PerformanceMonitor> then adapts down at runtime if frames drop.
 */
export function detectQuality(): QualityConfig {
  if (typeof window === "undefined") return CONFIGS.medium

  const nav = navigator as Navigator & { deviceMemory?: number }
  const mem = nav.deviceMemory ?? 4
  const cores = navigator.hardwareConcurrency ?? 4
  const coarse = window.matchMedia("(pointer: coarse)").matches

  let score = 0
  if (mem >= 8) score += 2
  else if (mem >= 4) score += 1
  if (cores >= 8) score += 2
  else if (cores >= 4) score += 1
  if (coarse) score -= 2

  if (score >= 4) return CONFIGS.high
  if (score >= 1) return CONFIGS.medium
  return CONFIGS.low
}

export function configFor(tier: Quality): QualityConfig {
  return CONFIGS[tier]
}

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return true
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
