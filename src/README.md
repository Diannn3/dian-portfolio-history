# DIAN — VECTOR ATLAS / SOURCE ARCHITECTURE

The application is a React + TypeScript portfolio with a protected imperative Three.js hero and a progressively enhanced editorial shell. `upgrade-pass-1` remains the architectural authority: SEO, lazy project/content loading, static route generation, media contracts, browser tests and regression guards are preserved while the newer Atlas interaction layer is merged on top.

## Runtime structure

```text
App.tsx
└─ BrowserRouter
   └─ AtlasProvider
      └─ MotionProvider
         ├─ AtlasRail + AtlasMenu
         ├─ Cursor + RouteMask
         ├─ Routes
         │  ├─ Home
         │  ├─ lazy ProjectPage
         │  └─ NotFound
         └─ Footer
```

### Home

```text
Hero                    protected, lazy WebGL island
Selected Work           DOM ledger + SVG fallback + lazy shared Three stage on xl/fine-pointer desktops
About                    editorial spread + HTML/SVG Discipline Graph
Current Vector           factual NOW ledger + decorative route diagram
Digital Artifact         sticky reading sequence + lazy viewport-aware ArtifactCanvas
Lab                      collapsed notebook; every experiment is dynamically imported
Tools                    relationship map, no proficiency ratings
Contact                  verified channels only
```

## Protected hero

`components/hero/*`, `lib/math/*` and the manifold shader are inherited unchanged from the approved pre-merge baseline. The hero owns its own ScrollTrigger choreography and lazy canvas lifecycle. Do not convert it to R3F or alter its field equations/camera merely to modernize the shell.

## Motion

- `lib/motion/reveal.ts` registers `ScrollTrigger` + `useGSAP` once.
- `MotionProvider` owns the one Lenis instance and document-level reveal/progress lifecycle.
- `RouteLifecycle` is the single owner of route/hash scrolling.
- Lenis is disabled for coarse pointers/reduced motion and runs through GSAP's ticker when enabled.
- Anchor handling is enabled so skip navigation, Atlas links and case-study chapter links remain functional.
- `lib/motion/ticker.ts` is the shared imperative tick source for non-GSAP frame work.

## WebGL boundaries

Three.js must remain absent from the synchronous `src/index.tsx` graph. `npm run sanity` enforces this.

- Hero canvas: lazy from the protected Hero.
- Work `ProjectStage`: dynamically imported only when the Work section approaches the viewport, and only used on xl/fine-pointer/non-reduced configurations. All smaller/coarse/reduced modes retain the SVG project previews.
- Digital Artifact: `ArtifactCanvas` remains lazy and only mounts near its section.
- Lab Spline: remote viewer infrastructure is lazy and Lab-only; an empty `SPLINE_SCENE_URL` means no viewer request.

## Project/content architecture

```text
src/data/projectCatalog.json       lightweight home/route metadata
src/content/projectRegistry.ts     lazy project-module loader
src/content/projects/*.ts          long-form verified case studies
src/components/work/case/*         reusable evidence/decision/validation/media layouts
```

No long-form project module may become synchronously reachable from the homepage. Project and route modules are prefetched only on interaction intent.

## Case-study reading system

The existing evidence model is retained. The redesigned presentation adds a sticky chapter index and Atlas header chapter state without replacing:

- `Seo`
- `ProjectLinks`
- `CurrentState`
- `CaseMedia`
- `SystemDiagram`
- `DecisionBlock`
- `ValidationBlock`
- project-specific lazy content modules

Procedural previews are labelled `SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT`; real interface evidence must use the media contract.

## Lab

The Lab is intentionally collapsed and code-split:

- L01 Vector Field Playground — real field math.
- L02 AedriAIn — diagram of the separate prototype, not live hand tracking.
- L03 Spline Spatial Study — infrastructure only until a real authored URL exists.
- L04 Motion Studies — the portfolio motion vocabulary.

## Regression contract

Run:

```bash
npm run sanity
npm run guard:frozen
npm run typecheck
npm run build
npm run verify:dist
npm run test:e2e
npm run test:a11y
```

The frozen-surface manifest protects the approved hero/math core and reviewed creative/runtime merge surfaces. Hashes are not a substitute for browser regression review; update them only after an intentional change.
