import CategoryGrid from '@/components/guides/CategoryGrid';
import Image from 'next/image';
import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideDecisionSteps from '@/components/guides/GuideDecisionSteps';
import GuideDecisionSystemHub from '@/components/guides/GuideDecisionSystemHub';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import RegistryGuideSlideLayout from '@/components/guides/RegistryGuideSlideLayout';
import SlideSection from '@/components/guides/SlideSection';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import ProductExampleCard from '@/components/guides/ProductExampleCard';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries } from '@/lib/blog/contentText';
import type { AnalyticsPageType } from '@/lib/analytics';
import { isRemoteImageUrl } from '@/lib/blog/images';
import {
  buildGuideOutline,
  stripFaqBlocks,
} from '@/lib/guides/articleOutline';
import { buildDecisionStepsFromSections } from '@/lib/guides/decisionSystemContent';
import {
  getGuideContinueExploringBlock,
  getGuideHeroJumpLinks,
  getGuideHubConfig,
  getGuideNextGuideItems,
} from '@/lib/guides/hubs';
import type { GuideHubLink } from '@/lib/guides/hubs';
import { GuideAnalyticsEvents, type GuideAnalyticsEventName } from '@/lib/guides/events';
import type { GuideCardItem } from '@/lib/guides/presentation';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DisclosureCard({ text }: { text: string }) {
  return (
    <MarketingSurface className="rounded-2xl border border-black/6 bg-white p-5 text-base leading-relaxed text-neutral-700 md:p-6 md:text-lg">
      {text}
    </MarketingSurface>
  );
}

