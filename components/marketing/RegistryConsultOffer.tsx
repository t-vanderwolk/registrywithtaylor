import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { registryConsult } from '@/lib/marketing/siteContent';

/**
 * Launch-phase single public offer: the $75 Registry Consult.
 * `full` (services page) shows includes + best-for + scope boundary;
 * `compact` (homepage) shows a condensed version. Driven by `registryConsult`
 * in siteContent.ts so copy lives in one place.
 */
export default function RegistryConsultOffer({
  variant = 'full',
  className = '',
}: {
  variant?: 'full' | 'compact';
  className?: string;
}) {
  const offer = registryConsult;
  const compact = variant === 'compact';

  return (
    <MarketingSection tone="ivory" spacing="spacious" className={className} reveal={false}>
      <div className="mx-auto max-w-3xl">
        <article className="relative overflow-hidden rounded-[1.9rem] border border-[rgba(212,123,145,0.34)] bg-[linear-gradient(160deg,#fdf8f9_0%,#faeef2_100%)] p-6 shadow-[0_28px_72px_rgba(212,123,145,0.12)] sm:p-9 lg:p-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[12%] top-6 h-24 rounded-full bg-[radial-gradient(circle,rgba(212,123,145,0.14)_0%,rgba(212,123,145,0)_72%)] blur-3xl"
          />
          <div className="relative">
            {/* Launch banner */}
            <span className="inline-flex items-center rounded-full border border-[rgba(212,123,145,0.3)] bg-[rgba(212,123,145,0.08)] px-3.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
              {offer.banner}
            </span>

            {/* Title + price */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 className="font-[family-name:var(--font-accent)] text-[2.4rem] font-medium leading-[0.98] tracking-[-0.02em] text-neutral-900 sm:text-[2.9rem]">
                {offer.title}
              </h2>
              <span className="font-[family-name:var(--font-accent)] text-[2.9rem] font-medium leading-none tracking-[-0.03em] text-[var(--color-accent-dark)]">
                {offer.price}
              </span>
            </div>
            <p className="mt-2 text-[0.82rem] uppercase tracking-[0.16em] text-neutral-400">{offer.format}</p>

            {/* Tagline + intro */}
            <p className="mt-5 font-serif text-[1.2rem] leading-[1.5] tracking-[-0.01em] text-neutral-800 sm:text-[1.35rem]">
              {offer.tagline}
            </p>
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-neutral-600">{offer.intro}</p>

            {/* Includes + Best for */}
            <div className={['mt-7 grid gap-4', compact ? '' : 'sm:grid-cols-2'].join(' ')}>
              <div className="rounded-2xl border border-[rgba(215,161,175,0.22)] bg-white/70 p-4 sm:p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">
                  What this includes
                </p>
                <div className="mt-3.5 space-y-2.5">
                  {offer.includes.map((item) => (
                    <div key={item} className="flex items-start gap-3.5">
                      <CheckIcon frameClassName="mt-0.5" />
                      <p className="text-[0.93rem] leading-6 text-neutral-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              {!compact ? (
                <div className="rounded-2xl border border-[rgba(215,161,175,0.22)] bg-white/70 p-4 sm:p-5">
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">
                    Best for
                  </p>
                  <div className="mt-3.5 space-y-2.5">
                    {offer.bestFor.map((item) => (
                      <div key={item} className="flex items-start gap-3.5">
                        <CheckIcon frameClassName="mt-0.5" />
                        <p className="text-[0.93rem] leading-6 text-neutral-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Scope boundary (full only) */}
            {!compact ? (
              <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#fbfaf8] p-4 sm:p-5">
                <p className="text-[0.93rem] leading-7 text-neutral-700">
                  <span className="font-semibold text-neutral-800">{offer.scopeNote}</span>
                </p>
                <p className="mt-2 text-[0.85rem] leading-6 text-neutral-500">
                  Not included: {offer.notIncluded.join(' · ')}.
                </p>
              </div>
            ) : null}

            {/* CTAs */}
            <div className="mt-7 flex flex-col items-start gap-3">
              <Link
                href={offer.primaryCta.href}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(216,137,160,0.6)] bg-[linear-gradient(135deg,var(--color-cta-pink)_0%,var(--color-cta-pink-hover)_100%)] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(216,137,160,0.28)] transition duration-200 hover:-translate-y-px hover:shadow-[0_18px_40px_rgba(216,137,160,0.34)] sm:w-auto"
              >
                <MotionCtaContent>{offer.primaryCta.label}</MotionCtaContent>
              </Link>
              <Link
                href={offer.secondaryCta.href}
                className="text-[0.9rem] font-medium text-[var(--color-accent-dark)] underline decoration-[rgba(215,161,175,0.6)] underline-offset-4 transition hover:text-neutral-900"
              >
                {offer.secondaryCta.label}
              </Link>
            </div>
          </div>
        </article>

        {/* Longer-term support note (full only) */}
        {!compact ? (
          <p className="mx-auto mt-6 max-w-2xl text-center text-[0.88rem] leading-7 text-neutral-500">
            {offer.longerTermNote}
          </p>
        ) : null}
      </div>
    </MarketingSection>
  );
}
