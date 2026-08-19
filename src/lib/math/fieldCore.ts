/**
 * Pure mathematical core for the site's vector field.
 * Keep this module free of Three.js so lightweight UI readouts can use the
 * same equations without pulling the WebGL runtime into the initial bundle.
 */
export const A = 1.0;
export const B = 0.72;
export const C = 0.58;

export type FieldVectorLike = {x: number;y: number;z: number;};

export function fieldComponents(
x: number,
y: number,
z: number,
t: number,
out: FieldVectorLike)
{
  const p = t * 0.12;
  out.x = A * Math.sin(z + p) + C * Math.cos(y * 1.15);
  out.y = B * Math.sin(x * 1.1) + A * Math.cos(z + p * 0.6);
  out.z = C * Math.sin(y * 0.95 - p) + B * Math.cos(x);
  return out;
}

/** Height function of the manifold. Mirrored exactly in GLSL (see shaders/manifold.ts). */
export function manifoldHeight(x: number, z: number, t: number) {
  return (
    0.42 * Math.sin(1.28 * x + 0.18 * t) * Math.cos(1.12 * z - 0.14 * t) +
    0.2 * Math.sin(0.62 * x * z + 0.24 * t) -
    0.055 * (x * x - z * z));

}

/** Deterministic PRNG so every reload composes identically. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = s * 1664525 + 1013904223 >>> 0;
    return s / 4294967296;
  };
}