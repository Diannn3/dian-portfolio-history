/** Editable site-level content. */

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
  'Maps, local data and spatial systems keep recurring because they turn abstract structures into decisions people make in places I actually know.'],

  /** annotation ticks in the centre column, one per paragraph above */
  annotations: [
  { id: '001', label: 'STRUCTURE → SURFACE' },
  { id: '002', label: 'OBJECTS BEFORE UI' },
  { id: '003', label: 'PLACES I KNOW' }]

};

export const disciplines = [
{ id: 'math', label: 'MATH', x: 0.5, y: 0.12, z: 0.85, note: 'Fields, topology, numerical methods.', method: 'F(x,y,z,t) · RK4' },
{ id: 'software', label: 'SOFTWARE', x: 0.85, y: 0.34, z: 0.35, note: 'Systems, APIs, interface architecture.', method: 'BOUNDARIES · STATE' },
{ id: 'ai', label: 'AI', x: 0.78, y: 0.76, z: 0.15, note: 'Parsing, agents, applied ML tooling.', method: 'PARSE · RESOLVE · GROUP' },
{ id: 'data', label: 'DATA', x: 0.22, y: 0.78, z: 0.5, note: 'Schemas, aggregation, honest uncertainty.', method: 'PROVENANCE · BINS' },
{ id: 'spatial', label: 'SPATIAL', x: 0.12, y: 0.36, z: 0.7, note: 'Maps, projections, indoor geometry.', method: 'GRAPH · PROJECTION' },
{ id: 'design', label: 'DESIGN', x: 0.5, y: 0.5, z: 1, note: 'Composition, hierarchy, restraint.', method: 'GRID · SCALE · SILENCE' }];


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
  { id: 'uppetite', state: 'BUILDING', value: 'UPPETITE — route-aware food discovery' },
  { id: 'ims', state: 'BUILDING', value: 'IMS Academic Hub — spatial + academic tooling' },
  { id: 'aedriain', state: 'PROTOTYPING', value: 'AedriAIn — hand-tracked spatial desktop' },
  { id: 'creative', state: 'EXPLORING', value: 'creative computation + spatial interfaces' }]

};

export const lab = [
{
  id: 'L01',
  title: 'Vector Field Playground',
  status: 'EXPERIMENT',
  note: 'The portfolio hero itself: analytic fields, trajectories, particles and a custom GLSL manifold treated as one interactive system.',
  tag: 'WEBGL',
  href: '',
  /** interactive module rendered inside the expanded row */
  experiment: 'field' as const,
  notes: [
  { label: 'FIELD', value: 'F = (A·sin z + C·cos 1.15y, B·sin 1.1x + A·cos z, C·sin 0.95y + B·cos x)' },
  { label: 'INTEGRATION', value: 'RK4, fixed step, trajectories precomputed once from a seeded PRNG.' },
  { label: 'LIMIT', value: 'Divergence-free by construction, so it cannot model sources or sinks.' }]

},
{
  id: 'L02',
  title: 'AedriAIn / Spatial Student Desktop',
  status: 'PROTOTYPE',
  note: 'Webcam hand tracking, pinch manipulation, holographic windows, local state and an Electron shell scaffold.',
  tag: 'INTERACTION',
  href: 'https://github.com/Diannn3/AedriAIn',
  experiment: 'hands' as const,
  notes: [
  { label: 'TRACKING', value: 'MediaPipe hand landmarks running in a Web Worker.' },
  { label: 'INPUT', value: 'Pinch/drag and two-hand transform, with a mouse fallback.' },
  { label: 'SHELL', value: 'Electron scaffolding and locally persisted window state.' },
  { label: 'LIMIT', value: 'Prototype 01 uses React 19 + R3F; it is a separate codebase, not this one.' }]

},
{
  id: 'L03',
  title: 'Spline / Spatial Study',
  status: 'EXPERIMENT',
  note: 'Infrastructure for one authored spatial scene: lazy runtime, viewport activation, poster and reduced-motion fallbacks.',
  tag: 'SPATIAL',
  href: '',
  experiment: 'spline' as const,
  notes: [
  { label: 'STATE', value: 'No published scene is configured, so the procedural artifact stands in.' },
  { label: 'LOADING', value: 'Runtime is dynamically imported on intersection, never in the route bundle.' },
  { label: 'RULE', value: 'No placeholder scene URL is invented to fill the slot.' }]

},
{
  id: 'L04',
  title: 'Motion / Scroll Studies',
  status: 'EXPERIMENT',
  note: 'The seven-verb motion vocabulary this site is built from, isolated so each one can be judged on its own.',
  tag: 'MOTION',
  href: '',
  experiment: 'motion' as const,
  notes: [
  { label: 'SOURCE', value: 'Every verb below is the one actually used elsewhere on this page.' },
  { label: 'TIMING', value: 'One GSAP ticker drives Lenis, the DOM work and every WebGL loop.' },
  { label: 'LIMIT', value: 'Reduced motion replaces all seven with their final state.' }]

}];


export const tools = [
{
  group: 'INTERFACE',
  items: 'Astro / SvelteKit / React / TypeScript',
  list: ['Astro', 'SvelteKit', 'React', 'TypeScript'],
  relates: ['VISUAL', 'SPATIAL']
},
{
  group: 'COMPUTATION',
  items: 'Python / NumPy / Pandas',
  list: ['Python', 'NumPy', 'Pandas'],
  relates: ['DATA', 'AI']
},
{
  group: 'SPATIAL',
  items: 'MapLibre / graph routing / GIS',
  list: ['MapLibre', 'graph routing', 'GIS'],
  relates: ['DATA', 'INTERFACE']
},
{
  group: 'VISUAL',
  items: 'Three.js / R3F / GSAP / GLSL',
  list: ['Three.js', 'R3F', 'GSAP', 'GLSL'],
  relates: ['INTERFACE', 'COMPUTATION']
},
{
  group: 'DATA',
  items: 'Postgres / Supabase / structured pipelines',
  list: ['Postgres', 'Supabase', 'structured pipelines'],
  relates: ['COMPUTATION', 'SPATIAL']
},
{
  group: 'AI',
  items: 'LLMs / computer vision / local model experiments',
  list: ['LLMs', 'computer vision', 'local model experiments'],
  relates: ['COMPUTATION', 'VISUAL']
}];


export const contactLinks = [
{ label: 'GITHUB', value: 'github.com/Diannn3', href: 'https://github.com/Diannn3' }];


/**
 * Spline scene URL. Left empty on purpose — no invented asset URLs.
 * Drop a published Spline scene URL here and the artifact section will load it
 * lazily, with the procedural artifact used as the fallback until then.
 */
export const SPLINE_SCENE_URL = '';