import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubDecisionItem } from '@/lib/guides/hubs';

export default function GuideStartHere({
  title = 'Start Here',
  description,
  items,
}: {
  title?: string;
  description?: string;
  items: GuideHubDecisionItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffaf6_0%,#fbf2ea_100%)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-8">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Start here</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="group flex h-full flex-col rounded-[1.6rem] border border-black/6 bg-white/92 p-6 shadow-[0_16px_36px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">Start here</span>
            </div>

            <h3 className="mt-6 font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{item.description}</p>

            <div className="mt-auto pt-6 text-sm font-semibold text-neutral-900">
              <span>Open guide</span>
              <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
