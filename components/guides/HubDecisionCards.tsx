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
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[2.15rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-[3.25rem]">{title}</h2>
          {description ? (
            <p className="max-w-[64ch] text-[1rem] leading-8 text-neutral-700 sm:text-[1.08rem] sm:leading-8">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-[1.6rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdfb_0%,#fbf4ec_100%)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.28)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={card.icon} />
                </div>
                <span className="text-[0.64rem] uppercase tracking-[0.18em] text-black/42">Starting point</span>
              </div>

              <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]">
                {card.title}
              </h3>
              <p className="mt-3 text-[1rem] leading-8 text-neutral-700">{card.description}</p>

              {card.bestFor ? (
                <div className="mt-4 rounded-[1.15rem] border border-black/6 bg-white/88 px-4 py-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.16em] text-black/46">Best for</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-neutral-700">{card.bestFor}</p>
                </div>
              ) : null}

              <span className="mt-5 inline-flex items-center gap-2 text-[1rem] font-medium text-[var(--color-accent-dark)]">
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
