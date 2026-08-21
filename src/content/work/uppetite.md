---
title: "UPPETITE"
order: 1
status: "active"
year: "Needs Aedrian confirmation"
role: "Needs Aedrian confirmation"
summary: "Route-aware campus food discovery web application engineered around student break schedules and localized vendor schedules around UPLB."
stack:
  - "Astro"
  - "Svelte 5"
  - "TypeScript"
  - "MapLibre GL"
  - "Supabase"
  - "Vercel"
repository: "https://github.com/Diannn3/kain-elbi"
visual:
  kind: "system-study"
  asset: "/studies/uppetite-route-prism.svg"
  alt: "Conceptual system study of UPPETITE route-aware food optimization model"
  caption: "Conceptual system study: isochrone schedule mapping & vendor filtering"
  evidenceState: "conceptual"
---

## 1. Artifact & Honest Evidence State
- **Artifact**: Public GitHub Repository [`github.com/Diannn3/kain-elbi`](https://github.com/Diannn3/kain-elbi)
- **Evidence State**: `conceptual` (System study model; no unverified production screenshots or commercial outcomes published).

## 2. Status, Year, and Exact Role
- **Status**: Active development / case study (`active`).
- **Year**: `Needs Aedrian confirmation`.
- **Role**: `Needs Aedrian confirmation` (Candidate evidence framing: product & system architecture, route-aware data modeling, frontend integration, security & validation).

## 3. Problem & User Context
University students face tight inter-class breaks where walking distance, preparation latency, and vendor operating hours determine meal feasibility. Traditional map tools provide generic distances without accounting for class schedules, real-time operating windows, or campus walking corridors.

## 4. Constraints
- Client-side execution for zero-latency filter operations on constrained mobile network connections.
- Strict isolation of student location coordinates; zero continuous background location tracking.
- Operational resilience against unpredictable vendor schedule variations.

## 5. Architecture
- **Rendering & Shell**: Astro 7 static container delivering zero-JS baseline shell.
- **Interactive Islands**: Svelte 5 runes-powered components for real-time schedule math and isochrone bounds.
- **Geospatial Engine**: MapLibre GL JS with custom campus vector tile overlays.
- **Data & Auth**: Supabase PostgreSQL with Row Level Security (RLS) and stored RPC functions.

## 6. Key Decisions
1. **Time-Constrained Filtering**: Filtering queries first by available time delta rather than pure geographic radius.
2. **Deterministic Schedule Parsing**: Encoding complex opening hours locally using deterministic rule evaluation.
3. **Decoupled Client State**: Keeping route state local to session memory to guarantee student data privacy.

## 7. Known Rejected Alternatives
- *Heavy Client Frameworks*: Full Single-Page Application architectures were rejected due to initial bundle weight on campus cellular networks.
- *Server-Side Location Resolvers*: Server-mediated proximity calculation was rejected to prevent tracking private student travel patterns.

## 8. Implementation Details
The application computes walking isochrones using walking speed approximations ($\sim 1.2\text{ m/s}$) mapped against known campus pathways, scoring vendors by combined transit + turnaround time against user schedule windows.

## 9. Validation & Testing
- Unit test suites covering schedule parsing edge cases (midnights, holidays, exam breaks).
- Synthetic viewport testing for high-density campus food strips.

## 10. Honest Current State
- The public repository documents functional smart-picking, explore views, and staff administrative interfaces.
- `Needs Aedrian confirmation` for verified active user counts, production vendor partnerships, and public deployment URLs.

## 11. Lessons
Designing for mobile students requires prioritizing battery efficiency and fast initial paint over complex GIS rendering overhead.

## 12. Repository & Links
- **Repository**: [github.com/Diannn3/kain-elbi](https://github.com/Diannn3/kain-elbi)
- **Live Deployment**: `Needs Aedrian confirmation`
