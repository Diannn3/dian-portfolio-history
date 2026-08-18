/**
 * Manifold shader. The vertex stage evaluates the same saddle+fold surface as
 * lib/math/field.ts (kept in sync intentionally) so the GPU mesh and the CPU
 * fallback describe one geometry. Fragment stage is matte with contour banding
 * derived from height — paper/technical, never chrome or neon.
 */

export const manifoldVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // scroll 0..1 : flatten / diagram-ify
  uniform vec2  uPointer;    // -1..1
  uniform float uPointerAmp;

  varying float vHeight;
  varying vec3  vNormal;
  varying vec2  vUv;
  varying vec3  vViewPos;

  float manifoldHeight(vec2 p, float t) {
    float saddle = (p.x * p.x - p.y * p.y) * 0.55;
    float fold   = sin(p.x * 2.4 + t * 0.6) * cos(p.y * 2.1 - t * 0.4) * 0.28;
    float ripple = sin((p.x * p.x + p.y * p.y) * 2.2 - t * 0.9) * 0.06;
    return saddle + fold + ripple;
  }

  void main() {
    vUv = uv;
    // position.xy carries the parametric (u,v) domain in [-1.4, 1.4]
    vec2 p = position.xy;

    float t = uTime;
    float h = manifoldHeight(p, t);

    // pointer creates a localized swell — the "probe" pushing the field
    float d = distance(p, uPointer * 1.4);
    float swell = exp(-d * d * 2.2) * uPointerAmp * 0.5;
    h += swell;

    // scroll flattens the manifold toward a contour plane
    h *= (1.0 - uProgress * 0.82);

    vHeight = h;

    // finite-difference normal
    float e = 0.02;
    float hx = manifoldHeight(p + vec2(e, 0.0), t) * (1.0 - uProgress * 0.82);
    float hy = manifoldHeight(p + vec2(0.0, e), t) * (1.0 - uProgress * 0.82);
    vec3 tangentX = normalize(vec3(e, 0.0, hx - h));
    vec3 tangentY = normalize(vec3(0.0, e, hy - h));
    vNormal = normalize(cross(tangentX, tangentY));

    vec3 transformed = vec3(p.x, p.y, h);
    vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

export const manifoldFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uInk;
  uniform vec3  uPaper;
  uniform vec3  uAccent;
  uniform float uProgress;

  varying float vHeight;
  varying vec3  vNormal;
  varying vec2  vUv;
  varying vec3  vViewPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vec3(0.4, 0.7, 0.6));
    float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);

    // matte paper base -> ink in shadow
    vec3 base = mix(uInk, uPaper, diff);

    // contour banding from height (topographic feel)
    float bands = abs(fract(vHeight * 6.0) - 0.5);
    float contour = smoothstep(0.46, 0.5, bands);
    base = mix(base, uInk, (1.0 - contour) * 0.16);

    // accent kissed onto the steepest positive ridges
    float ridge = smoothstep(0.35, 0.85, vHeight);
    base = mix(base, uAccent, ridge * 0.14 * (1.0 - uProgress));

    // subtle fresnel rim, kept extremely restrained
    vec3 V = normalize(-vViewPos);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    base = mix(base, uInk, fres * 0.12);

    gl_FragColor = vec4(base, 1.0);
  }
`
