let projectPagePromise: Promise<{
  default: typeof import('../../pages/ProjectPage').ProjectPage;
}> | null = null;

/**
 * The case-study route is split out of the homepage graph. It is fetched on
 * intent — hover or focus on a work row — never eagerly for every visitor.
 */
export function loadProjectPage() {
  projectPagePromise ??= import('../../pages/ProjectPage').then((module) => ({
    default: module.ProjectPage
  }));
  return projectPagePromise;
}

export function preloadProjectPage() {
  void loadProjectPage();
}