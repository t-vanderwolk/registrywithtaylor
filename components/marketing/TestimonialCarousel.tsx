import MarketingSection from '@/components/layout/MarketingSection';
import SectionIntro from '@/components/ui/SectionIntro';

type Testimonial = {
  quote: string;
  attribution: string;
};

export default function TestimonialCarousel({
  testimonials,
  eyebrow = 'What families say',
  title = 'Clarity, calmer decisions, and fewer products that miss the mark.',
  description = 'The strongest proof for this brand is not generic praise. It is families saying the decisions finally made sense.',
  className = '',
}: {
  testimonials: readonly Testimonial[];
  eyebrow?: string;
  title?: string;
  description?: string;
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

      {testimonials.length > 1 ? (
        <div className="mt-8 flex items-center justify-between md:hidden">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">Family notes</p>
          <p className="text-[0.84rem] leading-6 text-neutral-600">Swipe for more</p>
        </div>
      ) : null}

      <div className="relative">
        <div className="mt-4 -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 pr-10 md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pr-0">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.attribution}
              className="min-w-[85vw] max-w-[20rem] snap-start rounded-[1.55rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf6f7_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:min-w-0 md:max-w-none md:rounded-[1.85rem] md:p-6"
            >
              <p className="font-serif text-[1.4rem] leading-[1.18] tracking-[-0.03em] text-neutral-900 md:text-[1.55rem]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-6 max-w-none text-[0.72rem] uppercase tracking-[0.18em] text-black/50">
                {testimonial.attribution}
              </p>
            </article>
          ))}
        </div>

        {testimonials.length > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_72%,rgba(255,255,255,0.98)_100%)] md:hidden" />
        ) : null}
      </div>
    </MarketingSection>
  );
}
