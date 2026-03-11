import MarketingSection from '@/components/layout/MarketingSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';

type TrustStripItem = {
  title: string;
  description: string;
};

export default function TrustStrip({
  items,
  eyebrow = 'Why families trust Taylor',
  title = 'Credibility that goes deeper than a registry checklist.',
  description = 'Taylor brings retail baby gear knowledge, nursery-planning perspective, concierge-level support, and real consultation experience to the decisions families tend to second-guess most.',
  className = '',
}: {
  items: readonly TrustStripItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <MarketingSection tone="white" spacing="default" className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <MarketingSurface key={item.title} className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)]">
            <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
              Experience
            </p>
            <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.1] text-neutral-900">{item.title}</h3>
            <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{item.description}</p>
          </MarketingSurface>
        ))}
      </div>
    </MarketingSection>
  );
}
