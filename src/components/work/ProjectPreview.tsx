import React from 'react';
import type { PreviewKey } from '../../types/project';
import { UppetitePreview } from './previews/UppetitePreview';
import { PasadaPreview } from './previews/PasadaPreview';
import { DisasterPreview } from './previews/DisasterPreview';
import { CampusPreview } from './previews/CampusPreview';

const map: Record<PreviewKey, () => JSX.Element> = {
  uppetite: UppetitePreview,
  pasada: PasadaPreview,
  disaster: DisasterPreview,
  campus: CampusPreview
};

export function ProjectPreview({ preview }: {preview: PreviewKey;}) {
  const Component = map[preview];
  return <Component />;
}