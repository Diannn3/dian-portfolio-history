import type { Project } from '../types/project';

/**
 * Typed project collection. Single source of truth for the work index and the
 * /work/:slug case studies. Nothing here asserts deployment, metrics, users,
 * awards or dates — unverified facts are labelled explicitly.
 */
export const projects: Project[] = [
{
  slug: 'uppetite',
  index: '01',
  title: 'Uppetite Elbi',
  category: 'Community Discovery / Spatial Systems',
  status: 'IN DEVELOPMENT',
  period: 'ONGOING',
  accent: '#d94f2b',
  preview: 'uppetite',
  featured: true,
  verification: 'STATUS / TO VERIFY — no public release claimed',
  thesis:
  'Food discovery in a college town is a structured-data problem wearing a social costume.',
  summary:
  'A community-driven food discovery platform for UPLB and Los Baños, built on structured place data instead of algorithmic feeds.',
  role: ['Concept', 'Data model', 'Interface', 'Map tooling'],
  technologies: [
  { group: 'Spatial', items: ['MapLibre GL', 'PMTiles', 'GeoJSON'], intent: 'considered' },
  { group: 'Interface', items: ['Astro', 'React islands', 'TypeScript'], intent: 'considered' },
  { group: 'Data', items: ['Structured place schema', 'Contribution queue'], intent: 'in use' }],

  modules: [
  {
    kind: 'context',
    title: 'Context',
    body:
    'Los Baños food knowledge lives in group chats, screenshots and word of mouth. It is dense, local, fast-moving — and almost entirely unstructured. The interesting part is not the listing page; it is the schema that lets a community keep a place record honest.',
    items: [
    { label: 'Domain', value: 'Local discovery, UPLB / Los Baños' },
    { label: 'Primary object', value: 'Place record' },
    { label: 'Contribution', value: 'Community submit → verify → publish' }]

  },
  {
    kind: 'architecture',
    title: 'Lightweight mapping architecture',
    body:
    'Vector tiles served as a single static PMTiles archive, so the map has no tile server to keep alive. Place data stays separate from geometry, which keeps edits cheap.',
    nodes: [
    { id: 'submit', label: 'SUBMIT', detail: 'Community entry', x: 0.06, y: 0.24 },
    { id: 'schema', label: 'SCHEMA', detail: 'Typed place record', x: 0.33, y: 0.12 },
    { id: 'verify', label: 'VERIFY', detail: 'Peer confirmation', x: 0.33, y: 0.62 },
    { id: 'tiles', label: 'PMTILES', detail: 'Static vector archive', x: 0.66, y: 0.3 },
    { id: 'client', label: 'CLIENT', detail: 'Map + index UI', x: 0.93, y: 0.5 }],

    edges: [
    { from: 'submit', to: 'schema' },
    { from: 'submit', to: 'verify', label: 'queue' },
    { from: 'verify', to: 'schema', label: 'confirm' },
    { from: 'schema', to: 'tiles' },
    { from: 'tiles', to: 'client' }]

  },
  {
    kind: 'interface',
    title: 'Interface intent',
    body:
    'Two synchronised readings of the same dataset: a spatial one and an editorial one. The map answers "what is near me"; the index answers "what is worth walking for". Neither is a feed.',
    items: [
    { label: 'Map layer', value: 'Clusters → points → place sheet' },
    { label: 'Index layer', value: 'Typographic list, filterable by tag' },
    { label: 'Trust', value: 'Verification state shown on the record, not implied' }]

  },
  {
    kind: 'openQuestions',
    title: 'Open questions',
    items: [
    { label: '01', value: 'How little friction can verification have before it stops meaning anything?' },
    { label: '02', value: 'Should closures decay automatically, or require a human confirmation?' },
    { label: '03', value: 'What is the smallest useful place schema?' }]

  }]

},
{
  slug: 'pasada',
  index: '02',
  title: 'Pasada',
  category: 'Transit Intelligence / Data',
  status: 'CONCEPT',
  period: 'EXPLORATORY',
  accent: '#1f4d46',
  preview: 'pasada',
  featured: true,
  verification: 'STATUS / TO VERIFY — concept work, no operator partnership claimed',
  thesis: 'A jeepney route is a live system that nobody currently gets to see.',
  summary:
  'A smart public transportation concept for jeepneys: live visibility, passenger queues, ETA estimation and demand heatmaps for cooperatives.',
  role: ['Concept', 'Systems design', 'Data visualisation'],
  technologies: [
  { group: 'Spatial', items: ['Route geometry', 'Grid aggregation', 'Map rendering'], intent: 'considered' },
  { group: 'Analytics', items: ['ETA estimation', 'Demand modelling'], intent: 'considered' },
  { group: 'Interface', items: ['Passenger view', 'Operator dashboard'], intent: 'considered' }],

  modules: [
  {
    kind: 'context',
    title: 'Context',
    body:
    'Jeepneys run on shared, informal knowledge: where the queue forms, when the last unit passes, which route actually goes there. Two audiences need two very different surfaces over the same data — a passenger deciding whether to wait, and a cooperative deciding where to put units.',
    items: [
    { label: 'Audience A', value: 'Passenger — should I wait?' },
    { label: 'Audience B', value: 'Cooperative / LGU — where is demand?' },
    { label: 'Unit of analysis', value: 'Route segment × time bin' }]

  },
  {
    kind: 'flow',
    title: 'Signal flow',
    steps: [
    { label: 'OBSERVE', body: 'Unit position and queue reports arrive as sparse, irregular samples.' },
    { label: 'SNAP', body: 'Samples are matched to route geometry, so noise becomes progress along a line.' },
    { label: 'ESTIMATE', body: 'Segment speed history produces an arrival window rather than a single fake number.' },
    { label: 'AGGREGATE', body: 'Boardings and queue reports bin into a demand surface over space and time.' },
    { label: 'PRESENT', body: 'Passengers get one honest window. Operators get the field.' }]

  },
  {
    kind: 'spatial',
    title: 'Demand as a field',
    body:
    'Demand is easier to reason about as a continuous surface than as a table of stops. Heat is intensity; contours are the thresholds where dispatch decisions change.'
  },
  {
    kind: 'openQuestions',
    title: 'Open questions',
    items: [
    { label: '01', value: 'What incentive makes a driver or passenger contribute position data at all?' },
    { label: '02', value: 'How is uncertainty communicated without destroying trust in the ETA?' },
    { label: '03', value: 'Which decisions actually change if the demand field is visible?' }]

  }]

},
{
  slug: 'disaster-response',
  index: '03',
  title: 'Disaster Response Platform',
  category: 'AI Systems / Resilience',
  status: 'PROTOTYPE',
  period: 'ONGOING',
  accent: '#8a3b12',
  preview: 'disaster',
  featured: true,
  verification: 'STATUS / TO VERIFY — not deployed, not validated with responders',
  thesis: 'In an emergency the network is the first thing to fail, so the interface has to be a text message.',
  summary:
  'A connectivity-resilient emergency reporting concept for the Philippines: SMS in, AI parsing in the middle, a prioritised geospatial picture out.',
  role: ['Concept', 'Pipeline design', 'Interface'],
  technologies: [
  { group: 'Ingest', items: ['SMS gateway', 'Offline-tolerant queue'], intent: 'considered' },
  { group: 'AI', items: ['Incident parsing', 'Location resolution', 'Duplicate detection'], intent: 'considered' },
  { group: 'Spatial', items: ['Hazard layers', 'Cluster analysis'], intent: 'considered' }],

  modules: [
  {
    kind: 'context',
    title: 'Context',
    body:
    'A report arrives as free text from a feature phone: a landmark, a rough count, a need. It has no coordinates, no schema, and there may be forty near-duplicates of it. The hard work is turning that into something a coordinator can triage without reading everything.',
    items: [
    { label: 'Input', value: 'Unstructured SMS, low bandwidth' },
    { label: 'Output', value: 'Deduplicated, located, ranked incidents' },
    { label: 'Constraint', value: 'Must degrade, never disappear' }]

  },
  {
    kind: 'architecture',
    title: 'Parsing pipeline',
    body:
    'Each stage is separately inspectable. A coordinator can always see the original message behind a parsed incident — the model proposes, a human disposes.',
    nodes: [
    { id: 'sms', label: 'SMS', detail: 'Free-text report', x: 0.05, y: 0.5 },
    { id: 'parse', label: 'PARSE', detail: 'Type · need · count', x: 0.28, y: 0.22 },
    { id: 'geo', label: 'RESOLVE', detail: 'Landmark → coordinate', x: 0.5, y: 0.6 },
    { id: 'dedupe', label: 'DEDUPE', detail: 'Spatial + textual', x: 0.72, y: 0.24 },
    { id: 'rank', label: 'RANK', detail: 'Urgency estimate', x: 0.93, y: 0.56 }],

    edges: [
    { from: 'sms', to: 'parse' },
    { from: 'parse', to: 'geo' },
    { from: 'geo', to: 'dedupe' },
    { from: 'parse', to: 'dedupe', label: 'text sim.' },
    { from: 'dedupe', to: 'rank' }]

  },
  {
    kind: 'detail',
    title: 'Urgency, honestly',
    body:
    'Urgency is a composite of stated need, hazard exposure at the resolved location, and corroboration count. It is shown as a band with its inputs visible — never a single confident score that hides its reasoning.'
  },
  {
    kind: 'openQuestions',
    title: 'Open questions',
    items: [
    { label: '01', value: 'What is the correct failure mode when the model is unsure of a location?' },
    { label: '02', value: 'How do you dedupe without collapsing two genuinely separate incidents?' },
    { label: '03', value: 'Who is accountable for a ranked list?' }]

  }]

},
{
  slug: 'campus-navigation',
  index: '04',
  title: 'Campus Navigation',
  category: 'Indoor Spatial Interfaces',
  status: 'EXPERIMENT',
  period: 'ONGOING',
  accent: '#3c4a6b',
  preview: 'campus',
  featured: true,
  verification: 'STATUS / TO VERIFY — experimental, floor data incomplete',
  thesis: 'Indoors, a map stops being a plane and becomes a stack.',
  summary:
  'Experimental university navigation: campus routing that continues past the door, into floors, corridors and rooms.',
  role: ['Concept', 'Spatial data', '3D representation'],
  technologies: [
  { group: 'Spatial', items: ['Floor plan geometry', 'Route graph'], intent: 'in use' },
  { group: 'Visual', items: ['Three.js', 'SVG plan rendering'], intent: 'in use' },
  { group: 'Interface', items: ['Level switching', 'Landmark cues'], intent: 'considered' }],

  modules: [
  {
    kind: 'context',
    title: 'Context',
    body:
    'Outdoor routing ends at a building entrance, which is exactly where people get lost. The problem becomes a graph problem across levels, and a representation problem: how do you show three floors at once without turning it into an architectural drawing?',
    items: [
    { label: 'Primitive', value: 'Level · corridor · node' },
    { label: 'Cue', value: 'Landmarks over street names' },
    { label: 'View', value: 'Plan ⇄ exploded stack' }]

  },
  {
    kind: 'spatial',
    title: 'Level stack',
    body:
    'Levels are drawn as offset planes. The active level holds full contrast; the others fall back to hairlines so the route still reads as one continuous path.'
  },
  {
    kind: 'flow',
    title: 'Route finding',
    steps: [
    { label: 'GRAPH', body: 'Corridors and stairwells become an annotated node graph per level.' },
    { label: 'LINK', body: 'Vertical connectors join level graphs with a traversal cost.' },
    { label: 'SOLVE', body: 'Shortest path with a bias toward legible, landmark-rich routes.' },
    { label: 'NARRATE', body: 'Turn the path into human instructions anchored to what you can see.' }]

  },
  {
    kind: 'openQuestions',
    title: 'Open questions',
    items: [
    { label: '01', value: 'How much 3D is useful before it becomes decoration?' },
    { label: '02', value: 'Can floor plans be crowd-corrected the way street maps are?' },
    { label: '03', value: 'What replaces GPS indoors without new hardware?' }]

  }]

}];


export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};