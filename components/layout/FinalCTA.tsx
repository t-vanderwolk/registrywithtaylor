import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import { Body, Eyebrow, H2 } from '@/components/ui/MarketingHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type FinalCTAProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  note?: string;
  ctaAnalyticsLabel?: string;
};

export default function FinalCTA({
  className = '',
  eyebrow = 'Request Consultation',
  title = 'Figure out what actually fits.',
  description = 'One thoughtful conversation can help you sort registry picks, gear decisions, nursery setup, and what can wait.',
  ctaLabel = 'Request Consultation',
  ctaHref = '/consultation',
  note = 'Complimentary 45-minute consultation',
  ctaAnalyticsLabel,
}: FinalCTAProps) {
  const sectionClassName = [
    'relative z-10 border-t border-[rgba(0,0,0,0.06)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MarketingSection tone="blush" container="wide" spacing="spacious" className={sectionClassName}>
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(248,228,232,0.76)_100%)] px-6 py-10 shadow-[0_28px_70px_rgba(184,116,138,0.14)] sm:px-8 md:px-12 md:py-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0)_72%)]"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl space-y-5">
              <Eyebrow>{eyebrow}</Eyebrow>
              <H2 className="text-[var(--text-primary)]">{title}</H2>
              <Body className="max-w-none text-[var(--color-muted)]">{description}</Body>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/75">{note}</p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link
                href={ctaHref}
                data-analytics-consultation-cta={ctaAnalyticsLabel}
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                {ctaLabel}
              </Link>

              <p className="text-sm text-neutral-600">A clear next step, without pressure.</p>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
}
