import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCategoryPreviewSection from '@/components/guides/GuideCategoryPreviewSection';
import GuideComparisonCards from '@/components/guides/GuideComparisonCards';
import GuideLifestyleSelector from '@/components/guides/GuideLifestyleSelector';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import MarketingSurface from '@/components/ui/MarketingSurface';
import {
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideOutline,
  type GuideSection,
} from '@/lib/guides/articleOutline';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import {
  STROLLER_HUB_COMMON_MISTAKES,
  STROLLER_SELECTOR_ITEMS,
} from '@/lib/guides/strollerCluster';
import type { GuideHubLink } from '@/lib/guides/hubs';
import { getStrollerCategoryPreview, getStrollerCategoryVisual } from '@/lib/guides/strollerHub';
import { getStrollerHubCategoryGridCards } from '@/lib/guides/strollerSystem';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

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

function normalizeHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isStrollerCategorySection(section: GuideSection) {
  return normalizeHeading(section.title).includes('stroller categories');
}

const STROLLER_SECTION_ORDER = new Map([
  ['full size strollers', 0],
  ['full size everyday strollers', 0],
  ['full size modular strollers', 0],
  ['compact strollers', 1],
  ['travel strollers', 2],
  ['lightweight and travel strollers', 2],
  ['convertible single to double strollers', 3],
  ['convertible strollers', 3],
  ['double strollers', 4],
  ['side by side double strollers', 4],
  ['jogging and all terrain strollers', 5],
  ['jogging all terrain strollers', 5],
]);

function buildPrefaceBrief(content: string) {
  const cleanedContent = stripLeadingTopHeading(content);
  const blocks = extractStyledBlocks(cleanedContent);
  const pullquote = blocks.find((block): block is Extract<ParsedStyledBlock, { type: 'pullquote' }> => block.type === 'pullquote') ?? null;
  const callout = blocks.find((block): block is Extract<ParsedStyledBlock, { type: 'callout' }> => block.type === 'callout') ?? null;
  const textOnlyContent = stripStyledBlocksOfTypes(cleanedContent, ['pullquote', 'callout']);
  const { leadParagraph, remainingPreface } = splitPreface(textOnlyContent);

  return {
    leadParagraph,
    supportingParagraphs: remainingPreface
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    spotlight:
      pullquote
        ? {
            title: 'Real-life fit',
            body: pullquote.quote,
          }
        : callout
          ? {
              title: callout.title?.trim() || 'TMBC note',
              body: callout.body,
            }
          : null,
  };
}

