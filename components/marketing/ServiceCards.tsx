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
    <div className="rounded-[1.05rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] p-3 sm:rounded-2xl sm:p-4">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">{title}</p>
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
    <MarketingSection tone="ivory" spacing="spacious" container={container} className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-7 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.08fr)_minmax(0,0.96fr)] lg:items-stretch">
        {packages.map((pkg) => (
          <article
            key={pkg.key}
            className={[
              'flex h-full flex-col rounded-[1.3rem] border bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(55,40,46,0.08)] sm:rounded-2xl sm:p-6 lg:p-7',
              pkg.featured
                ? 'relative border-[rgba(216,137,160,0.34)] shadow-[0_24px_70px_rgba(216,137,160,0.12)] lg:-translate-y-2 lg:scale-[1.02]'
                : 'border-[rgba(0,0,0,0.06)]',
            ].join(' ')}
          >
            {pkg.featured ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[16%] top-5 h-16 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl"
              />
            ) : null}

            <div className="relative">
              {pkg.featured ? (
                <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/78">
                  Most Popular
                </p>
              ) : null}

              <div className="flex flex-col items-start gap-3">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                  {pkg.eyebrow}
                </p>
              </div>

              <div
                className={[
                  'mt-4 rounded-[1.1rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fff6f3_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:rounded-2xl sm:p-5',
                  pkg.featured ? 'bg-[linear-gradient(180deg,#ffffff_0%,#fff1f4_100%)] text-center shadow-[0_14px_34px_rgba(216,137,160,0.08)]' : '',
                ].join(' ')}
              >
                <h3
                  className={[
                    'font-serif leading-[1.06] tracking-[-0.035em] text-neutral-900',
                    pkg.featured ? 'mx-auto max-w-[14rem] text-[1.72rem] sm:text-[2rem]' : 'text-[1.5rem] sm:text-[1.75rem]',
                  ].join(' ')}
                >
                  {pkg.title}
                </h3>
                <p className="mt-2 max-w-none text-[0.94rem] leading-6 text-neutral-600 sm:leading-7">{pkg.summary}</p>
              </div>

              <p className="mt-4 max-w-none text-[0.96rem] leading-6 text-neutral-700 sm:mt-5 sm:leading-7">{pkg.description}</p>

              <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
                <ServiceDetailCard title="Best for" items={[pkg.bestFor]} />
                <ServiceDetailCard title="What this includes" items={pkg.bullets} />
              </div>
            </div>

            <div className="mt-auto pt-5 sm:pt-7">
              <p className="text-sm leading-6 text-neutral-500">Advisor-led support for the decisions that are not getting clearer on their own.</p>
              <Link
                href={ctaHref}
                className={[
                  'mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-shadow duration-200 hover:shadow-[0_16px_34px_rgba(55,40,46,0.08)]',
                  pkg.featured
                    ? 'bg-[var(--color-accent-dark)] text-white shadow-[0_16px_34px_rgba(55,40,46,0.12)]'
                    : 'border border-[rgba(196,156,94,0.18)] bg-white text-neutral-900 hover:shadow-sm',
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
