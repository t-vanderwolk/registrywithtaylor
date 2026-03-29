import CategoryGrid from '@/components/guides/CategoryGrid';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import HubHero from '@/components/guides/HubHero';
import ProductExampleGroup from '@/components/guides/ProductExampleGroup';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import { dedupeFaqEntries } from '@/lib/guides/decisionSystemContent';
import { getGuideFinalThought, getGuideSignOff, getGuideTakeaways, getGuideWhatThisIs, getGuideWhyItExists } from '@/lib/guides/editorialSystem';
import {
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
  getGuideJourneyPath,
  getGuideRealLifePrompt,
  getGuideLifestyleImages,
} from '@/lib/guides/experience';
import { getDefaultNextSteps, getGuideOrientation, getStandardGuideSlideItems, guideHubLinkToNextStepLink, normalizeGuideLinks, getFallbackCommonMistakes, dedupeTextItems } from '@/lib/guides/guideFlow';
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
  const breadcrumbs = getGuideBreadcrumbs({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const lifestyleImages = getGuideLifestyleImages({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const blogRecommendations = getGuideBlogRecommendations({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const journeyPath = getGuideJourneyPath({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
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
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
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
    getGuideTakeaways({
      guide,
      outline,
      extraItems: [
        config.fitCheck.fitSummary,
        config.fitCheck.notFitSummary,
        config.comparison.description,
        config.softCta.description,
      ],
    }),
    4,
  );
  const whatThisIs = getGuideWhatThisIs({ guide, outline });
  const whyItExists = getGuideWhyItExists({ guide, outline });
  const finalThought = getGuideFinalThought({ guide, outline });
  const signOff = getGuideSignOff({
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
  });
  const carSeatEducationItems =
    guide.slug === 'best-infant-car-seats'
      ? [
          'All infant car seats can be installed without a base. The base adds convenience, not requirement.',
          'Travel systems explain click-in compatibility between an infant seat and stroller. They are not proof that both products are the strongest long-term fit.',
          'If you want the seat to click into the stroller, confirm compatibility after the stroller lane is clear.',
          'When compatibility and longevity compete, stroller longevity usually matters more because the stroller stays in the routine longer.',
        ]
      : [];

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
      journeyPathLabels={journeyPath}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

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
        </div>
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <div className="space-y-6">
          <GuideJourneyIntro
            title="Start here before the category tabs start multiplying."
            description="This is the overview layer for the whole category. Use it to choose the right path before you commit to a narrower lane."
            intro={[
              config.hero.description,
              'The strongest next move is usually the one that matches the real-life friction first, not the one with the flashiest product story.',
            ]}
            calloutBody={getGuideRealLifePrompt({
              slug: guide.slug,
              category: guide.category,
              topicCluster: guide.topicCluster,
            })}
            whatThisIs={whatThisIs}
            whyItExists={whyItExists}
          />

          {lifestyleImages.length > 0 ? <GuideLifestyleGallery images={lifestyleImages} /> : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">What Matters</p>
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

          {carSeatEducationItems.length > 0 ? (
            <GuideBulletSection
              eyebrow="Critical Education"
              title="The car seat rules worth knowing before you compare features."
              description="These are the points that keep the car seat lane from getting dragged around by marketing shorthand."
              items={carSeatEducationItems}
            />
          ) : null}
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
          eyebrow="What People Get Wrong"
          title="What People Get Wrong"
          description="These are the habits that usually make the hub feel less helpful than it should."
          items={getFallbackCommonMistakes(guide.slug)}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <GuideJourneyFooter
            finalThought={finalThought}
            takeaways={takeaways}
            signOff={signOff}
            nextSteps={nextSteps}
            nextStepsTitle={config.continueExploring.title}
            nextStepsDescription={config.continueExploring.description}
            blogRecommendations={blogRecommendations}
            consultationEnabled={guide.consultationCtaEnabled !== false}
            consultationLabel={guide.consultationCtaLabel}
            consultationDescription={config.softCta.description}
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

          {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
