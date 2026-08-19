import React, { Suspense, lazy } from 'react';
import { lab } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';
import { LabExperiment } from './LabExperiment';

const VectorFieldPlayground = lazy(() =>
  import('./VectorFieldPlayground').then((module) => ({ default: module.VectorFieldPlayground }))
);
const AedriAInStudy = lazy(() =>
  import('./AedriAInStudy').then((module) => ({ default: module.AedriAInStudy }))
);
const SplineStudy = lazy(() =>
  import('./SplineStudy').then((module) => ({ default: module.SplineStudy }))
);
const MotionStudies = lazy(() =>
  import('./MotionStudies').then((module) => ({ default: module.MotionStudies }))
);

function ExperimentFallback() {
  return <p className="mono-label py-4">LOADING LAB PLATE…</p>;
}

/** LAB is an open notebook. Experiment code is fetched only when its row opens. */
export function Lab() {
  return (
    <SectionFrame
      id="lab"
      index="05"
      title="Lab"
      coordinate="PLATE 05 / NOTEBOOK"
      lede="Four entries: a field experiment, a diagram of a separate prototype, optional Spline infrastructure, and the motion vocabulary used by this portfolio."
    >
      <div className="atlas-grid pb-10">
        <div className="col-span-4 border-t border-hairline md:col-span-8 xl:col-span-11">
          <LabExperiment entry={lab[0]}>
            <Suspense fallback={<ExperimentFallback />}>
              <VectorFieldPlayground />
            </Suspense>
          </LabExperiment>
          <LabExperiment entry={lab[1]}>
            <Suspense fallback={<ExperimentFallback />}>
              <AedriAInStudy />
            </Suspense>
          </LabExperiment>
          <LabExperiment entry={lab[2]}>
            <Suspense fallback={<ExperimentFallback />}>
              <SplineStudy />
            </Suspense>
          </LabExperiment>
          <LabExperiment entry={lab[3]}>
            <Suspense fallback={<ExperimentFallback />}>
              <MotionStudies />
            </Suspense>
          </LabExperiment>
        </div>
      </div>
    </SectionFrame>
  );
}
