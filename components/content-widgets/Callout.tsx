import type { ReactNode } from 'react';
import { Body } from '@/components/ui/MarketingHeading';

export default function Callout({
  title,
  children,
}: {
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f0f1_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      {title ? (
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
          {title}
        </p>
      ) : null}
      <Body className="text-charcoal/85">{children}</Body>
    </section>
  );
}
