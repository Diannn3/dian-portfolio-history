# Contact Finale Restore

Base: current GitHub `master` tree `e1621313a8017d21bbb19fe520ef61087aae632f` (commit `2a8f6ce0b9e9870d66c18a094188dc8e3481f5b2`).

## Intent
Restore the `upgrade-pass-1` Contact finale visual language without reverting the current Atlas architecture.

## Changed
- `src/components/sections/Contact.tsx`
  - removes visible `SectionFrame` plate treatment while preserving `id="contact"`
  - restores full-width vertical atlas grid
  - restores pointer-responsive damped orange streamline
  - restores giant black/orange finale typography
  - restores solid `VIEW GITHUB` CTA with a local dependency-free magnetic interaction
  - restores `PROJECTS / CODE / EXPERIMENTS`
  - restores asymmetric GitHub ledger
  - removes `FIG / BEARING`, `VERIFIED`, and explanatory compliance paragraph
  - uses existing `contactLinks` as the single source of truth
  - disables interactive movement for coarse pointer / reduced motion
- `tests/e2e/portfolio.spec.ts`
  - adds Contact finale structure/URL regression coverage
- `tests/e2e/accessibility.spec.ts`
  - adds reduced-motion and keyboard-focus coverage for Contact
- `scripts/frozen-surfaces.json`
  - updates only the intentionally changed Contact hash

## Preserved
No changes to hero, math, Work, About, Now, Artifact, Lab, Tools, AtlasRail, AtlasMenu, case studies, routing, SEO, dependencies or content data.

## Checks run
- `node scripts/sanity.mjs` — PASS
- `node scripts/check-frozen-surfaces.mjs` — PASS (58/58)
- dependency-free TS/TSX transpile parser — PASS
- relative-import resolver — PASS
- `git diff --check` — PASS
- local baseline Git tree exactly matched remote `master` tree before edits

## Blocked
- `npm install` timed out because package-registry networking is unavailable in this cloud.
- Therefore real Vite build and Playwright browser execution were not run here.
