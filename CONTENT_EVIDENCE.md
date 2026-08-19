# Vector Atlas — content evidence ledger

This file is an internal claim ledger for the portfolio content pass. It is not rendered by the site.

## Rules

- **VERIFIED** — supported by an inspectable public repository/file.
- **DEFINED** — infrastructure or a test command exists, but this ledger does not assert a current green production run.
- **CONCEPT** — proposed behavior or architecture; never word it as shipped.
- Never infer deployment, adoption, accuracy, partnerships, user counts, test success or authorship scope from repository visibility alone.
- Real product media must be captured from the real application in a sanitized/deterministic state. Do not generate fake product screenshots.

## UPPETITE

Primary source: https://github.com/Diannn3/kain-elbi

### VERIFIED

- Product identity is UPPETITE; repository name is historical.
- Route-aware Smart Picks use origin, optional destination and break duration.
- Explore supports search/filter/map/list discovery surfaces.
- My UPPETITE includes local personal state such as timetable, Saved Places and Food Journal.
- Places Ops is an authenticated maintenance surface.
- Frontend uses Astro + Svelte + TypeScript + MapLibre GL JS.
- Staff/backend architecture uses Supabase Auth, Postgres, RLS and Edge Functions.
- Public architecture is static-first with scoped on-demand routes.
- Unsupported pedestrian-graph routes are not fabricated.
- Testing/audit commands are defined for unit, E2E, performance, visual, accessibility/privacy-related checks.

### NOT CLAIMED

- Public production launch.
- Number of users.
- Current place-data accuracy.
- Current green status of every defined test command.

## IMS Academic Hub

Primary source: https://github.com/Diannn3/ims-app

### VERIFIED

- Product joins indoor navigation, academic information and private student tools.
- Uses SvelteKit/Svelte/TypeScript.
- Navigation uses semantic SVG floor maps and an A* graph.
- Academic data uses Supabase/Postgres/RLS and staged review/publication flows.
- Gradebooks remain local in IndexedDB.
- Search spans multiple academic/spatial entity types.
- Test and verification commands exist for Vitest, Playwright, pgTAP and static project/data/security checks.
- Repository explicitly says current floor geometry is schematic and site-unverified.

### NOT CLAIMED

- Architectural/centimeter accuracy.
- Certified accessibility routing.
- Emergency/evacuation routing.
- Current green status of every defined validation gate.

## Pasada

State: **CONCEPT**

- No live fleet, operator partnership, measured ETA accuracy or demand telemetry is claimed.
- Portfolio language describes assumptions, failure modes and required validation rather than results.

## Disaster Response Platform

State: **CONCEPT**

- No public implementation repository was identified during this content audit.
- No deployment, responder validation, model accuracy or operational use is claimed.
- Human authority remains explicit in the concept framing.

## Aescent Web Studio

Public destination: https://aescentwebstudios.com/

Canonical source checkout audited separately: `businesses/aescent_web_studio/aescent-website`.
The public repository is `https://github.com/Diannn3/aescent-website`; its `origin/main`
was observed at `0a38934` during the source audit, and its Astro site metadata points at
`https://aescentwebstudios.com`.

### VERIFIED

- Aescent Web Studio is Dian's client-facing web practice.
- The public destination is a live studio site and is an approved external destination
  for the compact Studio Practice module.
- The audited source contains Astro implementation, responsive/editorial presentation,
  and public brand assets.
- The approved identity wording is first-person: "founder of Aescent Web Studio and a
  UPLB student here in Laguna." It is used only as a short trajectory marker, not as a
  client-outcome claim.

### SOURCE / DEPLOYMENT BOUNDARY

- The live site includes newer visible work (including Aescent Smiles and SMOR) that is
  absent from the public `main` snapshot audited above.
- The local Aescent checkout is dirty and contains newer changes that are not on live.
- Therefore the portfolio must not describe the public repository as the exact source
  for the deployed site. If linked, its label is only `PUBLIC REPOSITORY`.
- Source/deployment reconciliation is a separate, approval-gated task. This portfolio
  change does not reset, clean, branch, or modify that checkout.

### NOT CLAIMED

- Client counts, revenue, leads, conversion, bookings, testimonials or measured results.
- Client identities, private materials, team size, sole authorship or founding date.
- Aescent Smiles or SMOR as paying-client or measured-venture outcomes.
- Exact production-source mapping, deployment parity, performance, accessibility or
  speed without a dated audit.

## AedriAIn

Primary source: https://github.com/Diannn3/AedriAIn

### VERIFIED

- Prototype 01 uses React 19 + React Three Fiber.
- MediaPipe hand tracking runs through a Web Worker.
- Pinch/drag and two-hand transform interactions are implemented in the prototype description.
- Mouse fallback, local persisted state and Electron shell scaffolding exist.

## Repository media evidence discovered during upgrade pass

### UPPETITE

The public repository contains committed Playwright visual-regression snapshots under `app/tests/e2e/visual.spec.ts-snapshots/`, including Explore and Smart Picks mobile baselines. Their existence is evidence that deterministic UI visual states are versioned; it is **not** evidence of a public production launch or current green CI status.

### IMS

The repository contains `third-preview.png` plus three `reference/*-floor-source.jpeg` orientation images. The floor reference images are explicitly not app-interface evidence and must not be presented as screenshots of the implemented product.

## Approved Vector Atlas media manifest (2026-08-20)

Only the following derivatives are copied into this repository. They are cropped or
directly copied from genuine project-owned/public-safe sources, and each is captioned
with its state in the rendered case-study data.

| Asset | Source and treatment | State / allowed use |
| --- | --- | --- |
| `public/work/uppetite/smart-picks-mobile.webp` | UPPETITE committed Playwright baseline `smart-picks-list-mobile-390-visual-chromium-win32.png`; top 1200 CSS pixels cropped and scaled 2× with WebP quality 84 | Public-safe deterministic mobile evidence; proves route/time-aware Smart Picks UI, not production/adoption |
| `public/work/uppetite/explore-mobile.webp` | UPPETITE committed Playwright baseline `explore-results-mobile-390-visual-chromium-win32.png`; top 1200 CSS pixels cropped and scaled 2× with WebP quality 84 | Public-safe deterministic mobile evidence; proves discovery/search/filter UI, not live data accuracy |
| `public/work/ims/third-floor-schematic.png` | IMS repository `third-preview.png`, copied without redrawing | Prototype / synthetic / site-unverified; proves schematic floor-map language only |

No Aescent screenshot is approved in this commit. The local dirty Aescent assets are
not copied or treated as deployment proof. The Studio Practice module may use the
verified external link and a restrained public brand token; adding a dated live-site
capture requires a separate capture review with browser, date, viewport and state.
