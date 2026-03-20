import Image from 'next/image';
import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideHubLink } from '@/lib/guides/hubs';

export type CategoryGridCard = GuideHubLink & {
  tradeoff?: string;
  ctaLabel?: string;
};

export default function CategoryGrid({
  id,
  eyebrow,
  title,
  description,
  cards,
  bestForLabel = 'Best for',
  tradeoffLabel = 'Tradeoff',
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  cards: CategoryGridCard[];
  bestForLabel?: string;
  tradeoffLabel?: string;
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
            <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                    <GuideGlyph icon={card.icon} />
                  </div>
                  <h3 className="font-serif text-[1.45rem] leading-[1.06] tracking-tight text-charcoal sm:text-[1.62rem]">
                    {card.title}
                  </h3>
                </div>

                {card.imageSrc ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-stone-200/70 bg-[#fbf6f1]">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt?.trim() || card.title}
                      fill
                      sizes="64px"
                      className="object-contain object-center p-2"
                    />
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">{card.description}</p>

              <div className="mt-4 space-y-3">
                {card.bestFor ? (
                  <div className="rounded-xl border border-[rgba(196,156,94,0.14)] bg-[rgba(255,248,241,0.86)] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/76">{bestForLabel}</p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-700">{card.bestFor}</p>
                  </div>
                ) : null}

                {card.tradeoff ? (
                  <div className="rounded-xl border border-black/6 bg-[#FCFAFB] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-black/46">{tradeoffLabel}</p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-700">{card.tradeoff}</p>
                  </div>
                ) : null}
              </div>

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