function sortStrollerSubsections<T extends { title: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftOrder = STROLLER_SECTION_ORDER.get(normalizeHeading(left.title)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = STROLLER_SECTION_ORDER.get(normalizeHeading(right.title)) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

function toCategoryChipLabel(title: string) {
  const normalized = normalizeHeading(title);

  if (normalized.includes('full size')) {
    return 'Full-Size';
  }

  if (normalized.includes('compact')) {
    return 'Compact';
  }

  if (normalized.includes('travel')) {
    return 'Travel';
  }

  if (normalized.includes('convertible')) {
    return 'Convertible';
  }

  if (normalized.includes('double')) {
    return 'Double';
  }

  if (normalized.includes('jogging')) {
    return 'Jogging';
  }

  return title;
}

function CommonMistakesGrid() {
  return (
    <section id="common-stroller-mistakes" className="space-y-6">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          Common stroller mistakes
        </p>
        <h2 className="font-serif text-[1.85rem] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          The mistakes that usually make stroller shopping feel harder than it should
        </h2>
        <p className="max-w-[70ch] text-[0.98rem] leading-relaxed text-neutral-700">
          Most stroller regret starts earlier than the checkout page. It usually starts when parents compare brands before
          they understand which category is actually built for their life.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {STROLLER_HUB_COMMON_MISTAKES.map((mistake) => (
          <MarketingSurface
            key={mistake.title}
            className="rounded-[1.5rem] border border-stone-200/70 bg-white/92 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">Watch for this</p>
            <h3 className="mt-4 font-serif text-[1.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
              {mistake.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{mistake.description}</p>
          </MarketingSurface>
        ))}
      </div>
    </section>
  );
}

export default function GuideStrollerHub({
  guide,
  outline,
  nextStepLinks = [],
}: {
  guide: GuideArticleRecord;
  outline: GuideOutline;
  nextStepLinks?: GuideHubLink[];
}) {
  const preface = buildPrefaceBrief(outline.preface);
  const categorySection = outline.sections.find(isStrollerCategorySection) ?? null;
  const categoryBreakdown = categorySection ? splitGuideSectionContent(categorySection.content) : null;
  const previewSubsections = sortStrollerSubsections(categoryBreakdown?.subsections ?? []);
  const categoryChips = previewSubsections.map((subsection) => toCategoryChipLabel(subsection.title)).slice(0, 6);

  return (
    <div className="stroller-hub-shell space-y-6 sm:space-y-8 lg:space-y-16">
      <section className="mx-auto max-w-6xl">
        <MarketingSurface className="relative overflow-hidden rounded-[1.8rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe6_100%)] p-3.5 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(215,161,175,0.14),rgba(215,161,175,0)_68%)] sm:h-40" />

          <div className="relative grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            {preface.leadParagraph ? (
              <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(160deg,#fff8f7_0%,#f5ede5_100%)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:rounded-[1.45rem] sm:p-6 md:p-7">
                <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.2)_0%,rgba(215,161,175,0)_72%)]" />

                <div className="relative space-y-5 sm:space-y-6">
                  <div className="space-y-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Category-based guide</p>
                    <h2 className="max-w-[11ch] font-serif text-[1.72rem] leading-[0.95] tracking-[-0.05em] text-neutral-900 sm:text-[2.45rem] md:text-[2.8rem]">
                      Start with the stroller type.
                    </h2>
                    <div className="max-w-[32rem]">
                      <PostContent
                        postId={`${guide.id}-lead`}
                        content={preface.leadParagraph}
                        className="guide-post-content guide-hub-card-content"
                        variant="plain"
                        highlightBrandWordmark={true}
                      />
                    </div>
                  </div>

                  {categoryChips.length > 0 ? (
                    <div className="border-t border-[rgba(196,156,94,0.18)] pt-4 sm:pt-5">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">The categories get clearer fast</p>
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0">
                        {categoryChips.map((chip) => (
                          <span
                            key={chip}
                            className="shrink-0 rounded-full border border-[rgba(196,156,94,0.18)] bg-white/78 px-3 py-1.5 text-[0.75rem] uppercase tracking-[0.15em] text-neutral-800 sm:px-3.5 sm:py-2 sm:text-[0.78rem]"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="space-y-3 sm:space-y-4">
              {preface.supportingParagraphs.length > 0 ? (
                <div className="rounded-[1.35rem] border border-stone-200/70 bg-white/88 p-4 shadow-[0_14px_32px_rgba(0,0,0,0.04)] sm:rounded-[1.45rem] sm:p-6">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Why this guide exists</p>
                    <h3 className="font-serif text-[1.4rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-[1.8rem]">
                      Context first. Then comparison.
                    </h3>
                  </div>

                  <div className="mt-4">
                    <PostContent
                      postId={`${guide.id}-preface`}
                      content={preface.supportingParagraphs.join('\n\n')}
                      className="guide-post-content guide-hub-card-content"
                      variant="plain"
                      highlightBrandWordmark={true}
                    />
                  </div>
                </div>
              ) : null}

              {preface.spotlight ? (
                <div className="rounded-[1.35rem] border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(180deg,#fffdfd_0%,#f8edf1_100%)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)] sm:rounded-[1.45rem] sm:p-6">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    {preface.spotlight.title}
                  </p>
                  <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-7 text-[var(--color-accent-dark)]/92 sm:mt-4 sm:text-[1rem] sm:leading-8">
                    {preface.spotlight.body}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </MarketingSurface>
      </section>

      <GuideCategoryCards
        id="stroller-category-grid"
        eyebrow="All stroller categories"
        title="Compare every stroller lane at a glance"
        description="Each guide is built to help you choose what fits your life, not just what looks impressive on paper. Once the category is right, the model list gets much simpler."
        cards={getStrollerHubCategoryGridCards()}
        variant="stroller-hub"
        ctaLabel="Explore guide"
      />

      {previewSubsections.length > 0 ? (
        <>
          <GuideSectionDivider />

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {previewSubsections.map((subsection) => {
              const preview = getStrollerCategoryPreview(subsection.title);
              const visual = getStrollerCategoryVisual(subsection.title);

              if (!preview || !visual) {
                return null;
              }

              return (
                <GuideCategoryPreviewSection
                  key={subsection.id}
                  id={subsection.id}
                  title={subsection.title}
                  content={stripLeadingGuideHeading(subsection.content)}
                  postId={`${guide.id}-${subsection.id}-preview`}
                  imageSrc={visual.imageSrc}
                  imageAlt={visual.imageAlt}
                  examples={preview.examples}
                  href={preview.href}
                  ctaLabel={preview.ctaLabel}
                />
              );
            })}
          </div>
        </>
      ) : null}

      <GuideSectionDivider />

      <GuideLifestyleSelector
        id="find-your-stroller-type"
        title="Find your stroller type"
        items={[...STROLLER_SELECTOR_ITEMS]}
      />

      <GuideSectionDivider />

      <CommonMistakesGrid />

      {nextStepLinks.length > 0 ? (
        <>
          <GuideSectionDivider />

          <GuideComparisonCards
            title="Prefer recommendation-style reads after the category guidance?"
            description="These journal pieces are the better next step once you know which stroller lane makes sense and want a tighter list of models or comparison angles."
            cards={nextStepLinks}
          />
        </>
      ) : null}

      <GuideSectionDivider />

      <GuideSoftConversionCta
        title="Want someone to narrow the stroller decision with you?"
        description="Taylor-Made Baby Planning helps parents sort stroller type, car seat compatibility, storage realities, walking habits, and sibling planning without turning the process into a second full-time job."
        href="/services"
        ctaLabel="Learn about Taylor-Made Baby Planning"
      />
    </div>
  );
}
