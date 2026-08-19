export type ProjectStatus = 'CONCEPT' | 'PROTOTYPE' | 'IN DEVELOPMENT' | 'EXPERIMENT';

export type PreviewKey = 'uppetite' | 'pasada' | 'disaster' | 'campus';

export type EvidenceLevel = 'IMPLEMENTATION' | 'PROTOTYPE' | 'CONCEPT';

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

export interface ProjectLink {
  kind: 'repo' | 'docs' | 'demo' | 'video';
  label: string;
  href: string;
  note?: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  caption: string;
  poster?: string;
  aspectRatio?: string;
}

export interface ProjectDecision {
  question: string;
  choice: string;
  rationale: string;
  tradeoff: string;
  considered?: string[];
}

export interface ValidationItem {
  label: string;
  value: string;
  state: 'VERIFIED' | 'DEFINED' | 'LIMITATION' | 'NOT CLAIMED';
}

export interface ProjectModule {
  kind:
    | 'context'
    | 'interface'
    | 'architecture'
    | 'flow'
    | 'spatial'
    | 'detail'
    | 'openQuestions'
    | 'status'
    | 'evidence'
    | 'decision'
    | 'validation'
    | 'reflection';
  title: string;
  body?: string;
  items?: { label: string; value: string; note?: string }[];
  steps?: { label: string; body: string }[];
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  media?: ProjectMedia[];
  decision?: ProjectDecision;
  validation?: ValidationItem[];
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
  technologies: { group: string; items: string[]; intent: 'in use' | 'considered' }[];
  accent: string;
  preview: PreviewKey;
  featured: boolean;
  verification: string;
  evidenceLevel?: EvidenceLevel;
  links?: ProjectLink[];
  modules: ProjectModule[];
}
