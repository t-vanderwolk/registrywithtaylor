import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideHubLink } from '@/lib/guides/hubs';

export type HubDecisionCardItem = GuideHubLink & {
  ctaLabel?: string;
};

export default function HubDecisionCards({
  id,
  eyebrow,
  title,
  description,
  cards,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  cards: HubDecisionCardItem[];
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section id={id} className="space-y-5 scroll-mt-28">
      <RevealOnScroll>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
          {description ? (
            <p className="max-w-4xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-2xl border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdfb_0%,#fbf4ec_100%)] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.28)] hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={card.icon} />
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-black/42">Starting point</span>
              </div>

              <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.05] tracking-tight text-charcoal sm:text-[1.55rem]">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">{card.description}</p>

              {card.bestFor ? (
                <div className="mt-4 rounded-xl border border-black/6 bg-white/88 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-black/46">Best for</p>
                  <p className="mt-2 text-base leading-relaxed text-neutral-700">{card.bestFor}</p>
                </div>
              ) : null}

              <span className="mt-5 inline-flex items-center gap-2 text-base font-medium text-[var(--color-accent-dark)]">
                <span>{card.ctaLabel ?? `Explore ${card.title}`}</span>
                <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
