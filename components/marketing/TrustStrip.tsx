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
          <MarketingSurface
            key={item.title}
            className="flex h-full flex-col items-center text-center bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)] xl:min-h-[18rem] xl:p-6"
          >
            <div className="flex min-h-[8.5rem] items-center justify-center xl:min-h-[8.75rem]">
              <h3 className="mx-auto max-w-[12rem] font-serif text-[1.28rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 xl:text-[1.16rem]">
                {item.title}
              </h3>
            </div>
            <p className="mt-auto max-w-none text-sm leading-[1.75] text-neutral-700 xl:text-[0.92rem] xl:leading-[1.7]">
              {item.description}
            </p>
          </MarketingSurface>
        ))}
      </div>
    </MarketingSection>
  );
}
