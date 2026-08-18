# Verification Checklist

## Source checks completed

- [x] Relative imports resolve to files in the repository.
- [x] TS/TSX syntax transpile check completed with the locally available TypeScript compiler.
- [x] No fake Spline scene URL remains.
- [x] No invented contact URLs remain.
- [x] No `Math.random()` remains in the R3F field systems.
- [x] Astro Content Layer uses a `glob()` loader and `entry.id` routes.
- [x] React/Astro context boundaries are isolated correctly in source.
- [x] Lenis has an explicit destroy path.
- [x] Three.js resources manually constructed outside normal JSX ownership are explicitly disposed where needed.

## Commands to run on a machine with normal npm access

```bash
npm install
npm run check
npm run build
npx playwright install chromium
npm test
```

## Current environment limitation

`npm install --package-lock-only --ignore-scripts --no-audit --no-fund` repeatedly timed out in the execution environment before dependency resolution completed. Therefore the full Astro compiler/build/browser test suite is **not** marked as passing here.

The dependency set deliberately uses TypeScript 6.0.3 instead of TypeScript 7 because Astro's current `astro check` language-server path does not yet support TS7's native compiler API.
