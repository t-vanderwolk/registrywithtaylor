import Image from 'next/image';
import Link from 'next/link';
import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';

export default function GuideCategoryCards({
  title,
  description,
  cards,
  variant = 'default',
}: {
  title: string;
  description?: string;
  cards: GuideHubLink[];
  variant?: 'default' | 'stroller-hub';
}) {
  if (cards.length === 0) {
    return null;
  }

  const isStrollerHub = variant === 'stroller-hub';

  return (
    <section
      className={
        isStrollerHub
          ? 'space-y-6 rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdf9_0%,#f8f2ec_100%)] p-6 shadow-[0_20px_48px_rgba(0,0,0,0.04)] md:space-y-7 md:p-8 xl:p-10'
          : 'space-y-5'
      }
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          {isStrollerHub ? 'Stroller categories' : 'Sub-guides'}
        </p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 md:text-[2.25rem]">{title}</h2>
        {description ? (
          <p className={`${isStrollerHub ? 'max-w-4xl text-[0.98rem] leading-7 text-neutral-700' : 'max-w-3xl text-sm leading-7 text-neutral-700'}`}>
            {description}
          </p>
        ) : null}
      </div>

      <div className={`grid grid-cols-1 ${isStrollerHub ? 'gap-5 md:grid-cols-2 xl:grid-cols-3' : 'gap-6 md:grid-cols-2 lg:grid-cols-3'}`}>
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            href={card.href}
            className={
              isStrollerHub
                ? 'group flex h-full flex-col rounded-3xl border border-stone-200/70 bg-[#fcfaf7] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.28)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f2ec] md:p-6'
                : 'group flex h-full flex-col rounded-xl border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fcf7f4]'
            }
          >
            {card.imageSrc ? (
              <div
                className={
                  isStrollerHub
                    ? 'mb-6 rounded-[1.7rem] border border-stone-200/70 bg-[linear-gradient(180deg,#f6efe8_0%,#fdfbf8_100%)] p-4 md:p-5'
                    : 'relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.15rem] border border-black/6 bg-[#f7f2eb]'
                }
              >
                {isStrollerHub ? (
                  <div className="flex h-48 items-center justify-center md:h-52">
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt?.trim() || card.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain object-center"
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

            <div className="flex items-center justify-between gap-4">
              <div
                className={
                  isStrollerHub
                    ? 'flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]'
                    : 'flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]'
                }
              >
                <GuideGlyph icon={card.icon} />
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                {isStrollerHub ? 'Explore guide' : 'Open guide'}
              </span>
            </div>
            <h3 className={`${isStrollerHub ? 'mt-5 font-serif text-[1.38rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 md:text-[1.5rem]' : 'mt-5 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900'}`}>
              {card.title}
            </h3>
            <p className={`${isStrollerHub ? 'mt-3 text-sm leading-7 text-neutral-700' : 'mt-3 text-sm leading-7 text-neutral-700'}`}>
              {card.description}
            </p>

            <div className="mt-auto pt-6 text-sm font-semibold text-neutral-900">
              <span>{isStrollerHub ? 'Explore guide' : 'Open guide'}</span>
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
