---
title: "IMS Academic Hub"
order: 3
status: "prototype"
year: "Needs Aedrian confirmation"
role: "Needs Aedrian confirmation"
summary: "Mobile-first indoor wayfinding and academic record portal for the UPLB Institute of Mathematical Sciences Math Building."
stack:
  - "SvelteKit"
  - "TypeScript"
  - "Supabase"
  - "IndexedDB"
  - "A* Routing"
  - "Vitest"
  - "Playwright"
repository: "https://github.com/Diannn3/ims-app"
liveUrl: "https://ims-app-lime.vercel.app"
visual:
  kind: "system-study"
  asset: "/studies/ims-wayfinding-lattice.svg"
  alt: "Conceptual system study of IMS Indoor A* topological routing lattice"
  caption: "Conceptual system study: schematic room node graph and client-side pathfinding"
  evidenceState: "conceptual"
---

## 1. Artifact & Honest Evidence State
- **Artifact**: Public GitHub Repository [`github.com/Diannn3/ims-app`](https://github.com/Diannn3/ims-app) · Live Prototype [`ims-app-lime.vercel.app`](https://ims-app-lime.vercel.app)
- **Evidence State**: `conceptual` (Schematic indoor pathfinding model; maps are explicitly schematic and unverified by official university surveys).

## 2. Status, Year, and Exact Role
- **Status**: Active development / prototype implementation (`prototype`).
- **Year**: `Needs Aedrian confirmation`.
- **Role**: `Needs Aedrian confirmation` (Candidate evidence framing: information architecture, indoor wayfinding graph modeling, verified-public / private student data boundary).

## 3. Problem & User Context
University math institutes house complex multi-wing layouts with non-sequential room naming, confusing freshmen and visitors. Students require instant room wayfinding coupled with secure, offline-first personal academic tools without institutional bureaucracy.

## 4. Constraints
- Strict Privacy Boundary: Academic records (grades, notes, schedules) must remain exclusively on the student's device.
- Offline Capability: Navigation must function reliably within concrete lecture halls with poor cellular reception.
- Accuracy Transparency: The system must clearly communicate that floor maps are schematic models, avoiding false claims of official architectural blueprints.

## 5. Architecture
- **Framework**: SvelteKit with TypeScript delivering fast server-rendered views.
- **Indoor Routing Graph**: Client-side $A^*$ graph search evaluated across interconnected corridor waypoints and stair transitions.
- **Local Gradebook**: IndexedDB client store with zero remote synchronization for zero-trust academic confidentiality.
- **Verified Public Layer**: Supabase PostgreSQL for verified faculty directories and room schedules.

## 6. Key Decisions
1. **Topological Node Graph**: Modeling building corridors as a mathematical directed graph rather than raster images, enabling lightweight sub-millisecond path computation.
2. **Local-First Academic Data**: Storing personal student records in browser IndexedDB rather than centralized databases to eliminate privacy leak vectors.
3. **Multi-Floor Vertical Cost Functions**: Weighting staircase and ramp traversal dynamically in the $A^*$ heuristic to prefer accessible paths.

## 7. Known Rejected Alternatives
- *Heavy Native Mobile Apps*: Native iOS/Android apps were rejected in favor of progressive web standards to eliminate app store download barriers.
- *Centralized Student Grade Database*: Centralized databases were rejected to prevent holding sensitive student grade records.

## 8. Implementation Details
The indoor route finder represents each room, hallway junction, and stairwell as a vertex $v \in V$. The $A^*$ evaluation function $f(n) = g(n) + h(n)$ uses Manhattan distances modified by vertical penalty factors for floor changes.

## 9. Validation & Testing
- Vitest unit tests verifying graph connectivity, edge weight calculation, and boundary validations.
- Playwright end-to-end tests validating multi-floor route transitions.

## 10. Honest Current State
- Functional prototype with schematic floor navigation, faculty lookup, and local student grade calculator.
- `Needs Aedrian confirmation` for official institutional adoption, room survey measurements, and formal university endorsement.

## 11. Lessons
Topological abstractions provide far better performance and maintainability for indoor wayfinding than attempting pixel-perfect raster rendering.

## 12. Repository & Links
- **Repository**: [github.com/Diannn3/ims-app](https://github.com/Diannn3/ims-app)
- **Live Prototype**: [ims-app-lime.vercel.app](https://ims-app-lime.vercel.app)
