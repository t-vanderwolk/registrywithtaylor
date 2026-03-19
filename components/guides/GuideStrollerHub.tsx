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
  const { leadParagraph, remainingPreface } = splitPreface(outline.preface);
  const categorySection = outline.sections.find(isStrollerCategorySection) ?? null;
  const categoryBreakdown = categorySection ? splitGuideSectionContent(categorySection.content) : null;
  const previewSubsections = sortStrollerSubsections(categoryBreakdown?.subsections ?? []);

  return (
    <div className="stroller-hub-shell space-y-6 sm:space-y-8 lg:space-y-16">
      <section className="mx-auto max-w-5xl">
        <MarketingSurface className="rounded-[1.9rem] border border-stone-200/70 bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            {leadParagraph ? (
              <div className="rounded-[1.35rem] border border-stone-200/70 bg-[#fcfaf7] p-4 sm:p-5">
                <PostContent
                  postId={`${guide.id}-lead`}
                  content={leadParagraph}
                  className="guide-post-content guide-hub-card-content"
                  variant="plain"
                  highlightBrandWordmark={true}
                />
              </div>
            ) : null}

            {remainingPreface ? (
              <div className="rounded-[1.35rem] border border-stone-200/70 bg-[#fcfaf7] p-4 sm:p-5">
                <PostContent
                  postId={`${guide.id}-preface`}
                  content={remainingPreface}
                  className="guide-post-content guide-hub-card-content"
                  variant="plain"
                  highlightBrandWordmark={true}
                />
              </div>
            ) : null}
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
