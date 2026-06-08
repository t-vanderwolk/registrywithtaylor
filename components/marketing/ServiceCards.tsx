import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import SectionIntro from '@/components/ui/SectionIntro';
import type { ServicePackage } from '@/lib/marketing/siteContent';

function ServiceDetailCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,#fff8f9_0%,#fdf0f3_100%)] p-3 sm:p-4">
      <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">{title}</p>
      <div className="mt-3.5 space-y-2.5 sm:mt-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3.5 sm:gap-4">
            <CheckIcon frameClassName="mt-0.5" />
            <p className="max-w-none text-[0.93rem] leading-6 text-neutral-700 sm:leading-7">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceCards({
  packages,
  eyebrow = 'Consultation Services',
  title = 'Work with Taylor when you want expert judgment applied to your specific decisions.',
  description = 'Services are positioned as advisor support, not generic consulting. Every option is designed to move families from too much input to a clearer plan.',
  className = '',
  container = 'default',
  ctaHref = '/consultation',
  ctaLabel = 'Book a Consultation',
}: {
  packages: ServicePackage[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  container?: 'default' | 'narrow' | 'wide';
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <MarketingSection tone="ivory" spacing="spacious" container={container} className={className} reveal={false}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.08fr)_minmax(0,0.96fr)] lg:items-stretch lg:gap-7">
        {packages.map((pkg) => (
          <article
            key={pkg.key}
            className={[
              'flex h-full min-w-0 flex-col rounded-[1.6rem] border p-5 transition duration-300 hover:-translate-y-1 sm:p-6 lg:p-8',
              pkg.featured
                ? 'relative order-first border-[rgba(198,167,94,0.42)] bg-[linear-gradient(160deg,#fdfaf5_0%,#faf4e8_100%)] shadow-[0_28px_72px_rgba(198,167,94,0.13)] lg:order-none lg:-translate-y-2 lg:scale-[1.02]'
                : 'border-[rgba(0,0,0,0.07)] bg-[#fdfbf8] shadow-[0_8px_28px_rgba(55,40,46,0.05)] hover:shadow-[0_22px_52px_rgba(55,40,46,0.08)]',
            ].join(' ')}
          >
            {pkg.featured ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[10%] top-6 h-20 rounded-full bg-[radial-gradient(circle,rgba(198,167,94,0.14)_0%,rgba(198,167,94,0)_72%)] blur-3xl"
              />
            ) : null}

            <div className="relative">
              {/* Eyebrow + optional badge */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-neutral-400">
                  {pkg.eyebrow}
                </p>
                {pkg.featured ? (
                  <span className="rounded-full border border-[rgba(198,167,94,0.32)] bg-[rgba(198,167,94,0.08)] px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
                    Most Requested
                  </span>
                ) : null}
              </div>

              {/* Thin gold rule */}
              <div className={['mt-4 h-px w-8', pkg.featured ? 'bg-[var(--color-gold-soft)]' : 'bg-neutral-200'].join(' ')} />

              {/* Title */}
              <h3
                className={[
                  'mt-4 font-[family-name:var(--font-accent)] font-medium leading-[1.02] tracking-[-0.01em] text-neutral-900',
                  pkg.featured ? 'text-[2.1rem] sm:text-[2.4rem]' : 'text-[1.7rem] sm:text-[1.95rem]',
                ].join(' ')}
              >
                {pkg.title}
              </h3>

              {/* Price */}
              <div className={['mt-3 flex items-baseline gap-2', pkg.featured ? '' : ''].join(' ')}>
                {pkg.priceNote && (
                  <span className="text-[0.65rem] uppercase tracking-[0.16em] text-neutral-400">
                    {pkg.priceNote}
                  </span>
                )}
                <span
                  className={[
                    'font-[family-name:var(--font-accent)] font-medium leading-none tracking-[-0.03em] text-[var(--color-gold-soft)]',
                    pkg.featured ? 'text-[2.85rem]' : 'text-[2.4rem]',
                  ].join(' ')}
                >
                  {pkg.price}
                </span>
              </div>

              {/* Summary */}
              <p className="mt-4 max-w-none border-t border-neutral-100 pt-4 text-[0.93rem] leading-6 text-neutral-600 sm:leading-7">
                {pkg.summary}
              </p>

              <p className="mt-3 max-w-none text-[0.93rem] leading-6 text-neutral-500 sm:leading-7">{pkg.description}</p>

              <div className="mt-5 space-y-2.5 sm:mt-6">
                <ServiceDetailCard title="Best for" items={[pkg.bestFor]} />
                <ServiceDetailCard title="What this includes" items={pkg.bullets} />
              </div>
            </div>

            <div className="mt-auto pt-6 sm:pt-8">
              <Link
                href={ctaHref}
                className={[
                  'inline-flex min-h-[46px] w-full items-center justify-center rounded-full border px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition duration-200',
                  pkg.featured
                    ? 'border-[rgba(198,167,94,0.6)] bg-[linear-gradient(135deg,#c8aa5e_0%,#b8974b_100%)] text-white shadow-[0_14px_32px_rgba(198,167,94,0.28)] hover:-translate-y-px hover:shadow-[0_18px_40px_rgba(198,167,94,0.34)]'
                    : 'border-[rgba(198,167,94,0.22)] bg-white text-neutral-800 hover:border-[rgba(198,167,94,0.44)] hover:bg-[rgba(198,167,94,0.04)]',
                ].join(' ')}
              >
                <MotionCtaContent>{ctaLabel}</MotionCtaContent>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </MarketingSection>
  );
}
