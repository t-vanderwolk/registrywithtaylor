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
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(215,161,175,0.22)] bg-white px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">FAQ</p>
      <h3 className="mt-3 font-serif text-[1.45rem] leading-tight tracking-[-0.02em] text-neutral-900">{question}</h3>
      <Body className="mt-4 text-charcoal/85">{answer}</Body>
    </section>
  );
}
