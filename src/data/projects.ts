import type { Project } from '../types/project';

/**
 * Typed project collection. Single source of truth for the work index and the
 * /work/:slug case studies. Claims are intentionally bounded to what can be
 * supported by public repositories or explicitly labelled concept work.
 */
export const projects: Project[] = [
  {
    slug: 'uppetite',
    index: '01',
    title: 'UPPETITE Elbi',
    category: 'Community Discovery / Spatial Systems',
    status: 'IN DEVELOPMENT',
    period: 'ONGOING',
    accent: '#d94f2b',
    preview: 'uppetite',
    featured: true,
    evidenceLevel: 'IMPLEMENTATION',
    verification: 'IMPLEMENTATION / PUBLIC SOURCE VERIFIED — no production release or user metrics claimed',
    thesis: 'Food discovery in a college town is a structured-data problem wearing a social costume.',
    summary:
      'A route-aware food discovery system for UPLB and Los Baños that combines structured place data, campus walking context, local personal tools and community-maintained records.',
    role: ['Product direction', 'Data model', 'Interface', 'Map tooling'],
    links: [
      {
        kind: 'repo',
        label: 'Source',
        href: 'https://github.com/Diannn3/kain-elbi',
        note: 'Public UPPETITE repository; historical repository name is kain-elbi.',
      },
      {
        kind: 'docs',
        label: 'System docs',
        href: 'https://github.com/Diannn3/kain-elbi/tree/main/docs',
        note: 'Architecture, privacy and operations documentation.',
      },
    ],
    technologies: [
      { group: 'Interface', items: ['Astro', 'Svelte', 'TypeScript'], intent: 'in use' },
      { group: 'Spatial', items: ['MapLibre GL JS', 'Campus pedestrian graph'], intent: 'in use' },
      { group: 'Data', items: ['Structured place data', 'Python processing pipeline'], intent: 'in use' },
      { group: 'Backend', items: ['Supabase Auth', 'Postgres', 'RLS', 'Edge Functions'], intent: 'in use' },
      { group: 'Quality', items: ['Vitest', 'Playwright', 'axe checks', 'Visual / privacy audits'], intent: 'in use' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'Los Baños food knowledge is dense, local and constantly changing. A useful product cannot stop at “what is nearby?” because students often have a second constraint: where they need to be next, and how much time is actually left between classes.',
        items: [
          { label: 'Domain', value: 'Food discovery around UPLB / Los Baños' },
          { label: 'Core question', value: 'What can I realistically eat before my next commitment?' },
          { label: 'Primary data', value: 'Place records + walking context + verification signals' },
        ],
      },
      {
        kind: 'evidence',
        title: 'What exists now',
        body:
          'The repository has moved beyond a directory prototype. Public discovery, local personal tools and private maintenance workflows now sit on top of the same place system.',
        items: [
          { label: 'FIND', value: 'Route-aware Smart Picks using origin, optional next destination and break duration.' },
          { label: 'EXPLORE', value: 'Search, filters, map/list views, Saved Places and deterministic food-query parsing.' },
          { label: 'FRESHIE', value: 'Editorial guides and owner-curated Editor’s Picks kept separate from ranking signals.' },
          { label: 'PERSONAL', value: 'Timetable, Quick Routes, Saved Places and a private Food Journal stored on-device.' },
          { label: 'OPS', value: 'Invite-only Places Ops for verification priorities, feedback and audited maintenance.' },
        ],
      },
      {
        kind: 'architecture',
        title: 'Static first, identity only where needed',
        body:
          'Most student-facing surfaces can remain prerendered or local-first. Live server identity is reserved for editorial and staff workflows that actually need authorization and mutable private data.',
        nodes: [
          { id: 'public', label: 'PUBLIC', detail: 'Astro + Svelte discovery', x: 0.08, y: 0.22 },
          { id: 'local', label: 'LOCAL', detail: 'Timetable · journal · saved', x: 0.08, y: 0.7 },
          { id: 'data', label: 'PLACE DATA', detail: 'Validated structured records', x: 0.43, y: 0.42 },
          { id: 'route', label: 'ROUTING', detail: 'Supported pedestrian graph', x: 0.68, y: 0.16 },
          { id: 'ops', label: 'PLACES OPS', detail: 'Authenticated review', x: 0.68, y: 0.7 },
          { id: 'db', label: 'SUPABASE', detail: 'Auth · Postgres · RLS', x: 0.93, y: 0.5 },
        ],
        edges: [
          { from: 'data', to: 'public' },
          { from: 'route', to: 'public', label: 'context' },
          { from: 'public', to: 'local', label: 'device state' },
          { from: 'data', to: 'ops' },
          { from: 'ops', to: 'db', label: 'authorized' },
          { from: 'db', to: 'data', label: 'verified edits' },
        ],
      },
      {
        kind: 'decision',
        title: 'Decision / accounts only where identity matters',
        decision: {
          question: 'Should every student need an account to save places, keep a timetable or write a food journal?',
          considered: ['Full account system', 'Anonymous cloud identity', 'Device-local personal state'],
          choice: 'Keep ordinary student state in the browser; use authenticated Supabase sessions only for trusted staff workflows.',
          rationale:
            'Most personal features do not need identity. Keeping them local removes sign-up friction and avoids collecting behavior that the product does not need to operate.',
          tradeoff:
            'Personal state does not automatically follow a student across devices. Cross-device sync would require an explicit future identity decision rather than being smuggled in as a default.',
        },
      },
      {
        kind: 'decision',
        title: 'Decision / do not fabricate a route',
        decision: {
          question: 'What should Smart Picks do when a place cannot be safely snapped to the supported pedestrian graph?',
          considered: ['Straight-line estimate', 'Fallback walking guess', 'Fail closed and expose the coverage gap'],
          choice: 'Refuse to invent graph-based walking output when the place or campus anchor falls outside supported routing coverage.',
          rationale:
            'A recommendation that looks precise but is spatially unsupported is worse than an explicit limitation. Route integrity matters more than filling every result state.',
          tradeoff:
            'Some otherwise useful places cannot participate fully until routing coverage improves. The interface must explain that absence instead of silently pretending certainty.',
        },
      },
      {
        kind: 'flow',
        title: 'How the project changed',
        body: 'The work gradually shifted from a listing interface into a data and operations system.',
        steps: [
          { label: 'DIRECTORY', body: 'Start with structured places instead of scattered recommendations.' },
          { label: 'DISCOVERY', body: 'Add map, search and filters so the same records support multiple ways of finding food.' },
          { label: 'CONTEXT', body: 'Make time and next-destination constraints part of recommendation logic.' },
          { label: 'PERSONAL', body: 'Add useful local state without forcing identity onto ordinary users.' },
          { label: 'GOVERNANCE', body: 'Treat stale records, verification and staff review as product problems rather than cleanup work.' },
        ],
      },
      {
        kind: 'validation',
        title: 'Validation & limits',
        body:
          'The repository defines several quality gates, but this portfolio distinguishes “the test exists” from “a current production run is proven green.” No public usage metrics or production-release claim is made here.',
        validation: [
          { label: 'SOURCE', value: 'Public implementation repository and architecture documentation are inspectable.', state: 'VERIFIED' },
          { label: 'TESTING', value: 'Vitest, Playwright, accessibility, performance, visual and privacy/data audit commands are defined.', state: 'DEFINED' },
          { label: 'DATA', value: 'Place hours, menus, prices, operating status and route coverage can become stale or incomplete.', state: 'LIMITATION' },
          { label: 'RELEASE', value: 'No production launch, adoption count or user metric is asserted by this case study.', state: 'NOT CLAIMED' },
        ],
      },
      {
        kind: 'reflection',
        title: 'Reflection',
        body:
          'I started by treating food discovery as an interface problem. The project increasingly became a data-governance problem: provenance, stale records, routing coverage and who is allowed to change what matter as much as the map itself.',
        items: [
          { label: 'NEXT', value: 'Capture deterministic product screens for this case study from a clean demo state.' },
          { label: 'KEEP', value: 'Make uncertainty visible instead of hiding it behind polished recommendation UI.' },
        ],
      },
    ],
  },
  {
    slug: 'campus-navigation',
    index: '02',
    title: 'IMS Academic Hub',
    category: 'Spatial Systems / Academic Tooling',
    status: 'PROTOTYPE',
    period: 'ONGOING',
    accent: '#3c4a6b',
    preview: 'campus',
    featured: true,
    evidenceLevel: 'IMPLEMENTATION',
    verification: 'PROTOTYPE / PUBLIC SOURCE VERIFIED — floor geometry is schematic + site-unverified',
    thesis: 'Indoors, a map stops being a plane and becomes a stack.',
    summary:
      'A mobile-first IMS student system connecting indoor wayfinding, published academic information and private local grade tools through shared room and space identities.',
    role: ['Product architecture', 'Spatial data', 'Data governance', 'Interface'],
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
  },
  {
    slug: 'pasada',
    index: '03',
    title: 'Pasada',
    category: 'Transit Intelligence / Data',
    status: 'CONCEPT',
    period: 'EXPLORATORY',
    accent: '#1f4d46',
    preview: 'pasada',
    featured: true,
    evidenceLevel: 'CONCEPT',
    verification: 'CONCEPT / SYSTEM HYPOTHESIS — no operator partnership, live fleet or measured ETA claimed',
    thesis: 'A jeepney route is a live system that nobody currently gets to see.',
    summary:
      'A transport-system concept for making route position and aggregate passenger demand legible to both riders and operators without pretending sparse signals are exact.',
    role: ['Concept', 'Systems design', 'Data visualisation'],
    technologies: [
      { group: 'Spatial', items: ['Route geometry', 'Grid aggregation', 'Map rendering'], intent: 'considered' },
      { group: 'Analytics', items: ['ETA windows', 'Demand modelling'], intent: 'considered' },
      { group: 'Interface', items: ['Passenger surface', 'Operator dashboard'], intent: 'considered' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'Jeepneys run on shared, informal knowledge: where a queue forms, when the last unit passed, and whether waiting is still rational. Passengers and operators need different readings of the same uncertain route state.',
        items: [
          { label: 'Audience A', value: 'Passenger — should I wait?' },
          { label: 'Audience B', value: 'Cooperative / LGU — where is demand forming?' },
          { label: 'Unit', value: 'Route segment × time bin' },
        ],
      },
      {
        kind: 'flow',
        title: 'Signal flow',
        steps: [
          { label: 'OBSERVE', body: 'Vehicle position and queue reports arrive as sparse, irregular samples.' },
          { label: 'SNAP', body: 'Samples map to route geometry so noisy coordinates become progress along a line.' },
          { label: 'ESTIMATE', body: 'Segment history produces an arrival window rather than a single false-precision number.' },
          { label: 'AGGREGATE', body: 'Demand reports become a spatial/time surface instead of individual passenger traces.' },
          { label: 'PRESENT', body: 'Passengers get a bounded answer; operators get the larger field and its uncertainty.' },
        ],
      },
      {
        kind: 'spatial',
        title: 'Demand as a field',
        body:
          'Aggregate demand is easier to reason about as a surface than as a table of stops. Intensity can show where demand accumulates while contours mark thresholds where dispatch decisions may change.'
      },
      {
        kind: 'validation',
        title: 'Assumptions that must be proven',
        body: 'The interesting system only works if its inputs are worth trusting. These are hypotheses, not results.',
        validation: [
          { label: 'SIGNAL', value: 'Enough vehicles would need to contribute usable location updates at a useful cadence.', state: 'LIMITATION' },
          { label: 'DEMAND', value: 'Passenger-demand signals would need enough density to help without exposing individuals.', state: 'LIMITATION' },
          { label: 'VALUE', value: 'Operators would need to change a real dispatch decision because the aggregate field is visible.', state: 'NOT CLAIMED' },
        ],
      },
      {
        kind: 'openQuestions',
        title: 'Failure modes',
        body: 'The concept is only credible if these failure conditions are designed for before any “live” claim.',
        items: [
          { label: '01', value: 'Stale or sparse GPS can make a clean-looking map more misleading than no map.' },
          { label: '02', value: 'Queue or occupancy reports can be noisy, duplicated or deliberately gamed.' },
          { label: '03', value: 'Too much precision in an ETA can destroy trust when the underlying route state is irregular.' },
          { label: '04', value: 'Individual demand traces create privacy problems that aggregate surfaces should avoid.' },
        ],
      },
      {
        kind: 'reflection',
        title: 'Next evidence',
        body:
          'The next useful work is not another polished dashboard. It is evidence: interviews, route traces and a small data-collection prototype that can show whether the field changes any actual rider or operator decision.',
        items: [
          { label: 'TEST', value: 'Driver / operator workflow interviews' },
          { label: 'MEASURE', value: 'Route trace + ETA error analysis' },
          { label: 'PROBE', value: 'Passenger trust in uncertainty windows' },
        ],
      },
    ],
  },
  {
    slug: 'disaster-response',
    index: '04',
    title: 'Disaster Response Platform',
    category: 'AI Systems / Resilience',
    status: 'CONCEPT',
    period: 'EXPLORATORY',
    accent: '#8a3b12',
    preview: 'disaster',
    featured: true,
    evidenceLevel: 'CONCEPT',
    verification: 'CONCEPT / NO PUBLIC IMPLEMENTATION EVIDENCE FOUND — no deployment or responder validation claimed',
    thesis: 'In an emergency the network is the first thing to fail, so the interface has to survive without assuming an app.',
    summary:
      'A connectivity-resilient emergency reporting concept for the Philippines: constrained-channel reports in, inspectable incident structure and geospatial triage support out.',
    role: ['Concept', 'Pipeline design', 'Interface'],
    technologies: [
      { group: 'Ingest', items: ['SMS gateway', 'Offline-tolerant queue'], intent: 'considered' },
      { group: 'AI', items: ['Incident parsing', 'Location resolution', 'Duplicate detection'], intent: 'considered' },
      { group: 'Spatial', items: ['Hazard layers', 'Vulnerability context'], intent: 'considered' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'An emergency report may arrive as a short message containing a landmark, a rough count and a need. It has no guaranteed coordinates or schema, and many reports can describe the same event. The system question is how to structure that uncertainty without hiding the original evidence.',
        items: [
          { label: 'Input', value: 'Free text over constrained channels' },
          { label: 'Output', value: 'Located, grouped, inspectable incident candidates' },
          { label: 'Constraint', value: 'Capability should degrade rather than disappear with connectivity' },
        ],
      },
      {
        kind: 'architecture',
        title: 'Inspectable parsing pipeline',
        body:
          'The concept separates parsing, location resolution, duplicate grouping and prioritization so each stage can expose its inputs and uncertainty instead of collapsing everything into one opaque model answer.',
        nodes: [
          { id: 'message', label: 'REPORT', detail: 'Original message + media', x: 0.05, y: 0.5 },
          { id: 'parse', label: 'PARSE', detail: 'Hazard · need · people', x: 0.28, y: 0.22 },
          { id: 'geo', label: 'RESOLVE', detail: 'Landmark → candidate area', x: 0.5, y: 0.62 },
          { id: 'group', label: 'GROUP', detail: 'Possible duplicate reports', x: 0.72, y: 0.24 },
          { id: 'triage', label: 'TRIAGE', detail: 'Human-review queue', x: 0.93, y: 0.56 },
        ],
        edges: [
          { from: 'message', to: 'parse' },
          { from: 'parse', to: 'geo' },
          { from: 'geo', to: 'group' },
          { from: 'parse', to: 'group', label: 'text evidence' },
          { from: 'group', to: 'triage' },
        ],
      },
      {
        kind: 'decision',
        title: 'Decision / keep authority human',
        decision: {
          question: 'What should the AI be allowed to decide in a high-stakes emergency workflow?',
          considered: ['Automatic dispatch', 'Opaque priority score', 'Inspectable recommendations for human authority'],
          choice: 'Use AI to structure, resolve, group and surface evidence; keep operational authority with accountable human responders.',
          rationale:
            'The useful role of the model is reducing coordination load, not disguising uncertain inference as command authority. Original reports and intermediate reasoning inputs must remain inspectable.',
          tradeoff:
            'Human review keeps a bottleneck in the loop. The system therefore has to improve triage throughput without pretending that removing accountability is an optimization.',
        },
      },
      {
        kind: 'detail',
        title: 'Urgency, honestly',
        body:
          'If urgency is estimated at all, the interface should expose the inputs behind the band — stated need, location confidence, hazard context and corroboration — rather than present a single confident number whose provenance disappears.'
      },
      {
        kind: 'validation',
        title: 'What is not proven',
        body: 'No public implementation repository was found during this portfolio audit, so this page stays intentionally on the concept side of the line.',
        validation: [
          { label: 'DEPLOYMENT', value: 'No operational deployment is claimed.', state: 'NOT CLAIMED' },
          { label: 'RESPONDERS', value: 'No responder workflow validation is claimed.', state: 'NOT CLAIMED' },
          { label: 'ACCURACY', value: 'No location, deduplication or prioritization accuracy metric is claimed.', state: 'NOT CLAIMED' },
          { label: 'RISK', value: 'Ambiguous landmarks, malicious reports, stale hazard data and model hallucination remain core failure modes.', state: 'LIMITATION' },
        ],
      },
      {
        kind: 'openQuestions',
        title: 'Validation required',
        items: [
          { label: '01', value: 'Responder workflow review: does the structured incident actually reduce coordination load?' },
          { label: '02', value: 'Location-resolution evaluation across local landmarks, spelling variation and mixed language.' },
          { label: '03', value: 'Adversarial duplicate testing without collapsing two genuinely separate incidents.' },
          { label: '04', value: 'Degraded-network simulation across the channels the concept expects to survive.' },
        ],
      },
    ],
  }

];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
