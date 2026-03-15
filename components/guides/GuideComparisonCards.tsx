import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubLink } from '@/lib/guides/hubs';

export default function GuideComparisonCards({
  title,
  description,
  cards,
}: {
  title: string;
  description?: string;
  cards: GuideHubLink[];
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff9f5_0%,#fbf4ec_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Compare next</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            href={card.href}
            className="group flex h-full flex-col rounded-[1.4rem] border border-black/6 bg-white/92 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={card.icon} />
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">Journal</span>
            </div>
            <h3 className="mt-5 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{card.description}</p>
            <div className="mt-auto pt-5 text-sm font-semibold text-neutral-900">
              <span>Read comparison</span>
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
