'use client';

import type { StrollerAcademyLane } from '@/lib/guides/strollerAcademy';

export default function PlanningResultCard({
  primaryLane,
  alsoConsiderLane,
  whyThisFits,
  watchouts,
  onReset,
}: {
  primaryLane: StrollerAcademyLane;
  alsoConsiderLane: StrollerAcademyLane | null;
  whyThisFits: string[];
  watchouts: string[];
  onReset: () => void;
}) {
  return (
    <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(251,245,239,0.98),rgba(255,250,252,0.95))] p-6 shadow-[0_22px_70px_rgba(58,36,43,0.10)] sm:p-7">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">Planning Result</p>
      <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">Primary Match: {primaryLane.title}</h3>
      <p className="mt-4 text-base leading-8 text-[#5B4B55]">{primaryLane.definition}</p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-[1.3rem] bg-white/88 px-5 py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Why This Fits</p>
          <div className="mt-3 space-y-2">
            {whyThisFits.map((reason) => (
              <p key={reason} className="text-sm leading-7 text-[#4B3641]">
                {reason}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[1.3rem] bg-[rgba(252,247,249,0.92)] px-5 py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Watchouts</p>
          <div className="mt-3 space-y-2">
            {watchouts.map((watchout) => (
              <p key={watchout} className="text-sm leading-7 text-[#4B3641]">
                {watchout}
              </p>
            ))}
          </div>
        </div>

        {alsoConsiderLane ? (
          <div className="rounded-[1.3rem] bg-[rgba(250,244,246,0.92)] px-5 py-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Also Consider</p>
            <p className="mt-3 text-base font-medium text-[#2F2430]">{alsoConsiderLane.title}</p>
            <p className="mt-2 text-sm leading-7 text-[#4B3641]">{alsoConsiderLane.definition}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={primaryLane.href}
          className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
        >
          Explore {primaryLane.shortTitle} Lane
        </a>
        <span className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(215,161,175,0.18)] bg-white/82 px-5 py-3 font-mono text-[0.68rem] text-[#7C5663]">
          [CTA_PLACEHOLDER: Save This Lane]
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-transparent px-5 py-3 text-sm font-medium text-[#4B3641] transition duration-300 hover:bg-white/70"
        >
          Start over
        </button>
      </div>
    </section>
  );
}
