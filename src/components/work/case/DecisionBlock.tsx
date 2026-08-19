import React from 'react';
import type { ProjectDecision } from '../../../types/project';

export function DecisionBlock({ decision }: { decision: ProjectDecision }) {
  return (
    <div className="atlas-grid mt-8 gap-y-8 md:mt-12">
      <div className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-1">
        <span className="mono-label block">QUESTION</span>
        <p className="mt-3 font-heading text-display-3 leading-snug text-ink">
          {decision.question}
        </p>
        {decision.considered?.length ? (
          <div className="mt-8 border-t border-hairline pt-3">
            <span className="mono-label block">CONSIDERED</span>
            <ul className="mt-3 space-y-2">
              {decision.considered.map((item) => (
                <li key={item} className="text-read-sm text-graphite">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <dl className="col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-7">
        {[
          ['CHOICE', decision.choice],
          ['WHY', decision.rationale],
          ['TRADEOFF', decision.tradeoff],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-hairline py-4 md:grid md:grid-cols-[8rem_1fr] md:gap-6">
            <dt className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">{label}</dt>
            <dd className="mt-2 text-read text-ink md:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
