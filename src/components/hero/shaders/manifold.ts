/** GLSL mirror of lib/math/field.ts → manifoldHeight(). Kept in one place. */
export const heightGLSL = /* glsl */`
float mHeight(vec2 p, float t){
  return 0.42 * sin(1.28 * p.x + 0.18 * t) * cos(1.12 * p.y - 0.14 * t)
       + 0.20 * sin(0.62 * p.x * p.y + 0.24 * t)
       - 0.055 * (p.x * p.x - p.y * p.y);
}
`;

export const manifoldVertex = /* glsl */`
uniform float uTime;
uniform float uFlatten;
uniform float uDecompose;
uniform float uProbe;
uniform vec2 uPointer;

varying float vH;
varying float vSlope;
varying vec3 vNormal;
varying vec2 vUv;

${heightGLSL}

float amp(){ return 1.0 - 0.94 * uFlatten; }

float surface(vec2 g, float t){
  float h = mHeight(g, t);
  float d = distance(g, uPointer * 1.9);
  h += 0.32 * exp(-d * d * 1.5) * uProbe;
  return h * amp();
}

void main(){
  vUv = uv;
  vec2 g = position.xy;
  float t = uTime;

  float h = surface(g, t);

  float e = 0.075;
  float hx = surface(g + vec2(e, 0.0), t);
  float hy = surface(g + vec2(0.0, e), t);

  vec3 tx = normalize(vec3(e, 0.0, hx - h));
  vec3 ty = normalize(vec3(0.0, e, hy - h));
  vec3 n = normalize(cross(tx, ty));

  vSlope = clamp(length(vec2(hx - h, hy - h)) / e, 0.0, 1.6);

  // fold: the sheet is bent, not flat — a saddle carried around a soft crease
  vec3 p = vec3(g.x + 0.12 * sin(g.y * 1.5), g.y, h);

  // partial decomposition at mid-scroll: deterministic per-vertex drift
  float rnd = fract(sin(dot(g, vec2(12.9898, 78.233))) * 43758.5453);
  p += n * (rnd - 0.5) * 0.62 * uDecompose;

  vH = h;
  vNormal = normalize(normalMatrix * n);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const manifoldFragment = /* glsl */`
uniform vec3 uInk;
uniform vec3 uCanvas;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uContour;
uniform float uDensity;

varying float vH;
varying float vSlope;
varying vec3 vNormal;
varying vec2 vUv;

void main(){
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;

  float key = clamp(dot(n, normalize(vec3(0.35, 0.86, 0.38))), 0.0, 1.0);
  float rim = pow(1.0 - clamp(abs(n.z), 0.0, 1.0), 2.4);
  float shade = mix(0.30, 1.0, key);

  vec3 base = mix(uInk, uCanvas, shade);
  base = mix(base, uCanvas, 0.10);

  // topographic contours on the height function
  float bands = vH * uDensity;
  float d = abs(fract(bands - 0.5) - 0.5) / max(fwidth(bands), 1e-5);
  float line = 1.0 - clamp(d, 0.0, 1.0);

  vec3 lineCol = mix(uInk, uAccent, smoothstep(0.55, 1.35, vSlope));
  vec3 col = mix(base, lineCol, line * mix(0.62, 1.0, uContour));
  col = mix(col, uInk, rim * 0.14);

  // dissolve the sheet edge into the canvas: no rectangle silhouette
  float edge = smoothstep(0.0, 0.20, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));

  float surfaceAlpha = 0.94;
  float alpha = mix(surfaceAlpha, max(line, 0.06) * 0.96, uContour) * edge * uOpacity;
  if (alpha < 0.004) discard;

  gl_FragColor = vec4(col, alpha);
}
`;