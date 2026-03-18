import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideFullSizeInteractivePlanner, { type FullSizePlannerTopic } from '@/components/guides/GuideFullSizeInteractivePlanner';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import type { GuideHeroJumpLink, GuideHubDecisionItem, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import { STROLLER_COMPARISON_CARDS, STROLLER_SERIES_CARDS } from '@/lib/guides/strollerHub';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const FULL_SIZE_GUIDE_PATH = getGuidePath({ slug: 'full-size-modular-strollers' });
const STROLLER_GUIDE_PATH = getGuidePath({ slug: 'best-strollers' });
const COMPACT_GUIDE_PATH = getGuidePath({ slug: 'compact-lightweight-strollers' });
const DOUBLE_GUIDE_PATH = getGuidePath({ slug: 'double-strollers' });

const FULL_SIZE_SERIES_CARDS = STROLLER_SERIES_CARDS.filter((card) => card.href !== FULL_SIZE_GUIDE_PATH);

const FULL_SIZE_CONTINUE_LINKS: GuideHubLink[] = FULL_SIZE_SERIES_CARDS.filter((card) =>
  ['Compact Strollers', 'Travel Strollers'].includes(card.title),
).map((card) => ({
  title: card.title,
  description: card.description,
  href: card.href,
  icon: card.icon,
}));

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

function buildDecisionItems(sourceRoute: string): GuideHubDecisionItem[] {
  return [
    {
      title: 'If you walk most days',
      description: 'Stay here and use the real-life fit section to test whether everyday comfort and basket space are truly earning the footprint.',
      href: `${sourceRoute}#real-life-fit`,
      icon: 'stroller',
    },
    {
      title: 'If the stroller mostly lives in the trunk',
      description: 'Compare compact and travel options before buying more stroller than your routine is actually asking for.',
      href: COMPACT_GUIDE_PATH,
      icon: 'compact',
    },
    {
      title: 'If sibling planning is driving the decision',
      description: 'Check the double and convertible path first so modularity does not quietly turn into size you never needed.',
      href: DOUBLE_GUIDE_PATH,
      icon: 'double',
    },
  ];
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
    const isRealLifeFit = section.title === 'Real-Life Fit';
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

    if (isRealLifeFit) {
      companions.push({
        kind: 'continue',
        title: 'Not sure this is the right amount of stroller?',
        description:
          'These next guides help when the decision is starting to tilt toward lighter everyday use, travel-first movement, or future-sibling planning.',
        links: FULL_SIZE_CONTINUE_LINKS,
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
  const plannerTopics = buildPlannerTopics({
    sectionOrder,
    faqEntries,
    disclosureText,
    showDisclosureAfterIntro,
    showDisclosureBeforeConclusion,
    showDisclosureBeforeAffiliates,
  });

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
        <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="stroller-hub-shell space-y-8 md:space-y-16">
            <MarketingSurface className="mx-auto max-w-6xl rounded-[1.75rem] border border-stone-200/70 bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[2rem] md:p-8 lg:p-10">
              <div className="max-w-3xl space-y-3">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Start here</p>
                <h2 className="font-serif text-[1.9rem] leading-[1.04] tracking-tight text-neutral-900 sm:text-3xl">
                  What this guide is helping you decide
                </h2>
                <p className="text-[0.98rem] leading-relaxed text-neutral-700">
                  This section is here to separate real everyday usefulness from the version of stroller shopping that mainly looks polished in a product photo.
                </p>
              </div>

              <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
                <div className="relative overflow-hidden rounded-[1.7rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f8_0%,#f9f2ea_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:p-6 md:p-7">
                  <div className="absolute right-[-1.5rem] top-[-1.75rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.22)_0%,rgba(215,161,175,0)_72%)]" />
                  <div className="relative space-y-5">
                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">The real question</p>
                      <h3 className="max-w-[11ch] font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
                        Does your week need more stroller, or just a prettier category?
                      </h3>
                    </div>

                    {prefaceBrief.leadParagraph ? (
                      <p className="text-[1rem] leading-8 text-neutral-700 sm:text-[1.04rem]">
                        {stripMarkdown(prefaceBrief.leadParagraph)}
                      </p>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.2rem] border border-white/70 bg-white/78 p-4 backdrop-blur-[2px]">
                        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Best signal</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">You expect real weekly stroller use, not occasional driveway appearances.</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/70 bg-white/78 p-4 backdrop-blur-[2px]">
                        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Usually worth paying for</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">Ride quality, basket access, and seat comfort you will notice repeatedly.</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/70 bg-white/78 p-4 backdrop-blur-[2px]">
                        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Common trap</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">Buying the category that looks complete before testing how it lives folded.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {prefaceBrief.supportingParagraphs.length > 0 ? (
                    <div className="rounded-[1.55rem] border border-stone-200/70 bg-[#fcfaf7] p-5 sm:p-6">
                      <div className="space-y-5 text-[1rem] leading-8 text-neutral-700">
                        {prefaceBrief.supportingParagraphs.map((paragraph) => (
                          <p key={paragraph}>{stripMarkdown(paragraph)}</p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {prefaceBrief.callout ? (
                    <div className="rounded-[1.55rem] border border-[rgba(232,154,174,0.26)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:p-6">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                        {prefaceBrief.callout.title?.trim() || 'Start with the routine'}
                      </p>
                      <p className="mt-4 text-[1rem] leading-8 text-[var(--color-accent-dark)]/92">
                        {stripMarkdown(prefaceBrief.callout.body)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </MarketingSurface>

            <GuideDecisionHelper
              id="full-size-decision-helper"
              eyebrow="Quick decision helper"
              title="Is full-size actually your lane?"
              description="Start with the friction you feel most in real life. That usually gets you to the right stroller category faster than another round of spec comparison."
              items={buildDecisionItems(sourceRoute)}
              variant="stroller-hub"
              ctaLabel="Open guide"
            />

            <GuideSectionDivider />

            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="desktop" layout="band" />
            </div>

            <GuideFullSizeInteractivePlanner sourceRoute={sourceRoute} topics={plannerTopics} />

            <GuideSectionDivider />

            <GuideCategoryCards
              id="stroller-series"
              eyebrow="Continue the series"
              title="Compare this category with the rest of the stroller guide"
              description="If full-size feels close but not quite right, the next answer is usually in one of the adjacent stroller categories, not in another premium showroom lap."
              cards={FULL_SIZE_SERIES_CARDS}
              variant="stroller-hub"
              ctaLabel="Read guide"
            />

            <GuideSectionDivider />

            <GuideSoftConversionCta
              title="Want stroller advice matched to your actual week?"
              description="The stroller decision gets simpler once someone helps you sort walking habits, vehicle space, storage, sibling planning, and whether modular features will really earn their place."
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
            />

            <GuideSectionDivider />

            <GuideCategoryCards
              eyebrow="Back to the hub"
              title="Use the stroller guide as your bigger map"
              description="The full-size guide should sharpen the decision. The main stroller hub helps you step back and compare the whole category again if you need the broader view."
              cards={[
                {
                  title: 'The Taylor-Made Stroller Guide',
                  description: 'Go back to the full stroller education hub to compare categories side by side.',
                  href: STROLLER_GUIDE_PATH,
                  icon: 'stroller',
                  imageSrc: '/assets/strollers/fullsize.png',
                  imageAlt: 'Illustration representing the stroller guide hub.',
                },
              ]}
              variant="stroller-hub"
              ctaLabel="Open hub"
            />
          </div>
        </div>
      </section>
    </>
  );
}
