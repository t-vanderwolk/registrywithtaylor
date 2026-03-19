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
  const rowGridClass =
    rows.length >= 3
      ? 'sm:[grid-template-columns:repeat(auto-fit,minmax(12.5rem,1fr))]'
      : 'sm:[grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]';

  return (
    <section className="content-widget my-10 rounded-[22px] border border-[rgba(232,154,174,0.24)] bg-[linear-gradient(180deg,#fffdfd_0%,#fcf3f5_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6 md:px-7 md:py-7">
      <h3 className="tmbc-widget-heading font-serif text-[1.32rem] leading-[1.08] tracking-[-0.02em] sm:text-[1.45rem]">
        {title}
      </h3>
      {rows.length > 0 ? (
        <div className={`mt-4 grid gap-3.5 sm:mt-5 sm:gap-4 ${rowGridClass}`}>
          {rows.map((row, index) => (
            <div
              key={`comparison-row-${index}`}
              className="min-w-0 rounded-[18px] border border-[rgba(232,154,174,0.2)] bg-[linear-gradient(180deg,#ffffff_0%,#fff8fb_100%)] px-4 py-4 sm:px-5 sm:py-5"
            >
              <p className="break-words text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)] sm:text-[0.66rem]">
                {row.label}
              </p>
              <Body className="tmbc-widget-copy mt-2.5 text-[0.96rem] leading-7 sm:text-[0.98rem]">{row.value}</Body>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
