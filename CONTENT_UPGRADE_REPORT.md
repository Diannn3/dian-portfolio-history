# Vector Atlas — upgrade pass implementation report

## Remote baseline

This pass was based on the GitHub branch `content-upgrade` in `Diannn3/dian-portfolio-history`.

Remote baseline identifiers captured before edits:

- commit: `c6ce1b1e03bf8345c58b1e32684f1f40d34d0c97`
- tree: `75586e205c3dd744527d81ca5b380b514c860d84`

Direct `git clone` was blocked by cloud DNS. The working tree was therefore reconstructed and verified against the complete, non-truncated GitHub tree; the local baseline Git tree matched the remote tree SHA exactly before implementation began.

GitHub write operations currently return `403 Resource not accessible by integration`, so this pass is being developed/validated locally rather than silently modifying `content-upgrade`.

## Protected visual/runtime surfaces

A frozen-surface hash gate protects 32 approved files covering the creative/runtime core, including:

- hero / GLSL / camera / particles / streamlines / vector field
- math and motion libraries
- WebGL scene state
- project preview artwork
- global visual tokens
- navigation/cursor
- artifact geometry

Current result:

```text
FROZEN OK: 32 protected visual/runtime files match the approved baseline.
```

## Implemented in this pass

### Case-study UX

- compact `CURRENT STATE` summaries for UPPETITE and IMS
- jumpable Case Index derived from the case-study modules
- stable section anchors
- complex system diagrams now include a keyboard-accessible text equivalent
- mobile diagram `SCROLL / DRAG →` affordance
- Lab pruned to inspectable work instead of filling slots
- procedural Digital Artifact is presented as a deliberate Three.js construct rather than an empty Spline slot

### Initial-bundle isolation

- homepage uses `projectCatalog.json` rather than long-form case-study data
- detailed `ProjectPage` is lazy-loaded
- each case study lives in its own lazy project module
- pointer/focus intent preloads the selected project page + selected project content
- sanity gate fails if Three.js or long-form project content becomes synchronously reachable from `src/index.tsx`

### Routing / SEO hardening

- wildcard route no longer silently renders Home
- portfolio-native 404 has `noindex`
- postbuild emits static HTML entrypoints for every known project route
- route-specific title/description/robots/Open Graph metadata are present before React executes
- `robots.txt` always generated
- sitemap + canonical URLs generated only when `SITE_URL` is intentionally configured
- homepage and project entrypoints receive initial HTML metadata before React executes
- client-side 404 navigation removes stale canonical / `og:url` tags
- social metadata no longer claims `summary_large_image` unless a real social image is configured
- `verify:dist` validates generated route/crawler metadata after build

### Media contract

`ProjectMedia` now supports:

- exact `width` / `height`
- optional aspect-ratio override
- `contain` / `cover` fit
- one-image priority hint (`eager` + `fetchpriority=high`)
- lazy decoding/loading for non-priority images
- user-initiated video with `preload=none`

No fake screenshot was added. Full-tree repository inspection did discover real UPPETITE Playwright visual baselines; their exact source paths and privacy/crop rules are recorded in `MEDIA_CAPTURE_PLAN.md` for later localization/selection.

### Accessibility / regression infrastructure

- Playwright portfolio journey tests
- axe serious/critical accessibility checks
- keyboard case-index + diagram-text-equivalent checks
- reduced-motion readability check
- frozen-surface hash guard
- GitHub Actions workflow for install → static guards → build → dist verification → Chromium → browser tests

### Font loading

- font CSS `@import` remains removed
- Google Fonts requests now ask only for Geist / Geist Mono weights 400 and 500, matching the actual source usage
- self-hosting remains deferred until the font binaries can be acquired and browser-regressed normally

### Repository hygiene / reproducibility

- generated `.vercel` linkage removed and ignored
- remaining `latest` package entries removed
- dependencies/devDependencies exact-pinned in `package.json`
- Node engine contract added
- no fake lockfile generated while the registry is unreachable

## Dependency-free validation completed here

Current green checks include:

```text
SANITY OK
FROZEN OK — 32 protected files
TS/TSX transpile parser — PASS
relative source imports — PASS
mock postbuild route generation without SITE_URL — PASS
mock verify:dist without SITE_URL — PASS
mock postbuild route generation with SITE_URL — PASS
mock verify:dist with SITE_URL — PASS
git diff --check — PASS
```

The initial synchronous dependency graph remains free of both Three.js and long-form case-study modules.

## Validation still blocked by environment

This cloud does not have the project `node_modules`, and outbound npm/GitHub DNS is unavailable. An offline install also cannot complete because the new browser/a11y packages are not present in the npm cache.

Therefore this report does **not** claim that these have run successfully here:

```bash
npm install
npm run typecheck        # full dependency-aware TypeScript check
npm run build            # real Vite production build
npm run test:e2e         # real Chromium browser run
npm run test:a11y        # real axe browser run
```

On the first normal networked machine/CI run, execute the full quality command set from `README.md` before merging or deploying. Do not begin React/Vite/Tailwind/WebGL modernization until that baseline is green and visual screenshots exist.
