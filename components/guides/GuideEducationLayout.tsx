import PostContent from '@/components/blog/PostContent';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideEditorialImage from '@/components/guides/GuideEditorialImage';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import NextSteps from '@/components/guides/NextSteps';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { buildGuideOutline, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import {
  buildTakeawayBulletsFromOutline,
  dedupeTextItems,
  extractMarkdownListItems,
  getDefaultNextSteps,
  getFallbackCommonMistakes,
  getFallbackTakeaways,
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideCardToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import type { GuideCardItem } from '@/lib/guides/presentation';

interface GuideEducationLayoutProps {
  guide: {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    affiliateModules?: Array<{
      id: string;
      retailerLabel?: string | null;
      productName: string;
      imageUrl?: string | null;
      destinationUrl: string;
      ctaLabel?: string | null;
      description?: string | null;
      title?: string | null;
      notes?: string | null;
    }>;
    affiliateDisclosureEnabled?: boolean;
    affiliateDisclosureText?: string | null;
    faqItems: Array<{ question: string; answer: string }>;
    consultationCtaEnabled?: boolean;
    consultationCtaLabel?: string | null;
    newsletterCtaEnabled?: boolean;
    newsletterCtaHref?: string | null;
    newsletterCtaLabel?: string | null;
    nextStepCtaHref?: string | null;
    nextStepCtaLabel?: string | null;
    founderSignatureEnabled?: boolean;
    founderSignatureText?: string | null;
    takeaways?: string[];
    topicCluster?: string | null;
    heroImageUrl?: string | null;
    heroImageAlt?: string | null;
  };
  relatedGuides?: GuideCardItem[];
  preview?: boolean;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
}

type NarrativeSectionImage = {
  src: string;
  alt: string;
  caption: string;
  eyebrow: string;
};

type NarrativeSection = {
  id: string;
  title: string;
  content: string;
  image: NarrativeSectionImage;
};

const inlineImagePattern = /^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)$/;

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function extractLeadCopy(content: string) {
  const paragraphs = content
    .split('\n\n')
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith('#'));

  return paragraphs.slice(0, 2).join(' ');
}

function summarizeSection(content: string) {
  const plainText = content
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return 'Use this section to get clearer on the decision without rereading the whole guide.';
  }

  return plainText.length > 150 ? `${plainText.slice(0, 147).trim()}...` : plainText;
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isEditorialIntroSection(title: string) {
  const normalized = normalizeTitle(title);
  return (
    normalized === 'introduction' ||
    normalized.startsWith('why ') ||
    normalized.includes('feels overwhelming') ||
    normalized.startsWith('why this category') ||
    normalized.startsWith('why booster') ||
    normalized.startsWith('why rotating') ||
    normalized.startsWith('why all in one') ||
    normalized.startsWith('why convertible') ||
    normalized.startsWith('why this category exists')
  );
}

function isCommonMistakesSection(title: string) {
  return normalizeTitle(title).includes('common mistakes');
}

function isFaqSection(title: string) {
  return normalizeTitle(title) === 'faq';
}

function isCoreExclusionSection(title: string) {
  const normalized = normalizeTitle(title);

  return (
    isCommonMistakesSection(title) ||
    isFaqSection(title) ||
    normalized === 'final thoughts' ||
    normalized === 'next steps' ||
    normalized === 'takeaways' ||
    normalized === 'product examples' ||
    normalized === 'expert advice' ||
    normalized === 'planning tips' ||
    normalized === 'where to go next'
  );
}

function sanitizeImageCopy(value: string | undefined, fallback: string) {
  const cleaned = (value ?? '')
    .replace(/^temporary placeholder image:\s*/i, '')
    .replace(/\.+$/, '')
    .trim();

  return cleaned || fallback;
}

