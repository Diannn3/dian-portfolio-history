import React from 'react';
import { lab } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';
import { LabExperiment } from './LabExperiment';
import { VectorFieldPlayground } from './VectorFieldPlayground';
import { AedriAInStudy } from './AedriAInStudy';
import { SplineStudy } from './SplineStudy';
import { MotionStudies } from './MotionStudies';

/**
 * LAB — a notebook, not a showcase. Every entry stays collapsed until opened, so
 * nothing computes or renders in the background.
 */
export function Lab() {
  return (
    <SectionFrame
      id="lab"
      index="05"
      title="Lab"
      coordinate="PLATE 05 / NOTEBOOK"
      lede="Four entries. Each one states what it actually is — an experiment, a diagram of a separate prototype, empty infrastructure, or a motion reference.">

      <div className="atlas-grid pb-10">
        <div className="col-span-4 border-t border-hairline md:col-span-8 xl:col-span-11">
          <LabExperiment entry={lab[0]}>
            <VectorFieldPlayground />
          </LabExperiment>
          <LabExperiment entry={lab[1]}>
            <AedriAInStudy />
          </LabExperiment>
          <LabExperiment entry={lab[2]}>
            <SplineStudy />
          </LabExperiment>
          <LabExperiment entry={lab[3]}>
            <MotionStudies />
          </LabExperiment>
        </div>
      </div>
    </SectionFrame>);

}