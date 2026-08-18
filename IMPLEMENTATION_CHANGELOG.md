# Implementation Changelog

## Foundation
- Astro 7 + current React integration.
- Tailwind 4 via `@tailwindcss/vite`.
- Current Content Layer loader/id routing.
- TypeScript 6.0.3 for current Astro checker compatibility.
- `ClientRouter` lifecycle-aware layout.

## Hero / R3F
- Removed oversized ellipsoid-like DeepSeek geometry.
- Added open saddle/fold/twist manifold.
- Added one shared deterministic vector field.
- Seeded vector marks, streamline starts, and particle positions.
- Particles integrate the shared field.
- Streamlines numerically integrate the shared field.
- Coordinate grid, field, lines, particles, shape, and camera respond to one scroll progression.
- Pointer probe performs ray/plane intersection and reports real field values.
- `PerformanceMonitor` changes DPR/detail tiers.
- Reduced-motion mode removes continuous interaction and leaves a composed static state/fallback.

## Astro / React boundaries
- WebGL and Spline are client-only React islands.
- Radix Sheet is composed entirely inside one React island.
- Astro fallbacks are not imported into React; matching TSX fallbacks are used at React boundaries.

## Spline
- Removed fabricated scene URL.
- Added `PUBLIC_SPLINE_SCENE_URL`.
- Lazy loading + intersection gating.
- Added error boundary and designed fallback.

## Work / content
- Removed fabricated contact/project links.
- Conservative project statuses.
- Shared project-preview interaction.
- Project-specific SVG system visuals.
- Dynamic case-study routes based on content IDs.

## QA
- Playwright web server config.
- Homepage, mobile menu, overflow, reduced-motion, project-route, and visual hero tests.
- Added `AUDIT_REPORT.md` and `VERIFICATION.md`.
