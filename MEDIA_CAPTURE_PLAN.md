# Real media capture / ingestion plan

This file is not rendered by the portfolio. It defines the evidence images/videos that may be added through `ProjectMedia` without redesigning the Vector Atlas case-study layout.

## Rules

- Use the real application or a repository-committed visual baseline. Never generate a fake product screenshot.
- Prefer deterministic/synthetic or otherwise public-safe content.
- No `.env`, tokens, auth cookies, private reports, personal grade data, staff emails or private identifiers.
- Hide devtools, browser extensions and debug overlays.
- Preserve the untouched source capture; optimize a derivative for the portfolio.
- Every rendered media item needs a useful `alt` and `caption` in the relevant `src/content/projects/*.ts` file.
- Provide `width` + `height` when known so layout space is reserved before the image loads.
- Use `fit: 'contain'` for interface screenshots unless a deliberate crop has been reviewed.
- Mark `priority: true` only for a genuine above-the-fold lead image. All other images stay lazy.
- Video is only for motion that a still cannot explain; use a poster and user-initiated playback (`preload="none"`).

## UPPETITE — verified repository media sources

The UPPETITE repository already contains genuine Playwright visual-regression baselines under:

`app/tests/e2e/visual.spec.ts-snapshots/`

Verified canonical snapshot paths include:

- `explore-discovery-mobile-390.png`
- `explore-results-mobile-390.png`
- `home-mobile-390.png`
- `smart-picks-list-mobile-390.png`
- `smart-picks-map-mobile-390-visual-chromium-win32.png`

These are evidence sources, not automatic portfolio assets. Some Playwright snapshots are full-page/tall captures, so visually inspect and, when appropriate, produce a deterministic viewport crop from the real application rather than forcing a full-page image into a 16:10 frame.

Suggested portfolio directory: `public/work/uppetite/`

1. `smart-picks.webp`
   - Origin + optional next destination + break duration + returned choices.
   - Purpose: prove route/time-aware discovery rather than a generic nearby list.

2. `explore-map.webp`
   - Search/filter/list-map relationship.
   - Purpose: prove the public spatial discovery surface.

3. `my-uppetite.webp`
   - Synthetic timetable/personal state only.
   - Purpose: show local-first personal tools without exposing a real schedule or journal.

4. `freshie-editorial.webp`
   - Freshie / Editor’s Picks distinction when the current UI makes it legible.

5. `places-ops.webp`
   - Sanitized demo/private-development state only.
   - Purpose: show the operations workflow without exposing private submissions.

## IMS Academic Hub

The IMS repository does not currently contain an equivalent committed Playwright visual-baseline directory. It does contain:

- `third-preview.png` — candidate image; inspect before portfolio use.
- `reference/ground-floor-source.jpeg`
- `reference/second-floor-source.jpeg`
- `reference/third-floor-source.jpeg`

The three `reference/*` files are source orientation graphics, **not** proof of the current application interface and must not be presented as app screenshots.

Suggested portfolio directory: `public/work/ims/`

1. `map-routing.webp`
   - Synthetic route start/destination; show floor/room route and cross-floor behavior.

2. `room-detail.webp`
   - Show a room linking spatial and academic context.

3. `universal-search.webp`
   - Search across room/course/faculty/service entities using public/synthetic data.

4. `gradebook.webp`
   - Synthetic gradebook only; show categories, what-if mode or target-grade tool.

5. `admin-review.webp`
   - Synthetic import/review records only; show stage → verify → publish governance.

## Integration

Add media only to the appropriate `evidence` module in the corresponding project file, for example `src/content/projects/uppetite.ts`:

```ts
media: [
  {
    type: 'image',
    src: '/work/uppetite/smart-picks.webp',
    alt: 'UPPETITE Smart Picks showing origin, next destination and break-duration constraints.',
    caption: 'Smart Picks turns a food search into a time-and-route constraint problem.',
    width: 1440,
    height: 900,
    fit: 'contain',
  },
]
```

`npm run sanity` fails if a referenced local `/work/...` media asset does not exist.
