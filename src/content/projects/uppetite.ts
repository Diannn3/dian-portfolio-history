import type { Project } from '../../types/project';
import { projectCatalog } from '../../data/projectCatalog';

export const project: Project = {
  ...projectCatalog[0],
  evidenceLevel: 'IMPLEMENTATION',
  verification: 'IMPLEMENTATION / PUBLIC SOURCE VERIFIED — no production release or user metrics claimed',
  thesis: 'Food discovery in a college town is a structured-data problem wearing a social costume.',
  role: ['Product direction', 'Data model', 'Interface', 'Map tooling'],
  currentState: [
  { label: 'DISCOVERY', value: 'Route-aware Smart Picks combine origin, optional next destination and available break time.' },
  { label: 'EXPLORE', value: 'Search, filters and MapLibre map/list views operate on the same structured place records.' },
  { label: 'PERSONAL', value: 'Timetable, Quick Routes, Saved Places and Food Journal state remain on-device for ordinary users.' },
  { label: 'OPERATIONS', value: 'Authenticated staff workflows handle verification, feedback and editorial maintenance.' }],

  links: [
  {
    kind: 'repo',
    label: 'Source',
    href: 'https://github.com/Diannn3/kain-elbi',
    note: 'Public UPPETITE repository; historical repository name is kain-elbi.'
  },
  {
    kind: 'docs',
    label: 'System docs',
    href: 'https://github.com/Diannn3/kain-elbi/tree/main/docs',
    note: 'Architecture, privacy and operations documentation.'
  }],

  technologies: [
  { group: 'Interface', items: ['Astro', 'Svelte', 'TypeScript'], intent: 'in use' },
  { group: 'Spatial', items: ['MapLibre GL JS', 'Campus pedestrian graph'], intent: 'in use' },
  { group: 'Data', items: ['Structured place data', 'Python processing pipeline'], intent: 'in use' },
  { group: 'Backend', items: ['Supabase Auth', 'Postgres', 'RLS', 'Edge Functions'], intent: 'in use' },
  { group: 'Quality', items: ['Vitest', 'Playwright', 'axe checks', 'Visual / privacy audits'], intent: 'in use' }],

  modules: [
  {
    kind: 'context',
    title: 'Context',
    body:
    'Los Baños food knowledge is dense, local and constantly changing. A useful product cannot stop at “what is nearby?” because students often have a second constraint: where they need to be next, and how much time is actually left between classes.',
    items: [
    { label: 'Domain', value: 'Food discovery around UPLB / Los Baños' },
    { label: 'Core question', value: 'What can I realistically eat before my next commitment?' },
    { label: 'Primary data', value: 'Place records + walking context + verification signals' }]

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
    { label: 'OPS', value: 'Invite-only Places Ops for verification priorities, feedback and audited maintenance.' }]

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
    { id: 'db', label: 'SUPABASE', detail: 'Auth · Postgres · RLS', x: 0.93, y: 0.5 }],

    edges: [
    { from: 'data', to: 'public' },
    { from: 'route', to: 'public', label: 'context' },
    { from: 'public', to: 'local', label: 'device state' },
    { from: 'data', to: 'ops' },
    { from: 'ops', to: 'db', label: 'authorized' },
    { from: 'db', to: 'data', label: 'verified edits' }]

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
      'Personal state does not automatically follow a student across devices. Cross-device sync would require an explicit future identity decision rather than being smuggled in as a default.'
    }
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
      'Some otherwise useful places cannot participate fully until routing coverage improves. The interface must explain that absence instead of silently pretending certainty.'
    }
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
    { label: 'GOVERNANCE', body: 'Treat stale records, verification and staff review as product problems rather than cleanup work.' }]

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
    { label: 'RELEASE', value: 'No production launch, adoption count or user metric is asserted by this case study.', state: 'NOT CLAIMED' }]

  },
  {
    kind: 'reflection',
    title: 'Reflection',
    body:
    'I started by treating food discovery as an interface problem. The project increasingly became a data-governance problem: provenance, stale records, routing coverage and who is allowed to change what matter as much as the map itself.',
    items: [
    { label: 'NEXT', value: 'Capture deterministic product screens for this case study from a clean demo state.' },
    { label: 'KEEP', value: 'Make uncertainty visible instead of hiding it behind polished recommendation UI.' }]

  }]

};