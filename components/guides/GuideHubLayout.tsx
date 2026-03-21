import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideDecisionSystemHub from '@/components/guides/GuideDecisionSystemHub';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import NextSteps from '@/components/guides/NextSteps';
import RegistryGuideSlideLayout from '@/components/guides/RegistryGuideSlideLayout';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import ProductExampleCard from '@/components/guides/ProductExampleCard';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries } from '@/lib/blog/contentText';
import { buildGuideOutline, stripFaqBlocks } from '@/lib/guides/articleOutline';
import {
  buildCoverBulletsFromOutline,
  buildTakeawayBulletsFromOutline,
  dedupeTextItems,
  getFallbackCommonMistakes,
  getGuideOrientation,
  getStandardGuideSlideItems,
  getDefaultNextSteps,
  guideCardToNextStepLink,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import { getGuideHubConfig, getGuideNextGuideItems } from '@/lib/guides/hubs';
import type { GuideHubLink } from '@/lib/guides/hubs';
import type { GuideCardItem } from '@/lib/guides/presentation';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

function ProductRecommendations({
  guide,
}: {
  guide: GuideArticleRecord;
}) {
  if (guide.affiliateModules.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Product examples</p>
        <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.2rem]">
          A few examples to make the tradeoffs easier to picture.
        </h2>
        <p className="max-w-3xl text-base leading-8 text-[#5B4B55] md:text-lg">
          These are here to support the decision, not to turn the guide into a store shelf.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {guide.affiliateModules.map((module) => (
          <ProductExampleCard
            key={module.id}
            brand={module.retailerLabel}
            name={module.productName}
            image={
              module.imageUrl
                ? {
                    src: module.imageUrl,
                    alt: module.productName,
                    objectClassName: 'object-cover',
                  }
                : null
            }
            imageHref={module.destinationUrl}
            imageLinkLabel={module.ctaLabel}
            description={module.description}
            bestFor={module.title}
            standout={module.notes ?? undefined}
            cta={{ href: module.destinationUrl, label: module.ctaLabel }}
          />
        ))}
      </div>
    </section>
  );
}

export default function GuideHubLayout({
  guide,
  relatedGuides,
  preview = false,
  sourceRoute,
  displayDate,
  readingTime,
}: {
  guide: GuideArticleRecord;
  relatedGuides: GuideCardItem[];
  strollerJournalLinks?: GuideHubLink[];
  preview?: boolean;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
  disclosureText: string;
  nextStepEvent: unknown;
  nextStepDestinationPageType: unknown;
}) {
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const contentWithoutInlineFaqs = stripFaqBlocks(articleContent);
  const outline = buildGuideOutline(contentWithoutInlineFaqs);
  const hubConfig = getGuideHubConfig(guide.slug, sourceRoute);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const nextGuideItems = getGuideNextGuideItems(guide.slug);
  const slideItems = getStandardGuideSlideItems('guide');
  const orientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });

  if (!hubConfig && guide.slug !== 'best-strollers' && guide.slug !== 'best-infant-car-seats') {
    return null;
  }

  if (guide.slug === 'best-strollers' || guide.slug === 'best-infant-car-seats') {
    return <GuideDecisionSystemHub guide={guide} sourceRoute={sourceRoute} />;
  }

  if (guide.slug === 'minimalist-baby-registry') {
    return (
      <RegistryGuideSlideLayout
        guide={guide}
        sourceRoute={sourceRoute}
        displayDate={displayDate}
        readingTime={readingTime}
        faqEntries={faqEntries}
        nextGuideItems={nextGuideItems}
      />
    );
  }

  const nextSteps = normalizeGuideLinks(
    [
      {
        href: '/guides',
        label: 'TMBC Education Hub',
        description: 'Return to the broader guide system if a different category should come first.',
        stage: 'Start' as const,
      },
      ...(guide.nextStepCtaHref
        ? [
            {
              href: guide.nextStepCtaHref,
              label: guide.nextStepCtaLabel?.trim() || 'Open the next guide',
              description: 'Use the next linked guide while this category is still clear.',
              stage: 'Refine' as const,
            },
          ]
        : []),
      ...hubConfig!.supportLinks.map((link) => guideHubLinkToNextStepLink(link, 'Refine')),
      ...relatedGuides.slice(0, 2).map((link) => guideCardToNextStepLink(link, 'Compare')),
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
    ],
    4,
  );
  const decisionItems = hubConfig!.decisionItems.slice(0, 4).map((item) => ({
    condition: item.title.replace(/^If you\s+/i, '').toLowerCase(),
    recommendation: item.description,
    href: item.href,
  }));
  const takeaways = dedupeTextItems(
    [...buildTakeawayBulletsFromOutline(outline), ...hubConfig!.decisionItems.map((item) => item.description)],
    4,
  );

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <GuideHero
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={guide.category}
          title={guide.title}
          description={
            guide.excerpt?.trim() ||
            'A calmer editorial guide built to help you sort the tradeoffs, skip the noise, and move into the right next decision.'
          }
          readTime={`${readingTime} min`}
          publishedLabel={formatArticleDate(displayDate)}
          sectionCount={outline.sections.length}
          jumpLinks={slideItems.slice(1).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          imageSrc={guide.heroImageUrl}
          imageAlt={guide.heroImageAlt}
          variant="default"
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="What This Guide Covers"
          title="What This Guide Covers"
          description="This hub should act like a route map through the category, not like a stacked article directory."
          items={dedupeTextItems(
            [
              ...buildCoverBulletsFromOutline(outline),
              ...hubConfig!.cards.map((card) => card.title),
              ...hubConfig!.decisionItems.map((item) => item.title),
            ],
            5,
          )}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          {outline.preface ? (
            <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-hub-preface`}
                content={outline.preface}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          {outline.sections[0] ? (
            <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-${outline.sections[0].id}`}
                content={outline.sections[0].content}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          <GuideCategoryCards
            title={hubConfig!.cardsTitle}
            description={hubConfig!.cardsDescription}
            cards={hubConfig!.cards}
          />

          <GuideDecisionHelper
            title={hubConfig!.decisionHelperTitle}
            description={hubConfig!.decisionHelperDescription}
            items={hubConfig!.decisionItems}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock
          title="Use the hub as a decision path."
          description="These are the quickest ways to choose the right starting lane inside the category."
          items={decisionItems}
        />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These are the habits that usually make hub pages feel heavier than they need to."
          items={getFallbackCommonMistakes(guide.slug)}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <NextSteps links={nextSteps} />
          <ProductRecommendations guide={guide} />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[7].id} background="white">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="Takeaways"
            title="Takeaways"
            description="If the hub did its job, these are the parts that should still feel obvious when you leave."
            items={takeaways}
          />

          {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}

          {!preview ? (
            <GuideSoftConversionCta
              title="Keep the next step calm."
              description="Once the category feels clearer, the fastest win is following the next logical guide instead of reopening the whole decision from scratch."
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
            />
          ) : null}

          <GuideNextGuides items={nextGuideItems} />
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