function GuidePostSurface({
  postId,
  content,
  contentClassName = 'guide-post-content',
  compact = false,
  innerClassName = '',
}: {
  postId: string;
  content: string;
  contentClassName?: string;
  compact?: boolean;
  innerClassName?: string;
}) {
  return (
    <MarketingSurface
      className={`rounded-2xl border border-black/6 bg-white shadow-sm ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      <div className={innerClassName}>
        <PostContent postId={postId} content={content} className={contentClassName} variant="guide" />
      </div>
    </MarketingSurface>
  );
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

function shouldUseSoftGuideCtas({
  slug,
  category,
  sourceRoute,
}: {
  slug: string;
  category: string;
  sourceRoute: string;
}) {
  const context = `${slug} ${category} ${sourceRoute}`.toLowerCase();
  return context.includes('registry') || context.includes('nursery');
}

function ProductRecommendations({
  guide,
  preview,
  sourceRoute,
}: {
  guide: GuideArticleRecord;
  preview: boolean;
  sourceRoute: string;
}) {
  if (guide.affiliateModules.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Product examples</p>
        <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">Editorial picks inside this guide</h2>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
          These are here to make the tradeoffs easier to picture, not to turn the guide into a storefront.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            actionSlot={
              <GuideTrackedLink
                guideId={guide.id}
                href={module.destinationUrl}
                event={GuideAnalyticsEvents.AFFILIATE_CLICK}
                sourceRoute={sourceRoute}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.36)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:scale-[1.02] hover:shadow-md"
                track={!preview}
                meta={{
                  moduleTitle: module.title,
                  productName: module.productName,
                  ctaLabel: module.ctaLabel,
                  retailerLabel: module.retailerLabel,
                  partnerId: module.partnerId,
                }}
              >
                <span>{module.ctaLabel}</span>
                <span aria-hidden="true" className="ml-2">
                  -&gt;
                </span>
              </GuideTrackedLink>
            }
          />
        ))}
      </div>
    </section>
  );
}

function NextStepBand({
  guide,
  preview,
  sourceRoute,
  nextStepEvent,
  nextStepDestinationPageType,
}: {
  guide: GuideArticleRecord;
  preview: boolean;
  sourceRoute: string;
  nextStepEvent: GuideAnalyticsEventName | null;
  nextStepDestinationPageType: AnalyticsPageType | null;
}) {
  if (!guide.consultationCtaEnabled && !guide.newsletterCtaEnabled && !guide.nextStepCtaHref) {
    return null;
  }

  const actionClassName =
    'inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:scale-[1.02] hover:shadow-md';
  const primaryActionClassName = `${actionClassName} border border-[rgba(215,161,175,0.26)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_16px_34px_rgba(199,125,151,0.24)]`;

  return (
    <div className="space-y-4">
      <GuideCTARibbon
        eyebrow="Next step"
        title="Keep the momentum once the guide gets you close."
        description="The goal is not more tabs. It is a calmer decision, a stronger shortlist, and a clearer plan for what to do next."
        actionsSlot={
          <>
            {guide.consultationCtaEnabled ? (
              <GuideTrackedLink
                guideId={guide.id}
                href="/book"
                event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                sourceRoute={sourceRoute}
                className={primaryActionClassName}
                track={!preview}
                meta={{
                  ctaLabel: guide.consultationCtaLabel?.trim() || 'Book a Consultation',
                  placement: 'bottom_band',
                  slug: guide.slug,
                  title: guide.title,
                }}
              >
                {guide.consultationCtaLabel?.trim() || 'Book a Consultation'}
              </GuideTrackedLink>
            ) : null}

            {guide.newsletterCtaEnabled && guide.newsletterCtaHref ? (
              <GuideTrackedLink
                guideId={guide.id}
                href={guide.newsletterCtaHref}
                event={GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK}
                sourceRoute={sourceRoute}
                className={`${actionClassName} border border-[rgba(215,161,175,0.36)] bg-white/90 text-charcoal`}
                track={!preview}
                meta={{
                  ctaLabel: guide.newsletterCtaLabel?.trim() || 'Get the resource',
                  placement: 'bottom_band',
                }}
              >
                {guide.newsletterCtaLabel?.trim() || 'Get the resource'}
              </GuideTrackedLink>
            ) : null}

            {guide.nextStepCtaHref ? (
              <GuideTrackedLink
                guideId={guide.id}
                href={guide.nextStepCtaHref}
                event={nextStepEvent ?? GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK}
                sourceRoute={sourceRoute}
                className={`${actionClassName} border border-[rgba(215,161,175,0.36)] bg-white/90 text-charcoal`}
                track={!preview && Boolean(nextStepEvent)}
                meta={{
                  ctaLabel: guide.nextStepCtaLabel?.trim() || 'Explore related guides',
                  placement: 'bottom_band',
                  slug: guide.slug,
                  title: guide.title,
                  destinationPageType: nextStepDestinationPageType,
                }}
              >
                {guide.nextStepCtaLabel?.trim() || 'Explore related guides'}
              </GuideTrackedLink>
            ) : null}
          </>
        }
      />
      {guide.newsletterCtaEnabled && guide.newsletterCtaDescription ? (
        <p className="max-w-xl text-base leading-relaxed text-neutral-600">{guide.newsletterCtaDescription}</p>
      ) : null}
    </div>
  );
}

function getDecisionStyledHubCopy(slug: string) {
  switch (slug) {
    case 'minimalist-baby-registry':
      return {
        decisionEyebrow: 'Start here',
        decisionTitle: 'Find your registry starting point',
        decisionDescription: 'Start with the part of registry planning that feels the least clear. The rest gets easier once you know what problem you are actually solving.',
        categoryEyebrow: 'Registry lanes',
        categoryTitle: 'Explore the registry planning lanes',
        categoryDescription: 'These sections work best when you treat them like planning paths, not one long list of things to add.',
        walkthroughEyebrow: 'Quick guide',
        walkthroughTitle: 'A calmer way to build the list.',
        walkthroughDescription: 'The structure is pulled forward here so you can understand the order first, then decide what deserves actual registry space.',
        excludeStepTitles: ['What You’ll Learn', 'Category Snapshot', 'Continue Exploring', 'Key Takeaways'],
        continueTitle: 'Keep planning from the category that affects the registry next.',
        continueDescription: 'Once the order makes sense, jump into the adjacent guide that will sharpen the next decision instead of adding more tabs.',
        softCtaTitle: 'Want help turning the plan into a real shortlist?',
        softCtaDescription: 'A consultation is useful once you know the lanes but want help choosing what actually fits your space, routine, and budget.',
      };
    case 'nursery-setup-guide':
      return {
        decisionEyebrow: 'Start here',
        decisionTitle: 'Find your nursery starting point',
        decisionDescription: 'Pick the part of the room that will shape your real routine the fastest. That usually gives the rest of the room a much clearer job.',
        categoryEyebrow: 'Nursery lanes',
        categoryTitle: 'Explore the nursery planning lanes',
        categoryDescription: 'Use these lanes to sort sleep, storage, furniture, and room flow without turning the nursery into one giant undecided mood board.',
        walkthroughEyebrow: 'Quick guide',
        walkthroughTitle: 'A calmer way to shape the room.',
        walkthroughDescription: 'These are the decisions that matter most first, so you can design around real routines instead of a room that only behaves in daylight.',
        excludeStepTitles: ['Introduction', 'Product Examples', 'Final Thoughts'],
        continueTitle: 'Keep going with the next nursery decision that changes the room most.',
        continueDescription: 'Move into the supporting guide or category that will make the layout, storage, or purchasing order clearer from here.',
        softCtaTitle: 'Need another set of eyes on the room plan?',
        softCtaDescription: 'This is the point where outside perspective can save space, money, and at least one decorative decision that looked better on paper.',
      };
    default:
      return null;
  }
}

export default function GuideHubLayout({
  guide,
  relatedGuides,
  strollerJournalLinks = [],
  preview = false,
  sourceRoute,
  displayDate,
  readingTime,
  disclosureText,
  nextStepEvent,
  nextStepDestinationPageType,
}: {
  guide: GuideArticleRecord;
  relatedGuides: GuideCardItem[];
  strollerJournalLinks?: GuideHubLink[];
  preview?: boolean;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
  disclosureText: string;
  nextStepEvent: GuideAnalyticsEventName | null;
  nextStepDestinationPageType: AnalyticsPageType | null;
}) {
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const contentWithoutInlineFaqs = stripFaqBlocks(articleContent);
  const outline = buildGuideOutline(contentWithoutInlineFaqs);
  const hubConfig = getGuideHubConfig(guide.slug, sourceRoute);
  const isStrollerHub = guide.slug === 'best-strollers';
  const isCarSeatHub = guide.slug === 'best-infant-car-seats';
  const decisionStyledHubCopy = getDecisionStyledHubCopy(guide.slug);
  const useDecisionStyledHubCards = Boolean(decisionStyledHubCopy);
  const decisionStyledHubSteps =
    useDecisionStyledHubCards && decisionStyledHubCopy
      ? buildDecisionStepsFromSections(outline.sections, {
          excludeTitles: decisionStyledHubCopy.excludeStepTitles,
        }).slice(0, 4)
      : [];
  const heroJumpLinks = getGuideHeroJumpLinks({
    currentPath: sourceRoute,
    tocItems: outline.tocItems,
  });
  const styledHubHeroJumpLinks = useDecisionStyledHubCards
    ? [
        { label: 'Start here', href: `${sourceRoute}#hub-start` },
        { label: 'Planning lanes', href: `${sourceRoute}#hub-categories` },
        ...(decisionStyledHubSteps.length > 0 ? [{ label: 'Quick guide', href: `${sourceRoute}#hub-walkthrough` }] : []),
        ...(hubConfig?.supportLinks.length ? [{ label: 'Next steps', href: `${sourceRoute}#hub-continue` }] : []),
      ]
    : heroJumpLinks;
  const strollerHeroJumpLinks = [
    { label: 'Decision helper', href: `${sourceRoute}#stroller-decision-helper` },
    { label: 'Category guides', href: `${sourceRoute}#stroller-category-navigator` },
    { label: 'Find your type', href: `${sourceRoute}#find-your-stroller-type` },
    { label: 'Common mistakes', href: `${sourceRoute}#common-stroller-mistakes` },
    ...(strollerJournalLinks.length > 0
      ? [{ label: 'Next reads', href: `${sourceRoute}#stroller-next-reads` }]
      : []),
  ];
  const carSeatHeroJumpLinks = [
    { label: 'Start here', href: `${sourceRoute}#car-seat-starting-point` },
    { label: 'Stage flow', href: `${sourceRoute}#car-seat-stage-flow` },
    { label: 'Categories', href: `${sourceRoute}#car-seat-category-grid` },
    { label: 'Next steps', href: `${sourceRoute}#car-seat-continue` },
  ];
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const nextGuideItems = getGuideNextGuideItems(guide.slug);
  const showDisclosureAfterIntro =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const introSection = outline.sections[0] ?? null;
  const remainingSections = outline.sections.slice(1);
  const useSoftGuideCtas = shouldUseSoftGuideCtas({
    slug: guide.slug,
    category: guide.category,
    sourceRoute,
  });
  const heroPrimaryCta =
    hubConfig?.decisionItems[0]
      ? {
          href: hubConfig.decisionItems[0].href,
          label: hubConfig.decisionItems[0].title,
          ...(useSoftGuideCtas ? { variant: 'accent' as const } : {}),
        }
      : hubConfig?.cards[0]
        ? {
            href: hubConfig.cards[0].href,
            label: `Explore ${hubConfig.cards[0].title}`,
            ...(useSoftGuideCtas ? { variant: 'accent' as const } : {}),
          }
        : null;
  const heroSecondaryCta =
    hubConfig?.cards[0] && hubConfig.cards[0].href !== heroPrimaryCta?.href
      ? {
          href: hubConfig.cards[0].href,
          label: `See ${hubConfig.cards[0].title}`,
          variant: 'secondary' as const,
        }
      : hubConfig?.supportLinks[0]
        ? {
            href: hubConfig.supportLinks[0].href,
            label: hubConfig.supportLinks[0].title,
            variant: 'secondary' as const,
          }
        : null;
  const midPrimaryCta = guide.consultationCtaEnabled
    ? {
        href: '/book',
        label: guide.consultationCtaLabel?.trim() || 'Book a Consultation',
        ...(useSoftGuideCtas ? { variant: 'accent' as const } : {}),
      }
    : hubConfig?.supportLinks[0]
      ? {
          href: hubConfig.supportLinks[0].href,
          label: `Explore ${hubConfig.supportLinks[0].title}`,
          ...(useSoftGuideCtas ? { variant: 'accent' as const } : {}),
        }
      : null;
  const midSecondaryCta = relatedGuides[0]
    ? {
        href: relatedGuides[0].href,
        label: `Read ${relatedGuides[0].title}`,
        variant: 'secondary' as const,
      }
    : hubConfig?.supportLinks[1]
      ? {
          href: hubConfig.supportLinks[1].href,
          label: hubConfig.supportLinks[1].title,
          variant: 'secondary' as const,
        }
      : null;
  const slideDeckId = `guide-slide-deck-${guide.slug}`;
  const slideItems = useDecisionStyledHubCards
    ? [
        { id: 'guide-overview', label: 'Overview', shortLabel: 'Start' },
        { id: 'hub-start', label: 'Start Here', shortLabel: 'Path' },
        { id: 'hub-categories', label: 'Planning Lanes', shortLabel: 'Lanes' },
        ...(decisionStyledHubSteps.length > 0
          ? [{ id: 'hub-walkthrough', label: 'Quick Guide', shortLabel: 'Guide' }]
          : []),
        { id: 'hub-next-steps', label: 'Next Steps', shortLabel: 'Next' },
      ]
    : [
        { id: 'guide-overview', label: 'Overview', shortLabel: 'Start' },
        { id: 'hub-start', label: 'Start Here', shortLabel: 'Map' },
        { id: 'hub-guide-path', label: 'Guide Path', shortLabel: 'Read' },
        { id: 'hub-next-steps', label: 'Next Steps', shortLabel: 'Next' },
      ];

  if (!hubConfig && !isStrollerHub && !isCarSeatHub) {
    return null;
  }

  if (isStrollerHub || isCarSeatHub) {
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

  return (
    <GuideSlideDeck
      containerId={slideDeckId}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
    >
      <SlideSection id="guide-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
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
          jumpLinks={slideItems.slice(1, 7).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          imageSrc={guide.heroImageUrl}
          imageAlt={guide.heroImageAlt}
          variant={isStrollerHub ? 'stroller-hub' : isCarSeatHub ? 'guide-hub' : 'default'}
        />
      </SlideSection>

      <SlideSection id="hub-start" background="white">
        <div className="space-y-8">
          <GuideCTARibbon
            eyebrow="Start here"
            title="Start with the lane that sounds most like your life."
            description="You do not need to read this guide like homework. Begin with the section that matches the friction you are actually trying to solve."
            primaryCta={heroPrimaryCta}
            secondaryCta={heroSecondaryCta}
          />

          {!useDecisionStyledHubCards ? (
            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={outline.tocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={outline.tocItems} mode="desktop" layout="band" />
            </div>
          ) : null}

          {outline.preface && !useDecisionStyledHubCards ? (
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,246,241,0.98)_100%)] px-6 py-6 shadow-sm md:px-8 md:py-8">
              <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.18)_0%,rgba(215,161,175,0)_72%)]" />
              <div className="relative">
                <PostContent
                  postId={`${guide.id}-preface`}
                  content={outline.preface}
                  className="guide-post-content guide-slide-content"
                  variant="guide"
                />
              </div>
            </div>
          ) : null}

          {introSection ? (
            <div className="space-y-6">
              {useDecisionStyledHubCards && decisionStyledHubCopy ? (
                <>
                  {showDisclosureAfterIntro ? <DisclosureCard text={disclosureText} /> : null}
                  <HubDecisionCards
                    eyebrow={decisionStyledHubCopy.decisionEyebrow}
                    title={decisionStyledHubCopy.decisionTitle}
                    description={decisionStyledHubCopy.decisionDescription}
                    cards={hubConfig!.decisionItems.map((item) => ({
                      title: item.title,
                      description: item.description,
                      href: item.href,
                      icon: item.icon,
                      ctaLabel: 'Explore this path',
                    }))}
                  />
                </>
              ) : (
                <>
                  <GuidePostSurface
                    postId={`${guide.id}-${introSection.id}`}
                    content={introSection.content}
                    contentClassName="guide-post-content guide-slide-content"
                  />
                  {showDisclosureAfterIntro ? <DisclosureCard text={disclosureText} /> : null}
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
                </>
              )}
            </div>
          ) : null}
        </div>
      </SlideSection>

      {useDecisionStyledHubCards && decisionStyledHubCopy ? (
        <SlideSection id="hub-categories" background="blush">
          <CategoryGrid
            eyebrow={decisionStyledHubCopy.categoryEyebrow}
            title={decisionStyledHubCopy.categoryTitle}
            description={decisionStyledHubCopy.categoryDescription}
            bestForLabel={guide.slug === 'minimalist-baby-registry' ? 'Lane' : undefined}
            cards={hubConfig!.cards.map((card) => ({
              ...card,
              ctaLabel: 'Explore guide',
            }))}
          />
        </SlideSection>
      ) : (
        <SlideSection id="hub-guide-path" background="blush">
          <div className="space-y-8">
            {remainingSections.map((section, index) => {
              const continueExploringBlock = getGuideContinueExploringBlock({
                slug: guide.slug,
                currentPath: sourceRoute,
                sectionTitle: section.title,
                relatedGuides,
              });
              const isFinalSection = index === remainingSections.length - 1;

              return (
                <div key={section.id} className="space-y-6">
                  <GuidePostSurface
                    postId={`${guide.id}-${section.id}`}
                    content={section.content}
                    contentClassName="guide-post-content guide-slide-content"
                  />

                  {!isFinalSection && continueExploringBlock ? (
                    <GuideContinueExploring
                      title={continueExploringBlock.title}
                      description={continueExploringBlock.description}
                      links={continueExploringBlock.links}
                    />
                  ) : null}

                  {showDisclosureBeforeConclusion && section.title === 'Planning Tips' ? <DisclosureCard text={disclosureText} /> : null}
                </div>
              );
            })}

            <GuideCTARibbon
              eyebrow="Need a shorter path?"
              title="Keep the next step obvious."
              description="If the details are getting longer than your patience, use one of these shortcuts and keep moving toward a real decision."
              primaryCta={midPrimaryCta}
              secondaryCta={midSecondaryCta}
            />
          </div>
        </SlideSection>
      )}

      {useDecisionStyledHubCards && decisionStyledHubCopy && decisionStyledHubSteps.length > 0 ? (
        <SlideSection id="hub-walkthrough" background="ivory">
          <div className="space-y-8">
            <GuideDecisionSteps
              eyebrow={decisionStyledHubCopy.walkthroughEyebrow}
              title={decisionStyledHubCopy.walkthroughTitle}
              description={decisionStyledHubCopy.walkthroughDescription}
              steps={decisionStyledHubSteps}
              mode="summary"
            />

            <GuideCTARibbon
              eyebrow="Need a shorter path?"
              title="Keep the next step obvious."
              description="If the details are getting longer than your patience, use one of these shortcuts and keep moving toward a real decision."
              primaryCta={midPrimaryCta}
              secondaryCta={midSecondaryCta}
            />
          </div>
        </SlideSection>
      ) : null}

      <SlideSection id="hub-next-steps" background="white">
        <div className="space-y-8">
          {useDecisionStyledHubCards && decisionStyledHubCopy ? (
            <GuideContinueExploring
              title={decisionStyledHubCopy.continueTitle}
              description={decisionStyledHubCopy.continueDescription}
              links={hubConfig!.supportLinks}
            />
          ) : null}

          {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}

          {guide.founderSignatureEnabled && guide.founderSignatureText ? (
            <MarketingSurface className="rounded-2xl border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fff8f6_0%,#fbf7f2_100%)] p-6 shadow-sm md:p-8">
              <p className="font-script text-[2rem] leading-none text-[var(--color-accent-dark)]">Taylor</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{guide.founderSignatureText}</p>
            </MarketingSurface>
          ) : null}

          {showDisclosureBeforeAffiliates && guide.affiliateModules.length > 0 ? <DisclosureCard text={disclosureText} /> : null}

          <ProductRecommendations guide={guide} preview={preview} sourceRoute={sourceRoute} />

          <NextStepBand
            guide={guide}
            preview={preview}
            sourceRoute={sourceRoute}
            nextStepEvent={nextStepEvent}
            nextStepDestinationPageType={nextStepDestinationPageType}
          />

          {useDecisionStyledHubCards && decisionStyledHubCopy ? (
            <GuideSoftConversionCta
              title={decisionStyledHubCopy.softCtaTitle}
              description={decisionStyledHubCopy.softCtaDescription}
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
              primaryVariant={useSoftGuideCtas ? 'accent' : 'primary'}
            />
          ) : null}

          <GuideNextGuides items={nextGuideItems} />
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
