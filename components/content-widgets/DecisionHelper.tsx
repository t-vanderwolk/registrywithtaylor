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
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9eef2_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">Decision helper</p>
      <h3 className="tmbc-widget-heading mt-3 font-serif text-[1.55rem] leading-tight tracking-[-0.03em]">{question}</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[linear-gradient(180deg,#ffffff_0%,#fff7fa_100%)] px-4 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">Option</p>
          <div className="tmbc-widget-copy mt-2 text-sm leading-relaxed">{option}</div>
        </div>

        <div className="rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[rgba(243,227,232,0.6)] px-4 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">Result</p>
          <div className="tmbc-widget-copy mt-2 text-sm leading-relaxed">{result}</div>
        </div>
      </div>
    </section>
  );
}
