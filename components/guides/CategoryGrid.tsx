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
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  cards: CategoryGridCard[];
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

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-[1.7rem] border border-stone-200/70 bg-white/94 p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                    <GuideGlyph icon={card.icon} />
                  </div>
                  <h3 className="font-serif text-[1.5rem] leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-[1.62rem]">
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

              <p className="mt-4 text-[1rem] leading-8 text-neutral-700">{card.description}</p>

              <div className="mt-4 space-y-3">
                {card.bestFor ? (
                  <div className="rounded-[1.1rem] border border-[rgba(196,156,94,0.14)] bg-[rgba(255,248,241,0.86)] px-4 py-3">
                    <p className="text-[0.64rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/76">Best for</p>
                    <p className="mt-2 text-[0.98rem] leading-7 text-neutral-700">{card.bestFor}</p>
                  </div>
                ) : null}

                {card.tradeoff ? (
                  <div className="rounded-[1.1rem] border border-black/6 bg-[#fcfaf7] px-4 py-3">
                    <p className="text-[0.64rem] uppercase tracking-[0.16em] text-black/46">Tradeoff</p>
                    <p className="mt-2 text-[0.98rem] leading-7 text-neutral-700">{card.tradeoff}</p>
                  </div>
                ) : null}
              </div>

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
