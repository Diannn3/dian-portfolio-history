export interface Experiment {
  number: string;
  title: string;
  type: string;
  status: 'LIVE' | 'PROTOTYPE' | 'EXPERIMENT' | 'ARCHIVED';
  year: string;
  description: string;
  url?: string;
}

export const experiments: Experiment[] = [
  {
    number: '01',
    title: 'Vector Field Playground',
    type: 'Interactive',
    status: 'EXPERIMENT',
    year: '2025',
    description: 'Interactive vector field visualisation',
    url: 'https://dian.dev/lab/vector-field',
  },
  {
    number: '02',
    title: 'Gesture Interface',
    type: 'HCI',
    status: 'PROTOTYPE',
    year: '2024',
    description: 'Hand gesture control for spatial UIs',
    url: 'https://dian.dev/lab/gesture',
  },
  {
    number: '03',
    title: 'Local LLM Experiments',
    type: 'AI',
    status: 'EXPERIMENT',
    year: '2025',
    description: 'Running small language models locally',
    url: 'https://dian.dev/lab/local-llm',
  },
  {
    number: '04',
    title: 'Data Sonification',
    type: 'Audio',
    status: 'ARCHIVED',
    year: '2023',
    description: 'Listening to data patterns',
  },
  {
    number: '05',
    title: 'WebGL Map Experiments',
    type: 'Visual',
    status: 'EXPERIMENT',
    year: '2025',
    description: 'Rendering maps with custom WebGL',
    url: 'https://dian.dev/lab/webgl-maps',
  },
  {
    number: '06',
    title: 'Computer Vision Interface',
    type: 'HCI',
    status: 'PROTOTYPE',
    year: '2024',
    description: 'Camera-based interaction prototypes',
    url: 'https://dian.dev/lab/cv-interface',
  },
];
