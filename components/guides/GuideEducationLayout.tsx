import PostContent from '@/components/blog/PostContent';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import NextSteps from '@/components/guides/NextSteps';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { buildGuideOutline } from '@/lib/guides/articleOutline';
import {
  buildCoverBulletsFromOutline,
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
  };
  relatedGuides?: GuideCardItem[];
  preview?: boolean;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
}

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
  const whatThisGuideCovers = buildCoverBulletsFromOutline(outline);
  const commonMistakes =
    extractMarkdownListItems(
      outline.sections.find((section) => section.title.toLowerCase().includes('common mistakes'))?.content ?? '',
      5,
    ).length > 0
      ? extractMarkdownListItems(
          outline.sections.find((section) => section.title.toLowerCase().includes('common mistakes'))?.content ?? '',
          5,
        )
      : getFallbackCommonMistakes(guide.slug);
  const takeaways = dedupeTextItems(
    [...buildTakeawayBulletsFromOutline(outline), ...getFallbackTakeaways(guide.slug)],
    4,
  );
  const decisionItems = outline.sections.slice(0, 4).map((section) => ({
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
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={guide.category}
          title={guide.title}
          description={
            leadCopy ||
            'Clear, practical guidance to help you understand what matters first, what can wait, and what to do next.'
          }
          readTime={`${readingTime} min`}
          publishedLabel={formatArticleDate(displayDate)}
          sectionCount={outline.sections.length}
          jumpLinks={slideItems.slice(1).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          imageSrc={undefined}
          imageAlt={guide.title}
          variant="default"
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <div className="space-y-6">
          <GuideBulletSection
            eyebrow="What This Guide Covers"
            title="What This Guide Covers"
            description="Use these as the main buckets on the page. You should not need a long lead-in paragraph to know what is ahead."
            items={whatThisGuideCovers}
          />

          {tocItems.length > 0 ? (
            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="desktop" layout="band" />
            </div>
          ) : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
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

          <div className="grid gap-5 xl:grid-cols-2">
            {outline.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{section.title}</p>
                <div className="mt-4">
                  <PostContent
                    postId={`${guide.id}-${section.id}`}
                    content={section.content}
                    className="guide-post-content guide-slide-content"
                    variant="guide"
                  />
                </div>
              </section>
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
          items={commonMistakes}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <NextSteps
          links={nextSteps}
          description="Use these links to keep the guide system connected. Every page should point back to the parent guide, the next logical decision, and a related category."
        />
      </SlideSection>

      <SlideSection id={slideItems[7].id} background="white">
        <div className="space-y-6">
          <GuideBulletSection
            eyebrow="Takeaways"
            title="Takeaways"
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
