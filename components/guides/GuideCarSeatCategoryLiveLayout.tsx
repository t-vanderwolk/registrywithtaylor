import PostContent from '@/components/blog/PostContent';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideHero from '@/components/guides/GuideHero';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideStrollerInteractivePlanner, {
  type StrollerInteractivePlannerConfig,
  type StrollerPlannerTopic,
} from '@/components/guides/GuideStrollerInteractivePlanner';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import {
  getCoreGuideRouteCards,
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
  getGuideJourneyPath,
  getGuideLifestyleImages,
  getGuideParentLink,
  getGuideRealLifePrompt,
} from '@/lib/guides/experience';
import { getGuideFinalThought, getGuideSignOff, getGuideTakeaways } from '@/lib/guides/editorialSystem';
import type { GuideHeroJumpLink } from '@/lib/guides/hubs';
import { getDefaultNextSteps, getGuideOrientation, normalizeGuideLinks } from '@/lib/guides/guideFlow';
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

function findCommonMistakesSection(sections: ReturnType<typeof buildGuideOutline>['sections']) {
  return (
    sections.find((section) => {
      const normalized = normalizeValue(section.title);
      return (
        normalized.includes('watch out') ||
        normalized.includes('mistake') ||
        normalized.includes('watchout')
      );
    }) ?? null
  );
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
  const orientation = getGuideOrientation({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const breadcrumbs = getGuideBreadcrumbs({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const parentGuide = getGuideParentLink({
    slug: guide.slug,
    topicCluster: guide.topicCluster,
  });
  const coreGuideRoutes = getCoreGuideRouteCards({
    slug: guide.slug,
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
  const nextSteps = normalizeGuideLinks(
    [
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
      {
        href: config.context.hubHref,
        label: `Back to ${config.context.hubLabel}`,
        description: `Return to the broader ${config.context.currentLabel.toLowerCase()} map if you need the wider lane context again.`,
        stage: 'Start' as const,
      },
      ...config.continueExploring.links.map((link) => ({
        href: link.href,
        label: link.title,
        description: link.description,
        stage: 'Refine' as const,
      })),
    ],
    4,
  );
  const commonMistakesSection = findCommonMistakesSection(outline.sections);
  const slideItems = [
    { id: 'car-seat-guide-overview', label: 'Title + Intro', shortLabel: 'Intro' },
    { id: 'car-seat-guide-start', label: 'Orientation', shortLabel: 'Start' },
    { id: 'interactive-planner', label: 'What Matters', shortLabel: 'Matter' },
    { id: 'car-seat-guide-fit', label: 'Decision Framework', shortLabel: 'Decide' },
    { id: 'car-seat-guide-education', label: 'Critical Education', shortLabel: 'Know' },
    { id: commonMistakesSection?.id ?? 'car-seat-guide-mistakes', label: 'What People Get Wrong', shortLabel: 'Avoid' },
    { id: 'car-seat-guide-continue', label: 'Next Steps', shortLabel: 'Next' },
  ] as const;
  const heroJumpLinks: GuideHeroJumpLink[] = slideItems.slice(1).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));
  const criticalEducationItems = showCompatibilityGenerator
    ? [
        'All infant car seats can be installed without a base. The base is convenience, not requirement.',
        'Travel systems explain how an infant seat clicks into a stroller. They do not prove the stroller is the strongest long-term choice.',
        'If you want click-in convenience, confirm seat-to-stroller compatibility after the stroller lane is clear.',
        'When a matching infant seat and a longer-lasting stroller pull against each other, stroller longevity usually matters more.',
      ]
    : [
        'Stage fit, install confidence, and daily loading habits matter more than the feature list sounding impressive.',
        'If a travel-system question is steering the decision, solve the stroller lane first and then confirm the car seat pairing.',
        'The seat should fit the stroller if you want click-in convenience, but the stroller still tends to have the longer job.',
      ];
  const fallbackMistakes = [
    'Picking the category label first and only later asking whether the actual stage or fit problem matches.',
    'Treating convenience language like a safety rule, especially around bases, rotating features, or click-in marketing.',
    'Letting compatibility shorthand outrank install confidence, car fit, or how long the setup will realistically serve you.',
  ];
  const finalThought = getGuideFinalThought({
    guide: {
      slug: guide.slug,
      category: guide.category,
      topicCluster: guide.topicCluster,
    },
    outline,
  });
  const takeaways = getGuideTakeaways({
    guide: { slug: guide.slug },
    outline,
    extraItems: [
      criticalEducationItems[0] ?? '',
      config.fitCheck.fitSummary,
      config.fitCheck.signatureMoment,
    ],
  });
  const signOff = getGuideSignOff({
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
  });

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={[...slideItems]}
      backLink={{ href: config.context.hubHref, label: `Back to ${config.context.hubLabel}` }}
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

          <GuideHero
            parentLink={{ href: config.context.hubHref, label: config.context.hubLabel }}
            eyebrow={config.heroEyebrow}
            title={guide.title}
            description={config.heroDescription}
            readTime={`${readingTime} min`}
            publishedLabel={formatArticleDate(displayDate)}
            sectionCount={slideItems.length - 1}
            jumpLinks={heroJumpLinks}
            imageSrc={null}
            imageAlt={guide.title}
            variant="stroller-category"
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="blush">
        <div className="stroller-hub-shell space-y-6 sm:space-y-8">
            <GuideContextStrip context={config.context} />

            <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />

          <GuideJourneyIntro
            title="The setup underneath the label matters more than the label itself."
            description="Start here to get the category grounded in real life before you move into planner tabs, comparison pressure, or the most convincing product page."
            intro={[
              config.heroDescription,
              'This is a narrower category guide, which means it works best after the main car-seat guide has already given you the wider stage context.',
            ]}
            calloutBody={getGuideRealLifePrompt({
              slug: guide.slug,
              category: guide.category,
              topicCluster: guide.topicCluster,
            })}
            parentGuide={parentGuide}
            whoThisIsFor={config.fitCheck.fitBullets.slice(0, 4)}
            whatThisIs={`A narrower car seat category guide for parents pressure-testing the ${config.context.currentLabel.toLowerCase()} lane before they shortlist specific seats.`}
            whyItExists={config.startPanel.startDescription}
          />

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

          {lifestyleImages.length > 0 ? <GuideLifestyleGallery images={lifestyleImages} /> : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="ivory">
        <div className="space-y-5">
          <div className="space-y-4">
            <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="mobile" />
            <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="desktop" layout="band" />
          </div>

          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
              What Matters
            </p>
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 md:text-[2.4rem]">
              The considerations that usually make the category clearer.
            </h2>
            <p className="text-sm leading-7 text-neutral-700 md:text-[1rem]">
              Work through the guide like a guided editorial experience: understand the lane, pressure-test the fit, and only then get more specific.
            </p>
          </div>

          <GuideStrollerInteractivePlanner topics={plannerTopics} config={plannerConfig} />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="white">
        <div className="space-y-5">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
              Decision Framework
            </p>
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 md:text-[2.4rem]">
              Use the shorter fit logic when you need the answer without rereading the whole guide.
            </h2>
          </div>

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
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="blush">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="Critical Education"
            title="The rules that keep the car seat decision calmer."
            description="These are the points that usually reduce confusion before compatibility shorthand or feature lists take over."
            items={criticalEducationItems}
          />

          {showCompatibilityGenerator ? (
            <section id="travel-system-compatibility" className="space-y-5 scroll-mt-28">
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
          ) : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="white">
        {commonMistakesSection ? (
          <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="space-y-4">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                What People Get Wrong
              </p>
              <PostContent
                postId={`${guide.id}-${commonMistakesSection.id}-common-mistakes`}
                content={stripLeadingGuideHeading(commonMistakesSection.content)}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </div>
          </MarketingSurface>
        ) : (
          <GuideBulletSection
            eyebrow="What People Get Wrong"
            title="What People Get Wrong"
            description="These are the habits that usually make a smaller car seat decision feel larger than it needs to."
            items={fallbackMistakes}
          />
        )}
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
            consultationDescription={`The ${config.context.currentLabel.toLowerCase()} decision gets much easier once someone helps you weigh stage, car fit, loading habits, and how long the seat really needs to work.`}
          />

          {coreGuideRoutes.length > 0 ? (
            <GuideCategoryCards
              eyebrow="Core guides"
              title="Keep the broader TMBC routes within reach."
              description="If this sub-guide helped, the next move should stay obvious instead of turning back into a fresh search."
              cards={coreGuideRoutes}
              ctaLabel="Open guide"
            />
          ) : null}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
