import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideDecisionSteps from '@/components/guides/GuideDecisionSteps';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuidePageSection from '@/components/guides/GuidePageSection';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import ProductExampleGroup from '@/components/guides/ProductExampleGroup';
import { stripMarkdown } from '@/lib/blog/contentText';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import {
  buildDecisionStepsFromSections,
  buildPrefaceBrief,
  dedupeFaqEntries,
} from '@/lib/guides/decisionSystemContent';
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
  const steps = buildDecisionStepsFromSections(outline.sections, {
    excludeTitles: ['FAQ', 'Product Examples'],
  });
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const tocItems: GuideTocItem[] = [
    { id: 'guide-start', label: 'Start here', level: 2 },
    { id: 'guide-fit', label: 'Fit check', level: 2 },
    { id: 'guide-compare', label: 'Compare lanes', level: 2 },
    ...steps.map((step) => ({ id: step.id, label: step.title, level: 2 as const })),
    { id: 'guide-examples', label: 'Examples', level: 2 },
    { id: 'guide-continue', label: 'Continue exploring', level: 2 },
    ...(faqEntries.length > 0 ? [{ id: 'guide-faq', label: 'FAQ', level: 2 as const }] : []),
  ];
  const heroJumpLinks = tocItems.slice(0, 6).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={config.heroEyebrow}
        title={guide.title}
        description={guide.excerpt?.trim() || config.heroDescription}
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={tocItems.length}
        jumpLinks={heroJumpLinks}
        imageSrc={null}
        imageAlt={guide.title}
        variant="stroller-category"
      />

      <GuidePageSection tone="white" innerClassName="space-y-12 md:space-y-16">
        <GuideContextStrip context={config.context} />

        <GuideCTARibbon
          eyebrow="Start here"
          title="Start with the question hiding under the category name."
          description="Most of these categories make more sense once you connect them to your routine, your storage, and what you need the gear to do on an ordinary Tuesday."
          primaryCta={
            config.continueExploring.links[0]
              ? {
                  href: config.continueExploring.links[0].href,
                  label: `Compare ${config.continueExploring.links[0].title}`,
                }
              : null
          }
          secondaryCta={{
            href: config.context.hubHref,
            label: `Return to ${config.context.hubLabel}`,
          }}
        />

        <div id="guide-start" className="scroll-mt-28">
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
        </div>

        <div className="space-y-4">
          <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="mobile" />
          <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="desktop" layout="band" />
        </div>
      </GuidePageSection>

      <GuidePageSection tone="blush" innerClassName="space-y-12 md:space-y-16">
        <div id="guide-fit" className="scroll-mt-28">
          <GuideDecisionBlock {...config.fitCheck} />
        </div>

        <div id="guide-compare" className="scroll-mt-28">
          <GuideComparisonBand
            eyebrow="Category comparison"
            title={config.comparison.title}
            description={config.comparison.description}
            groups={config.comparison.groups}
          />
        </div>

        <GuideDecisionSteps
          title="Move through the decision one clear step at a time."
          description="This keeps the guide structured around what you need to understand next, not around how much copy can fit on one page."
          steps={steps}
        />

        <GuideCTARibbon
          eyebrow="Need the next click?"
          title="Keep moving without over-reading."
          description="If this category already feels mostly clear, use the next step links below and compare it against the closest alternative."
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
      </GuidePageSection>

      <GuidePageSection tone="white" innerClassName="space-y-12 md:space-y-16">
        <div id="guide-examples" className="scroll-mt-28">
          <ProductExampleGroup
            eyebrow="Product examples"
            title={config.productExamples.title}
            description={config.productExamples.description}
            groups={config.productExamples.groups}
          />
        </div>

        <div id="guide-continue" className="scroll-mt-28">
          <GuideContinueExploring
            title={config.continueExploring.title}
            description={config.continueExploring.description}
            links={config.continueExploring.links}
          />
        </div>

        {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}

        <GuideSoftConversionCta
          title={config.softCta.title}
          description={config.softCta.description}
          href="/services"
          ctaLabel="Learn about Taylor-Made Baby Planning"
        />
      </GuidePageSection>
    </>
  );
}
