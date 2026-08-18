/** Editable site-level content. */

export const identity = {
  name: 'Dian',
  headline: ['BUILDS SYSTEMS', 'BETWEEN EQUATIONS', 'AND INTERFACES.'],
  support:
  'Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces.',
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
  'I study applied mathematics and spend the rest of my time building: community tools, map interfaces, small AI systems, and experiments that only exist to answer one question.',
  'I prefer specific problems in places I know over general problems in the abstract.']

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
  period: 'NOW / 2026',
  entries: [
  { label: 'BUILDING', value: 'community + spatial tools' },
  { label: 'LEARNING', value: 'computational mathematics' },
  { label: 'EXPERIMENTING', value: 'AI agents + spatial interfaces' },
  { label: 'EXPLORING', value: 'creative WebGL' }]

};

export const lab = [
{
  id: 'L01',
  title: 'Vector Field Playground',
  status: 'EXPERIMENT',
  note: 'Integrating trajectories through analytic fields and watching where they disagree.',
  tag: 'WEBGL'
},
{
  id: 'L02',
  title: 'Gesture Interface',
  status: 'CONCEPT',
  note: 'Pointer and hand input as continuous parameters rather than discrete clicks.',
  tag: 'INTERACTION'
},
{
  id: 'L03',
  title: 'Local LLM Experiments',
  status: 'PROTOTYPE',
  note: 'Small models running close to the data they are asked about.',
  tag: 'AI'
},
{
  id: 'L04',
  title: 'WebGL Map Experiments',
  status: 'EXPERIMENT',
  note: 'Tiles, projections and terrain treated as geometry instead of images.',
  tag: 'SPATIAL'
},
{
  id: 'L05',
  title: 'Computer Vision Interface',
  status: 'CONCEPT',
  note: 'Reading the physical world as an input surface.',
  tag: 'AI'
},
{
  id: 'L06',
  title: 'Data Visualisation Experiments',
  status: 'EXPERIMENT',
  note: 'Plotting systems that keep uncertainty visible.',
  tag: 'DATA'
}];


export const tools = [
{ group: 'INTERFACE', items: 'Astro / React / TypeScript' },
{ group: 'COMPUTATION', items: 'Python / NumPy / Pandas' },
{ group: 'SPATIAL', items: 'MapLibre / PMTiles / GIS' },
{ group: 'VISUAL', items: 'Three.js / R3F / Spline / GSAP' },
{ group: 'AI', items: 'LLMs / ML tooling' },
{ group: 'SYSTEMS', items: 'Node / APIs / databases' }];


export const contactLinks = [
{ label: 'GITHUB', value: 'github.com/Diannn3', href: 'https://github.com/Diannn3' }];


/**
 * Spline scene URL. Left empty on purpose — no invented asset URLs.
 * Drop a published Spline scene URL here and the artifact section will load it
 * lazily, with the procedural artifact used as the fallback until then.
 */
export const SPLINE_SCENE_URL = '';