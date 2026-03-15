import type { ReactNode } from 'react';
import { Body } from '@/components/ui/MarketingHeading';

type ComparisonRow = {
  label: ReactNode;
  value: ReactNode;
};

export default function Comparison({
  title,
  rows,
}: {
  title: ReactNode;
  rows: ComparisonRow[];
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,#fffdfa_0%,#fcf7f4_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <h3 className="font-serif text-[1.45rem] leading-tight tracking-[-0.02em] text-neutral-900">{title}</h3>
      {rows.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rows.map((row, index) => (
            <div
              key={`comparison-row-${index}`}
              className="rounded-[20px] border border-[rgba(215,161,175,0.2)] bg-white px-4 py-4"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                {row.label}
              </p>
              <Body className="mt-2 text-charcoal/85">{row.value}</Body>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
