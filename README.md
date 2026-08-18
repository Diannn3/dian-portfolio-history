# Dian — Vector Atlas Portfolio

A portfolio rebuilt from the second DeepSeek frontend benchmark. The useful Astro-first structure is retained, while the broken/placeholder implementation has been upgraded around an actual mathematical hero system, current Astro Content Layer, Tailwind 4, R3F performance adaptation, shadcn/Radix island boundaries, GSAP/Lenis cleanup, and honest project content.

## Run

```bash
npm install
npm run dev
```

Validation:

```bash
npm run check
npm run build
npx playwright install
npm test
```

## Environment

Copy `.env.example` to `.env`.

- `SITE_URL` — real production domain when known.
- `PUBLIC_SPLINE_SCENE_URL` — exported Spline `.splinecode` URL. If absent, the intentionally designed fallback is shown; no fake Spline URL is shipped.

## Architecture

- Astro owns pages, content, layouts, SEO, and most UI.
- React islands own WebGL, Spline, the mobile Radix Sheet, and project preview interaction.
- Three.js/R3F hero uses a procedural folded manifold, deterministic vector field, field-integrated streamlines and particles, pointer probe, scroll collapse, reduced-motion handling, and adaptive DPR/quality.
- Spline is a separate lazy-loaded artifact, not a substitute for custom R3F.
- Project content is an Astro 7 Content Layer collection with a `glob()` loader and `entry.id` routing.

## Accuracy

Contact URLs and the Spline scene are intentionally left unconfigured rather than invented. Project status text is conservative and should be updated from real repositories/materials when verified.

See `AUDIT_REPORT.md` for the source audit and implementation decisions.
