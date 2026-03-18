import type { ReactNode } from 'react';
import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideComparisonCards from '@/components/guides/GuideComparisonCards';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries } from '@/lib/blog/contentText';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import {
  getStrollerCategoryDecisionItems,
  getStrollerCategoryGuideConfig,
  getStrollerHubBackLinkCard,
  getStrollerRelatedGuideCards,
} from '@/lib/guides/strollerCluster';
import type { GuideHubLink } from '@/lib/guides/hubs';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';
import Comparison from '@/components/content-widgets/Comparison';
import ProductCard from '@/components/content-widgets/ProductCard';

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

function findSectionContent(
  sections: ReturnType<typeof buildGuideOutline>['sections'],
  titles: string[],
) {
  const normalizedTitles = titles.map((title) => title.trim().toLowerCase());
  const match = sections.find((section) => normalizedTitles.includes(section.title.trim().toLowerCase()));
  return match ? stripLeadingGuideHeading(match.content) : '';
}

function buildTocItems({
  hasLearningModules,
  hasExamples,
  hasNextStepLinks,
  faqCount,
}: {
  hasLearningModules: boolean;
  hasExamples: boolean;
  hasNextStepLinks: boolean;
  faqCount: number;
}): GuideTocItem[] {
  return [
    { id: 'what-this-category-is', label: 'What This Category Is', level: 2 },
    ...(hasLearningModules ? [{ id: 'category-lessons', label: 'Category Lessons', level: 2 as const }] : []),
    { id: 'who-it-works-for', label: 'Who It Works For', level: 2 },
    { id: 'when-it-may-not-fit', label: 'When It May Not Fit', level: 2 },
    { id: 'common-mistakes', label: 'Common Mistakes', level: 2 },
    ...(hasExamples ? [{ id: 'product-examples', label: 'Product Examples', level: 2 as const }] : []),
    { id: 'related-stroller-types', label: 'Related Stroller Types', level: 2 },
    ...(hasNextStepLinks ? [{ id: 'category-next-reads', label: 'Next Reads', level: 2 as const }] : []),
    ...(faqCount > 0 ? [{ id: 'guide-faq', label: 'FAQ', level: 2 as const }] : []),
  ];
}

function GuidePostSurface({
  id,
  eyebrow,
  title,
  content,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  content?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28">
      <MarketingSurface className="min-w-0 rounded-[2rem] border border-black/6 bg-white/94 p-6 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-8">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[1.85rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-[2.45rem]">
            {title}
          </h2>
        </div>

        {content ? (
          <div className="mt-6">
            <PostContent
              postId={`${id}-content`}
              content={content}
              className="guide-post-content stroller-guide-content stroller-guide-content--wide guide-post-content--subsection"
              variant="plain"
              highlightBrandWordmark={true}
            />
          </div>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}
      </MarketingSurface>
    </section>
  );
}

function normalizeSectionTitle(title: string) {
  return title.trim().toLowerCase();
}

function getSupplementalSections({
  sections,
  renderedTitles,
}: {
  sections: ReturnType<typeof buildGuideOutline>['sections'];
  renderedTitles: string[];
}) {
  const renderedTitleSet = new Set(renderedTitles.map((title) => normalizeSectionTitle(title)));
  const skippedTitles = new Set(
    ['Introduction', 'Quick Guide Navigation', 'FAQ', 'Final Thoughts'].map((title) => normalizeSectionTitle(title)),
  );

  return sections.filter((section) => {
    const normalizedTitle = normalizeSectionTitle(section.title);
    return !renderedTitleSet.has(normalizedTitle) && !skippedTitles.has(normalizedTitle);
  });
}

function LearningModuleSection({
  sections,
}: {
  sections: ReturnType<typeof buildGuideOutline>['sections'];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <section id="category-lessons" className="min-w-0 scroll-mt-28 space-y-6">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Category lessons</p>
        <h2 className="font-serif text-[1.85rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-[2.45rem]">
          The lessons that make this category easier to understand
        </h2>
        <p className="max-w-[70ch] text-[0.98rem] leading-relaxed text-neutral-700">
          This section is meant to feel more like a decision library than a long article. Use the sections below to compare the
          ideas parents usually need before they start narrowing model lists.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <GuidePostSurface
            key={section.id}
            id={section.id}
            eyebrow={`Lesson ${String(index + 1).padStart(2, '0')}`}
            title={section.title}
            content={stripLeadingGuideHeading(section.content)}
          />
        ))}
      </div>
    </section>
  );
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