function stripInlineImages(content: string) {
  return content
    .split('\n')
    .filter((line) => !inlineImagePattern.test(line.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractInlineImage(content: string) {
  for (const line of content.split('\n')) {
    const match = line.trim().match(inlineImagePattern);
    if (!match) {
      continue;
    }

    const [, altText, src, title] = match;
    const fallbackCopy = 'Guide editorial image';
    const copy = sanitizeImageCopy(altText || title, fallbackCopy);

    return {
      src,
      alt: copy,
      caption: copy,
      eyebrow: 'Editorial image',
    } satisfies NarrativeSectionImage;
  }

  return null;
}

function getFallbackImagePool(guide: GuideEducationLayoutProps['guide']) {
  const normalizedCategory = normalizeTitle(guide.category);
  const normalizedSlug = normalizeTitle(guide.slug);

  if (normalizedCategory.includes('nursery') || normalizedSlug.includes('nursery')) {
    return [
      '/assets/editorial/nursery.jpg',
      '/assets/editorial/gear.jpg',
      '/assets/placeholders/tmbc-guide-image-placeholder.svg',
    ];
  }

  if (normalizedCategory.includes('registry') || normalizedSlug.includes('registry')) {
    return [
      '/assets/editorial/registry.jpg',
      '/assets/editorial/gear.jpg',
      '/assets/placeholders/tmbc-guide-image-placeholder.svg',
    ];
  }

  if (normalizedCategory.includes('travel') || normalizedSlug.includes('travel')) {
    return [
      '/assets/editorial/growing-with-confidence.jpg',
      '/assets/editorial/gear.jpg',
      '/assets/placeholders/tmbc-guide-image-placeholder.svg',
    ];
  }

  if (normalizedCategory.includes('stroller') || normalizedSlug.includes('stroller')) {
    return [
      '/assets/editorial/strollers.png',
      '/assets/editorial/stroller-folds.jpg',
      '/assets/editorial/double-strollers.jpg',
      '/assets/editorial/gear.jpg',
    ];
  }

  if (normalizedCategory.includes('car seat') || normalizedSlug.includes('car seat')) {
    return [
      '/assets/editorial/gear.jpg',
      '/assets/editorial/growing-with-confidence.jpg',
      '/assets/placeholders/tmbc-guide-image-placeholder.svg',
    ];
  }

  return [
    '/assets/editorial/gear.jpg',
    '/assets/editorial/growing-with-confidence.jpg',
    '/assets/placeholders/tmbc-guide-image-placeholder.svg',
  ];
}

function buildFallbackImage({
  guide,
  sectionTitle,
  index,
}: {
  guide: GuideEducationLayoutProps['guide'];
  sectionTitle: string;
  index: number;
}) {
  const pool = getFallbackImagePool(guide);
  const src = pool[index % pool.length] ?? '/assets/placeholders/tmbc-guide-image-placeholder.svg';
  const caption = `${sectionTitle} is easier to hold onto once you can picture how it shows up in everyday life.`;

  return {
    src,
    alt: `${sectionTitle} editorial image`,
    caption,
    eyebrow: 'Editorial image',
  } satisfies NarrativeSectionImage;
}

function buildNarrativeSections({
  guide,
  sectionIds,
  sections,
}: {
  guide: GuideEducationLayoutProps['guide'];
  sectionIds: Set<string>;
  sections: ReturnType<typeof buildGuideOutline>['sections'];
}) {
  return sections
    .filter((section) => sectionIds.has(section.id))
    .map((section, index) => {
      const strippedContent = stripLeadingGuideHeading(stripInlineImages(section.content));
      return {
        id: section.id,
        title: section.title,
        content: strippedContent,
        image: extractInlineImage(section.content) ?? buildFallbackImage({ guide, sectionTitle: section.title, index }),
      } satisfies NarrativeSection;
    })
    .filter((section) => section.content);
}

export default function GuideEducationLayout({
  guide,
  relatedGuides = [],
  sourceRoute,
  displayDate,
  readingTime,
}: GuideEducationLayoutProps) {
  const outline = buildGuideOutline(guide.content);
  const leadCopy = extractLeadCopy(guide.content);
  const orientation = getGuideOrientation({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const slideItems = getStandardGuideSlideItems('guide');
  const tocItems = outline.sections.map((section) => ({
    id: section.id,
    label: section.title,
    level: 2 as const,
  }));
  const editorialIntroIds = new Set(
    outline.sections
      .filter((section) => isEditorialIntroSection(section.title))
      .slice(0, 2)
      .map((section) => section.id),
  );
  const fallbackCoreIds = outline.sections
    .filter((section) => !isCoreExclusionSection(section.title))
    .slice(0, 5)
    .map((section) => section.id);
  const selectedCoreIds = new Set(
    outline.sections
      .filter((section) => !editorialIntroIds.has(section.id) && !isCoreExclusionSection(section.title))
      .slice(0, 5)
      .map((section) => section.id),
  );

  if (selectedCoreIds.size < 3) {
    for (const id of fallbackCoreIds) {
      selectedCoreIds.add(id);
      if (selectedCoreIds.size >= 3) {
        break;
      }
    }
  }

  const editorialSections = buildNarrativeSections({
    guide,
    sectionIds: editorialIntroIds,
    sections: outline.sections.filter((section) => !selectedCoreIds.has(section.id)),
  });
  const coreSections = buildNarrativeSections({
    guide,
    sectionIds: selectedCoreIds,
    sections: outline.sections,
  });
  const supportingSections = outline.sections.filter(
    (section) =>
      !editorialIntroIds.has(section.id) &&
      !selectedCoreIds.has(section.id) &&
      !isCommonMistakesSection(section.title) &&
      !isFaqSection(section.title),
  );
  const commonMistakesSection = outline.sections.find((section) => isCommonMistakesSection(section.title));
  const commonMistakes = extractMarkdownListItems(commonMistakesSection?.content ?? '', 5);
  const takeaways = dedupeTextItems(
    [...buildTakeawayBulletsFromOutline(outline), ...getFallbackTakeaways(guide.slug)],
    4,
  );
  const decisionItems = (coreSections.length > 0 ? coreSections : editorialSections).slice(0, 4).map((section) => ({
    condition: `need clarity on ${section.title.toLowerCase()}`,
    recommendation: `${summarizeSection(section.content)} Start with this section.`,
    href: `${sourceRoute}#${section.id}`,
  }));
  const nextSteps = normalizeGuideLinks(
    [
      ...(guide.nextStepCtaHref
        ? [
            {
              href: guide.nextStepCtaHref,
              label: guide.nextStepCtaLabel?.trim() || 'Open the next guide',
              description: 'Use the next linked guide while this decision is still fresh.',
              stage: 'Refine' as const,
            },
          ]
        : []),
      ...relatedGuides.slice(0, 3).map((guideCard) => guideCardToNextStepLink(guideCard, 'Compare')),
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
    ],
    4,
  );

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({
        slug: guide.slug,
        path: sourceRoute,
        category: guide.category,
      })}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <GuideHero
          slug={guide.slug}
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={guide.category}
          category={guide.category}
          title={guide.title}
          description={
            leadCopy ||
            'Clear, practical guidance to help you understand what matters first, what can wait, and what to do next.'
          }
          readTime={`${readingTime} min`}
          publishedLabel={formatArticleDate(displayDate)}
          sectionCount={outline.sections.length}
          jumpLinks={slideItems.slice(1).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          topicCluster={guide.topicCluster}
          imageSrc={guide.heroImageUrl}
          imageAlt={guide.heroImageAlt}
          variant="default"
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <div className="space-y-6">
          {outline.preface ? (
            <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-guide-preface`}
                content={outline.preface}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          {editorialSections.map((section) => (
            <MarketingSurface
              key={section.id}
              className="border-[rgba(215,161,175,0.16)] bg-white/92 shadow-[0_16px_42px_rgba(0,0,0,0.06)]"
            >
              <div id={section.id} className="space-y-4">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{section.title}</p>
                <PostContent
                  postId={`${guide.id}-${section.id}-editorial`}
                  content={section.content}
                  className="guide-post-content guide-slide-content"
                  variant="guide"
                />
              </div>
            </MarketingSurface>
          ))}

          {tocItems.length > 0 ? (
            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="desktop" layout="band" />
            </div>
          ) : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Core Considerations</p>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">
              The pieces that usually shape the real decision.
            </h2>
            <p className="text-base leading-8 text-[#5B4B55] md:text-lg">
              This is the main section of the guide. Read it like a guided editorial, not like a rush to check every box.
            </p>
          </div>

          <div className="space-y-10">
            {coreSections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Core consideration</p>
                    <h3 className="text-[1.8rem] font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.15rem]">
                      {section.title}
                    </h3>
                  </div>

                  <PostContent
                    postId={`${guide.id}-${section.id}`}
                    content={section.content}
                    className="guide-post-content guide-slide-content"
                    variant="guide"
                  />

                  <GuideEditorialImage
                    eyebrow={section.image.eyebrow}
                    src={section.image.src}
                    alt={section.image.alt}
                    caption={section.image.caption}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock
          title="Use the guide as a decision path, not a reading assignment."
          description="These are the fastest ways to match the guide to the question you are actually trying to answer."
          items={decisionItems}
        />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These are the practical misses that usually make the category feel heavier than it needs to."
          items={commonMistakes.length > 0 ? commonMistakes : getFallbackCommonMistakes(guide.slug)}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <NextSteps
            links={nextSteps}
            description="Use these links to keep the guide system connected. Every page should point back to the parent guide, the next logical decision, and a related category."
          />

          {supportingSections.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {supportingSections.slice(0, 2).map((section) => (
                <MarketingSurface
                  key={section.id}
                  className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
                >
                  <div id={section.id} className="space-y-4">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{section.title}</p>
                    <PostContent
                      postId={`${guide.id}-${section.id}-supporting`}
                      content={stripLeadingGuideHeading(section.content)}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  </div>
                </MarketingSurface>
              ))}
            </div>
          ) : null}

          <GuideBulletSection
            eyebrow="Keep In Mind"
            title="Keep In Mind"
            description="If you only keep the short version, keep these."
            items={takeaways}
          />

          {guide.faqItems.length > 0 ? (
            <GuideFaqAccordion
              items={guide.faqItems.map((item) => ({
                question: item.question,
                answer: item.answer,
              }))}
            />
          ) : null}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
