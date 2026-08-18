export type ProjectStatus = 'CONCEPT' | 'PROTOTYPE' | 'IN DEVELOPMENT' | 'EXPERIMENT';

export type PreviewKey = 'uppetite' | 'pasada' | 'disaster' | 'campus';

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
  /** normalized 0-1 coordinates inside the diagram frame */
  x: number;
  y: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProjectModule {
  kind: 'context' | 'interface' | 'architecture' | 'flow' | 'spatial' | 'detail' | 'openQuestions' | 'status';
  title: string;
  body?: string;
  items?: {label: string;value: string;}[];
  steps?: {label: string;body: string;}[];
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  status: ProjectStatus;
  /** honest: no dates are invented, this is a working-period label */
  period: string;
  thesis: string;
  summary: string;
  role: string[];
  /** technologies under consideration / in use — labelled by intent, never as a deployment claim */
  technologies: {group: string;items: string[];intent: 'in use' | 'considered';}[];
  accent: string;
  preview: PreviewKey;
  featured: boolean;
  verification: string;
  modules: ProjectModule[];
}