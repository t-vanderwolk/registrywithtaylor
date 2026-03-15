import Link from 'next/link';
import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';

export default function GuideCategoryCards({
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
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Sub-guides</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            href={card.href}
            className="group flex h-full flex-col rounded-xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.08)]"
          >
            {card.showPlaceholder ? (
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.15rem] border border-black/6 bg-[linear-gradient(180deg,#f6eee6_0%,#ecdfd1_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,156,94,0.2),transparent_55%),linear-gradient(135deg,rgba(255,255,255,0.8),transparent_48%)]" />
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/82 text-[var(--color-accent-dark)] shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                  <GuideGlyph icon={card.icon} />
                </div>
                <div className="absolute inset-x-0 bottom-0 border-t border-black/6 bg-white/74 p-4 backdrop-blur-[2px]">
                  <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/42">Image placeholder</p>
                  <p className="mt-2 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">
                    {card.title}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={card.icon} />
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">Open guide</span>
            </div>
            <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
