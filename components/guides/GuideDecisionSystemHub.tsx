import CategoryGrid from '@/components/guides/CategoryGrid';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import HubHero from '@/components/guides/HubHero';
import NextSteps from '@/components/guides/NextSteps';
import ProductExampleGroup from '@/components/guides/ProductExampleGroup';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import { dedupeFaqEntries } from '@/lib/guides/decisionSystemContent';
import { getGuideOrientation, getStandardGuideSlideItems, guideHubLinkToNextStepLink, normalizeGuideLinks, getFallbackCommonMistakes, dedupeTextItems } from '@/lib/guides/guideFlow';
import { getDecisionHubPageConfig } from '@/lib/guides/guideDecisionSystem';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

export default function GuideDecisionSystemHub({
  guide,
  sourceRoute,
}: {
  guide: GuideArticleRecord;
  sourceRoute: string;
}) {
  const config = getDecisionHubPageConfig(guide.slug);
  if (!config) {
    return null;
  }

  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 4);
  const slideItems = getStandardGuideSlideItems('guide');
  const orientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });
  const decisionItems = [
    ...config.decisionCards.cards.slice(0, 2).map((card) => ({
      condition: card.description.toLowerCase(),
      recommendation: `Start with ${card.title}. ${card.bestFor ?? 'It will narrow the right lane faster.'}`,
      href: card.href,
    })),
    {
      condition: config.fitCheck.notFitBullets[0]?.toLowerCase() || 'still feel caught between lanes',
      recommendation: config.fitCheck.signatureMoment || 'Use the fit check to separate the better lane from the more popular-sounding one.',
      href: `${sourceRoute}#${slideItems[4].id}`,
    },
  ];
  const nextSteps = normalizeGuideLinks(
    [
      {
        href: '/guides',
        label: 'TMBC Education Hub',
        description: 'Return to the broader guide map if you need a different category first.',
        stage: 'Start' as const,
      },
      ...config.continueExploring.links.map((link) => guideHubLinkToNextStepLink(link, 'Refine')),
    ],
    4,
  );
  const takeaways = dedupeTextItems(
    [
      config.fitCheck.fitSummary,
      config.fitCheck.notFitSummary,
      config.comparison.description,
      config.softCta.description,
    ],
    4,
  );

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({
        slug: guide.slug,
        path: sourceRoute,
        category: guide.category,
      })}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <HubHero
          slug={guide.slug}
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={config.hero.eyebrow}
          category={guide.category}
          title={config.hero.title}
          description={config.hero.description}
          note={config.hero.note}
          stats={config.hero.stats}
          highlights={config.hero.highlights}
          jumpLinks={slideItems.slice(1).map((item) => ({ href: `${sourceRoute}#${item.id}`, label: item.label }))}
          topicCluster={guide.topicCluster}
          imageSrc={guide.heroImageUrl}
          imageAlt={guide.heroImageAlt}
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="Editorial Intro"
          title="Editorial Intro"
          description="This hub should get you oriented before you disappear into category tabs."
          items={[
            'The main starting-point cards that sort the category by real-life fit.',
            'A category map that shows the stroller or seat lanes side by side.',
            'A quick fit check so you can see where the wrong lane starts to show.',
            'The next links that move you from the hub into the right deeper guide.',
          ]}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Core Considerations</p>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">
              The main routes that make the category feel smaller on purpose.
            </h2>
            <p className="text-base leading-8 text-[#5B4B55] md:text-lg">
              Read this section like an editorial map: first the starting lanes, then the category grid, then the side-by-side tradeoffs.
            </p>
          </div>

          <HubDecisionCards
            eyebrow={config.decisionCards.eyebrow}
            title={config.decisionCards.title}
            description={config.decisionCards.description}
            cards={config.decisionCards.cards}
          />

          <CategoryGrid
            eyebrow={config.categoryGrid.eyebrow}
            title={config.categoryGrid.title}
            description={config.categoryGrid.description}
            cards={config.categoryGrid.cards}
          />

          <GuideComparisonBand
            eyebrow="Core comparison"
            title={config.comparison.title}
            description={config.comparison.description}
            groups={config.comparison.groups}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock
          title={config.fitCheck.title}
          description={config.fitCheck.description}
          items={decisionItems}
        />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These are the habits that usually make the hub feel less helpful than it should."
          items={getFallbackCommonMistakes(guide.slug)}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <NextSteps
            title={config.continueExploring.title}
            description={config.continueExploring.description}
            links={nextSteps}
          />

          <ProductExampleGroup
            eyebrow="Product examples"
            title={config.productExamples.title}
            description={config.productExamples.description}
            groups={config.productExamples.groups.map((group) => ({
              ...group,
              examples: group.examples.slice(0, 2),
            }))}
          />

          <GuideBulletSection
            eyebrow="Keep In Mind"
            title="Keep In Mind"
            description="If the hub did its job, these should be the parts you still remember once you click away."
            items={takeaways}
          />

          {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}

          <GuideSoftConversionCta
            title={config.softCta.title}
            description={config.softCta.description}
            href="/services"
            ctaLabel="Learn about Taylor-Made Baby Planning"
          />
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
