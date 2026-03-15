import type { ReactNode } from 'react';

export default function DecisionHelper({
  question,
  option,
  result,
}: {
  question: ReactNode;
  option: ReactNode;
  result: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f0ea_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Decision helper</p>
      <h3 className="mt-3 font-serif text-[1.55rem] leading-tight tracking-[-0.03em] text-neutral-900">{question}</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-[rgba(196,156,94,0.18)] bg-white px-4 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Option</p>
          <div className="mt-2 text-sm leading-relaxed text-neutral-700">{option}</div>
        </div>

        <div className="rounded-[18px] border border-[rgba(215,161,175,0.22)] bg-[rgba(243,227,232,0.45)] px-4 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Result</p>
          <div className="mt-2 text-sm leading-relaxed text-neutral-700">{result}</div>
        </div>
      </div>
    </section>
  );
}
