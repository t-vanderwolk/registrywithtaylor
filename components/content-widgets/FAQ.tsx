import type { ReactNode } from 'react';
import { Body } from '@/components/ui/MarketingHeading';

export default function FAQ({
  question,
  answer,
}: {
  question: ReactNode;
  answer: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf1f5_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">FAQ</p>
      <h3 className="tmbc-widget-heading mt-3 font-serif text-[1.45rem] leading-tight tracking-[-0.02em]">{question}</h3>
      <Body className="tmbc-widget-copy mt-4">{answer}</Body>
    </section>
  );
}
