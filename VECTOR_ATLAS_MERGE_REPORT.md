# Vector Atlas Redesign Merge Report

## Purpose

This branch selectively merges the strongest interaction and editorial ideas from the interrupted Magic Patterns redesign into the production-oriented `upgrade-pass-1` architecture.

`upgrade-pass-1` remains the architectural authority. The Magic Patterns export is treated only as a feature donor.

## Base and donor

- Base branch: `upgrade-pass-1`
- Local merge branch: `feature/vector-atlas-redesign-merge`
- Clean base commit used locally: `7ca61ec14c38adcb5cccf71ab16d44cddc2dafbc`
- Magic Patterns donor: `1872aa9b-acc1-46b6-b0b9-0a344d453f41.zip`

Direct `git clone` and npm registry access were unavailable in the working cloud because outbound DNS failed. The clean local `upgrade-pass-1` Git history from the prior handoff was used as the executable base; key source hashes were cross-checked against the connected GitHub branch. Stale remote leftovers such as `.vercel/*` and the old monolithic `src/data/projects.ts` were intentionally not restored.

## Preserved from upgrade-pass-1

The merge deliberately retains the stronger production/content architecture from the base:

- custom hero, shaders, mathematical field and hero choreography
- lazy project route loading
- per-project lazy long-form content registry
- lightweight project catalog
- intent prefetching
- `Seo.tsx`
- project social-image contract
- genuine case media support
- Current State / Decision / Validation / System Diagram modules
- portfolio-native 404
- static route entrypoint generation
- canonical metadata / robots / sitemap support
- `verify-dist`
- sanity guard
- frozen-surface guard
- Playwright journey tests
- Playwright + axe accessibility tests
- GitHub Actions CI definition
- favicon and optimized font loading

No project claim, status, metric, repository link or verification boundary was loosened as part of this redesign merge.

## Transplanted and integrated from Magic Patterns

### Contextual Atlas shell

Added a three-state Atlas Rail:

- TOP — quiet identity/navigation while the hero remains dominant
- CONTENT — active section + document progress notation
- PROJECT — project identity + active case-study chapter + next-project affordance

Added a fullscreen Radix Atlas Index with:

- project index
- section index
- verified contact channel
- keyboard/focus behavior supplied by Radix Dialog
- Lenis pause/resume while open
- SVG-only field backdrop; no extra GPU context

### Motion architecture

Added:

- `AtlasContext`
- `MotionProvider`
- `RouteMask`
- section observation
- rail progress state
- `@gsap/react` / `useGSAP`

GSAP registers both ScrollTrigger and `useGSAP` once. Lenis remains the single smooth-scroll owner and is driven through the GSAP ticker. The Lenis stylesheet is imported and smooth scroll is destroyed/recreated when reduced-motion preference changes.

### Selected Work

Replaced the static Work Index presentation with an expanding Work Ledger while retaining the base catalog, route prefetch and SVG project previews.

A single shared Three.js `ProjectStage` is progressively enhanced only when all of the following are true:

- WebGL is supported
- capability tier is not low
- fine pointer / hover is available
- viewport is at least 1280px
- reduced motion is not requested
- the Work section is near the viewport

Otherwise the existing SVG previews remain visible. This intentionally fixes the donor's 768–1279px preview gap.

The stage contains four schematic scenes:

- UPPETITE — place lattice, route fragment and verified-node vocabulary
- IMS — stacked floors and waypoint/path vocabulary
- Pasada — transport route and moving-unit vocabulary, without fake ETA metrics
- Disaster Response — signal/gateway/incident vocabulary, without fake counts

The shared stage uses one WebGL context, `IntersectionObserver`, `ResizeObserver`, capped DPR, the shared ticker and explicit geometry/material disposal.

### About / Current Vector / Tools / Contact

Ported and integrated:

- more editorial About composition
- accessible 2.5D Discipline Graph with real HTML controls and a text equivalent
- Current Vector route presentation
- Tools relationship map rather than skill ratings
- pointer-responsive Contact bearing and restrained GSAP rule animation

All copy is sourced from the existing verified site data.

### Digital Artifact

Kept the base procedural Three.js Artifact and its lazy canvas boundary.

Added the donor's sticky five-step reading structure:

1. GEOMETRY
2. CORE
3. INPUT
4. STATE
5. SOURCE

The copy was rewritten to describe the object that actually exists (coordinate rings + torus-knot core) rather than falsely claiming all artifact geometry is derived from the hero field equations.

Spline can no longer replace the Digital Artifact.

### Lab

Added an open notebook using Radix Collapsible. Experiment code is dynamically imported only when a row opens:

- L01 — Vector Field Playground using the real field equations and RK4 integration
- L02 — AedriAIn study, explicitly described as a diagram rather than live hand tracking
- L03 — optional Spline study; no scene URL is invented
- L04 — Motion Studies for the site's defined motion vocabulary

