# Frozen visual contract

`visual-contract.spec.ts` owns the deterministic part of the Vector Atlas hero contract. It disables WebGL and requests reduced motion so the automated screenshots measure the authored SVG fallback, typography, copy, responsive layout, and the 1279/1280 Work-stage boundary rather than GPU timing.

The reviewed fallback baselines cover:

- 390 × 844 mobile;
- 768 × 900 tablet;
- 1280 × 900 desktop boundary;
- 1440 × 900 desktop;
- 1440 × 700 short-height desktop.

Do not update snapshots to silence a failure. First inspect the actual image and the diff, confirm that the change is intentional, and run the frozen-surface guard. If the hero or a global runtime/CSS surface changed, stop and review the protected source contract before accepting a new baseline.

```powershell
npm run guard:frozen
npm run test:visual -- --project=desktop-chromium
```

The approved update command is explicit and should be used only after visual review:

```powershell
npm run test:visual -- --project=desktop-chromium --update-snapshots
```

The automated fallback contract does not replace manual review of live WebGL choreography. For a presentation review, capture the live scene at 390, 768, 1280, 1440, and a short-height desktop viewport, and record the browser/OS, quality tier, reduced-motion setting, and whether the capture is WebGL or SVG fallback. Do not check those GPU-dependent captures into the deterministic snapshot directory.
