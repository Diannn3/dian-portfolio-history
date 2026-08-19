import React from 'react';

/** A restrained, external practice feature — deliberately not a project route. */
export function StudioPractice() {
  return (
    <article data-studio-practice className="border-y border-hairline py-8 md:py-10">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.42fr)] md:gap-10">
        <div>
          <p className="mono-label mb-3 text-accent">STUDIO PRACTICE</p>
          <h3 className="font-heading text-display-2 font-medium uppercase leading-[0.95] text-ink">
            Aescent Web Studio
          </h3>
          <p className="mono-label mt-3">LIVE STUDIO SITE · DOCUMENTED PRACTICE</p>
          <p className="mt-6 max-w-[58ch] text-read text-graphite">
            A client-facing web practice for shaping local-business ideas into clear, responsive public interfaces and the delivery structure around them.
          </p>
          <p className="mt-4 max-w-[58ch] text-read-sm text-graphite">
            Dian is the founder; this portfolio records the practice as implementation and operating evidence, not as a claim about client outcomes.
          </p>
          <ul className="mt-6 grid gap-3 border-t border-hairline pt-4 text-read-sm text-graphite md:grid-cols-3 md:gap-5">
            <li><span className="mono-label block text-ink">01</span>Astro implementation and responsive editorial systems.</li>
            <li><span className="mono-label block text-ink">02</span>Client-facing service architecture and handoff structure.</li>
            <li><span className="mono-label block text-ink">03</span>Public work documented without outcome inflation.</li>
          </ul>
          <a
            href="https://aescentwebstudios.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="mono-label link-underline mt-7 inline-block text-ink"
            data-cursor="external"
          >
            VISIT AESCENT ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="flex min-h-[12rem] items-center justify-center border border-[#d4af37]/40 bg-[#0a0a0a] p-8 md:min-h-full">
          <img
            src="/work/aescent/aescent-monogram.png"
            alt="Aescent Web Studio monogram"
            width={1260}
            height={1260}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-[12rem] object-contain"
          />
        </div>
      </div>
      <p className="mono-label mt-6 border-t border-hairline pt-3">
        SOURCE BOUNDARY / LIVE DESTINATION VERIFIED · PUBLIC REPOSITORY PARITY NOT CLAIMED
      </p>
    </article>
  );
}
