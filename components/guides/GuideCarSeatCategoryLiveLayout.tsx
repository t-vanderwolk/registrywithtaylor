import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideStrollerInteractivePlanner, {
  type StrollerInteractivePlannerConfig,
  type StrollerPlannerTopic,
} from '@/components/guides/GuideStrollerInteractivePlanner';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import type { GuideHeroJumpLink } from '@/lib/guides/hubs';
import {
  getCarSeatCategoryGuideConfig,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function stripLeadingTopHeading(content: string) {
  const lines = content.split('\n');
  if (lines.length === 0) {
    return content.trim();
  }

  const firstLine = lines[0]?.trim() ?? '';
  if (firstLine.startsWith('# ')) {
    return lines.slice(1).join('\n').trim();
  }

  return content.trim();
}

function splitPreface(content: string) {
  const paragraphs = stripLeadingTopHeading(content)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const [leadParagraph = '', ...remainingParagraphs] = paragraphs;

  return {
    leadParagraph,
    remainingPreface: remainingParagraphs.join('\n\n'),
  };
}

function stripStyledBlocksOfTypes(content: string, blockTypes: ParsedStyledBlock['type'][]) {
  const typesToStrip = new Set(blockTypes);
  const lines = content.split('\n');
  const keptLines: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed || !isStyledBlockStart(trimmed)) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    if (typesToStrip.has(parsed.block.type)) {
      index = parsed.nextIndex;
      continue;
    }

    keptLines.push(...lines.slice(index, parsed.nextIndex));
    index = parsed.nextIndex;
  }

  return keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function sanitizeGuideContent(content: string) {
  return stripLeadingTopHeading(content)
    .replace(/\n+Start with confidence\.[\s\S]*$/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function buildPrefaceBrief(content: string) {
  const cleanedContent = sanitizeGuideContent(content);
  const blocks = extractStyledBlocks(cleanedContent);
  const callout = blocks.find((block): block is Extract<ParsedStyledBlock, { type: 'callout' }> => block.type === 'callout') ?? null;
  const textOnlyContent = stripStyledBlocksOfTypes(cleanedContent, ['callout']);
  const { leadParagraph, remainingPreface } = splitPreface(textOnlyContent);

  return {
    leadParagraph,
    supportingParagraphs: remainingPreface
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    callout,
  };
}

function dedupeFaqEntries({
  guide,
  articleContent,
}: {
  guide: GuideArticleRecord;
  articleContent: string;
}) {
  return [
    ...guide.faqItems.map((entry) => ({
      question: entry.question,
      answer: entry.answer,
    })),
    ...extractFaqEntries(articleContent),
  ].filter(
    (entry, index, collection) =>
      collection.findIndex(
        (candidate) =>
          candidate.question.toLowerCase() === entry.question.toLowerCase() &&
          candidate.answer.toLowerCase() === entry.answer.toLowerCase(),
      ) === index,
  );
}

function extractSectionSummary(content: string) {
  const blocks = sanitizeGuideContent(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !block.startsWith('### ') &&
        !block.startsWith(':::') &&
        !block.startsWith('![') &&
        !block.startsWith('- ') &&
        !/^\d+\.\s/.test(block),
    );

  return blocks[0] ? stripMarkdown(blocks[0]) : '';
}

function extractSectionHighlights(content: string) {
  const { subsections } = splitGuideSectionContent(sanitizeGuideContent(content));
  return subsections.map((subsection) => stripMarkdown(subsection.title)).slice(0, 3);
}

function isProductExamplesSection(title: string) {
  return normalizeValue(title).includes('product examples');
}

function sectionLabel(title: string) {
  switch (title) {
    case 'Introduction':
      return 'Overview';
    case 'Product Examples':
      return 'Product Picks';
    case 'Final Thoughts':
      return 'Final Thoughts';
    case 'FAQ':
      return 'FAQ';
    default:
      return title;
  }
}

function buildVisibleTocItems({
  outline,
  faqCount,
}: {
  outline: ReturnType<typeof buildGuideOutline>;
  faqCount: number;
}): GuideTocItem[] {
  const sectionItems = outline.tocItems
    .filter((item) => item.level === 2 && normalizeValue(item.label) !== 'faq')
    .map((item) => ({
      ...item,
      label: sectionLabel(item.label),
    }));

  if (faqCount > 0) {
    sectionItems.splice(Math.max(sectionItems.length - 1, 0), 0, {
      id: 'guide-faq',
      label: 'FAQ',
      level: 2,
    });
  }

  return sectionItems;
}

function buildPlannerTopics({
  sections,
  faqEntries,
  productExamples,
}: {
  sections: ReturnType<typeof buildGuideOutline>['sections'];
  faqEntries: { question: string; answer: string }[];
  productExamples: ReturnType<typeof getCarSeatCategoryGuideConfig>['productExamples'];
}): StrollerPlannerTopic[] {
  const topics: StrollerPlannerTopic[] = sections.map((section) => {
    const cleanedContent = sanitizeGuideContent(stripLeadingGuideHeading(section.content));
    const { introContent, subsections } = splitGuideSectionContent(cleanedContent);
    const overviewContent = sanitizeGuideContent(stripLeadingGuideHeading(introContent));
    const isProductTopic = isProductExamplesSection(section.title);
    const topicId = isProductTopic ? 'product-examples' : section.id;

    return {
      id: topicId,
      label: sectionLabel(section.title),
      title: section.title,
      summary: extractSectionSummary(cleanedContent),
      highlights: extractSectionHighlights(cleanedContent),
      overviewContent: overviewContent || (isProductTopic ? cleanedContent : undefined),
      cards: subsections.map((subsection) => ({
        id: subsection.id,
        eyebrow: 'Focus area',
        title: subsection.title,
        content: sanitizeGuideContent(stripLeadingGuideHeading(subsection.content)),
      })),
      companions: [],
      products: isProductTopic ? productExamples : undefined,
    };
  });

  if (faqEntries.length > 0) {
    topics.splice(Math.max(topics.length - 1, 0), 0, {
      id: 'guide-faq',
      label: 'FAQ',
      title: 'FAQ',
      summary: 'Quick answers to the questions parents usually still have once the category starts making more sense.',
      highlights: [],
      overviewContent: undefined,
      cards: [],
      companions: [],
      faqItems: faqEntries.map((entry, index) => ({
        id: `guide-faq-${index + 1}`,
        question: entry.question,
        answer: entry.answer,
      })),
    });
  }

  return topics;
}

function buildPlannerConfig({
  planner,
  currentLabel,
  continueDescription,
  continueLinks,
  hubHref,
  hubLabel,
}: {
  planner: ReturnType<typeof getCarSeatCategoryGuideConfig>['planner'];
  currentLabel: string;
  continueDescription: string;
  continueLinks: ReturnType<typeof getCarSeatCategoryGuideConfig>['continueExploring']['links'];
  hubHref: string;
  hubLabel: string;
}): StrollerInteractivePlannerConfig {
  const primaryNextLink = continueLinks[0];

  return {
    ...planner,
    finalCtaEyebrow: 'Next move',
    finalCtaTitle: primaryNextLink ? `Continue with ${primaryNextLink.title}` : `Return to the ${hubLabel}`,
    finalCtaDescription: primaryNextLink?.description ?? continueDescription,
    finalCtaHref: primaryNextLink?.href ?? hubHref,
    finalCtaLabel: primaryNextLink ? `Open ${primaryNextLink.title}` : `Open ${hubLabel}`,
    topicIcons: {
      introduction: 'book',
      'product-examples': 'bag',
      'guide-faq': 'checklist',
      'final-thoughts': 'book',
      ...planner.topicIcons,
    },
    topicTablistAriaLabel: `${currentLabel} guide topics`,
  };
}

export default async function GuideCarSeatCategoryLiveLayout({
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
  const config = getCarSeatCategoryGuideConfig(guide.slug as CarSeatCategoryGuideSlug);

  if (!config) {
    return null;
  }

  const articleContent = sanitizeGuideContent(guide.content);
  const outline = buildGuideOutline(articleContent);
  const preface = buildPrefaceBrief(outline.preface);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const showCompatibilityGenerator = guide.slug === 'infant-car-seats';
  const [compatibilityStrollers, compatibilityCarSeats] = showCompatibilityGenerator
    ? await Promise.all([getTravelSystemStrollers(), getTravelSystemCarSeats()])
    : [[], []];
  const visibleTocItems: GuideTocItem[] = [
    {
      id: 'interactive-planner',
      label: 'Interactive Planner',
      level: 2,
    },
    ...(showCompatibilityGenerator
      ? ([
          {
            id: 'travel-system-compatibility',
            label: 'Travel System Compatibility',
            level: 2,
          },
        ] satisfies GuideTocItem[])
      : []),
    ...buildVisibleTocItems({
      outline,
      faqCount: faqEntries.length,
    }),
  ];
  const heroJumpLinks: GuideHeroJumpLink[] = visibleTocItems.slice(0, 6).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));
  const plannerTopics = buildPlannerTopics({
    sections: outline.sections.filter((section) => normalizeValue(section.title) !== 'faq'),
    faqEntries,
    productExamples: config.productExamples,
  });
  const plannerConfig = buildPlannerConfig({
    planner: config.planner,
    currentLabel: config.context.currentLabel,
    continueDescription: config.continueExploring.description,
    continueLinks: config.continueExploring.links,
    hubHref: config.context.hubHref,
    hubLabel: config.context.hubLabel,
  });

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={config.heroEyebrow}
        title={guide.title}
        description={config.heroDescription}
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={visibleTocItems.length}
        jumpLinks={heroJumpLinks}
        imageSrc={null}
        imageAlt={guide.title}
        variant="stroller-category"
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="stroller-hub-shell space-y-6 sm:space-y-8 lg:space-y-16">
            <GuideContextStrip context={config.context} />

            <div id="car-seat-guide-start" className="scroll-mt-28">
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
                leadParagraphClassName="max-w-[36rem]"
              />
            </div>

            <div id="car-seat-guide-fit" className="scroll-mt-28">
              <GuideDecisionBlock
                title={config.fitCheck.title}
                description={config.fitCheck.description}
                fitSummary={config.fitCheck.fitSummary}
                fitBullets={config.fitCheck.fitBullets}
                notFitSummary={config.fitCheck.notFitSummary}
                notFitBullets={config.fitCheck.notFitBullets}
                signatureMoment={config.fitCheck.signatureMoment}
              />
            </div>

            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="desktop" layout="band" />
            </div>

            <GuideStrollerInteractivePlanner topics={plannerTopics} config={plannerConfig} />

            {showCompatibilityGenerator ? (
              <div id="travel-system-compatibility" className="scroll-mt-28">
                <section className="space-y-5">
                  <div className="max-w-3xl space-y-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      Compatibility Tool
                    </p>
                    <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 md:text-[2.4rem]">
                      Travel system compatibility
                    </h2>
                    <p className="text-sm leading-7 text-neutral-700 md:text-[1rem]">
                      If the stroller question is dragging the infant seat decision around with it, use this to check the real pairings before you commit. Start with the stroller or the infant seat, then see what actually fits and what kind of adapter story comes with it.
                    </p>
                  </div>

                  {compatibilityStrollers.length > 0 || compatibilityCarSeats.length > 0 ? (
                    <TravelSystemGenerator
                      strollers={compatibilityStrollers}
                      carSeats={compatibilityCarSeats}
                    />
                  ) : (
                    <div className="rounded-[1.8rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-white/78 px-5 py-6 text-sm leading-7 text-neutral-600">
                      The TMBC compatibility library is not available in this environment yet. Once the stroller and infant seat data are present, this section will show the same travel system generator used in the full tool.
                    </div>
                  )}
                </section>
              </div>
            ) : null}

            <div id="car-seat-guide-continue" className="scroll-mt-28">
              <GuideContinueExploring
                title={config.continueExploring.title}
                description={config.continueExploring.description}
                links={config.continueExploring.links}
              />
            </div>

            <GuideSectionDivider />

            <GuideSoftConversionCta
              title="Want help matching the right seat to your actual routine?"
              description={`The ${config.context.currentLabel.toLowerCase()} decision gets much easier once someone helps you weigh stage, car fit, loading habits, and how long the seat really needs to work.`}
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
            />
          </div>
        </div>
      </section>
    </>
  );
}
