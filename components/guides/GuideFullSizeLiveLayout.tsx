import GuideCategoryStartPanel from '@/components/guides/GuideCategoryStartPanel';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideFullSizeInteractivePlanner, { type FullSizePlannerTopic } from '@/components/guides/GuideFullSizeInteractivePlanner';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import type { GuideHeroJumpLink, GuideHubLink } from '@/lib/guides/hubs';
import { getStrollerCategoryGuideConfig, getStrollerRelatedGuideCards } from '@/lib/guides/strollerCluster';
import { STROLLER_COMPARISON_CARDS } from '@/lib/guides/strollerHub';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const HERO_LABELS: Record<string, string> = {
  'Interactive Planner': 'Interactive Planner',
  Introduction: 'Overview',
  'Why This Category Feels Overwhelming': 'Why It Feels Hard',
  'What Full-Size and Modular Really Mean': 'What It Means',
  'Real-Life Fit': 'Real-Life Fit',
  'Product Examples': 'Product Picks',
  'Common Mistakes Parents Make': 'Common Mistakes',
  'Final Thoughts': 'Final Thoughts',
  FAQ: 'FAQ',
};

const FULL_SIZE_PRODUCT_LINKS: GuideHubLink[] = [
  {
    title: 'Best Full-Size Strollers of 2026',
    description: 'Use the shortlist when you already know this category fits and you want the actual models worth comparing.',
    href: '/blog/best-full-size-strollers-2026',
    icon: 'stroller',
  },
  {
    title: 'Stroller Comparisons',
    description: 'Helpful when the shortlist is getting muddled by overlapping premium brands and feature language.',
    href: '/blog/stroller-comparisons',
    icon: 'strategy',
  },
  {
    title: 'Best Travel Strollers',
    description: 'A useful check if the question is quietly shifting from everyday comfort to portability and lighter carry.',
    href: '/blog/best-travel-strollers',
    icon: 'plane',
  },
];

const FULL_SIZE_START_DESCRIPTION =
  'This section is here to separate real everyday usefulness from the version of stroller shopping that mainly looks polished in a product photo.';

const FULL_SIZE_QUESTION_TITLE = 'Does your week need more stroller, or just a prettier category?';

const FULL_SIZE_SUMMARY_CARDS = [
  {
    eyebrow: 'Best signal',
    text: 'You expect real weekly stroller use, not occasional driveway appearances.',
  },
  {
    eyebrow: 'Usually worth paying for',
    text: 'Ride quality, basket access, and seat comfort you will notice repeatedly.',
  },
  {
    eyebrow: 'Common trap',
    text: 'Buying the category that looks complete before testing how it lives folded.',
  },
] as const;

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

