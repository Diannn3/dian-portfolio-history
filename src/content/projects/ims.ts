import type { Project } from '../../types/project';
import { projectCatalog } from '../../data/projectCatalog';

export const project: Project = {
    ...projectCatalog[1],
    evidenceLevel: 'IMPLEMENTATION',
    verification: 'PROTOTYPE / PUBLIC SOURCE VERIFIED — floor geometry is schematic + site-unverified',
    thesis: 'Indoors, a map stops being a plane and becomes a stack.',
    role: ['Product architecture', 'Spatial data', 'Data governance', 'Interface'],
    currentState: [
      { label: 'SPATIAL', value: 'A three-floor semantic map connects room identities to client-side graph routing and deep links.' },
      { label: 'INSTITUTIONAL', value: 'Published courses, faculty, rooms, schedules and services share controlled academic data boundaries.' },
      { label: 'PERSONAL', value: 'Gradebooks, what-if calculations and target solving stay local in IndexedDB rather than institutional storage.' },
      { label: 'GOVERNANCE', value: 'Imported academic records move through staging, review, verification and publication instead of becoming public automatically.' },
    ],
    links: [
      {
        kind: 'repo',
        label: 'Source',
        href: 'https://github.com/Diannn3/ims-app',
        note: 'Public IMS Academic Hub repository.',
      },
      {
        kind: 'docs',
        label: 'System docs',
        href: 'https://github.com/Diannn3/ims-app/tree/master/docs',
        note: 'Architecture, import, map and validation documentation.',
      },
    ],
    technologies: [
      { group: 'Interface', items: ['SvelteKit', 'Svelte', 'TypeScript'], intent: 'in use' },
      { group: 'Spatial', items: ['Semantic SVG floor maps', 'A* route graph'], intent: 'in use' },
      { group: 'Data', items: ['Supabase', 'Postgres', 'RLS', 'CSV staging / review'], intent: 'in use' },
      { group: 'Personal', items: ['IndexedDB gradebooks', 'What-if / target-grade tools'], intent: 'in use' },
      { group: 'Quality', items: ['Vitest', 'Playwright', 'pgTAP', 'Static verification gates'], intent: 'in use' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'Outdoor routing ends at a building entrance, while academic information usually lives in a separate set of pages, documents and schedules. The prototype treats a room as a shared identity that can connect where a place is, what happens there and what a student can do next.',
        items: [
          { label: 'Spatial', value: 'Floors, rooms, route graph, location anchors' },
          { label: 'Institutional', value: 'Courses, faculty, schedules, services, provenance' },
          { label: 'Personal', value: 'Local gradebooks and what-if tools' },
        ],
      },
      {
        kind: 'evidence',
        title: 'What exists now',
        body:
          'The current repository contains all three domains rather than only the original map experiment.',
        items: [
          { label: 'MAP', value: 'Interactive three-floor schematic, room search, pan/zoom, A* routing and cross-floor segments.' },
          { label: 'SEARCH', value: 'Universal search across rooms, courses, faculty, services, research and resources.' },
          { label: 'ACADEMICS', value: 'Published-only academic views with provenance and freshness boundaries.' },
          { label: 'GRADES', value: 'Local multi-gradebook workspace with what-if mode, targets and backup/restore.' },
          { label: 'ADMIN', value: 'Staged CSV import, review queue, publication controls and auditable source records.' },
        ],
      },
      {
        kind: 'architecture',
        title: 'Three systems, one room identity',
        body:
          'Permanent room and space IDs let independent domains meet without forcing every feature into one database model. Static map geometry can remain useful even if institutional data is empty or unavailable.',
        nodes: [
          { id: 'map', label: 'SPATIAL', detail: 'SVG + route graph', x: 0.08, y: 0.22 },
          { id: 'room', label: 'ROOM ID', detail: 'Shared stable identity', x: 0.4, y: 0.48 },
          { id: 'academic', label: 'ACADEMIC', detail: 'Published institutional data', x: 0.72, y: 0.18 },
          { id: 'personal', label: 'PERSONAL', detail: 'Local grade workspace', x: 0.72, y: 0.72 },
          { id: 'admin', label: 'GOVERNANCE', detail: 'Stage · verify · publish', x: 0.95, y: 0.45 },
        ],
        edges: [
          { from: 'map', to: 'room' },
          { from: 'room', to: 'academic' },
          { from: 'room', to: 'personal', label: 'context' },
          { from: 'academic', to: 'admin', label: 'publication' },
          { from: 'admin', to: 'academic', label: 'verified data' },
        ],
      },
      {
        kind: 'decision',
        title: 'Decision / keep one SvelteKit runtime',
        decision: {
          question: 'Should the app use an Astro shell plus islands, or keep the interaction-heavy product in one SvelteKit model?',
          considered: ['Astro shell + interactive islands', 'Single SvelteKit client/server runtime'],
          choice: 'Keep the application on SvelteKit.',
          rationale:
            'Map state, IndexedDB tools, SSR authentication, form actions and admin workflows already share enough interaction and server context that another framework boundary would add coordination cost without solving a real product problem.',
          tradeoff:
            'The project gives up some static-site separation that would be attractive for a mostly editorial product. That is accepted because this application behaves more like a tool than a content site.',
        },
      },
      {
        kind: 'decision',
        title: 'Decision / personal grades stay local',
        decision: {
          question: 'Should a student’s private gradebook live in the same Supabase system as institutional academic data?',
          considered: ['Cloud grade storage', 'Authenticated student profiles', 'Browser-local IndexedDB workspace'],
          choice: 'Keep gradebooks in IndexedDB and keep them out of Supabase.',
          rationale:
            'The grade calculator does not need institutional identity to work. Local storage keeps a sensitive personal tool independent from the public academic-data system.',
          tradeoff:
            'Cross-device synchronization is not automatic. Backup and restore become explicit user actions instead of a hidden cloud dependency.',
        },
      },
      {
        kind: 'flow',
        title: 'Institutional data fails closed',
        body:
          'Importing a file is not the same thing as publishing truth. New or changed records move through a review boundary before student-facing pages may expose them.',
        steps: [
          { label: 'IMPORT', body: 'Parse CSV with explicit size, header and normalization constraints.' },
          { label: 'STAGE', body: 'Resolve references, record issues and compute stable source/content identities.' },
          { label: 'APPLY', body: 'Admin applies a valid batch transactionally; changed data remains non-public.' },
          { label: 'VERIFY', body: 'Editor reviews the resulting institutional record and its provenance.' },
          { label: 'PUBLISH', body: 'Only an authorized publication step exposes verified records to public views.' },
        ],
      },
      {
        kind: 'validation',
        title: 'Validation & hard limits',
        body:
          'This prototype is unusually strict about what the map is not. The supplied floor references are orientation graphics, not architectural drawings, so route geometry is deliberately described as schematic and site-unverified.',
        validation: [
          { label: 'SOURCE', value: 'Public implementation repository, test scripts and architecture docs are inspectable.', state: 'VERIFIED' },
          { label: 'MAP', value: 'Current geometry and route graph are schematic; a physical walkthrough is still required.', state: 'LIMITATION' },
          { label: 'SAFETY', value: 'No evacuation, certified accessibility or emergency-routing claim is made.', state: 'NOT CLAIMED' },
          { label: 'TESTING', value: 'Vitest, Playwright, pgTAP and multiple dependency-free verification scripts are defined.', state: 'DEFINED' },
        ],
      },
      {
        kind: 'reflection',
        title: 'Reflection',
        body:
          'The original navigation experiment became more interesting when the room stopped being only geometry. A stable space identity can connect a route, a class, a faculty office, a service and a student action — while each domain keeps its own trust boundary.',
        items: [
          { label: 'NEXT', value: 'Physically verify doors, corridors, stairs and room relationships before strengthening any routing claim.' },
          { label: 'KEEP', value: 'Make published institutional information fail closed when provenance or review state is uncertain.' },
        ],
      },
    ],
  };
