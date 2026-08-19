import type { Project } from '../types/project';

const loaders: Record<string, () => Promise<Project>> = {
  uppetite: () => import('./projects/uppetite').then((module) => module.project),
  'campus-navigation': () => import('./projects/ims').then((module) => module.project),
  pasada: () => import('./projects/pasada').then((module) => module.project),
  'disaster-response': () => import('./projects/disaster').then((module) => module.project)
};

export function hasProject(slug?: string): slug is string {
  return Boolean(slug && loaders[slug]);
}

const pending = new Map<string, Promise<Project>>();

export function loadProject(slug: string) {
  const loader = loaders[slug];
  if (!loader) return Promise.resolve<Project | undefined>(undefined);
  let request = pending.get(slug);
  if (!request) {
    request = loader();
    pending.set(slug, request);
  }
  return request;
}

export function preloadProject(slug: string) {
  void loadProject(slug);
}