function buildPrefaceBrief(content: string) {
  const cleanedContent = stripLeadingTopHeading(content);
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

function buildVisibleTocItems(outline: ReturnType<typeof buildGuideOutline>, faqCount: number): GuideTocItem[] {
  const sectionItems = outline.tocItems
    .filter((item) => item.level === 2 && item.label !== 'FAQ')
    .map((item) => ({
      ...item,
      label: HERO_LABELS[item.label] ?? item.label,
    }));

  if (faqCount > 0) {
    sectionItems.splice(Math.max(sectionItems.length - 1, 0), 0, {
      id: 'guide-faq',
      label: HERO_LABELS.FAQ,
      level: 2,
    });
  }

  return sectionItems;
}

function extractSectionSummary(content: string) {
  const blocks = content
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
  const { subsections } = splitGuideSectionContent(content);

  return subsections.map((subsection) => stripMarkdown(subsection.title)).slice(0, 3);
}

function buildPlannerTopics({
  sectionOrder,
  faqEntries,
  disclosureText,
  showDisclosureAfterIntro,
  showDisclosureBeforeConclusion,
  showDisclosureBeforeAffiliates,
}: {
  sectionOrder: ReturnType<typeof buildGuideOutline>['sections'];
  faqEntries: { question: string; answer: string }[];
  disclosureText: string;
  showDisclosureAfterIntro: boolean;
  showDisclosureBeforeConclusion: boolean;
  showDisclosureBeforeAffiliates: boolean;
}): FullSizePlannerTopic[] {
  const topics: FullSizePlannerTopic[] = sectionOrder.map((section) => {
    const trimmedContent = stripLeadingGuideHeading(section.content);
    const { introContent, subsections } = splitGuideSectionContent(trimmedContent);
    const overviewContent = stripLeadingGuideHeading(introContent);
    const companions: FullSizePlannerTopic['companions'] = [];
    const isProductSection = section.title === 'Product Examples';
    const isIntroduction = section.title === 'Introduction';
    const isFinalSection = section.title === 'Final Thoughts';
    const isCommonMistakes = section.title === 'Common Mistakes Parents Make';

    if (showDisclosureBeforeAffiliates && isProductSection) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (showDisclosureBeforeConclusion && isFinalSection) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (showDisclosureAfterIntro && isIntroduction) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (isProductSection) {
      companions.push({
        kind: 'comparison',
        title: 'Want the actual full-size stroller shortlist?',
        description: 'This is the faster next step once the category itself makes sense and you want the model list worth comparing.',
        cards: FULL_SIZE_PRODUCT_LINKS,
      });
    }

    if (isCommonMistakes) {
      companions.push({
        kind: 'comparison',
        title: 'Compare the next part of the decision',
        description:
          'These supporting reads help when the full-size conversation starts overlapping with travel needs, category confusion, or infant car seat compatibility.',
        cards: STROLLER_COMPARISON_CARDS,
      });
    }

    return {
      id: section.id,
      label: HERO_LABELS[section.title] ?? section.title,
      title: section.title,
      summary: extractSectionSummary(trimmedContent),
      highlights: extractSectionHighlights(trimmedContent),
      overviewContent: overviewContent || undefined,
      cards: subsections.map((subsection) => ({
        id: subsection.id,
        eyebrow: 'Focus area',
        title: subsection.title,
        content: stripLeadingGuideHeading(subsection.content),
      })),
      companions,
    };
  });

  if (faqEntries.length > 0) {
    topics.splice(Math.max(topics.length - 1, 0), 0, {
      id: 'guide-faq',
      label: HERO_LABELS.FAQ,
      title: 'FAQ',
      summary: 'Quick answers to the questions parents usually still have once the category starts making sense.',
      highlights: [],
      cards: [],
      companions: [],
      faqItems: faqEntries,
    });
  }

  return topics;
}

export default function GuideFullSizeLiveLayout({
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
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const prefaceBrief = buildPrefaceBrief(outline.preface);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const visibleTocItems: GuideTocItem[] = [
    {
      id: 'interactive-planner',
      label: HERO_LABELS['Interactive Planner'],
      level: 2,
    },
    ...buildVisibleTocItems(outline, faqEntries.length),
  ];
  const heroJumpLinks: GuideHeroJumpLink[] = visibleTocItems.slice(0, 6).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));
  const sectionOrder = outline.sections.filter((section) => section.title !== 'FAQ');
  const disclosureText =
    guide.affiliateDisclosureText?.trim() ||
    'Some links in this guide are affiliate links. Taylor-Made Baby Co. may earn a commission at no additional cost to you.';
  const showDisclosureAfterIntro =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const categoryConfig = getStrollerCategoryGuideConfig(guide.slug);
  const continueLinks = getStrollerRelatedGuideCards(guide.slug);
  const plannerTopics = buildPlannerTopics({
    sectionOrder,
    faqEntries,
    disclosureText,
    showDisclosureAfterIntro,
    showDisclosureBeforeConclusion,
    showDisclosureBeforeAffiliates,
  });

  if (!categoryConfig) {
    return null;
  }

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={guide.category}
        title={guide.title}
        description={
          guide.excerpt?.trim() ||
          'A stroller-category guide built to help you decide whether full-size comfort and modular flexibility fit your real week.'
        }
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={visibleTocItems.length}
        jumpLinks={heroJumpLinks}
        imageSrc={guide.heroImageUrl}
        imageAlt={guide.heroImageAlt}
        variant="stroller-category"
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="stroller-hub-shell space-y-6 sm:space-y-8 lg:space-y-16">
            <GuideContextStrip slug={guide.slug} />

            <GuideCategoryStartPanel
              startDescription={FULL_SIZE_START_DESCRIPTION}
              questionTitle={FULL_SIZE_QUESTION_TITLE}
              leadParagraph={prefaceBrief.leadParagraph ? stripMarkdown(prefaceBrief.leadParagraph) : undefined}
              supportingParagraphs={prefaceBrief.supportingParagraphs.map((paragraph) => stripMarkdown(paragraph))}
              callout={
                prefaceBrief.callout
                  ? {
                      title: prefaceBrief.callout.title,
                      body: stripMarkdown(prefaceBrief.callout.body),
                    }
                  : null
              }
              summaryCards={[...FULL_SIZE_SUMMARY_CARDS]}
              questionTitleClassName="max-w-none sm:max-w-[11ch]"
              leadParagraphClassName="max-w-none"
            />
            <GuideDecisionBlock
              title={`Use ${categoryConfig.shortTitle} as a fit check`}
              description="The fastest way to narrow this category is to decide whether the everyday tradeoff actually helps your week."
              fitSummary={categoryConfig.worksForSummary}
              fitBullets={categoryConfig.worksForBullets}
              notFitSummary={categoryConfig.notBestFitSummary}
              notFitBullets={categoryConfig.notBestFitBullets}
              signatureMoment={categoryConfig.signatureMoment}
            />

            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="desktop" layout="band" />
            </div>

            <GuideFullSizeInteractivePlanner sourceRoute={sourceRoute} topics={plannerTopics} />

            {continueLinks.length > 0 ? (
              <GuideContinueExploring
                title="Continue exploring the nearby stroller lanes"
                description="If full-size feels close but not quite right, compare the adjacent categories before you start swapping models inside the same lane."
                links={continueLinks}
              />
            ) : null}

            <GuideSectionDivider />

            <GuideSoftConversionCta
              title="Want stroller advice matched to your actual week?"
              description="The stroller decision gets simpler once someone helps you sort walking habits, vehicle space, storage, sibling planning, and whether modular features will really earn their place."
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
            />
          </div>
        </div>
      </section>
    </>
  );
}
