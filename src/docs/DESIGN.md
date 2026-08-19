# DESIGN — VECTOR ATLAS

The site is a printed research atlas that happens to run. Instrument panel, not sci-fi
HUD. Paper canvas, ink, graphite, hairlines, one red-orange for punctuation, square and
precise geometry.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#f4f2ed` | page ground |
| `--surface` | `#eae7e0` | figure fills, plate interiors |
| `--ink` | `#111111` | primary type, geometry |
| `--graphite` | `#555555` | secondary prose, labels |
| `--hairline` | `#d8d4cc` | every rule and frame |
| `--accent` | `#d94f2b` | punctuation only: current index, active node, limitation |
| `--signal` | `#1f4d46` | verified state |

Accent is a mark, never a fill. No gradients. No shadows for depth — depth comes from
offset hairlines and overlap.

## Typography

- **Geist** for everything substantive; **Geist Mono** for notation.
- Display: `display-xl` (name plate), `display-1`, `display-2`, `display-3`.
- Reading scale (the fix for microscopic body text at 1920): `read-lg`, `read`,
  `read-sm`. Substantive prose always uses these and is capped near 62–68ch.
- Mono micro type (`micro`, `label`) is only for index numbers, labels, coordinates,
  status and captions. **Never** for explanations, decision rationale or validation
  detail.
- Uppercase + `0.14em` tracking for notation; sentence case for prose.

## Grid

12 / 8 / 4 columns via `.atlas-grid` — 4 up to 768px, 8 to 1280px, 12 above, with
padding stepping 1.25rem → 2.5rem → 4rem → 7rem at 1920. Sections are plates: hairline,
index, title, coordinate annotation, content.

## Notation language

- Every section and chapter is indexed (`01`, `CH 03`, `FIG / 02.1`).
- Coordinates (`N 14.16° / E 121.24°`) and plate labels annotate rather than decorate.
- Progress is atlas notation: discrete ticks and a travelling accent mark. Never a
  rounded progress bar.

## Motion vocabulary — seven verbs

| Verb | Behaviour | Where |
| --- | --- | --- |
| **VECTOR DRAW** | a rule draws from its origin | section hairlines |
| **FIELD SETTLE** | marks arrive slightly off-grid, then settle | figures, node sets |
| **INDEX SHIFT** | notation swaps register without morphing | AtlasRail state changes |
| **CLIP REVEAL** | a figure is uncovered by its own frame | media, plates |
| **DEPTH FOCUS** | one element sharpens as neighbours recede in weight | ledger rows, contact |
| **ROUTE** | one sheet wipes across the canvas | route transitions |
| **DECOMPOSE** | a solid separates into what generated it | hero, Digital Artifact |

Timing: `cubic-bezier(0.16, 0.84, 0.24, 1)` (`ease-atlas`) and GSAP `expo` for reveals.
One Lenis instance, one GSAP ticker, one ScrollTrigger registry. DOM animations tied to
component lifecycle use `useGSAP` with `scope`, `dependencies` and `revertOnUpdate`, and
`contextSafe` for event-triggered work. Never add a competing `requestAnimationFrame`
loop — subscribe to `lib/motion/ticker`.

## 3D rules

- The hero is frozen: its shaders, field equations, camera choreography and scroll
  timings are not to be edited.
- Raw Three.js only. Every canvas: one context, capped DPR (≤1.5–1.8),
  `IntersectionObserver` gating, `ResizeObserver` for container resize, exhaustive
  geometry/material disposal on unmount.
- Geometry must be derived from the site's own equations (`lib/math/fieldCore.ts`), not
  decorative primitives.
- No postprocessing, no bloom, no neon. Ink-on-paper in three dimensions.
- Compact viewports and reduced motion get flat SVG equivalents, not degraded 3D.

## Spline rules

- One optional viewer, in Lab / L03 only, loaded lazily and only in view.
- `SPLINE_SCENE_URL` empty ⇒ honest `NO SCENE CONFIGURED` state.
- Spline never replaces the procedural Digital Artifact, and no example or borrowed
  scene is ever used.

## WebGL lifecycle

Hero (own island, pauses off-screen) · ProjectStage (one context for the whole ledger,
geometry swapped per row) · Digital Artifact (viewport-aware, static under reduced
motion) · Spline (only if configured) — never all rendering at once.

## Mobile behaviour

Nothing important hides behind hover. The ledger shows inline flat previews instead of
the shared stage; the artifact sequence collapses to a short static plate; Lenis is off
on coarse pointers; touch targets are ≥44px.

## Reduced motion

Header does not morph. No 3D drift. Artifact is static and shortened. Lab demos hold
their end state. Route transitions are immediate. The hero keeps its own existing
reduced-motion behaviour.

## Accessibility

Skip link, semantic `main`, ordered headings, visible focus (2px accent outline, 3px
offset). Every SVG/WebGL surface that carries information also carries a DOM equivalent:
node lists, definition lists, live-region readouts. Decorative graphics are
`aria-hidden`. No fake SVG buttons — interactive nodes are real HTML buttons positioned
over the drawing. External links are labelled as opening in a new tab.

## Anti-patterns — never introduce

glassmorphism · purple gradients · cyberpunk · neon HUD · giant rounded cards · pill
spam · SaaS dashboard styling · generic feature cards · fake terminal UI · random blobs ·
meaningless particle backgrounds · device mockups (MacBook/iPhone chrome) · fake metrics ·
fake screenshots · fake clients · fake users · fake awards · fake deployment claims.
