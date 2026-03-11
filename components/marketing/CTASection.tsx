import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';

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
  primaryLabel = 'Book a Consultation',
  secondaryHref = '/guides',
  secondaryLabel = 'Explore the Guides',
  primaryAnalyticsLabel,
  secondaryAnalyticsLabel,
  note = 'Authority first. Consultation when you need it.',
  className = '',
}: CTASectionProps) {
  return (
    <MarketingSection
      tone="white"
      spacing="default"
      className={[
        'border-t border-black/5 bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)]',
        className,
      ].join(' ')}
    >
      <div className="relative mx-auto max-w-[64rem] overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-white/90 px-6 py-10 text-center shadow-[0_20px_55px_rgba(0,0,0,0.06)] md:px-10 md:py-12">
        <div className="absolute left-1/2 top-[-3.25rem] h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.2)_0%,rgba(232,154,174,0)_74%)]" />
        <p className="relative text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <p className="relative mt-4 font-script text-[1.8rem] leading-none text-[var(--color-accent-dark)] sm:text-[2.2rem]">
          Taylor-Made clarity
        </p>
        <h2 className="relative mx-auto mt-4 max-w-[18ch] font-serif text-[2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.55rem]">
          {title}
        </h2>
        <p className="relative mx-auto mt-5 max-w-[40rem] text-[1rem] leading-8 text-neutral-700">{description}</p>
        <div className="relative mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            data-analytics-consultation-cta={primaryAnalyticsLabel}
            className="btn btn--primary w-full sm:w-auto"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            data-analytics-consultation-cta={secondaryAnalyticsLabel}
            className="btn btn--secondary w-full sm:w-auto"
          >
            {secondaryLabel}
          </Link>
        </div>
        <p className="relative mt-5 text-[0.72rem] uppercase tracking-[0.18em] text-black/45">{note}</p>
      </div>
    </MarketingSection>
  );
}
