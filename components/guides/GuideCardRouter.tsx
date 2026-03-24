import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';
import Link from 'next/link';

export default function GuideCardRouter({
  title,
  description,
  cards,
  eyebrow = 'Routing',
  ctaLabel = 'Open guide',
}: {
  title: string;
  description?: string;
  cards: GuideHubLink[];
  eyebrow?: string;
  ctaLabel?: string;
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <h2 className="max-w-[18ch] font-serif text-[1.7rem] leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-[2.5rem] md:text-[3rem]">
          {title}
        </h2>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      {cards.length > 1 ? (
        <div className="flex items-center justify-between md:hidden">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">Browse guides</p>
          <p className="text-[0.84rem] leading-6 text-neutral-600">Swipe for more</p>
        </div>
      ) : null}

      <div className="relative">
        <div className="-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pr-0 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={`${card.href}-${card.title}`}
              href={card.href}
              className="group flex min-w-[78vw] max-w-[18.5rem] snap-start flex-col rounded-[1.35rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)] md:min-w-0 md:max-w-none md:rounded-[1.5rem] md:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={card.icon} />
                </span>
                <span className="text-[0.64rem] uppercase tracking-[0.13em] text-[var(--color-accent-dark)]">{ctaLabel}</span>
              </div>

              <h3 className="mt-4 font-serif text-[1.32rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 md:mt-5 md:text-[1.45rem]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{card.description}</p>
              {card.bestFor ? (
                <p className="mt-3 rounded-[1rem] border border-stone-200/70 bg-white/90 px-3 py-2.5 text-[0.98rem] leading-[1.68] text-neutral-700">
                  <span className="mr-2 text-[0.64rem] uppercase tracking-[0.13em] text-[var(--color-accent-dark)]/82">Best for</span>
                  <span>{card.bestFor.replace(/^best for\s+/i, '').trim()}</span>
                </p>
              ) : null}

              <div className="mt-auto pt-4 text-sm font-semibold text-neutral-900">
                <span>{ctaLabel}</span>
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  -&gt;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {cards.length > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(255,252,251,0)_0%,rgba(255,252,251,0.92)_72%,rgba(255,252,251,0.98)_100%)] md:hidden" />
        ) : null}
      </div>
    </section>
  );
}