Spline is Lab-only, near-viewport gated, capability gated and absent from the initial route bundle.

### Case-study presentation

Kept the base case-study data/module architecture and upgraded its presentation rather than creating a second parallel system.

The existing Case Index is now a sticky chapter rail that also feeds the Atlas Rail's current chapter state.

Case modules use varied editorial layouts while preserving:

- genuine `CaseMedia`
- `SystemDiagram`
- decisions
- validation
- real project links
- Current State
- project evidence boundaries

Procedural previews remain explicitly labeled `SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT`.

### Reading scale

Extended the existing Tailwind theme with:

- `read-sm`
- `read`
- `read-lg`

Mono microtype remains reserved for labels/status/index notation, while substantive case-study prose has a larger readable floor.

## Donor behavior deliberately rejected

The following Magic Patterns decisions were not merged:

- donor `package.json`
- duplicate `src/package.json`
- invalid `gsap/ScrollTrigger` package dependency
- `latest` dependency ranges
- synchronous Three.js import from the homepage
- duplicate case-study component hierarchy
- duplicate content/project data
- Spline replacing the Digital Artifact
- fake or borrowed Spline scene URLs
- R3F/Drei migration during this merge
- shadcn migration during this merge
- React 19 / Router 7 / Vite / Tailwind major migrations
- fabricated product screenshots or metrics

## Cleanup

Removed obsolete duplicate surfaces after verifying they were no longer imported:

- old `Nav.tsx`
- old static `sections/Lab.tsx`
- old `WorkIndex.tsx`
- artifact-level `SplineScene.tsx`
- unused `Button.tsx`
- unused `MagneticLink.tsx`

The complete source graph remains reachable through static or dynamic imports; no orphaned TS/TSX source modules remain at the time of this report.

## Regression safeguards added/extended

`npm run sanity` now checks, among other things:

- all declared package versions are pinned
- invalid `gsap/ScrollTrigger` dependency remains absent
- duplicate `src/package.json` remains absent
- Emotion is not reintroduced
- GSAP React integration stays registered
- Lenis anchor contract stays present
- Lenis stylesheet stays imported
- Spline stays out of the Digital Artifact
- ArtifactCanvas remains lazy
- obsolete pre-merge surfaces remain deleted
- case media references resolve
- social images resolve
- HTTPS external content links
- no known fake metrics/placeholders
- Three.js is not in the initial synchronous graph
- ProjectStage / ArtifactCanvas / Lab experiments are not in the initial synchronous graph
- long-form project content is not in the initial synchronous graph
- 404 and complex-diagram text alternative remain present

Playwright coverage was extended for:

- Atlas shell
- Atlas Index focus trap / Escape / focus restoration
- section hash navigation
- tablet inline Work previews
- wide low-capability SVG fallback
- wide capable shared Three stage
- direct static case-study routes
- direct lazy chapter deep links
- Case Index hash navigation
- client 404
- static 404
- skip link
- System Diagram text alternative
- Discipline Graph keyboard controls
- reduced motion
- axe serious/critical checks across all primary routes

## Validation actually run in this cloud

The following dependency-free checks have been run during implementation:

- `npm run sanity` / direct `node scripts/sanity.mjs`
- frozen-surface validation during intermediate checkpoints
- TypeScript parser/transpile checks using globally available TypeScript
- relative-import resolution across source/tests
- complete source reachability across static + dynamic imports
- initial synchronous import-graph analysis
- package-import versus manifest audit
- `git diff --check`
- mock `dist` static route generation and `verify-dist`, both without `SITE_URL` and with a configured canonical origin
- direct Git diff verification that hero/math/project-preview core files remain unchanged from the base

## Validation blocked by environment

The cloud cannot currently complete npm registry resolution, so these must run on a normal networked checkout before merge to production:

- `npm install` / `npm ci`
- real `npm run typecheck`
- real Vite production build
- real `npm run verify:dist` against that build
- Playwright Chromium journeys
- axe browser run
- visual regression screenshots
- Lighthouse / Core Web Vitals measurement
- live WebGL lifecycle profiling

No green status is claimed for those blocked checks.

## Remaining content work

The largest intentional content gap is unchanged:

- add genuine deterministic UPPETITE product captures
- add genuine IMS Academic Hub product captures

The media system is ready, but no AI-generated UI should be presented as implementation evidence.

## Merge rule going forward

Treat this branch as:

> `upgrade-pass-1` production/content architecture + selectively reviewed Vector Atlas redesign surfaces.

Do not re-ingest the Magic Patterns export wholesale. Do not update frozen hashes merely to silence a guard. Any future change to protected creative/runtime files should be intentional and visually reviewed.
