import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCategoryPreviewSection from '@/components/guides/GuideCategoryPreviewSection';
import GuideComparisonBand from '@/components/guides/GuideComparisonBand';
import GuideContextStrip from '@/components/guides/GuideContextStrip';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionBlock from '@/components/guides/GuideDecisionBlock';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideStageProgression from '@/components/guides/GuideStageProgression';
import MarketingSurface from '@/components/ui/MarketingSurface';
import {
  CAR_SEAT_HUB_CONTEXT,
  CAR_SEAT_HUB_FIT_CHECK,
  getCarSeatCategoryPreview,
  getCarSeatCategoryVisual,
  getCarSeatComparisonBandGroups,
  getCarSeatContinueExploringLinks,
  getCarSeatHubCategoryGridCards,
  getCarSeatHubStartingPointCards,
  getCarSeatStageProgressionItems,
} from '@/lib/guides/carSeatSystem';
import {
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideOutline,
  type GuideSection,
} from '@/lib/guides/articleOutline';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
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

function isCarSeatCategorySection(section: GuideSection) {
  return normalizeHeading(section.title).includes('car seat categories');
}

function isCarSeatSpecializedSection(section: GuideSection) {
  return normalizeHeading(section.title).includes('specialized car seat paths');
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

function toStageChipLabel(title: string) {
  const normalized = normalizeHeading(title);

  if (normalized.includes('infant')) {
    return 'Infant';
  }

  if (normalized.includes('convertible')) {
    return 'Convertible';
  }

  if (normalized.includes('all in one')) {
    return 'All-in-One';
  }

  if (normalized.includes('booster')) {
    return 'Booster';
  }

  return title;
}

const CAR_SEAT_SECTION_ORDER = new Map([
  ['infant car seats', 0],
  ['convertible car seats', 1],
  ['all in one car seats', 2],
  ['booster seats', 3],
  ['rotating car seats', 4],
  ['travel lightweight car seats', 5],
]);

function sortCarSeatSubsections<T extends { title: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftOrder = CAR_SEAT_SECTION_ORDER.get(normalizeHeading(left.title)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = CAR_SEAT_SECTION_ORDER.get(normalizeHeading(right.title)) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

export default function GuideCarSeatHub({
  guide,
  outline,
}: {
  guide: GuideArticleRecord;
  outline: GuideOutline;
}) {
  const preface = buildPrefaceBrief(outline.preface);
  const categorySection = outline.sections.find(isCarSeatCategorySection) ?? null;
  const specializedSection = outline.sections.find(isCarSeatSpecializedSection) ?? null;
  const categoryBreakdown = categorySection ? splitGuideSectionContent(categorySection.content) : null;
  const specializedBreakdown = specializedSection ? splitGuideSectionContent(specializedSection.content) : null;
  const previewSubsections = sortCarSeatSubsections(categoryBreakdown?.subsections ?? []);
  const specializedSubsections = sortCarSeatSubsections(specializedBreakdown?.subsections ?? []);
  const stageChips = previewSubsections.map((subsection) => toStageChipLabel(subsection.title)).slice(0, 4);

  return (
    <div className="stroller-hub-shell space-y-5 sm:space-y-8 lg:space-y-16">
      <section className="mx-auto max-w-6xl">
        <MarketingSurface className="relative overflow-hidden rounded-[1.8rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe6_100%)] p-3.5 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(215,161,175,0.14),rgba(215,161,175,0)_68%)] sm:h-40" />

          <div className="relative grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            {preface.leadParagraph ? (
              <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(160deg,#fff8f7_0%,#f5ede5_100%)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:rounded-[1.45rem] sm:p-6 md:p-7">
                <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.2)_0%,rgba(215,161,175,0)_72%)]" />

                <div className="relative space-y-5 sm:space-y-6">
                  <div className="space-y-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Stage-based guide</p>
                    <h2 className="max-w-[11ch] font-serif text-[1.72rem] leading-[0.95] tracking-[-0.05em] text-neutral-900 sm:text-[2.45rem] md:text-[2.8rem]">
                      Start with the stage.
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

                  {stageChips.length > 0 ? (
                    <div className="border-t border-[rgba(196,156,94,0.18)] pt-4 sm:pt-5">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">The path gets clearer fast</p>
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0">
                        {stageChips.map((chip) => (
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
                      Clarity first. Then comparison.
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

              {preface.callout ? (
                <div className="rounded-[1.35rem] border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(180deg,#fffdfd_0%,#f8edf1_100%)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)] sm:rounded-[1.45rem] sm:p-6">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    {preface.callout.title?.trim() || 'TMBC note'}
                  </p>
                  <p className="mt-3 max-w-[32rem] text-[0.95rem] leading-7 text-[var(--color-accent-dark)]/92 sm:mt-4 sm:text-[1rem] sm:leading-8">
                    {preface.callout.body}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </MarketingSurface>
      </section>

      <GuideContextStrip context={CAR_SEAT_HUB_CONTEXT} />

      <GuideCategoryCards
        id="car-seat-starting-point"
        eyebrow="Find your starting point"
        title="Find Your Starting Point"
        description="We&apos;ll guide you from here. Start with the stage that solves your real question first, then let the comparison list get narrower on purpose."
        cards={getCarSeatHubStartingPointCards()}
        variant="stroller-hub"
        ctaLabel="Start here"
      />

      <GuideDecisionBlock
        title={CAR_SEAT_HUB_FIT_CHECK.title}
        description={CAR_SEAT_HUB_FIT_CHECK.description}
        fitSummary={CAR_SEAT_HUB_FIT_CHECK.fitSummary}
        fitBullets={[...CAR_SEAT_HUB_FIT_CHECK.fitBullets]}
        notFitSummary={CAR_SEAT_HUB_FIT_CHECK.notFitSummary}
        notFitBullets={[...CAR_SEAT_HUB_FIT_CHECK.notFitBullets]}
        signatureMoment={CAR_SEAT_HUB_FIT_CHECK.signatureMoment}
      />

      <GuideStageProgression
        id="car-seat-stage-flow"
        title="See the stage progression before you overthink the seat"
        description="Most families do not make one giant car seat decision forever. They move through stages. Once that is clear, the categories stop feeling like competing personality types."
        items={getCarSeatStageProgressionItems()}
      />

      <GuideComparisonBand
        eyebrow="Category comparison"
        title="Compare the core car seat paths before you compare the models"
        description="Infant, convertible, and all-in-one answer different stages of life. The best seat is usually the one that matches the stage first."
        groups={getCarSeatComparisonBandGroups()}
      />

      <GuideSectionDivider />

      <GuideCategoryCards
        id="car-seat-category-grid"
        eyebrow="Car seat category system"
        title="Understand the car seat categories at a glance"
        description="Think of this as the calmer map: the core stages, the specialized lanes, when parents usually use each one, and where the tradeoffs start."
        cards={getCarSeatHubCategoryGridCards()}
        variant="stroller-hub"
        ctaLabel="Open section"
      />

      {previewSubsections.length > 0 ? (
        <>
          <GuideSectionDivider />

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {previewSubsections.map((subsection) => {
              const preview = getCarSeatCategoryPreview(subsection.title);
              const visual = getCarSeatCategoryVisual(subsection.title);

              return (
                <GuideCategoryPreviewSection
                  key={subsection.id}
                  id={subsection.id}
                  title={subsection.title}
                  content={stripLeadingGuideHeading(subsection.content)}
                  postId={`${guide.id}-${subsection.id}-preview`}
                  imageSrc={visual?.imageSrc}
                  imageAlt={visual?.imageAlt}
                  examples={preview?.examples ?? []}
                  href={preview?.href}
                  ctaLabel={preview?.ctaLabel}
                  examplesEyebrow="Example seats"
                  examplesDescription="These are educational anchors to make the category feel more concrete before you move into seat-specific comparisons."
                />
              );
            })}
          </div>
        </>
      ) : null}

      {specializedSubsections.length > 0 ? (
        <>
          <GuideSectionDivider />

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {specializedSubsections.map((subsection) => {
              const preview = getCarSeatCategoryPreview(subsection.title);
              const visual = getCarSeatCategoryVisual(subsection.title);

              return (
                <GuideCategoryPreviewSection
                  key={subsection.id}
                  id={subsection.id}
                  title={subsection.title}
                  content={stripLeadingGuideHeading(subsection.content)}
                  postId={`${guide.id}-${subsection.id}-preview`}
                  imageSrc={visual?.imageSrc}
                  imageAlt={visual?.imageAlt}
                  examples={preview?.examples ?? []}
                  href={preview?.href}
                  ctaLabel={preview?.ctaLabel}
                  examplesEyebrow="Example seats"
                  examplesDescription="These examples make the specialized lane easier to picture before you open the full sub-guide."
                />
              );
            })}
          </div>
        </>
      ) : null}

      <GuideSectionDivider />

      <GuideContinueExploring
        id="car-seat-continue"
        title="Continue Exploring"
        description="Once the stage is clearer, move into the more specific guide that matches it. That is usually where the real shortlist begins."
        links={getCarSeatContinueExploringLinks()}
      />
    </div>
  );
}
