# Real media capture plan

This file is not rendered by the portfolio. It defines the genuine screenshots/videos that can be added later through `ProjectMedia` without redesigning the case-study layout.

## Global capture rules

- Use the real application. Never generate a fake product screenshot.
- Use deterministic/synthetic or otherwise public-safe content.
- No `.env`, tokens, auth cookies, private reports, personal grade data, staff emails or private identifiers.
- Hide devtools, browser extensions and debug overlays.
- Prefer clean 1440px desktop captures and 390px mobile captures.
- Export optimized WebP/AVIF derivatives; preserve the untouched source capture separately.
- Every rendered media item needs a useful `alt` and `caption` in `src/data/projects.ts`.
- Video is only for motion that a still image cannot explain; use a poster and user-initiated playback.

## UPPETITE

Suggested media directory: `public/work/uppetite/`

1. `smart-picks.webp`
   - Show origin, optional next destination, break duration and returned choices.
   - Purpose: prove route/time-aware discovery rather than a generic nearby list.

2. `explore-map.webp`
   - Show search/filter/list-map relationship.
   - Purpose: prove the public discovery surface.

3. `my-uppetite.webp`
   - Use synthetic timetable/personal state only.
   - Purpose: show local-first personal tools without exposing a real schedule or journal.

4. `freshie-editorial.webp`
   - Show Freshie / Editor’s Picks distinction if the current UI makes it legible.
   - Purpose: show editorial recommendation as a separate product surface.

5. `places-ops.webp`
   - Use sanitized demo/private-development state only.
   - Purpose: show that community data maintenance has a real operations workflow.

## IMS Academic Hub

Suggested media directory: `public/work/ims/`

1. `map-routing.webp`
   - Use synthetic route start/destination.
   - Show floor/room route and cross-floor behavior.

2. `room-detail.webp`
   - Show a room linking spatial and academic context.

3. `universal-search.webp`
   - Search across room/course/faculty/service entities using public/synthetic data.

4. `gradebook.webp`
   - Synthetic gradebook only.
   - Show categories, what-if mode or target-grade tool without personal academic data.

5. `admin-review.webp`
   - Synthetic import/review records only.
   - Purpose: show stage → verify → publish governance without exposing real institutional moderation data.

## Integration

Add media only to the appropriate `evidence` module in `src/data/projects.ts`:

```ts
media: [
  {
    type: 'image',
    src: '/work/uppetite/smart-picks.webp',
    alt: 'UPPETITE Smart Picks showing origin, next destination and break-duration constraints.',
    caption: 'Smart Picks turns a food search into a time-and-route constraint problem.',
    aspectRatio: '16 / 10',
  },
]
```

`npm run sanity` will fail if a referenced `/work/...` asset does not exist.
