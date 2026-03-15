import { Fragment } from 'react';
import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCategoryPreviewSection from '@/components/guides/GuideCategoryPreviewSection';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import {
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideOutline,
  type GuideSection,
} from '@/lib/guides/articleOutline';
import {
  getStrollerCategoryPreview,
  getStrollerCategoryVisual,
  STROLLER_HUB_DECISION_ITEMS,
  STROLLER_NAVIGATOR_CARDS,
  STROLLER_SERIES_CARDS,
} from '@/lib/guides/strollerHub';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

function normalizeHeading(value: string) {
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

function LongformSection({
  id,
  title,
  content,
  postId,
}: {
  id: string;
  title: string;
  content: string;
  postId: string;
}) {
  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#fcf8f4_100%)] px-6 py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h2
          id={id}
          className="scroll-mt-28 font-serif text-2xl leading-[1.04] tracking-[-0.04em] text-neutral-900 md:text-3xl"
        >
          {title}
        </h2>
        <div className="mt-5">
          <PostContent
            postId={postId}
            content={stripLeadingGuideHeading(content)}
            className="guide-post-content stroller-guide-content stroller-guide-content--hub"
            variant="plain"
          />
        </div>
      </div>
    </section>
  );
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
  const understandingContent = [remainingPreface, categoryBreakdown?.introContent].filter(Boolean).join('\n\n');
  const previewSubsections = sortStrollerSubsections(categoryBreakdown?.subsections ?? []);
  const longformSections = outline.sections.filter((section) => !isStrollerCategorySection(section));

  return (
    <div className="stroller-hub-shell space-y-10 md:space-y-16">
      {leadParagraph ? (
        <section className="mx-auto max-w-3xl">
          <div className="text-[1.02rem] leading-relaxed text-neutral-700 md:text-[1.08rem]">
            <PostContent
              postId={`${guide.id}-lead`}
              content={leadParagraph}
              className="guide-post-content stroller-guide-content stroller-guide-content--lead"
              variant="plain"
            />
          </div>
        </section>
      ) : null}

      <GuideCategoryCards
        id="stroller-category-navigator"
        eyebrow="Category navigator"
        title="Choose your stroller category"
        description="Start with the stroller category that matches your week. The goal is not to compare everything. It is to find the lane that already fits your real life."
        cards={STROLLER_NAVIGATOR_CARDS}
        variant="stroller-hub"
        ctaLabel="Explore guide"
      />

      <GuideSectionDivider />

      <section id="stroller-categories" className="space-y-6">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
            Understanding stroller categories
          </p>
          <h2 className="font-serif text-2xl leading-[1.04] tracking-[-0.04em] text-neutral-900 md:text-3xl">
            Understanding stroller categories
          </h2>
        </div>

        {understandingContent ? (
          <div className="mx-auto max-w-3xl">
            <PostContent
              postId={`${guide.id}-understanding-categories`}
              content={understandingContent}
              className="guide-post-content stroller-guide-content stroller-guide-content--hub"
              variant="plain"
            />
          </div>
        ) : null}
      </section>

      <div className="space-y-8 md:space-y-10">
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

      <GuideSectionDivider />

      <GuideDecisionHelper
        id="stroller-decision-helper"
        eyebrow="Quick decision helper"
        title="Not sure where to start?"
        description="Use the scenario that sounds most like your life right now. A clearer starting point usually matters more than a longer shortlist."
        items={STROLLER_HUB_DECISION_ITEMS}
        variant="stroller-hub"
        ctaLabel="Explore guide"
      />

      {longformSections.map((section, index) => (
        <Fragment key={section.id}>
          <GuideSectionDivider />
          <LongformSection
            id={section.id}
            title={section.title}
            content={section.content}
            postId={`${guide.id}-${section.id}-section-${index}`}
          />
        </Fragment>
      ))}

      <GuideSectionDivider />

      <GuideCategoryCards
        id="stroller-series"
        eyebrow="Continue the series"
        title="Continue the Taylor-Made Stroller Series"
        description="Each guide goes deeper on one stroller path, so you can compare within the right category instead of bouncing between six different kinds of decisions."
        cards={STROLLER_SERIES_CARDS}
        variant="stroller-hub"
        ctaLabel="Open guide"
      />
    </div>
  );
}
