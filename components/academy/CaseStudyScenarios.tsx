import type { CaseStudy } from '@/lib/caseStudies';

export default function CaseStudyScenarios({ study }: { study: CaseStudy }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
      <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Real-Life Scenarios</p>
        <h2 className="mt-4 break-words font-serif text-[clamp(1.85rem,3.4vw,2.45rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
          The moments that made the decision clearer
        </h2>
        <div className="mt-6 space-y-4">
          {study.scenarios.slice(0, 3).map((scenario, index) => (
            <div key={scenario} className="rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.76)] px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Scenario {index + 1}</p>
              <p className="mt-3 break-words text-[0.98rem] leading-7 text-[#5B4B55]">{scenario}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(248,240,234,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">How it played out</p>
          <p className="mt-5 break-words text-[1rem] leading-8 text-[#4B3641] sm:text-[1.05rem]">{study.realLife}</p>
        </article>

        <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Taylor's note</p>
          <p className="mt-5 break-words font-serif text-[1.45rem] leading-[1.18] tracking-[-0.03em] text-[#2F2430] sm:text-[1.75rem]">
            {study.taylorsNote}
          </p>
        </article>
      </div>
    </section>
  );
}
