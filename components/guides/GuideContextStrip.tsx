import Link from 'next/link';
import FadeInSection from '@/components/ui/FadeInSection';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { getStrollerContextStripData } from '@/lib/guides/strollerSystem';

export type GuideContextStripData = {
  breadcrumb: readonly string[];
  currentLabel: string;
  compareLabel: string;
  compareHref: string;
  compareCtaLabel?: string;
  hubLabel: string;
  hubHref: string;
  hubCtaLabel?: string;
};

export default function GuideContextStrip({
  slug,
  context,
}: {
  slug?: string;
  context?: GuideContextStripData | null;
}) {
  const resolvedContext =
    context ??
    (slug
      ? (() => {
          const strollerContext = getStrollerContextStripData(slug);
          if (!strollerContext) {
            return null;
          }

          return {
            breadcrumb: strollerContext.breadcrumb,
            currentLabel: strollerContext.currentLabel,
            compareLabel: strollerContext.compareLabel,
            compareHref: strollerContext.compareHref,
            compareCtaLabel: 'Open comparison path',
            hubLabel: 'Stroller Hub',
            hubHref: strollerContext.hubHref,
            hubCtaLabel: 'See the full stroller map',
          } satisfies GuideContextStripData;
        })()
      : null);

  if (!resolvedContext) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/46">
          {resolvedContext.breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true" className="text-black/28">-&gt;</span> : null}
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <FadeInSection duration={0.25} yOffset={-10}>
            <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">You&apos;re exploring</p>
              <p className="mt-2 font-serif text-[1.3rem] leading-[1.08] tracking-tight text-charcoal">{resolvedContext.currentLabel}</p>
            </div>
          </FadeInSection>

          <Link
            href={resolvedContext.compareHref}
            className="group rounded-xl border border-[rgba(0,0,0,0.06)] bg-white px-4 py-4 transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">Compare with</p>
              <p className="mt-2 font-serif text-[1.3rem] leading-[1.08] tracking-tight text-charcoal">{resolvedContext.compareLabel}</p>
              <MotionCtaContent align="start" className="mt-2 text-base text-[var(--color-accent-dark)]" showArrow>
                {resolvedContext.compareCtaLabel ?? 'Open comparison path'}
              </MotionCtaContent>
          </Link>

          <Link
            href={resolvedContext.hubHref}
            className="group rounded-xl border border-[rgba(0,0,0,0.06)] bg-white px-4 py-4 transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">Or return to</p>
              <p className="mt-2 font-serif text-[1.3rem] leading-[1.08] tracking-tight text-charcoal">{resolvedContext.hubLabel}</p>
              <MotionCtaContent align="start" className="mt-2 text-base text-[var(--color-accent-dark)]" showArrow>
                {resolvedContext.hubCtaLabel ?? 'See the full map'}
              </MotionCtaContent>
          </Link>
        </div>
      </section>
    </RevealOnScroll>
  );
}
