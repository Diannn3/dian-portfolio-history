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
  /** Use exact source dimensions whenever they are known to reserve layout space. */
  width?: number;
  height?: number;
  /** Optional override when source dimensions are not available. */
  aspectRatio?: string;
  /** Screenshots should usually use contain; decorative/photographic media may use cover. */
  fit?: 'contain' | 'cover';
  /** Only the first genuinely above-the-fold evidence image should be marked priority. */
  priority?: boolean;
}

export interface CurrentStateItem {
  label: string;
  value: string;
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
  'context' |
  'interface' |
  'architecture' |
  'flow' |
  'spatial' |
  'detail' |
  'openQuestions' |
  'evidence' |
  'decision' |
  'validation' |
  'reflection';
  title: string;
  body?: string;
  items?: {label: string;value: string;note?: string;}[];
  steps?: {label: string;body: string;}[];
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
  technologies: {group: string;items: string[];intent: 'in use' | 'considered';}[];
  accent: string;
  preview: PreviewKey;
  /** Optional route-level social preview. Omit until a real local image exists. */
  socialImage?: string;
  verification: string;
  evidenceLevel?: EvidenceLevel;
  links?: ProjectLink[];
  /** compact, evidence-bounded snapshot shown near the top of mature case studies */
  currentState?: CurrentStateItem[];
  modules: ProjectModule[];
}