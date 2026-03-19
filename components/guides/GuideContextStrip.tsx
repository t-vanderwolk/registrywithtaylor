import Link from 'next/link';
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
            compareCtaLabel: 'Open comparison path ->',
            hubLabel: 'Stroller Hub',
            hubHref: strollerContext.hubHref,
            hubCtaLabel: 'See the full stroller map ->',
          } satisfies GuideContextStripData;
        })()
      : null);

  if (!resolvedContext) {
    return null;
  }

  return (
    <section className="rounded-[1.6rem] border border-stone-200/70 bg-white/92 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)] sm:rounded-[1.8rem] sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-black/46">
        {resolvedContext.breadcrumb.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-black/28">/</span> : null}
            <span>{item}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] px-4 py-3.5">
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">You&apos;re exploring</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{resolvedContext.currentLabel}</p>
        </div>

        <Link
          href={resolvedContext.compareHref}
          className="group rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)]"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Compare with</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{resolvedContext.compareLabel}</p>
          <p className="mt-2 text-sm text-[var(--color-accent-dark)]">{resolvedContext.compareCtaLabel ?? 'Open comparison path ->'}</p>
        </Link>

        <Link
          href={resolvedContext.hubHref}
          className="group rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)]"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Or return to</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{resolvedContext.hubLabel}</p>
          <p className="mt-2 text-sm text-[var(--color-accent-dark)]">{resolvedContext.hubCtaLabel ?? 'See the full map ->'}</p>
        </Link>
      </div>
    </section>
  );
}
