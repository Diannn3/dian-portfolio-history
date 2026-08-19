import type { PreviewKey, ProjectStatus } from '../types/project';

export interface ProjectCatalogEntry {
  slug: string;
  index: string;
  title: string;
  category: string;
  status: ProjectStatus;
  period: string;
  accent: string;
  preview: PreviewKey;
  summary: string;
  socialImage?: string;
}

/**
 * Lightweight metadata for the home ledger, route metadata and cross-project
 * navigation. Long-form case-study content stays lazy.
 */
export const projectCatalog: ProjectCatalogEntry[] = [
{
  slug: 'uppetite',
  index: '01',
  title: 'UPPETITE Elbi',
  category: 'Community Discovery / Spatial Systems',
  status: 'IN DEVELOPMENT',
  period: 'ONGOING',
  accent: '#d94f2b',
  preview: 'uppetite',
  summary:
  'A route-aware food discovery system for UPLB and Los Baños that combines structured place data, campus walking context, local personal tools and community-maintained records.'
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
  summary:
  'A mobile-first IMS student system connecting indoor wayfinding, published academic information and private local grade tools through shared room and space identities.'
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
  summary:
  'A transport-system concept exploring how passenger uncertainty and aggregate demand signals could be modeled around jeepney routes without pretending the data already exists.'
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
  summary:
  'A connectivity-resilient emergency-reporting concept for the Philippines that structures messages into incidents while keeping uncertainty and human authority explicit.'
}];


export function getCatalogProject(slug?: string) {
  return projectCatalog.find((project) => project.slug === slug);
}

export function nextCatalogProject(slug: string) {
  const index = projectCatalog.findIndex((project) => project.slug === slug);
  return projectCatalog[(index + 1 + projectCatalog.length) % projectCatalog.length];
}