function splitProductExampleContent(content: string) {
  const blocks = extractStyledBlocks(content);

  return {
    products: blocks.filter((block): block is Extract<ParsedStyledBlock, { type: 'product' }> => block.type === 'product'),
    comparisons: blocks.filter(
      (block): block is Extract<ParsedStyledBlock, { type: 'comparison' }> => block.type === 'comparison',
    ),
    narrative: stripStyledBlocksOfTypes(content, ['product', 'comparison']),
  };
}

export default function GuideStrollerCategoryLayout({
  guide,
  displayDate,
  readingTime,
  sourceRoute,
  strollerJournalLinks = [],
}: {
  guide: GuideArticleRecord;
  displayDate: Date;
  readingTime: number;
  sourceRoute: string;
  strollerJournalLinks?: GuideHubLink[];
}) {
  const config = getStrollerCategoryGuideConfig(guide.slug);
  if (!config) {
    return null;
  }

  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const whatSectionContent = findSectionContent(outline.sections, config.whatSectionTitles);
  const realLifeFitContent = findSectionContent(outline.sections, ['Real-Life Fit']);
  const expertAdviceContent = findSectionContent(outline.sections, ['Expert Advice']);
  const commonMistakesContent = findSectionContent(outline.sections, ['Common Mistakes Parents Make']);
  const exampleModelsContent = findSectionContent(outline.sections, [
    'Product Examples',
    'Example Models',
    'Products Worth Understanding',
  ]);
  const supplementalSections = getSupplementalSections({
    sections: outline.sections,
    renderedTitles: [
      ...config.whatSectionTitles,
      'Real-Life Fit',
      'Expert Advice',
      'Common Mistakes Parents Make',
      'Product Examples',
      'Example Models',
      'Products Worth Understanding',
    ],
  });
  const productExamples = exampleModelsContent ? splitProductExampleContent(exampleModelsContent) : null;
  const tocItems = buildTocItems({
    hasLearningModules: supplementalSections.length > 0,
    hasExamples: Boolean(exampleModelsContent),
    hasNextStepLinks: strollerJournalLinks.length > 0,
    faqCount: faqEntries.length,
  });
  const heroJumpLinks = tocItems.slice(0, 5).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={guide.category}
        title={guide.title}
        description={guide.excerpt?.trim() || config.heroDescription}
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={tocItems.length}
        jumpLinks={heroJumpLinks}
        imageSrc={guide.heroImageUrl}
        imageAlt={guide.heroImageAlt}
        variant="stroller-category"
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="w-full px-5 py-10 sm:px-8 lg:px-10 lg:py-16 xl:px-12 2xl:px-16">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:gap-10 xl:gap-12">
            <div className="min-w-0 stroller-hub-shell space-y-8">
              <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="mobile" />

              {outline.preface ? (
                <MarketingSurface className="relative min-w-0 overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,246,241,0.98)_100%)] px-5 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.05)] sm:rounded-[2.2rem] md:px-8 md:py-8">
                  <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.18)_0%,rgba(215,161,175,0)_72%)]" />
                  <div className="relative">
                    <PostContent
                      postId={`${guide.id}-preface`}
                      content={outline.preface}
                      className="guide-post-content stroller-guide-content stroller-guide-content--lead stroller-guide-content--wide"
                      variant="plain"
                      highlightBrandWordmark={true}
                    />
                  </div>
                </MarketingSurface>
              ) : null}

              <MarketingSurface className="min-w-0 rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Quick fit check</p>
                    <h2 className="font-serif text-[1.9rem] leading-[1.04] tracking-tight text-neutral-900 sm:text-3xl">
                      Before you compare models, make sure this category fits your week.
                    </h2>
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-neutral-700">
                    <p>{config.worksForSummary}</p>
                    <p>{config.notBestFitSummary}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <GuideDecisionHelper
                    id="category-decision-helper"
                    eyebrow="Quick decision helper"
                    title={`Use the ${config.shortTitle.toLowerCase()} lane more confidently`}
                    description="This should feel like a category decision, not a personality test. Start with the friction your routine makes obvious."
                    items={getStrollerCategoryDecisionItems({
                      slug: guide.slug,
                      sourceRoute,
                    })}
                    variant="stroller-hub"
                    ctaLabel="Open section"
                  />
                </div>
              </MarketingSurface>
              <GuidePostSurface
                id="what-this-category-is"
                eyebrow="What this category is"
                title="What parents are actually choosing in this category"
                content={whatSectionContent}
              />

              {supplementalSections.length > 0 ? <LearningModuleSection sections={supplementalSections} /> : null}

              <GuidePostSurface id="who-it-works-for" eyebrow="Who it works for" title="Who this category tends to help most" content={realLifeFitContent}>
                <div className="rounded-[1.35rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,#fffaf6_0%,#fcf7f1_100%)] p-4 md:p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">Quick read</p>
                  <ul className="mt-4 space-y-3">
                    {config.worksForBullets.map((bullet) => (
                      <li key={bullet} className="text-sm leading-7 text-neutral-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </GuidePostSurface>

              <GuidePostSurface
                id="when-it-may-not-fit"
                eyebrow="When it may not be the best fit"
                title="When this category may be more stroller than you need"
                content={expertAdviceContent}
              >
                <div className="rounded-[1.35rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,#fffaf6_0%,#fcf7f1_100%)] p-4 md:p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">Watch for this</p>
                  <ul className="mt-4 space-y-3">
                    {config.notBestFitBullets.map((bullet) => (
                      <li key={bullet} className="text-sm leading-7 text-neutral-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </GuidePostSurface>

              <GuidePostSurface
                id="common-mistakes"
                eyebrow="Common mistakes"
                title="The mistakes that tend to create regret in this lane"
                content={commonMistakesContent}
              />

              {exampleModelsContent ? (
                <section id="product-examples" className="min-w-0 scroll-mt-28">
                  <MarketingSurface className="min-w-0 rounded-[2rem] border border-black/6 bg-white/94 p-6 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-8">
                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Product examples</p>
                      <h2 className="font-serif text-[1.85rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-[2.45rem]">
                        Product examples worth understanding once the category fits
                      </h2>
                    </div>

                    {productExamples?.narrative ? (
                      <div className="mt-6">
                        <PostContent
                          postId={`${guide.id}-product-examples-narrative`}
                          content={productExamples.narrative}
                          className="guide-post-content stroller-guide-content stroller-guide-content--wide guide-post-content--subsection"
                          variant="plain"
                          highlightBrandWordmark={true}
                        />
                      </div>
                    ) : null}

                    {productExamples?.products.length ? (
                      <>
                        {productExamples.comparisons.length > 0 ? (
                          <div className="mt-6 space-y-4 [&_.content-widget]:my-0">
                            {productExamples.comparisons.map((comparison, index) => (
                              <Comparison
                                key={`${guide.id}-product-example-comparison-${index}`}
                                title={comparison.title}
                                rows={comparison.rows}
                              />
                            ))}
                          </div>
                        ) : null}

                      <div className="mt-6 space-y-5 [&_.content-widget]:my-0">
                        {productExamples.products.map((product, index) => (
                          <ProductCard
                            key={`${guide.id}-product-example-${product.brand}-${product.productName}-${index}`}
                            brand={product.brand}
                            productName={product.productName}
                            review={product.shortReview}
                            bestFor={product.bestFor}
                            standout={product.standout ?? undefined}
                            pros={product.pros}
                            affiliateLinks={product.affiliateLinks}
                            imageUrl={product.imageUrl}
                            imageAlt={product.imageAlt}
                          />
                        ))}
                      </div>
                      </>
                    ) : null}
                  </MarketingSurface>
                </section>
              ) : null}

              <GuideCategoryCards
                id="related-stroller-types"
                eyebrow="Related stroller types"
                title="Compare this category with the nearby stroller paths"
                description="The next best comparison is usually another stroller type, not another premium brand carousel."
                cards={getStrollerRelatedGuideCards(guide.slug)}
                variant="stroller-hub"
                ctaLabel="Explore guide"
              />

              {strollerJournalLinks.length > 0 ? (
                <div id="category-next-reads" className="scroll-mt-28">
                  <GuideComparisonCards
                    title="Ready for recommendations instead of category education?"
                    description="These journal pieces are the next step once you know this stroller type makes sense and want a tighter comparison lens."
                    cards={strollerJournalLinks}
                  />
                </div>
              ) : null}

              <GuideCategoryCards
                eyebrow="Back to the stroller hub"
                title="Use the main stroller hub as your bigger map"
                description="Go back to the pillar guide if you want to compare the full stroller cluster side by side again."
                cards={getStrollerHubBackLinkCard()}
                variant="stroller-hub"
                ctaLabel="Open hub"
              />

              <GuideSoftConversionCta
                title="Need a second set of eyes on the stroller decision?"
                description="Taylor-Made Baby Planning helps parents narrow the stroller category, talk through tradeoffs, and stop comparing options that were never meant for the same life."
                href="/services"
                ctaLabel="Learn about Taylor-Made Baby Planning"
              />

              <GuideFaqAccordion items={faqEntries} />
            </div>

            <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="desktop" />
          </div>
        </div>
      </section>
    </>
  );
}
