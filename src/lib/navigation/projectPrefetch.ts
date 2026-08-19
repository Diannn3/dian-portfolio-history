let projectPagePromise: Promise<{ default: typeof import('../../pages/ProjectPage').ProjectPage }> | null = null;

/** Shared lazy boundary so route rendering and intent-prefetch reuse the same request. */
export function loadProjectPage() {
  projectPagePromise ??= import('../../pages/ProjectPage').then((module) => ({
    default: module.ProjectPage,
  }));
  return projectPagePromise;
}

export function preloadProjectPage() {
  void loadProjectPage();
}
