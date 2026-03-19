import Link from 'next/link';
import { getStrollerContextStripData } from '@/lib/guides/strollerSystem';

export default function GuideContextStrip({
  slug,
}: {
  slug: string;
}) {
  const context = getStrollerContextStripData(slug);

  if (!context) {
    return null;
  }

  return (
    <section className="rounded-[1.6rem] border border-stone-200/70 bg-white/92 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)] sm:rounded-[1.8rem] sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-black/46">
        {context.breadcrumb.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-black/28">/</span> : null}
            <span>{item}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] px-4 py-3.5">
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">You&apos;re exploring</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{context.currentLabel}</p>
        </div>

        <Link
          href={context.compareHref}
          className="group rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)]"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Compare with</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{context.compareLabel}</p>
          <p className="mt-2 text-sm text-[var(--color-accent-dark)]">Open comparison path -&gt;</p>
        </Link>

        <Link
          href={context.hubHref}
          className="group rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)]"
        >
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Or return to</p>
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">Stroller Hub</p>
          <p className="mt-2 text-sm text-[var(--color-accent-dark)]">See the full stroller map -&gt;</p>
        </Link>
      </div>
    </section>
  );
}
