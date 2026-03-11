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
    'relative z-10 border-t border-[rgba(0,0,0,0.05)] bg-gradient-to-b from-rose-50 to-white py-20 md:py-24',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MarketingSection tone="white" container="wide" spacing="default" className={sectionClassName}>
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,247,249,0.92)_100%)] px-6 py-12 text-center shadow-[0_18px_48px_rgba(0,0,0,0.06)] sm:px-8 md:px-12 md:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-4rem] h-44 w-44 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(243,198,208,0.34)_0%,rgba(255,255,255,0)_72%)]"
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="flex justify-center">
              <div className="w-16 rounded-full bg-rose-300/70">
                <div className="h-[2px] w-full rounded-full bg-rose-300" />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Eyebrow>{eyebrow}</Eyebrow>
              <H2 className="mx-auto max-w-[16ch] text-[var(--text-primary)]">{title}</H2>
              <Body className="mx-auto mt-4 max-w-[42rem] text-[var(--color-muted)]">{description}</Body>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">{note}</p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
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
