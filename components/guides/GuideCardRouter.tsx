import type { GuideHubLink } from '@/lib/guides/hubs';
import { GuideRouteCard, GuideSectionHeading } from '@/components/guides/GuidePrimitives';

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
      <GuideSectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        className="max-w-[58rem]"
      />

      {cards.length > 1 ? (
        <div className="flex items-center justify-between md:hidden">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">Browse guides</p>
          <p className="text-[0.84rem] leading-6 text-neutral-600">Swipe for more</p>
        </div>
      ) : null}

      <div className="relative">
        <div className="-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pr-0 xl:grid-cols-3">
          {cards.map((card) => (
            <GuideRouteCard
              key={`${card.href}-${card.title}`}
              href={card.href}
              title={card.title}
              description={card.description}
              icon={card.icon}
              eyebrow={eyebrow}
              ctaLabel={ctaLabel}
              bestFor={card.bestFor}
              compact
              className="min-w-[78vw] max-w-[18.5rem] snap-start md:min-w-0 md:max-w-none"
            />
          ))}
        </div>

        {cards.length > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(255,252,251,0)_0%,rgba(255,252,251,0.92)_72%,rgba(255,252,251,0.98)_100%)] md:hidden" />
        ) : null}
      </div>
    </section>
  );
}
