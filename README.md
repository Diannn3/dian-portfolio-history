# Dian — Vector Atlas

An Astro portfolio built around **applied mathematics × software × AI × spatial systems × data × design**. The visual system treats the site like a mathematical atlas: a procedural manifold, one deterministic vector field, editorial project diagrams, and restrained motion rather than a stack of generic portfolio cards.

## What is implemented

- Astro routes and layouts; React is reserved for interactive islands.
- Procedural React Three Fiber hero with a custom parametric saddle/manifold.
- One shared deterministic field drives particles, RK4 streamlines, and fallback visuals.
- GSAP ScrollTrigger maps the long hero stage from spatial 3D toward a flatter diagram state.
- Adaptive WebGL quality tiers based on capability signals plus R3F performance monitoring.
- Static SVG manifold/vector-field fallback for reduced motion or unavailable WebGL.
- Editorial Selected Work index with one shared desktop preview and inline mobile previews.
- Typed Astro Content Collection and four case-study routes.
- Interactive SVG discipline graph.
- Lazy Spline integration with a complete static computational-artifact fallback.
- Now, Lab, Tools, Contact, and footer sections.
- Astro ClientRouter transitions with scoped GSAP/Lenis lifecycle cleanup.
- shadcn-compatible Base UI dialog behavior for mobile navigation, plus skip link, visible focus, semantic headings, and reduced-motion paths.
- Playwright functional coverage and visual-regression checkpoints.

## Projects

The content intentionally does **not** invent usage metrics, awards, deployments, adoption, or outcomes. Unknown dates/roles are rendered as `TO VERIFY` rather than guessed.

1. UPPETITE ELBI — `IN DEVELOPMENT`
2. PASADA — `PROTOTYPE`
3. DISASTER RESPONSE PLATFORM — `CONCEPT`
4. CAMPUS / BUILDING NAVIGATION — `EXPERIMENT`

Edit project metadata and MDX in `src/content/projects/`. The schema lives in `src/content.config.ts`.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Environment

Copy `.env.example` to `.env` and add only values you have verified:

```bash
SITE_URL=
PUBLIC_CONTACT_EMAIL=
PUBLIC_GITHUB_URL=
PUBLIC_LINKEDIN_URL=
PUBLIC_SPLINE_SCENE_URL=
```

The contact UI and Spline section remain intentional and complete when these are empty; they do not substitute fake URLs or a random public Spline scene.

## Validation

The repository is configured for the following validation sequence. If dependencies were not already installed, `npm install` generates the local npm lockfile before these checks.

```bash
npm run check
npm run build
npm run test
```

Playwright covers 375×812, 430×932, 768×1024, 1440×900, and 1920×1080. `tests/visual.spec.ts` provides screenshot checkpoints for the hero, work, about, artifact, lab, contact, a project page, and the mobile menu.

To create/update visual baselines intentionally:

```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```

## Architecture

```text
src/
├── components/
│   ├── about/          # discipline graph
│   ├── global/         # header, nav, cursor, SEO, footer
│   ├── hero/           # R3F scene + fallback + field probe
│   ├── project/        # project-specific system diagrams
│   ├── sections/       # homepage editorial sections
│   ├── spline/         # lazy digital artifact
│   └── work/           # shared project preview system
├── content/projects/   # MDX project source of truth
├── layouts/            # BaseLayout + ProjectLayout
├── lib/
│   ├── math/           # vector field + RK4 integration
│   ├── motion/         # GSAP / Lenis lifecycle
│   └── webgl/          # capability + quality tiers
├── pages/              # homepage + dynamic work routes
└── styles/             # design tokens + editorial CSS
```

## Hero math

The hero is deliberately not a stock sphere/torus/blob. Its central form uses a procedural saddle with travelling folds and ripples. A related vector field controls surrounding trajectories. Animated hot paths use caller-owned buffers so particles and streamline rebuilds do not manufacture new vector arrays every frame.

## Spline

`DigitalArtifact.tsx` lazy-loads the Spline React runtime only when:

- a verified `PUBLIC_SPLINE_SCENE_URL` exists,
- reduced motion is not requested, and
- the viewport is not the lightweight mobile composition.

Without that URL, the designed SVG artifact is the production fallback rather than an empty placeholder.

## Content rules

When adding project information:

- do not infer user counts, adoption, performance, awards, or validation;
- do not turn a planned technology into a shipped-technology claim;
- use the status enum when chronology is uncertain;
- add external URLs only after verifying them.

## Performance notes

- No React state updates inside R3F frame loops.
- Particle positions mutate one `BufferAttribute` in place.
- Streamline RK4 integration reuses position and scratch buffers.
- One shared project-preview animation loop runs only on fine-pointer devices.
- Lenis is disabled for coarse pointers and reduced motion.
- Spline is lazy and has a static fallback.
- WebGL quality is not inferred from viewport width alone.
