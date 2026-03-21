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
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow}</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.4rem]">{title}</h2>
          {description ? (
            <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <RevealOnScroll key={`${card.href}-${card.title}`} delayMs={index * 70}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,253,253,0.98)_0%,rgba(251,244,247,0.96)_100%)] p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#A15B72]">
                  <GuideGlyph icon={card.icon} />
                </div>
                <span className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Starting point</span>
              </div>

              <h3 className="mt-5 text-[1.45rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#2F2430] sm:text-[1.55rem]">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-8 text-[#5B4B55]">{card.description}</p>

              {card.bestFor ? (
                <div className="mt-4 rounded-[1.2rem] bg-white/88 px-4 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Best for</p>
                  <p className="mt-2 text-sm leading-7 text-[#4B3641]">{card.bestFor}</p>
                </div>
              ) : null}

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
