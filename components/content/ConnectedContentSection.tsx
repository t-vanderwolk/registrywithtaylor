import InternalLink from '@/components/content/InternalLink';
import type { InternalLinkCard } from '@/lib/internal-links/types';

type ConnectedContentSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: InternalLinkCard[];
  className?: string;
};

export default function ConnectedContentSection({
  eyebrow,
  title,
  description,
  cards,
  className = '',
}: ConnectedContentSectionProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className="max-w-3xl space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">{eyebrow}</p>
        <h2 className="break-words font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.04] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
          {title}
        </h2>
        <p className="max-w-4xl break-words text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)] sm:text-[1.05rem]">
          {description}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <InternalLink
            key={`${card.href}-${card.title}`}
            href={card.href}
            destinationKind={card.kind}
            placement="section_card"
            className="group flex h-full min-w-0 flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.94)_100%)] p-5 shadow-[0_18px_45px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.26)] hover:shadow-[0_24px_56px_rgba(58,36,43,0.12)] sm:p-6"
          >
            {card.eyebrow ? (
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose,#A15B72)]">
                {card.eyebrow}
              </p>
            ) : null}
            <h3 className="mt-4 break-words font-serif text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
              {card.title}
            </h3>
            <p className="mt-4 break-words text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
              {card.description}
            </p>
            <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[var(--tmbc-blog-rose,#A15B72)] transition duration-200 group-hover:translate-x-1">
              {card.ctaLabel}
            </span>
          </InternalLink>
        ))}
      </div>
    </section>
  );
}
