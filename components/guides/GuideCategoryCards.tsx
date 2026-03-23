import Image from 'next/image';
import Link from 'next/link';
import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideCardRouter from '@/components/guides/GuideCardRouter';

export default function GuideCategoryCards({
  id,
  title,
  description,
  cards,
  variant = 'default',
  eyebrow,
  ctaLabel,
}: {
  id?: string;
  title: string;
  description?: string;
  cards: GuideHubLink[];
  variant?: 'default' | 'stroller-hub';
  eyebrow?: string;
  ctaLabel?: string;
}) {
  if (cards.length === 0) {
    return null;
  }

  const isStrollerHub = variant === 'stroller-hub';

  if (!isStrollerHub) {
    return (
      <GuideCardRouter
        title={title}
        description={description}
        cards={cards}
        eyebrow={eyebrow ?? 'Sub-guides'}
        ctaLabel={ctaLabel ?? 'Open guide'}
      />
    );
  }

  const formatBestFor = (value: string) => value.replace(/^best for\s+/i, '').trim();

  return (
    <section
      id={id}
      className={
        isStrollerHub
          ? 'min-w-0 space-y-5 rounded-[1.6rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdf9_0%,#f8f2ec_100%)] p-3.5 shadow-[0_20px_48px_rgba(0,0,0,0.04)] sm:space-y-6 sm:p-6 md:space-y-7 md:rounded-[2rem] md:p-8 xl:p-10'
          : 'min-w-0 space-y-5'
      }
    >
      <div className="space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">
          {eyebrow ?? (isStrollerHub ? 'Stroller categories' : 'Sub-guides')}
        </p>
        <h2 className="max-w-[16ch] font-serif text-[1.84rem] leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-[2.5rem] md:text-[3rem]">{title}</h2>
        {description ? (
          <p className={`${isStrollerHub ? 'max-w-[62ch] text-[1rem] leading-[1.74] text-neutral-700 sm:text-[1.04rem]' : 'max-w-3xl text-sm leading-7 text-neutral-700'}`}>
            {description}
          </p>
        ) : null}
      </div>

      <div className={`grid min-w-0 grid-cols-1 ${isStrollerHub ? 'gap-3.5 sm:gap-5 md:grid-cols-2 xl:grid-cols-3' : 'gap-6 md:grid-cols-2 lg:grid-cols-3'}`}>
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            href={card.href}
            className={
              isStrollerHub
                ? 'group flex min-w-0 h-full flex-col rounded-[1.45rem] border border-stone-200/70 bg-[#fcfaf7] p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D7A1AF] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f2ec] sm:rounded-3xl sm:p-5 md:p-6'
                : 'group flex min-w-0 h-full flex-col rounded-xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fcf7f4]'
            }
          >
            {card.imageSrc ? (
              <div
                className={
                  isStrollerHub
                    ? 'mb-3 rounded-[1.2rem] border border-stone-200/70 bg-[linear-gradient(180deg,#f6efe8_0%,#fdfbf8_100%)] p-2.5 sm:mb-6 sm:rounded-[1.7rem] sm:p-4 md:p-5'
                    : 'relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.15rem] border border-black/6 bg-[#f7f2eb]'
                }
              >
                {isStrollerHub ? (
                  <div className="relative h-32 sm:h-44 md:h-[220px]">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt?.trim() || card.title}
                      fill
                      sizes="(min-width: 1280px) 20rem, (min-width: 768px) 45vw, 100vw"
                      className="object-contain object-center p-3"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <>
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt?.trim() || card.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,0.04)_0%,rgba(23,23,23,0.22)_100%)]" />
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/84 text-[var(--color-accent-dark)] shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                      <GuideGlyph icon={card.icon} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.88)_100%)] p-4">
                      <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/42">Stroller category</p>
                      <p className="mt-2 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">
                        {card.title}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : card.showPlaceholder ? (
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

            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div
                className={
                  isStrollerHub
                    ? 'flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)] sm:h-11 sm:w-11'
                    : 'flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]'
                }
              >
                <GuideGlyph icon={card.icon} />
              </div>
              <span className="text-[0.64rem] uppercase tracking-[0.13em] text-[var(--color-accent-dark)] sm:text-[0.7rem]">
                {ctaLabel ?? (isStrollerHub ? 'Explore guide' : 'Open guide')}
              </span>
            </div>
            <h3 className={`${isStrollerHub ? 'mt-3 font-serif text-[1.16rem] leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:mt-5 sm:text-[1.34rem] md:text-[1.46rem]' : 'mt-5 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900'}`}>
              {card.title}
            </h3>
            <p className={`${isStrollerHub ? 'mt-2.5 max-w-[34ch] text-[1rem] leading-[1.74] text-neutral-700 sm:mt-3' : 'mt-3 text-sm leading-7 text-neutral-700'}`}>
              {card.description}
            </p>
            {card.bestFor ? (
              <p
                className="mt-3 rounded-[1rem] border border-stone-200/70 bg-white/90 px-3 py-2.5 text-[0.98rem] leading-[1.68] text-neutral-700"
              >
                <span className="mr-2 text-[0.64rem] uppercase tracking-[0.13em] text-[var(--color-accent-dark)]/82">
                  Best for
                </span>
                <span>{formatBestFor(card.bestFor)}</span>
              </p>
            ) : null}

            <div className="mt-auto pt-4 text-sm font-semibold text-neutral-900 sm:pt-6">
              <span>{ctaLabel ?? (isStrollerHub ? 'Explore guide' : 'Open guide')}</span>
              <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
