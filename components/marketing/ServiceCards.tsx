import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import SectionIntro from '@/components/ui/SectionIntro';
import type { ServicePackage } from '@/lib/marketing/siteContent';

export default function ServiceCards({
  packages,
  eyebrow = 'Consultation Services',
  title = 'Work with Taylor when you want expert judgment applied to your specific decisions.',
  description = 'Services are positioned as advisor support, not generic consulting. Every option is designed to move families from too much input to a clearer plan.',
  className = '',
  container = 'default',
}: {
  packages: ServicePackage[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  container?: 'default' | 'narrow' | 'wide';
}) {
  return (
    <MarketingSection tone="ivory" spacing="spacious" container={container} className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <article
            key={pkg.key}
            className={[
              'relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-7',
              pkg.featured
                ? 'border-[rgba(216,137,160,0.34)] bg-[linear-gradient(180deg,#ffffff_0%,#fff4f6_100%)] shadow-[0_24px_56px_rgba(216,137,160,0.10)]'
                : 'border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf8f4_100%)]',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                {pkg.eyebrow}
              </p>
              {pkg.featured ? (
                <span className="rounded-full border border-[rgba(196,156,94,0.28)] bg-white/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                  Most Popular
                </span>
              ) : null}
            </div>

            <div className="mt-4 rounded-[1.45rem] border border-white/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-5">
              <h3 className="font-serif text-[1.65rem] leading-[1.06] tracking-[-0.035em] text-neutral-900 sm:text-[1.75rem]">
                {pkg.title}
              </h3>
              <p className="mt-3 max-w-none text-[0.98rem] leading-7 text-neutral-700">{pkg.summary}</p>
            </div>

            <p className="mt-5 max-w-none text-[0.95rem] leading-7 text-neutral-600">{pkg.description}</p>

            <div className="mt-5 rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">Best for</p>
              <p className="mt-2 max-w-none text-[0.95rem] leading-7 text-neutral-700">{pkg.bestFor}</p>
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-white/88 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">What this includes</p>
              <div className="mt-4 space-y-3">
                {pkg.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-4">
                    <CheckIcon frameClassName="mt-0.5" />
                    <p className="max-w-none text-[0.94rem] leading-7 text-neutral-700">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-black/45">When you want clearer next steps</p>
              <Link href="/consultation" className="btn btn--primary mt-4 w-full justify-center pt-0">
                Book a Consultation
              </Link>
            </div>
          </article>
        ))}
      </div>
    </MarketingSection>
  );
}
