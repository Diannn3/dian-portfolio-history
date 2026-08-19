import type { Project } from '../../types/project';
import { projectCatalog } from '../../data/projectCatalog';

export const project: Project = {
    ...projectCatalog[3],
    evidenceLevel: 'CONCEPT',
    verification: 'CONCEPT / NO PUBLIC IMPLEMENTATION EVIDENCE FOUND — no deployment or responder validation claimed',
    thesis: 'In an emergency the network is the first thing to fail, so the interface has to survive without assuming an app.',
    role: ['Concept', 'Pipeline design', 'Interface'],
    technologies: [
      { group: 'Ingest', items: ['SMS gateway', 'Offline-tolerant queue'], intent: 'considered' },
      { group: 'AI', items: ['Incident parsing', 'Location resolution', 'Duplicate detection'], intent: 'considered' },
      { group: 'Spatial', items: ['Hazard layers', 'Vulnerability context'], intent: 'considered' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'An emergency report may arrive as a short message containing a landmark, a rough count and a need. It has no guaranteed coordinates or schema, and many reports can describe the same event. The system question is how to structure that uncertainty without hiding the original evidence.',
        items: [
          { label: 'Input', value: 'Free text over constrained channels' },
          { label: 'Output', value: 'Located, grouped, inspectable incident candidates' },
          { label: 'Constraint', value: 'Capability should degrade rather than disappear with connectivity' },
        ],
      },
      {
        kind: 'architecture',
        title: 'Inspectable parsing pipeline',
        body:
          'The concept separates parsing, location resolution, duplicate grouping and prioritization so each stage can expose its inputs and uncertainty instead of collapsing everything into one opaque model answer.',
        nodes: [
          { id: 'message', label: 'REPORT', detail: 'Original message + media', x: 0.05, y: 0.5 },
          { id: 'parse', label: 'PARSE', detail: 'Hazard · need · people', x: 0.28, y: 0.22 },
          { id: 'geo', label: 'RESOLVE', detail: 'Landmark → candidate area', x: 0.5, y: 0.62 },
          { id: 'group', label: 'GROUP', detail: 'Possible duplicate reports', x: 0.72, y: 0.24 },
          { id: 'triage', label: 'TRIAGE', detail: 'Human-review queue', x: 0.93, y: 0.56 },
        ],
        edges: [
          { from: 'message', to: 'parse' },
          { from: 'parse', to: 'geo' },
          { from: 'geo', to: 'group' },
          { from: 'parse', to: 'group', label: 'text evidence' },
          { from: 'group', to: 'triage' },
        ],
      },
      {
        kind: 'decision',
        title: 'Decision / keep authority human',
        decision: {
          question: 'What should the AI be allowed to decide in a high-stakes emergency workflow?',
          considered: ['Automatic dispatch', 'Opaque priority score', 'Inspectable recommendations for human authority'],
          choice: 'Use AI to structure, resolve, group and surface evidence; keep operational authority with accountable human responders.',
          rationale:
            'The useful role of the model is reducing coordination load, not disguising uncertain inference as command authority. Original reports and intermediate reasoning inputs must remain inspectable.',
          tradeoff:
            'Human review keeps a bottleneck in the loop. The system therefore has to improve triage throughput without pretending that removing accountability is an optimization.',
        },
      },
      {
        kind: 'detail',
        title: 'Urgency, honestly',
        body:
          'If urgency is estimated at all, the interface should expose the inputs behind the band — stated need, location confidence, hazard context and corroboration — rather than present a single confident number whose provenance disappears.'
      },
      {
        kind: 'validation',
        title: 'What is not proven',
        body: 'No public implementation repository was found during this portfolio audit, so this page stays intentionally on the concept side of the line.',
        validation: [
          { label: 'DEPLOYMENT', value: 'No operational deployment is claimed.', state: 'NOT CLAIMED' },
          { label: 'RESPONDERS', value: 'No responder workflow validation is claimed.', state: 'NOT CLAIMED' },
          { label: 'ACCURACY', value: 'No location, deduplication or prioritization accuracy metric is claimed.', state: 'NOT CLAIMED' },
          { label: 'RISK', value: 'Ambiguous landmarks, malicious reports, stale hazard data and model hallucination remain core failure modes.', state: 'LIMITATION' },
        ],
      },
      {
        kind: 'openQuestions',
        title: 'Validation required',
        items: [
          { label: '01', value: 'Responder workflow review: does the structured incident actually reduce coordination load?' },
          { label: '02', value: 'Location-resolution evaluation across local landmarks, spelling variation and mixed language.' },
          { label: '03', value: 'Adversarial duplicate testing without collapsing two genuinely separate incidents.' },
          { label: '04', value: 'Degraded-network simulation across the channels the concept expects to survive.' },
        ],
      },
    ],
  };
