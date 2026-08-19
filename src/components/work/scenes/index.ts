import type { PreviewKey } from '../../../types/project';
import type { StageNode } from './shared';
import { createUppetiteScene } from './uppetite';
import { createImsScene } from './ims';
import { createPasadaScene } from './pasada';
import { createDisasterScene } from './disaster';

export type { StageNode };

/** One stage, four project-specific geometries. Built and disposed on demand. */
export function createStageScene(variant: PreviewKey, reduced: boolean): StageNode {
  switch (variant) {
    case 'uppetite':
      return createUppetiteScene(reduced);
    case 'campus':
      return createImsScene(reduced);
    case 'pasada':
      return createPasadaScene(reduced);
    case 'disaster':
    default:
      return createDisasterScene(reduced);
  }
}