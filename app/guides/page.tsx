import SiteShell from '@/components/SiteShell';
import CTASection from '@/components/marketing/CTASection';
import GuideGrid from '@/components/marketing/GuideGrid';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { toGuideCardItemFromGuide, toGuideCardItemFromPillar } from '@/lib/guides/presentation';
import { getPublicGuideWhere } from '@/lib/guides/status';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { guidePillars } from '@/lib/marketing/siteContent';
import prisma from '@/lib/server/prisma';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Baby Gear Guides | Taylor-Made Baby Co.',
  description:
    'Explore expert baby gear and baby preparation guides for strollers, infant car seats, registries, nursery setup, and travel with baby.',
  path: '/guides',
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. Baby Gear Guides.',
});

const learnPrinciples = [
  {
    title: 'Authority first',
    description: 'Guides are organized around decision quality, not around product hype or endless listicles.',
  },
  {
    title: 'Real-life fit',
    description: 'Every category is framed through space, routine, budget, travel, storage, and daily use.',
  },
  {
    title: 'Clear next steps',
    description: 'Each guide should leave parents knowing what to compare, what to skip, and when expert support would help.',
  },
] as const;

export default async function GuidesIndexPage() {
  let publishedGuides: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    category: string;
    heroImageUrl: string | null;
    heroImageAlt: string | null;
  }> = [];
  try {
    publishedGuides = await prisma.guide.findMany({
      where: getPublicGuideWhere(),
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        heroImageUrl: true,
        heroImageAlt: true,
      },
    });
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      throw error;
    }
  }

  const guideCardMap = new Map(
    guidePillars.map((guide) => {
      const card = toGuideCardItemFromPillar(guide);
      return [card.slug, card] as const;
    }),
  );

  for (const guide of publishedGuides) {
    const card = toGuideCardItemFromGuide(guide);
    guideCardMap.set(card.slug, card);
  }

  const guideCards = [...guideCardMap.values()];

  return (
    <SiteShell currentPath="/guides">
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow="Baby Gear Guides"
          title="Learn what matters, in the right order."
          subtitle="Use the guide hub to understand the categories, compare what fits your life, and make baby gear decisions with a lot less guesswork."
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Explore the Guides', href: '#guide-hub' }}
          tagline="Best Strollers • Infant Car Seats • Registry Planning • Travel With Baby"
          image="/assets/hero/hero-baby-editorial.jpg"
          imageAlt="Editorial baby registry and product planning scene"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="How to use the hub"
            title="Start with the category you are actively deciding, then follow the trail into the comparisons that matter."
            description="The guide system is designed to feel like a premium editorial desk: focused topics, better questions, and stronger recommendation logic."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {learnPrinciples.map((principle) => (
              <MarketingSurface key={principle.title} className="h-full">
                <h3 className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{principle.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <GuideGrid
          id="guide-hub"
          guides={guideCards}
          eyebrow="Guide hub"
          title="Five entry points for the baby gear and baby preparation decisions that shape the first season."
          description="These pillar guides are designed to support search, build authority, and give parents a more useful place to begin than generic checklists."
        />

        <CTASection
          eyebrow="Need a tailored answer?"
          title="Book a consultation when the guide gets you close, but your real-life variables still matter."
          description="The knowledge hub builds clarity. Taylor's advisory work applies that clarity to your actual gear, registry, nursery, and timeline decisions."
        />
      </main>
    </SiteShell>
  );
}
