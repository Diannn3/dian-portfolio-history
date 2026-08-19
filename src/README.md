# DIAN — VECTOR ATLAS

A personal portfolio built around one visual system: a mathematical field that the
whole site is derived from. The hero renders that field in WebGL; every diagram,
preview and contour elsewhere is the same system flattened into SVG.

## Environment note

The original brief specified Astro with React islands. This project runs in a
React + TypeScript single-project runtime (no Astro compiler, no Node test
runner available here), so the architecture is preserved in React terms:

| Brief (Astro)              | Here                                                      |
| -------------------------- | --------------------------------------------------------- |
| Astro routes / layouts     | `pages/` + `App.tsx` routing, static-first section markup  |
| React islands              | `lazy()` + IntersectionObserver mounts (`Hero`, artifact)  |
| `client:visible` / `idle`  | observer + `requestIdleCallback` before canvas mount       |
| Content Collections        | `data/projects.ts` typed against `types/project.ts`        |
| View transitions           | route lifecycle + shared preview → case-study media        |
| Playwright                 | not runnable in this environment                           |

Everything else — the WebGL system, GSAP choreography, Lenis, quality tiers,
fallbacks, reduced motion, accessibility — is implemented.

## Structure

```
components/
  hero/        Three.js scene: manifold, field, streamlines, lattice, particles, probe
  work/        editorial project index, SVG previews, source links + evidence case modules
  about/       discipline graph (SVG, keyboard accessible)
  artifact/    OBJECT / 001 — instanced armillary object + Spline slot + fallback
  sections/    Now, Lab, Tools, Contact
  global/      Nav (Radix Dialog mobile menu), Cursor, Footer, Seo
  ui/          CVA button primitive, magnetic link
lib/
  math/fieldCore.ts    pure F(x,y,z,t), manifold height, seeded PRNG
  math/field.ts        Three.js adapter + RK4 streamlines
  motion/              GSAP registration, reveal vocabulary, shared ticker, Lenis
  webgl/sceneState.ts  frame-loop state + quality profiles
data/                  projects, site content (single edit point)
```

## The field

`lib/math/fieldCore.ts` defines `F(x,y,z,t)` (an ABC-style divergence-free flow) and
the manifold height function without importing Three.js. `lib/math/field.ts` adapts
that pure field to Three.js vectors for the WebGL scene. The GLSL in `components/hero/shaders/manifold.ts`
mirrors the height function exactly, so the surface, its contours, the vector
glyphs, the tracer particles and the lattice all agree.

Scroll drives one uniform set: `uFlatten`, `uDecompose`, `uContour`. The scene
goes volumetric → decomposing → contour diagram, and the camera walks from a
three-quarter view to a near-plan projection as it does.

## Performance

- one instanced draw call for the vector field, one for each artifact ring
- geometry and streamlines are computed once from a seeded PRNG
- Three.js is driven imperatively (no reconciler): React mounts the scene, the
  scene owns its own objects and disposes all geometry/materials on unmount
- no `Vector3` allocation inside frame loops; no React state per frame
- `frameloop` is switched off when a canvas leaves the viewport
- quality tiers (`low` / `medium` / `high`) inferred from WebGL support, cores,
  memory, DPR and pointer type — never from viewport width
- a single timing source: GSAP's ticker drives Lenis and all DOM frame work

## Accessibility

Skip link, semantic landmarks, ordered headings, visible focus, keyboard-operable
SVG graph nodes, Radix Dialog mobile menu (Escape, focus trap and return,
`aria-expanded`), decorative WebGL hidden from the accessibility tree, and a
complete SVG hero fallback when WebGL is unavailable.

`prefers-reduced-motion` disables Lenis, the custom cursor, magnetism, camera
drift, field animation, particle travel and all reveal travel — the static
composition is the intended design, not a degraded one.

## Content evidence and honesty

Project state is one of `CONCEPT` / `PROTOTYPE` / `IN DEVELOPMENT` / `EXPERIMENT`.
Implemented flagship projects can link to inspectable public sources and use optional
`evidence`, `decision`, `validation` and `reflection` modules. Concept work is kept
explicitly on the concept side of the line: no deployment, adoption, accuracy,
partnership or test-success claim is inferred from a design or repository description.

`CONTENT_EVIDENCE.md` is the internal claim ledger for the current content pass.
It distinguishes verified implementation facts from defined-but-not-proven-green
quality gates and explicit non-claims. The media renderer accepts real screenshots
and user-initiated video, but no fake product screenshot is generated to fill an empty slot.

The GitHub contact uses the known public profile; no email or LinkedIn address is
published automatically. `SPLINE_SCENE_URL` in `data/site.ts` stays intentionally
empty until a real scene exists. Drop a published Spline scene URL into that constant
and the artifact section loads it lazily; until then the procedural object stands in.
