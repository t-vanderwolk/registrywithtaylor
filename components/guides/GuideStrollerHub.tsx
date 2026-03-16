import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCategoryPreviewSection from '@/components/guides/GuideCategoryPreviewSection';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideInsightPanel from '@/components/guides/GuideInsightPanel';
import GuideLifestyleSelector from '@/components/guides/GuideLifestyleSelector';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import StrollerRealityCheck from '@/components/guides/StrollerRealityCheck';
import { splitGuideSectionContent, stripLeadingGuideHeading, type GuideOutline, type GuideSection } from '@/lib/guides/articleOutline';
import {
  getStrollerCategoryPreview,
  getStrollerCategoryVisual,
  STROLLER_HUB_DECISION_ITEMS,
  STROLLER_INSIGHT_PANEL_PARAGRAPHS,
  STROLLER_LIFESTYLE_MATCHES,
  STROLLER_NAVIGATOR_CARDS,
  STROLLER_REALITY_CHECK_CARDS,
  STROLLER_SERIES_CARDS,
} from '@/lib/guides/strollerHub';
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
  return normalizeHeading(section.title).includes('six stroller categories');
}

const STROLLER_SECTION_ORDER = new Map([
  ['full size strollers', 0],
  ['full size everyday strollers', 0],
  ['compact strollers', 1],
  ['travel strollers', 2],
  ['lightweight and travel strollers', 2],
  ['convertible single to double strollers', 3],
  ['convertible strollers', 3],
  ['jogging and all terrain strollers', 4],
  ['jogging all terrain strollers', 4],
  ['double strollers', 5],
  ['side by side double strollers', 5],
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

export default function GuideStrollerHub({
  guide,
  outline,
}: {
  guide: GuideArticleRecord;
  outline: GuideOutline;
}) {
  const { leadParagraph, remainingPreface } = splitPreface(outline.preface);
  const categorySection = outline.sections.find(isStrollerCategorySection) ?? null;
  const categoryBreakdown = categorySection ? splitGuideSectionContent(categorySection.content) : null;
  const previewSubsections = sortStrollerSubsections(categoryBreakdown?.subsections ?? []);

  return (
    <div className="stroller-hub-shell space-y-8 md:space-y-16">
      <section className="mx-auto max-w-3xl space-y-5 md:space-y-6">
        {leadParagraph ? (
          <div className="text-[1.02rem] leading-relaxed text-neutral-700 md:text-[1.08rem]">
            <PostContent
              postId={`${guide.id}-lead`}
              content={leadParagraph}
              className="guide-post-content stroller-guide-content stroller-guide-content--lead"
              variant="plain"
            />
          </div>
        ) : null}

        {remainingPreface ? (
          <PostContent
            postId={`${guide.id}-preface`}
            content={remainingPreface}
            className="guide-post-content stroller-guide-content stroller-guide-content--hub"
            variant="plain"
          />
        ) : null}
      </section>

      <GuideDecisionHelper
        id="stroller-decision-helper"
        eyebrow="Quick decision helper"
        title="Not sure where to start?"
        description="Use the scenario that sounds most like your life right now. A clearer starting point usually matters more than a longer shortlist."
        items={STROLLER_HUB_DECISION_ITEMS}
        variant="stroller-hub"
        ctaLabel="Explore guide"
      />

      <GuideSectionDivider />

      <GuideCategoryCards
        id="stroller-category-navigator"
        eyebrow="Category navigator"
        title="Choose a stroller category"
        description="The fastest way to simplify stroller shopping is to start with the category that already matches your daily life."
        cards={STROLLER_NAVIGATOR_CARDS}
        variant="stroller-hub"
        ctaLabel="Explore guide"
      />

      {previewSubsections.length > 0 ? (
        <>
          <GuideSectionDivider />

          <div className="space-y-6 md:space-y-10">
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

      <GuideInsightPanel
        title="Why stroller shopping feels confusing"
        paragraphs={STROLLER_INSIGHT_PANEL_PARAGRAPHS}
      />

      <GuideSectionDivider />

      <GuideLifestyleSelector title="Choose based on your lifestyle" items={STROLLER_LIFESTYLE_MATCHES} />

      <GuideSectionDivider />

      <StrollerRealityCheck title="Stroller size reality check" cards={STROLLER_REALITY_CHECK_CARDS} />

      <GuideSectionDivider />

      <div className="space-y-6">
        <div id="stroller-categories" className="scroll-mt-28" aria-hidden="true" />
        <GuideCategoryCards
          id="stroller-series"
          eyebrow="Continue the series"
          title="Explore the stroller categories"
          description="Each deeper guide walks through one category at a calmer pace, so you can compare the right strollers instead of every stroller."
          cards={STROLLER_SERIES_CARDS}
          variant="stroller-hub"
          ctaLabel="Read the guide"
        />
      </div>

      <GuideSectionDivider />

      <GuideSoftConversionCta
        title="Still deciding?"
        description="Every family uses their stroller differently. Inside the Taylor-Made Baby Planning process, parents walk through stroller categories step by step so the final decision fits their lifestyle, routines, and space."
        href="/services"
        ctaLabel="Learn about Taylor-Made Baby Planning"
      />
    </div>
  );
}
