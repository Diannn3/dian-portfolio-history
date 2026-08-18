export const site = {
  name: 'Dian',
  title: 'Dian — Mathematics, systems & spatial interfaces',
  description: 'Applied mathematics student and builder working across software, AI, maps, data, and interaction design.',
  location: 'Los Baños, Philippines',
};

export const nowItems = [
  { label: 'BUILDING', value: 'community mapping tools and spatial interfaces' },
  { label: 'LEARNING', value: 'machine learning systems and computational mathematics' },
  { label: 'EXPERIMENTING', value: 'local AI, agents, WebGL, and unconventional interfaces' },
  { label: 'CURRENTLY', value: 'turning ambitious student projects into sharper products' },
];

export const experiments = [
  { index: '01', title: 'Vector Field Playground', type: 'Creative coding', status: 'EXPERIMENT' },
  { index: '02', title: 'Gesture Interface', type: 'Computer vision', status: 'PROTOTYPE' },
  { index: '03', title: 'Local LLM Bench', type: 'AI systems', status: 'EXPERIMENT' },
  { index: '04', title: 'WebGL Map Studies', type: 'Spatial graphics', status: 'EXPERIMENT' },
  { index: '05', title: 'Campus Wayfinding', type: 'Navigation', status: 'PROTOTYPE' },
  { index: '06', title: 'Data Sonification', type: 'Data / audio', status: 'CONCEPT' },
];

export const skills = [
  ['INTERFACE', 'Astro / React / TypeScript'],
  ['COMPUTATION', 'Python / NumPy / Pandas'],
  ['SPATIAL', 'MapLibre / PMTiles / GIS'],
  ['VISUAL SYSTEMS', 'Three.js / WebGL / GSAP'],
  ['AI / ML', 'LLMs / scikit-learn / local inference'],
  ['SYSTEMS', 'Node / APIs / databases'],
] as const;
