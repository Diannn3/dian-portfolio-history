import type { ProjectModule } from '../types/project';

function slugify(value: string) {
  return value.
  toLowerCase().
  normalize('NFKD').
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-+|-+$/g, '').
  slice(0, 52);
}

export function getCaseSectionId(module: ProjectModule, index: number) {
  return `case-${String(index).padStart(2, '0')}-${slugify(module.title) || module.kind}`;
}

export interface CaseChapter {
  id: string;
  index: string;
  title: string;
  kind: ProjectModule['kind'];
}

/**
 * One ordered chapter list, shared by the sticky chapter navigator, the
 * contextual rail and the URL hashes. Deep links and keyboard activation use
 * the same ids.
 */
export function getCaseChapters(modules: ProjectModule[]): CaseChapter[] {
  const chapters = modules.map((module, i) => ({
    id: getCaseSectionId(module, i + 1),
    index: String(i + 1).padStart(2, '0'),
    title: module.title,
    kind: module.kind
  }));
  chapters.push({
    id: 'case-technology',
    index: String(modules.length + 1).padStart(2, '0'),
    title: 'Technology',
    kind: 'detail'
  });
  return chapters;
}