import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import NextSteps from '@/components/guides/NextSteps';
import ProductExampleGroup from '@/components/guides/ProductExampleGroup';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { stripMarkdown } from '@/lib/blog/contentText';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import { buildPrefaceBrief, dedupeFaqEntries } from '@/lib/guides/decisionSystemContent';
import {
  dedupeTextItems,
  getFallbackCommonMistakes,
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import { getDecisionCategoryPageConfig } from '@/lib/guides/guideDecisionSystem';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function GuideCategoryDecisionSystem({
  guide,
  displayDate,
  readingTime,
  sourceRoute,
}: {
  guide: GuideArticleRecord;
  displayDate: Date;
  readingTime: number;
  sourceRoute: string;
}) {
  const config = getDecisionCategoryPageConfig(guide.slug);
  if (!config) {
    return null;
  }

  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const preface = buildPrefaceBrief(outline.preface);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const slideItems = getStandardGuideSlideItems('guide');
  const orientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });
  const nextSteps = normalizeGuideLinks(
    [
      {
        href: config.context.hubHref,
        label: config.context.hubLabel,
        description: 'Return to the parent hub if you need the wider category map again.',
        stage: 'Start' as const,
      },
      {
        href: config.context.compareHref,
        label: config.context.compareLabel,
        description: 'Compare this path with the closest neighboring category next.',
        stage: 'Compare' as const,
      },
      ...config.continueExploring.links.map((link) => guideHubLinkToNextStepLink(link, 'Refine')),
    ],
    4,
  );
  const decisionItems = [
    ...config.fitCheck.fitBullets.slice(0, 2).map((bullet) => ({
      condition: bullet.toLowerCase(),
      recommendation: `This category is usually a good fit. ${config.fitCheck.fitSummary}`,
      href: `${sourceRoute}#${slideItems[3].id}`,
    })),
    ...config.fitCheck.notFitBullets.slice(0, 1).map((bullet) => ({
      condition: bullet.toLowerCase(),
      recommendation: `Compare ${config.context.compareLabel} before you commit. ${config.fitCheck.notFitSummary}`,
      href: config.context.compareHref,
    })),
  ];
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
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <GuideHero
          eyebrow={config.heroEyebrow}
          title={guide.title}
          description={guide.excerpt?.trim() || config.heroDescription}
          readTime={`${readingTime} min`}
          publishedLabel={formatArticleDate(displayDate)}
          sectionCount={slideItems.length}
          jumpLinks={slideItems.slice(1).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          imageSrc={null}
          imageAlt={guide.title}
          variant="stroller-category"
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="What This Guide Covers"
          title="What This Guide Covers"
          description="The goal is to make the category legible before you start over-comparing the wrong products."
          items={[
            config.startPanel.startDescription,
            ...config.startPanel.summaryCards.map((card) => card.text),
            config.comparison.description,
          ].slice(0, 5)}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <GuideContextStrip context={config.context} />

          <GuideCategoryStartPanel
            startDescription={config.startPanel.startDescription}
            questionTitle={config.startPanel.questionTitle}
            leadParagraph={preface.leadParagraph ? stripMarkdown(preface.leadParagraph) : undefined}
            supportingParagraphs={preface.supportingParagraphs.map((paragraph) => stripMarkdown(paragraph))}
            callout={
              preface.callout
                ? {
                    title: preface.callout.title,
                    body: stripMarkdown(preface.callout.body),
                  }
                : null
            }
            summaryCards={config.startPanel.summaryCards}
            questionTitleClassName="max-w-none"
            leadParagraphClassName="max-w-[38rem]"
          />

          <GuideComparisonBand
            eyebrow="Category comparison"
            title={config.comparison.title}
            description={config.comparison.description}
            groups={config.comparison.groups}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock title={config.fitCheck.title} description={config.fitCheck.description} items={decisionItems} />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These are the category traps that usually make the page feel more confusing than it needs to."
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
            groups={config.productExamples.groups}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[7].id} background="white">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="Takeaways"
            title="Takeaways"
            description="Keep the short version, then move into the next comparison while it still feels obvious."
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
