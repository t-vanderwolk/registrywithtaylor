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
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow}</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.4rem]">{title}</h2>
          {description ? (
            <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#A15B72]">
                    <GuideGlyph icon={card.icon} />
                  </div>
                  <h3 className="text-[1.45rem] font-medium leading-[1.06] tracking-[-0.02em] text-[#2F2430] sm:text-[1.62rem]">
                    {card.title}
                  </h3>
                </div>

                {card.imageSrc ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(251,245,239,0.96)]">
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

              <p className="mt-4 text-base leading-8 text-[#5B4B55]">{card.description}</p>

              <div className="mt-4 space-y-3">
                {card.bestFor ? (
                  <div className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{bestForLabel}</p>
                    <p className="mt-2 text-sm leading-7 text-[#4B3641]">{card.bestFor}</p>
                  </div>
                ) : null}

                {card.tradeoff ? (
                  <div className="rounded-[1.2rem] bg-[rgba(250,244,246,0.92)] px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{tradeoffLabel}</p>
                    <p className="mt-2 text-sm leading-7 text-[#4B3641]">{card.tradeoff}</p>
                  </div>
                ) : null}
              </div>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8F4C62]">
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
