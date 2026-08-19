import type { ProjectModule } from '../types/project';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 52);
}

export function getCaseSectionId(module: ProjectModule, index: number) {
  return `case-${String(index).padStart(2, '0')}-${slugify(module.title) || module.kind}`;
}
