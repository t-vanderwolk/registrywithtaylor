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
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      {title ? (
        <p className="tmbc-widget-title mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
          {title}
        </p>
      ) : null}
      <Body className="tmbc-widget-copy">{children}</Body>
    </section>
  );
}
