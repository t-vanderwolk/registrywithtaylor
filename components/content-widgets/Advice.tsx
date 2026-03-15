import type { ReactNode } from 'react';
import { Body } from '@/components/ui/MarketingHeading';

export default function Advice({
  title,
  children,
}: {
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(215,161,175,0.22)] bg-white px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <div className="border-l-4 border-l-[var(--tmbc-blog-blush)] pl-4 sm:pl-5">
        {title ? (
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">
            {title}
          </p>
        ) : null}
        <Body className="text-charcoal/85">{children}</Body>
      </div>
    </section>
  );
}
