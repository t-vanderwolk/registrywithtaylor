import type { ReactNode } from 'react';
import MarketingSection from '@/components/layout/MarketingSection';
import SectionDivider from '@/components/ui/SectionDivider';
import SectionIntro from '@/components/ui/SectionIntro';

export type StrolleriaReview = {
  quote: string;
  name: string;
  source: string;
};

export type AnonymousQuote = {
  quote: string;
  attribution: string;
};

const anonColsClass: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const cardBase =
  'min-w-[85vw] max-w-[20rem] snap-start rounded-[1.55rem] border border-[rgba(0,0,0,0.06)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:min-w-0 md:max-w-none md:rounded-[1.85rem] md:p-6';

const fadeEdge =
  'pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_72%,rgba(255,255,255,0.98)_100%)] md:hidden';

export default function TwoTierTestimonials({
  title = 'What families say about working with Taylor',
  eyebrow = 'Client Stories',
  description,
  strolleriaReviews,
  anonymousQuotes,
  anonymousColumns = 3,
  className = '',
}: {
  title?: string;
  eyebrow?: string;
  description?: ReactNode;
  strolleriaReviews: readonly StrolleriaReview[];
  anonymousQuotes: readonly AnonymousQuote[];
  anonymousColumns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <MarketingSection tone="white" spacing="spacious" className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      {/* Tier 1: Named Strolleria reviews */}
      <div className="mt-8 sm:mt-10">
        <div className="flex items-center justify-between">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">
            Strolleria · Verified Reviews
          </p>
          <p className="text-[0.84rem] leading-6 text-neutral-600 md:hidden">Swipe for more</p>
        </div>

        <div className="relative">
          <div className="mt-4 -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 pr-10 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pr-0">
            {strolleriaReviews.map((review) => (
              <article
                key={review.name}
                className={`${cardBase} bg-[linear-gradient(180deg,#ffffff_0%,#fdfaf5_100%)]`}
              >
                <p
                  className="text-[0.9rem] tracking-[0.06em] text-[var(--color-accent-dark)]"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </p>
                <p className="mt-3 font-serif text-[1.3rem] leading-[1.2] tracking-[-0.025em] text-neutral-900 md:text-[1.4rem]">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="mt-5 text-[0.72rem] uppercase tracking-[0.18em] text-black/50">
                  {review.name} · {review.source}
                </p>
              </article>
            ))}
          </div>
          <div className={fadeEdge} />
        </div>
      </div>

      {/* Separator */}
      <div className="mt-10 md:mt-12">
        <SectionDivider />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">
            Consultation Sessions
          </p>
          <p className="text-[0.84rem] leading-6 text-neutral-600 md:hidden">Swipe for more</p>
        </div>
      </div>

      {/* Tier 2: Anonymous consultation quotes */}
      <div className="relative mt-4">
        <div
          className={`-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 pr-10 md:mx-0 md:grid ${anonColsClass[anonymousColumns]} md:overflow-visible md:px-0 md:pr-0`}
        >
          {anonymousQuotes.map((quote) => (
            <article
              key={quote.quote.slice(0, 24)}
              className={`${cardBase} bg-[linear-gradient(180deg,#ffffff_0%,#fdf6f7_100%)]`}
            >
              <p className="font-serif text-[1.3rem] leading-[1.2] tracking-[-0.025em] text-neutral-900 md:text-[1.4rem]">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="mt-5 text-[0.72rem] uppercase tracking-[0.18em] text-black/50">
                {quote.attribution}
              </p>
            </article>
          ))}
        </div>
        <div className={fadeEdge} />
      </div>
    </MarketingSection>
  );
}
