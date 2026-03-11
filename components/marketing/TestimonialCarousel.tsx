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

      <div className="mt-10 -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.attribution}
            className="min-w-[18rem] snap-start rounded-[1.85rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf6f7_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:min-w-0"
          >
            <p className="font-serif text-[1.55rem] leading-[1.2] tracking-[-0.03em] text-neutral-900">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="mt-6 max-w-none text-[0.72rem] uppercase tracking-[0.18em] text-black/50">
              {testimonial.attribution}
            </p>
          </article>
        ))}
      </div>
    </MarketingSection>
  );
}
