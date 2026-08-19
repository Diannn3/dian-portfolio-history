# Dian — Vector Atlas

A creative developer portfolio generated from a Magic Patterns design and then hardened into a source-backed case-study system.

The visual system is intentionally preserved: custom Three.js / GLSL hero, atlas grid, procedural project previews, GSAP/Lenis motion and reduced-motion fallbacks. The current content pass adds verified project evidence without redesigning those surfaces.

## Getting started

```bash
npm install
npm run dev
```

Quality commands:

```bash
npm run sanity
npm run typecheck
npm run build
```

## Content model

Project content lives in `src/data/projects.ts` and is typed by `src/types/project.ts`.

Case studies support the original modules plus optional evidence-oriented modules:

- `evidence` — implementation facts and optional real media
- `decision` — question, choice, rationale and tradeoff
- `validation` — verified facts, defined checks, limitations and explicit non-claims
- `reflection` — what changed and what comes next

Real project screenshots/videos can be added through `ProjectMedia`; the current portfolio does not fabricate product screenshots when genuine captures are unavailable.

See `CONTENT_EVIDENCE.md` for the internal claim ledger used by the content pass.
