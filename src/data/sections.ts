import type { SectionMeta } from '../contexts/AtlasContext';

/**
 * Transitional home registry. The section order is a contract shared by the
 * observer, Atlas menu, and future consolidation work; `tools` remains in the
 * registry during CORE so its information does not silently disappear.
 */
export const homeSections: SectionMeta[] = [
  { id: 'work', index: '01', label: 'SELECTED WORK' },
  { id: 'about', index: '02', label: 'ABOUT' },
  { id: 'now', index: '03', label: 'CURRENT VECTOR' },
  { id: 'artifact', index: '04', label: 'DIGITAL ARTIFACT' },
  { id: 'lab', index: '05', label: 'LAB' },
  { id: 'tools', index: '06', label: 'TOOLS' },
  { id: 'contact', index: '07', label: 'CONTACT' },
];

export const sectionNav = homeSections.map(({ id, index, label }) => ({ id, index, label }));
