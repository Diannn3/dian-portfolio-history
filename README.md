# Dian — Vector Atlas

A creative developer portfolio that keeps the original Magic Patterns art direction while hardening the project into a source-backed, production-oriented case-study system.

The protected visual system includes the custom Three.js / GLSL hero, contextual Atlas Rail, expanding Work Ledger, procedural project previews, GSAP/Lenis motion vocabulary, procedural artifact and reduced-motion fallbacks. Production/content work remains guarded so the redesign does not trade away routing, SEO, accessibility, code-splitting or content honesty.

## Getting started

```bash
npm install
npm run dev
```

Node 20–22 is supported by the current package contract.

## Quality gates

```bash
npm run sanity
npm run guard:frozen
npm run typecheck
npm run build
npm run verify:dist
npm run test:e2e
npm run test:a11y
```

`guard:frozen` hashes the protected creative/runtime files. Do not update `scripts/frozen-surfaces.json` merely to make a failure disappear; change the approved hashes only after an intentional visual/runtime review.

Playwright + axe tests are defined, but a green run still requires installed npm dependencies and Chromium.

## Runtime architecture

The homepage imports only the lightweight project catalog. Long-form case studies are split into one lazy module per project:

```text
src/data/projectCatalog.json     homepage / route metadata only
src/content/projectRegistry.ts   lazy project loader
src/content/projects/
  uppetite.ts
  ims.ts
  pasada.ts
  disaster.ts
```

Pointer/focus intent on a Work Ledger entry preloads both the case-study page module and that project's content. Three.js and long-form project copy remain outside the initial synchronous import graph; `npm run sanity` enforces both boundaries.

## Static route metadata / deep links

Vite still builds the React application. The dependency-free `postbuild` step then emits static HTML entrypoints for the known case-study paths plus a static `404.html`:

```text
/work/uppetite/index.html
/work/campus-navigation/index.html
/work/pasada/index.html
/work/disaster-response/index.html
404.html
robots.txt
sitemap.xml        # when SITE_URL is configured
```

Set the canonical production origin during the build:

```bash
SITE_URL=https://your-real-domain.example npm run build
```

Do not put a guessed/staging domain in production metadata. `npm run verify:dist` checks the generated route titles, descriptions, indexability, 404 behavior, crawler files and configured canonicals.

The React Router wildcard also renders a portfolio-native `404 / COORDINATE NOT FOUND` surface with `noindex` as a client-side fallback.

## Content model

Case studies are typed by `src/types/project.ts` and support:

- `evidence` — implementation facts and optional genuine media
- `decision` — question, choice, rationale and tradeoff
- `validation` — verified facts, defined checks, limitations and explicit non-claims
- `reflection` — what changed and what comes next

Project media supports exact dimensions, contain/cover fit, lazy loading, optional one-image priority, captions and user-initiated video. No fake product screenshot is generated to fill an empty slot.

See:

- `CONTENT_EVIDENCE.md` — internal claim ledger
- `MEDIA_CAPTURE_PLAN.md` — genuine screenshot sources/capture requirements
- `CONTENT_UPGRADE_REPORT.md` — earlier production/content hardening handoff
- `docs/PRODUCT.md` + `docs/DESIGN.md` — Vector Atlas product/design contracts
- `VECTOR_ATLAS_MERGE_REPORT.md` — redesign merge implementation handoff
