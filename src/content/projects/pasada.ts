import type { Project } from '../../types/project';
import { projectCatalog } from '../../data/projectCatalog';

export const project: Project = {
    ...projectCatalog[2],
    evidenceLevel: 'CONCEPT',
    verification: 'CONCEPT / SYSTEM HYPOTHESIS — no operator partnership, live fleet or measured ETA claimed',
    thesis: 'A jeepney route is a live system that nobody currently gets to see.',
    role: ['Concept', 'Systems design', 'Data visualisation'],
    technologies: [
      { group: 'Spatial', items: ['Route geometry', 'Grid aggregation', 'Map rendering'], intent: 'considered' },
      { group: 'Analytics', items: ['ETA windows', 'Demand modelling'], intent: 'considered' },
      { group: 'Interface', items: ['Passenger surface', 'Operator dashboard'], intent: 'considered' },
    ],
    modules: [
      {
        kind: 'context',
        title: 'Context',
        body:
          'Jeepneys run on shared, informal knowledge: where a queue forms, when the last unit passed, and whether waiting is still rational. Passengers and operators need different readings of the same uncertain route state.',
        items: [
          { label: 'Audience A', value: 'Passenger — should I wait?' },
          { label: 'Audience B', value: 'Cooperative / LGU — where is demand forming?' },
          { label: 'Unit', value: 'Route segment × time bin' },
        ],
      },
      {
        kind: 'flow',
        title: 'Signal flow',
        steps: [
          { label: 'OBSERVE', body: 'Vehicle position and queue reports arrive as sparse, irregular samples.' },
          { label: 'SNAP', body: 'Samples map to route geometry so noisy coordinates become progress along a line.' },
          { label: 'ESTIMATE', body: 'Segment history produces an arrival window rather than a single false-precision number.' },
          { label: 'AGGREGATE', body: 'Demand reports become a spatial/time surface instead of individual passenger traces.' },
          { label: 'PRESENT', body: 'Passengers get a bounded answer; operators get the larger field and its uncertainty.' },
        ],
      },
      {
        kind: 'spatial',
        title: 'Demand as a field',
        body:
          'Aggregate demand is easier to reason about as a surface than as a table of stops. Intensity can show where demand accumulates while contours mark thresholds where dispatch decisions may change.'
      },
      {
        kind: 'validation',
        title: 'Assumptions that must be proven',
        body: 'The interesting system only works if its inputs are worth trusting. These are hypotheses, not results.',
        validation: [
          { label: 'SIGNAL', value: 'Enough vehicles would need to contribute usable location updates at a useful cadence.', state: 'LIMITATION' },
          { label: 'DEMAND', value: 'Passenger-demand signals would need enough density to help without exposing individuals.', state: 'LIMITATION' },
          { label: 'VALUE', value: 'Operators would need to change a real dispatch decision because the aggregate field is visible.', state: 'NOT CLAIMED' },
        ],
      },
      {
        kind: 'openQuestions',
        title: 'Failure modes',
        body: 'The concept is only credible if these failure conditions are designed for before any “live” claim.',
        items: [
          { label: '01', value: 'Stale or sparse GPS can make a clean-looking map more misleading than no map.' },
          { label: '02', value: 'Queue or occupancy reports can be noisy, duplicated or deliberately gamed.' },
          { label: '03', value: 'Too much precision in an ETA can destroy trust when the underlying route state is irregular.' },
          { label: '04', value: 'Individual demand traces create privacy problems that aggregate surfaces should avoid.' },
        ],
      },
      {
        kind: 'reflection',
        title: 'Next evidence',
        body:
          'The next useful work is not another polished dashboard. It is evidence: interviews, route traces and a small data-collection prototype that can show whether the field changes any actual rider or operator decision.',
        items: [
          { label: 'TEST', value: 'Driver / operator workflow interviews' },
          { label: 'MEASURE', value: 'Route trace + ETA error analysis' },
          { label: 'PROBE', value: 'Passenger trust in uncertainty windows' },
        ],
      },
    ],
  };
