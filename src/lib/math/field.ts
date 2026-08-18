/**
 * VECTOR ATLAS — shared mathematics.
 *
 * A single deterministic vector field F(x, y, z, t) drives the whole visual
 * system: the parametric manifold, the streamlines, the particle drift and
 * the SVG fallback all read from these functions, so every element belongs
 * to one coherent field rather than to independent visual noise.
 */

export type Vec3 = [number, number, number]
type MutableVector = Float32Array | Float64Array | number[]

/** Write F(x,y,z,t) into a caller-owned buffer to avoid animation-loop garbage. */
export function fieldInto(
  x: number,
  y: number,
  z: number,
  t: number,
  out: MutableVector,
  offset = 0,
): void {
  const s = Math.sin(t * 0.18)
  const c = Math.cos(t * 0.18)

  const rx = -z * 0.9
  const rz = x * 0.9

  const sx = 0.55 * Math.sin(y * 1.3 + t * 0.3)
  const sy = 0.4 * (x * x - z * z) * 0.35 - y * 0.35
  const sz = 0.55 * Math.cos(x * 1.1 - t * 0.25)

  out[offset] = (rx * 0.5 + sx * c - sz * s) * 0.5
  out[offset + 1] = sy * 0.5
  out[offset + 2] = (rz * 0.5 + sz * c + sx * s) * 0.5
}

/** Convenience form for static/non-hot-path callers. */
export function field(x: number, y: number, z: number, t: number): Vec3 {
  const out: Vec3 = [0, 0, 0]
  fieldInto(x, y, z, t, out)
  return out
}

/** Height of the central saddle/manifold surface z = h(u, v, t). */
export function manifoldHeight(u: number, v: number, t: number): number {
  const saddle = (u * u - v * v) * 0.55
  const fold = Math.sin(u * 2.4 + t * 0.6) * Math.cos(v * 2.1 - t * 0.4) * 0.28
  const ripple = Math.sin((u * u + v * v) * 2.2 - t * 0.9) * 0.06
  return saddle + fold + ripple
}

export function magnitude([x, y, z]: Vec3): number {
  return Math.sqrt(x * x + y * y + z * z)
}

/** Simple seeded PRNG (mulberry32) for reproducible seeding. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let tt = Math.imul(a ^ (a >>> 15), 1 | a)
    tt = (tt + Math.imul(tt ^ (tt >>> 7), 61 | tt)) ^ tt
    return ((tt ^ (tt >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Integrate a streamline with RK4. `out` and `scratch` are injectable so the
 * animated scene can reuse the same memory each update instead of allocating
 * positions and four temporary vectors for every step.
 */
export function integrateStreamline(
  seed: Vec3,
  steps: number,
  dt: number,
  t: number,
  out: Float32Array = new Float32Array(steps * 3),
  scratch: Float64Array = new Float64Array(12),
): Float32Array {
  let [x, y, z] = seed
  for (let i = 0; i < steps; i++) {
    const p = i * 3
    out[p] = x
    out[p + 1] = y
    out[p + 2] = z

    fieldInto(x, y, z, t, scratch, 0)
    fieldInto(x + (scratch[0] * dt) / 2, y + (scratch[1] * dt) / 2, z + (scratch[2] * dt) / 2, t, scratch, 3)
    fieldInto(x + (scratch[3] * dt) / 2, y + (scratch[4] * dt) / 2, z + (scratch[5] * dt) / 2, t, scratch, 6)
    fieldInto(x + scratch[6] * dt, y + scratch[7] * dt, z + scratch[8] * dt, t, scratch, 9)

    x += (dt / 6) * (scratch[0] + 2 * scratch[3] + 2 * scratch[6] + scratch[9])
    y += (dt / 6) * (scratch[1] + 2 * scratch[4] + 2 * scratch[7] + scratch[10])
    z += (dt / 6) * (scratch[2] + 2 * scratch[5] + 2 * scratch[8] + scratch[11])

    const r = Math.sqrt(x * x + y * y + z * z)
    if (r > 3.4) {
      x *= 0.6
      y *= 0.6
      z *= 0.6
    }
  }
  return out
}
