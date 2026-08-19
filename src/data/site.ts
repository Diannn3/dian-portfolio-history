/** Editable site-level content. Claims here must stay evidence-bounded. */

export const identity = {
  name: 'Dian',
  headline: ['BUILDS SYSTEMS', 'BETWEEN EQUATIONS', 'AND INTERFACES.'],
  support:
  'Applied Mathematics student building spatial, data and AI-backed tools around real local systems.',
  meta: [
  { key: 'FIELD', value: 'APPLIED MATHEMATICS' },
  { key: 'LOC', value: 'LOS BAÑOS' },
  { key: 'SYSTEM', value: 'ACTIVE' }],

  status: 'BUILDING THINGS'
};

export const about = {
  statement: 'I like problems that sit between equations and interfaces.',
  paragraphs: [
  'Most of what I work on starts as a structure — a field, a graph, a schema — and ends as something a person can actually touch. The translation between those two states is the part I find interesting.',
  'Applied mathematics shapes how I approach software: identify the objects, constraints and relationships first, then decide what the interface needs to expose.',
  'Maps, local data and spatial systems keep recurring because they turn abstract structures into decisions people make in places I actually know.']

};

export const disciplines = [
{ id: 'math', label: 'MATH', x: 0.5, y: 0.12, note: 'Fields, topology, numerical methods.' },
{ id: 'software', label: 'SOFTWARE', x: 0.85, y: 0.34, note: 'Systems, APIs, interface architecture.' },
{ id: 'ai', label: 'AI', x: 0.78, y: 0.76, note: 'Parsing, agents, applied ML tooling.' },
{ id: 'data', label: 'DATA', x: 0.22, y: 0.78, note: 'Schemas, aggregation, honest uncertainty.' },
{ id: 'spatial', label: 'SPATIAL', x: 0.12, y: 0.36, note: 'Maps, projections, indoor geometry.' },
{ id: 'design', label: 'DESIGN', x: 0.5, y: 0.5, note: 'Composition, hierarchy, restraint.' }];


export const disciplineEdges: [string, string][] = [
['math', 'software'],
['math', 'data'],
['math', 'design'],
['software', 'ai'],
['software', 'design'],
['ai', 'data'],
['data', 'spatial'],
['spatial', 'design'],
['spatial', 'math'],
['ai', 'design']];


export const now = {
  period: 'NOW / AUG 2026',
  entries: [
  { label: 'BUILDING', value: 'UPPETITE — route-aware food discovery' },
  { label: 'BUILDING', value: 'IMS Academic Hub — spatial + academic tooling' },
  { label: 'PROTOTYPING', value: 'AedriAIn — hand-tracked spatial desktop' },
  { label: 'EXPLORING', value: 'creative computation + spatial interfaces' }]

};

export interface LabEntry {
  id: string;
  title: string;
  status: string;
  note: string;
  tag: string;
  href: string;
}

export const lab: LabEntry[] = [
{
  id: 'L01',
  title: 'Vector Field Playground',
  status: 'EXPERIMENT',
  note:
  'The same analytic field the hero is built from, exposed directly: seed points integrated with RK4 so the parameters behind the site become adjustable rather than decorative.',
  tag: 'FIELD MATH',
  href: ''
},
{
  id: 'L02',
  title: 'AedriAIn / Spatial Student Desktop',
  status: 'PROTOTYPE',
  note:
  'Webcam hand tracking, pinch manipulation, holographic windows, local state and an Electron shell scaffold. The visualisation here is a diagram of that prototype — this page does not run hand tracking.',
  tag: 'INTERACTION',
  href: 'https://github.com/Diannn3/AedriAIn'
},
{
  id: 'L03',
  title: 'Spline Spatial Study',
  status: 'EXPERIMENT',
  note:
  'Lazy-loading infrastructure for a published Spline scene, kept deliberately empty until a real scene of mine exists. No borrowed or example asset stands in for it.',
  tag: 'SPATIAL',
  href: ''
},
{
  id: 'L04',
  title: 'Motion Studies',
  status: 'EXPERIMENT',
  note:
  'The seven motion verbs this site is built from, demonstrated in isolation so the vocabulary is inspectable instead of implicit.',
  tag: 'MOTION',
  href: ''
}];


export const tools = [
{ group: 'INTERFACE', items: 'Astro / SvelteKit / React / TypeScript' },
{ group: 'COMPUTATION', items: 'Python / NumPy / Pandas' },
{ group: 'SPATIAL', items: 'MapLibre / graph routing / GIS' },
{ group: 'VISUAL', items: 'Three.js / R3F / GSAP / GLSL' },
{ group: 'DATA', items: 'Postgres / Supabase / structured pipelines' },
{ group: 'AI', items: 'LLMs / computer vision / local model experiments' }];


export const contactLinks = [
{ label: 'GITHUB', value: 'github.com/Diannn3', href: 'https://github.com/Diannn3' }];


/**
 * Spline scene URL. Left empty on purpose — no invented asset URLs.
 * Drop a published Spline scene URL here and Lab / L03 will load it lazily,
 * inside the viewport only, with an honest fallback until then.
 */
export const SPLINE_SCENE_URL = '';