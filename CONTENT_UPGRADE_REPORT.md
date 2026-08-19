# Vector Atlas — content upgrade implementation report

## Baseline

The content pass was applied to the previously hardened `dian-vector-atlas-safe-pass` copy. The original safe-pass remains separate.

## Runtime/visual surfaces intentionally frozen

No edits were made to:

- hero shaders or mathematical field code
- Three.js scene/camera/particles/streamlines/vector glyphs
- project preview artwork
- GSAP / Lenis motion implementation
- global navigation, cursor, SEO implementation or footer
- Digital Artifact / Spline/procedural geometry
- global CSS / Tailwind tokens
- routing architecture

A file-level allowlist comparison against the safe-pass reports no changes outside the content/schema files documented below.

## Implemented

### Case-study schema

Added optional, backward-compatible content primitives:

- project source/document/demo/video links
- evidence level (`IMPLEMENTATION`, `PROTOTYPE`, `CONCEPT`)
- real media records (`image` / `video`)
- structured engineering decisions
- validation states (`VERIFIED`, `DEFINED`, `LIMITATION`, `NOT CLAIMED`)
- reflection modules

### Reusable components

- `ProjectLinks.tsx`
- `CaseMedia.tsx`
- `DecisionBlock.tsx`
- `ValidationBlock.tsx`
- extended `CaseModules.tsx`

No new npm package was introduced.

### UPPETITE

- promoted to implementation-backed flagship #01
- public source/docs links
- actual Astro/Svelte/MapLibre/Supabase architecture represented
- current product surfaces documented
- local-first personal-state decision documented
- fail-closed route-coverage decision documented
- project-evolution flow added
- validation/non-claim block added
- reflection added

### IMS Academic Hub

- visible project renamed from Campus Navigation while preserving `/work/campus-navigation`
- moved to flagship #02
- public source/docs links
- real SvelteKit/SVG/A*/Supabase/IndexedDB architecture represented
- current product surfaces documented
- SvelteKit framework decision documented
- local grade-data decision documented
- import → stage → apply → verify → publish governance flow added
- site-unverified floorplan limitation made explicit
- reflection added

### Pasada

- moved to #03
- remains explicitly `CONCEPT`
- assumptions, failure modes and required validation replace implied results
- no live fleet, partnership or measured ETA claim

### Disaster Response Platform

- moved to #04
- downgraded from `PROTOTYPE` to `CONCEPT` because no public implementation evidence was found during the audit
- human authority decision made explicit
- deployment/responder/accuracy non-claims added
- required validation work listed

### Homepage supporting content

- hero visual/copy structure retained
- support sentence made more specific
- `NOW / AUG 2026` uses current named projects
- Tools updated to reflect implemented work
- About copy made more systems-oriented
- Lab reduced to stronger entries and now links AedriAIn to its real public repository

### Media infrastructure

Real screenshot/video rendering is implemented but no fake product media was added.

`MEDIA_CAPTURE_PLAN.md` specifies deterministic, privacy-safe captures for UPPETITE and IMS. `npm run sanity` will reject a `/work/...` media path if the referenced file does not exist.

## Evidence policy

`CONTENT_EVIDENCE.md` records the claim boundary for each project. It distinguishes repository-backed facts from defined test infrastructure and explicit non-claims.

## Validation completed in this environment

- `npm run sanity` / `node scripts/sanity.mjs` — **PASS**
- all TS/TSX files through TypeScript `transpileModule` — **56/56 PASS**
- changed-file semantic TypeScript check with temporary external-library stubs — **PASS**
- frozen-surface file comparison against safe-pass — **PASS**
- Three.js remains outside the initial static import graph — **PASS**
- external content links are HTTPS-bounded — **PASS**
- referenced `/work/...` media assets are existence-checked — **PASS**

## Validation blocked by environment

`npm run build` cannot run because the working container has no installed dependencies (`vite: not found`). A clean npm install probe times out because outbound npm access is unavailable in this environment.

This is not reported as a successful production build. On a normal networked machine, run:

```bash
npm install
npm run sanity
npm run typecheck
npm run build
npm run dev
```

Then perform browser/visual regression at the target desktop/mobile widths before merging or deploying.
