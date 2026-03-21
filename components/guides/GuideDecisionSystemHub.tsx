import CategoryGrid from '@/components/guides/CategoryGrid';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideDecisionSteps from '@/components/guides/GuideDecisionSteps';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import HubHero from '@/components/guides/HubHero';
import ProductExampleGroup from '@/components/guides/ProductExampleGroup';
import SlideSection from '@/components/guides/SlideSection';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import { buildDecisionStepsFromSections, dedupeFaqEntries } from '@/lib/guides/decisionSystemContent';
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
  const steps = buildDecisionStepsFromSections(outline.sections, {
    excludeTitles: ['FAQ', 'Product Examples'],
  });
  const hubSteps = steps.slice(0, 3);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 4);
  const jumpLinks = [
    { href: `${sourceRoute}#hub-start`, label: 'Start here' },
    { href: `${sourceRoute}#hub-categories`, label: 'Category map' },
    { href: `${sourceRoute}#hub-fit-check`, label: 'Fit check' },
    { href: `${sourceRoute}#hub-comparison`, label: 'Compare lanes' },
    ...(hubSteps.length > 0 ? [{ href: `${sourceRoute}#hub-walkthrough`, label: 'Quick guide' }] : []),
    { href: `${sourceRoute}#hub-next-steps`, label: 'Next steps' },
  ];
  const productExampleGroups = config.productExamples.groups.map((group) => ({
    ...group,
    examples: group.examples.slice(0, 2),
  }));
  const slideDeckId = `guide-slide-deck-${guide.slug}`;
  const slideItems = [
    { id: 'guide-overview', label: 'Overview', shortLabel: 'Start' },
    { id: 'hub-start', label: 'Start Here', shortLabel: 'Path' },
    { id: 'hub-categories', label: 'Category Map', shortLabel: 'Map' },
    { id: 'hub-fit-check', label: 'Fit Check', shortLabel: 'Fit' },
    { id: 'hub-comparison', label: 'Compare Lanes', shortLabel: 'Compare' },
    { id: 'hub-next-steps', label: 'Next Steps', shortLabel: 'Next' },
  ];

  return (
    <GuideSlideDeck containerId={slideDeckId} items={slideItems}>
      <SlideSection id="guide-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
        <HubHero
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={config.hero.eyebrow}
          title={config.hero.title}
          description={config.hero.description}
          note={config.hero.note}
          stats={config.hero.stats}
          highlights={config.hero.highlights}
          jumpLinks={jumpLinks}
        />
      </SlideSection>

      <SlideSection id="hub-start" background="white">
        <div className="space-y-8">
          <GuideCTARibbon
            eyebrow="Start here"
            title="Begin with the lane that already sounds like your week."
            description="This hub works best when you start with your routine, not the product names. Pick the path that sounds the most familiar and let the rest narrow from there."
            primaryCta={
              config.decisionCards.cards[0]
                ? {
                    href: config.decisionCards.cards[0].href,
                    label: config.decisionCards.cards[0].title,
                  }
                : null
            }
            secondaryCta={
              config.decisionCards.cards[1]
                ? {
                    href: config.decisionCards.cards[1].href,
                    label: config.decisionCards.cards[1].title,
                  }
                : null
            }
          />

          <HubDecisionCards
            eyebrow={config.decisionCards.eyebrow}
            title={config.decisionCards.title}
            description={config.decisionCards.description}
            cards={config.decisionCards.cards}
          />
        </div>
      </SlideSection>

      <SlideSection id="hub-categories" background="blush">
        <CategoryGrid
          eyebrow={config.categoryGrid.eyebrow}
          title={config.categoryGrid.title}
          description={config.categoryGrid.description}
          cards={config.categoryGrid.cards}
        />
      </SlideSection>

      <SlideSection id="hub-fit-check" background="ivory">
        <GuideDecisionBlock {...config.fitCheck} />
      </SlideSection>

      <SlideSection id="hub-comparison" background="blush">
        <div className="space-y-8">
          <GuideComparisonBand
            eyebrow="Category comparison"
            title={config.comparison.title}
            description={config.comparison.description}
            groups={config.comparison.groups}
          />

          {hubSteps.length > 0 ? (
            <div id="hub-walkthrough" className="scroll-mt-28">
              <GuideDecisionSteps
                eyebrow="Guided walkthrough"
                title="A quicker way to narrow it down."
                description="The key decisions are pulled forward here, so you can get oriented without reading the whole guide first."
                steps={hubSteps}
                mode="summary"
              />
            </div>
          ) : null}

          <GuideCTARibbon
            eyebrow="Keep going"
            title="Need the shorter route?"
            description="If you already know the general lane, jump straight into the next guide that gets you closest to a real shortlist."
            primaryCta={
              config.continueExploring.links[0]
                ? {
                    href: config.continueExploring.links[0].href,
                    label: `Explore ${config.continueExploring.links[0].title}`,
                  }
                : null
            }
            secondaryCta={
              config.continueExploring.links[1]
                ? {
                    href: config.continueExploring.links[1].href,
                    label: `Explore ${config.continueExploring.links[1].title}`,
                  }
                : null
            }
          />
        </div>
      </SlideSection>

      <SlideSection id="hub-next-steps" background="white">
        <div className="space-y-8">
          <ProductExampleGroup
            eyebrow="Category examples"
            title={config.productExamples.title}
            description={config.productExamples.description}
            groups={productExampleGroups}
          />

          <GuideContinueExploring
            title={config.continueExploring.title}
            description={config.continueExploring.description}
            links={config.continueExploring.links}
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
