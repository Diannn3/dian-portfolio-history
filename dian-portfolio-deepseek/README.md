# Dian — Vector Atlas Portfolio

A rebuilt creative-developer portfolio using Astro, React, React Three Fiber, Three.js, GSAP, Lenis, and Tailwind CSS 4.

## Design concept

**Vector Atlas** treats mathematics, maps, trajectories, coordinate systems, and data labels as one visual language. The hero is a deterministic vector field with integrated streamlines rather than a generic rotating 3D primitive.

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
npm run test:e2e
```

## Architecture

- Astro-first page shell and static project pages
- React island only for the R3F hero
- Astro Content Collections for verified project content
- GSAP + Lenis motion initialized on Astro router lifecycle events
- Adaptive R3F quality using `PerformanceMonitor`
- Reduced-motion and non-WebGL fallback behavior
- Shared project preview controller rather than one RAF loop per project

## Content integrity

Project entries deliberately use statuses such as **In development**, **Prototype**, and **Concept**. Do not replace these with outcomes, user counts, validation claims, or deployment claims unless those facts are verified.

## Archive

The original DeepSeek response is retained in `docs/archive/DEEPSEEK_ORIGINAL_OUTPUT.txt` for comparison.
