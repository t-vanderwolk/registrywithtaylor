import PostContent from '@/components/blog/PostContent';
import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideExampleBlock from '@/components/guides/GuideExampleBlock';
import GuideFAQ from '@/components/guides/GuideFAQ';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries } from '@/lib/blog/contentText';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import {
  buildGuideOutline,
  stripLeadingGuideHeading,
  type GuideSection,
  type GuideTocItem,
} from '@/lib/guides/articleOutline';
import {
  getCarSeatCategoryGuideConfig,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import type { GuideHeroJumpLink } from '@/lib/guides/hubs';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

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

function isFaqSection(section: GuideSection) {
  return normalizeValue(section.title) === 'faq';
}

function isProductExamplesSection(section: GuideSection) {
  return normalizeValue(section.title).includes('product examples');
}

function buildHeroJumpLinks({
  hasProductExamples,
  hasFaq,
}: {
  hasProductExamples: boolean;
  hasFaq: boolean;
}): GuideHeroJumpLink[] {
  return [
    { label: 'Start here', href: '#car-seat-guide-start' },
    { label: 'Fit check', href: '#car-seat-guide-fit' },
    ...(hasProductExamples ? [{ label: 'Examples', href: '#car-seat-guide-examples' }] : []),
    ...(hasFaq ? [{ label: 'FAQ', href: '#guide-faq' }] : []),
    { label: 'Continue', href: '#car-seat-guide-continue' },
  ];
}

function getVisibleTocItems(items: GuideTocItem[]) {
  return items.filter((item) => normalizeValue(item.label) !== 'faq');
}

function GuideNarrativeSection({
  guideId,
  section,
}: {
  guideId: string;
  section: GuideSection;
}) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <MarketingSurface className="rounded-[1.55rem] border border-stone-200/70 bg-white/92 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[1.8rem] md:p-7">
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">Guide topic</p>
          <h2 className="font-serif text-[1.55rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-[1.9rem]">
            {section.title}
          </h2>
        </div>

        <div className="mt-5">
          <PostContent
            postId={`${guideId}-${section.id}`}
            content={stripLeadingGuideHeading(section.content)}
            className="guide-post-content"
            variant="plain"
            highlightBrandWordmark={true}
          />
        </div>
      </MarketingSurface>
    </section>
  );
}

export default function GuideCarSeatCategoryLiveLayout({
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
  const articleContent = sanitizeGuideContent(guide.content);
  const outline = buildGuideOutline(articleContent);
  const preface = buildPrefaceBrief(articleContent);
  const faqItems = dedupeFaqEntries({ guide, articleContent });
  const visibleTocItems = getVisibleTocItems(outline.tocItems);
  const hasProductExamples = outline.sections.some(isProductExamplesSection);
  const heroJumpLinks = buildHeroJumpLinks({
    hasProductExamples,
    hasFaq: faqItems.length > 0,
  });
  const topLevelSectionCount = visibleTocItems.filter((item) => item.level === 2).length || visibleTocItems.length || 1;

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={config.heroEyebrow}
        title={guide.title}
        description={config.heroDescription}
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={topLevelSectionCount}
        jumpLinks={heroJumpLinks}
        imageSrc={null}
        imageAlt={guide.title}
        variant="stroller-category"
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:space-y-10 lg:px-8 lg:py-10">
        <GuideContextStrip context={config.context} />

        <div id="car-seat-guide-start" className="scroll-mt-28">
          <GuideCategoryStartPanel
            startDescription={config.startPanel.startDescription}
            questionTitle={config.startPanel.questionTitle}
            leadParagraph={preface.leadParagraph}
            supportingParagraphs={preface.supportingParagraphs}
            callout={
              preface.callout
                ? {
                    title: preface.callout.title,
                    body: preface.callout.body,
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

        <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} layout="band" />

        <div className="space-y-6 sm:space-y-7">
          {outline.sections.map((section) => {
            if (isFaqSection(section)) {
              return null;
            }

            if (isProductExamplesSection(section)) {
              const productNarrative = stripStyledBlocksOfTypes(stripLeadingGuideHeading(section.content), [
                'product',
                'comparison',
                'faq',
              ]);

              return (
                <section id="car-seat-guide-examples" key={section.id} className="scroll-mt-28 space-y-4">
                  <MarketingSurface className="rounded-[1.55rem] border border-stone-200/70 bg-white/92 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[1.8rem] md:p-7">
                    <div className="space-y-2">
                      <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">Guide topic</p>
                      <h2 className="font-serif text-[1.55rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-[1.9rem]">
                        {section.title}
                      </h2>
                    </div>

                    {productNarrative ? (
                      <div className="mt-5">
                        <PostContent
                          postId={`${guide.id}-${section.id}-intro`}
                          content={productNarrative}
                          className="guide-post-content"
                          variant="plain"
                          highlightBrandWordmark={true}
                        />
                      </div>
                    ) : null}
                  </MarketingSurface>

                  <GuideExampleBlock
                    topicId={section.id}
                    products={config.productExamples}
                    comparisons={[]}
                  />
                </section>
              );
            }

            return <GuideNarrativeSection key={section.id} guideId={guide.id} section={section} />;
          })}
        </div>

        {faqItems.length > 0 ? (
          <section id="guide-faq" className="scroll-mt-28">
            <GuideFAQ
              items={faqItems.map((item, index) => ({
                id: `${guide.slug}-faq-${index + 1}`,
                question: item.question,
                answer: item.answer,
              }))}
            />
          </section>
        ) : null}

        <div id="car-seat-guide-continue" className="scroll-mt-28">
          <GuideContinueExploring
            title={config.continueExploring.title}
            description={config.continueExploring.description}
            links={config.continueExploring.links}
          />
        </div>
      </div>
    </>
  );
}
