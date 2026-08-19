import catalog from './projectCatalog.json';
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
 * Lightweight metadata for the home/work index, build-time route metadata and
 * cross-project navigation. Long-form case-study content stays lazy.
 */
export const projectCatalog = catalog as ProjectCatalogEntry[];

export function getCatalogProject(slug?: string) {
  return projectCatalog.find((project) => project.slug === slug);
}

export function nextCatalogProject(slug: string) {
  const index = projectCatalog.findIndex((project) => project.slug === slug);
  return projectCatalog[(index + 1 + projectCatalog.length) % projectCatalog.length];
}
