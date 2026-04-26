import type { CaseStudy } from '@/lib/caseStudies';

function BulletList({ items, variant }: { items: string[]; variant: 'matters' | 'doesnt' }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.slice(0, 5).map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
              variant === 'matters' ? 'bg-[#D986A2]' : 'border border-[#D986A2] bg-white'
            }`}
          />
          <span className="break-words text-[0.98rem] leading-8 text-[#5B4B55]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudyDecisions({ study }: { study: CaseStudy }) {
  return (
    <section id="case-study-decisions" className="space-y-8 scroll-mt-24">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Decision Layer</p>
        <h2 className="mt-4 break-words font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
          What changed once the real life constraints got named
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">What mattered</p>
          <BulletList items={study.whatMatters} variant="matters" />
        </article>

        <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(248,240,234,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">What did not</p>
          <BulletList items={study.whatDoesntMatter} variant="doesnt" />
        </article>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {study.decisions.map((decision, index) => (
          <article
            key={decision.title}
            className="rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] px-5 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.07)] sm:px-6"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Decision {index + 1}</p>
            <h3 className="mt-4 break-words font-serif text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
              {decision.title}
            </h3>
            <p className="mt-4 break-words text-[1rem] font-medium leading-7 text-[#4B3641]">{decision.choice}</p>
            <p className="mt-4 break-words text-[0.95rem] leading-7 text-[#5B4B55]">{decision.reasoning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
