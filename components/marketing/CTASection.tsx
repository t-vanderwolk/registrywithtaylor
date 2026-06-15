'use client';

import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { getAnalyticsPageType, getClientPageAnalyticsContext, getInternalPathFromHref, trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryAnalyticsLabel?: string;
  secondaryAnalyticsLabel?: string;
  note?: string;
  className?: string;
};

export default function CTASection({
  eyebrow = 'Ready when you are',
  title = 'Book a consultation when you want expert eyes on your baby gear plan.',
  description = 'Taylor-Made Baby Co. is built to help expecting parents make better baby gear and preparation decisions with far less second-guessing.',
  primaryHref = '/consultation',
  primaryLabel = 'Book a Free Consultation',
  secondaryHref = '/academy',
  secondaryLabel = 'Explore the Academy',
  primaryAnalyticsLabel,
  secondaryAnalyticsLabel,
  note = 'Authority first. Consultation when you need it.',
  className = '',
}: CTASectionProps) {
  const trackCtaClick = (href: string, ctaLabel: string) => {
    const destinationPath = getInternalPathFromHref(href);
    const destinationPageType = destinationPath ? getAnalyticsPageType(destinationPath) : null;
    const eventName =
      destinationPageType === 'book'
        ? AnalyticsEvents.CONSULTATION_CLICK
        : destinationPageType === 'contact'
          ? AnalyticsEvents.CONTACT_CLICK
          : null;

    if (!eventName) {
      return;
    }

    trackEvent(eventName, {
      ...(getClientPageAnalyticsContext() ?? {
        path: '/',
        pageType: 'homepage' as const,
        referrer: null,
        referrerPageType: null,
      }),
      ctaLabel,
      destination: destinationPath ?? href,
      destinationPageType,
    });
  };

  return (
    <MarketingSection
      tone="white"
      spacing="default"
      className={[
        'border-t border-black/5 bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)]',
        className,
      ].join(' ')}
    >
      <div className="relative mx-auto max-w-[64rem] overflow-hidden rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-white/90 px-4 py-7 text-center shadow-[0_20px_55px_rgba(0,0,0,0.06)] sm:rounded-[2rem] sm:px-6 sm:py-10 md:px-10 md:py-12">
        <div className="absolute left-1/2 top-[-3.25rem] h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.2)_0%,rgba(232,154,174,0)_74%)]" />
        <p className="relative text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <p className="relative mt-3 font-script text-[1.55rem] leading-none text-[var(--color-accent-dark)] sm:mt-4 sm:text-[2.2rem]">
          Taylor-Made clarity
        </p>
        <h2 className="relative mx-auto mt-3 max-w-[19ch] font-serif text-[1.72rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:mt-4 sm:text-[2.55rem]">
          {title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-[40rem] text-[0.98rem] leading-7 text-neutral-700 sm:mt-5 sm:text-[1rem] sm:leading-8">
          {description}
        </p>
        <div className="relative mt-5 flex flex-col items-center justify-center gap-3 sm:mt-7 sm:flex-row sm:gap-4">
          <Link
            href={primaryHref}
            className="btn btn--primary w-full sm:w-auto"
            data-analytics-managed="true"
            onClick={() => trackCtaClick(primaryHref, primaryAnalyticsLabel ?? primaryLabel)}
          >
            <MotionCtaContent>{primaryLabel}</MotionCtaContent>
          </Link>
          <Link
            href={secondaryHref}
            className="btn btn--secondary w-full sm:w-auto"
            data-analytics-managed="true"
            onClick={() => trackCtaClick(secondaryHref, secondaryAnalyticsLabel ?? secondaryLabel)}
          >
            <MotionCtaContent>{secondaryLabel}</MotionCtaContent>
          </Link>
        </div>
        <p className="relative mt-4 text-[0.68rem] uppercase tracking-[0.16em] text-black/45 sm:mt-5 sm:text-[0.72rem]">{note}</p>
      </div>
    </MarketingSection>
  );
}
