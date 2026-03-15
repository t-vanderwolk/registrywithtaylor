import Image from 'next/image';
import PostContent from '@/components/blog/PostContent';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideCategoryFeatureRow from '@/components/guides/GuideCategoryFeatureRow';
import GuideComparisonCards from '@/components/guides/GuideComparisonCards';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideDecisionStrip from '@/components/guides/GuideDecisionStrip';
import GuideEditorialImage from '@/components/guides/GuideEditorialImage';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import GuideKeywordDefinition from '@/components/guides/GuideKeywordDefinition';
import GuideRealityCheck from '@/components/guides/GuideRealityCheck';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideStartHere from '@/components/guides/GuideStartHere';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import GuideTravelSystemFinder from '@/components/guides/GuideTravelSystemFinder';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries } from '@/lib/blog/contentText';
import type { AnalyticsPageType } from '@/lib/analytics';
import { isRemoteImageUrl } from '@/lib/blog/images';
import {
  buildGuideOutline,
  splitGuideSectionContent,
  stripFaqBlocks,
  stripLeadingGuideHeading,
} from '@/lib/guides/articleOutline';
import {
  getGuideContinueExploringBlock,
  getGuideHeroJumpLinks,
  getGuideHubConfig,
  getGuideNextGuideItems,
} from '@/lib/guides/hubs';
import { GuideAnalyticsEvents, type GuideAnalyticsEventName } from '@/lib/guides/events';
import {
  getStrollerDecisionStrip,
  getStrollerEditorialImage,
  getStrollerRealityCheck,
  getStrollerCategoryVisual,
  getStrollerVisibleTocItems,
  STROLLER_COMPARISON_CARDS,
  STROLLER_START_HERE_ITEMS,
} from '@/lib/guides/strollerHub';
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
    <MarketingSurface className="rounded-[1.75rem] border border-black/6 bg-white/90 p-5 text-sm leading-7 text-neutral-700">
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
      className={`rounded-[2rem] border border-black/6 bg-white/94 shadow-[0_16px_36px_rgba(0,0,0,0.04)] ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      <div className={innerClassName}>
        <PostContent postId={postId} content={content} className={contentClassName} />
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
    <MarketingSurface className="rounded-[2rem] border border-black/6 bg-white/94 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          Product recommendations
        </p>
        <h2 className="font-serif text-[2rem] leading-[1] tracking-[-0.04em] text-neutral-900">
          Editorial picks inside this guide
        </h2>
      </div>

      <div className="mt-8 space-y-5">
        {guide.affiliateModules.map((module) => (
          <article
            key={module.id}
            className="rounded-[1.7rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
              <div className="space-y-3">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{module.title}</p>
                <h3 className="font-serif text-[1.7rem] leading-[1.05] tracking-[-0.04em] text-neutral-900">
                  {module.productName}
                </h3>
                {module.retailerLabel ? (
                  <p className="text-sm uppercase tracking-[0.14em] text-black/45">{module.retailerLabel}</p>
                ) : null}
                {module.imageUrl ? (
                  <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-black/6 bg-[#f7f4ef]">
                    <Image
                      src={module.imageUrl}
                      alt={module.productName}
                      fill
                      sizes="(min-width: 768px) 24vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                      unoptimized={isRemoteImageUrl(module.imageUrl)}
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-7 text-neutral-700">{module.description}</p>
                {module.notes ? (
                  <p className="rounded-[1.2rem] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm leading-7 text-neutral-700">
                    {module.notes}
                  </p>
                ) : null}
                <GuideTrackedLink
                  guideId={guide.id}
                  href={module.destinationUrl}
                  event={GuideAnalyticsEvents.AFFILIATE_CLICK}
                  sourceRoute={sourceRoute}
                  className="btn btn--secondary"
                  track={!preview}
                  meta={{
                    moduleTitle: module.title,
                    productName: module.productName,
                    ctaLabel: module.ctaLabel,
                    retailerLabel: module.retailerLabel,
                    partnerId: module.partnerId,
                  }}
                >
                  {module.ctaLabel}
                </GuideTrackedLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </MarketingSurface>
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

  return (
    <MarketingSurface className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Next step</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">
        Keep the momentum once the guide gets you close.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-700">
        The goal is not more tabs. It is a calmer decision, a stronger shortlist, and a clearer plan for what to do next.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {guide.consultationCtaEnabled ? (
          <GuideTrackedLink
            guideId={guide.id}
            href="/book"
            event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
            sourceRoute={sourceRoute}
            className="btn btn--primary w-full sm:w-auto"
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
            className="btn btn--secondary w-full sm:w-auto"
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
            className="btn btn--secondary w-full sm:w-auto"
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
      </div>
      {guide.newsletterCtaEnabled && guide.newsletterCtaDescription ? (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-600">{guide.newsletterCtaDescription}</p>
      ) : null}
    </MarketingSurface>
  );
}

export default function GuideHubLayout({
  guide,
  relatedGuides,
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
  const heroJumpLinks = getGuideHeroJumpLinks({
    currentPath: sourceRoute,
    tocItems: outline.tocItems,
  });
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const nextGuideItems = getGuideNextGuideItems(guide.slug);
  const isStrollerHub = guide.slug === 'best-strollers';
  const mobileTocItems = isStrollerHub ? getStrollerVisibleTocItems(outline.tocItems) : outline.tocItems;
  const nextGuideNavItems = isStrollerHub ? nextGuideItems.filter((item) => !item.current) : nextGuideItems;
  const showDisclosureAfterIntro =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');

  if (!hubConfig) {
    return null;
  }

  return (
    <>
      {isStrollerHub ? <GuideScrollProgress /> : null}

      <GuideHero
        eyebrow={guide.category}
        title={guide.title}
        description={
          guide.excerpt?.trim() ||
          'A calmer editorial guide built to help you sort the tradeoffs, skip the noise, and move into the right next decision.'
        }
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={outline.sections.length}
        jumpLinks={heroJumpLinks}
        imageSrc={guide.heroImageUrl}
        imageAlt={guide.heroImageAlt}
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div
          className={`mx-auto ${
            isStrollerHub ? 'max-w-[92rem] px-6 sm:px-8 lg:px-8 xl:px-10' : 'max-w-7xl px-5 sm:px-8 lg:px-10'
          } ${
            isStrollerHub ? 'py-16 lg:py-20' : 'py-10 lg:py-16'
          }`}
        >
          {isStrollerHub ? (
            <div className="pb-10 lg:pb-12">
              <GuideStartHere
                description="Three faster ways into the stroller decision, depending on what is most true for your week."
                items={STROLLER_START_HERE_ITEMS}
              />
            </div>
          ) : null}

          <div className={isStrollerHub ? 'space-y-10' : 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:gap-10'}>
            <div className={isStrollerHub ? 'space-y-10' : 'space-y-8'}>
              <GuideTableOfContents currentPath={sourceRoute} items={mobileTocItems} mode="mobile" />
              {isStrollerHub ? (
                <GuideTableOfContents currentPath={sourceRoute} items={outline.tocItems} mode="desktop" layout="band" />
              ) : null}

              {outline.preface ? (
                <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,246,241,0.98)_100%)] px-5 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.05)] sm:rounded-[2.2rem] md:px-8 md:py-8">
                  <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.18)_0%,rgba(215,161,175,0)_72%)]" />
                  <div className={`relative ${isStrollerHub ? 'mx-auto max-w-3xl' : ''}`}>
                    <PostContent
                      postId={`${guide.id}-preface`}
                      content={outline.preface}
                      className={isStrollerHub ? 'guide-post-content stroller-guide-content' : 'guide-post-content'}
                    />
                  </div>
                </div>
              ) : null}

              {outline.sections.map((section, index) => {
                const continueExploringBlock = getGuideContinueExploringBlock({
                  slug: guide.slug,
                  currentPath: sourceRoute,
                  sectionTitle: section.title,
                  relatedGuides,
                });
                const isIntroduction = index === 0;
                const isFinalSection = index === outline.sections.length - 1;
                const sectionBreakdown = isStrollerHub ? splitGuideSectionContent(section.content) : null;
                const contentClassName = isStrollerHub ? 'guide-post-content stroller-guide-content' : 'guide-post-content';
                const subsectionClassName = `${contentClassName} guide-post-content--subsection`;
                const innerClassName = isStrollerHub ? 'mx-auto max-w-3xl' : '';
                const realityCheck = isStrollerHub ? getStrollerRealityCheck(section.title) : null;
                const editorialImage = isStrollerHub ? getStrollerEditorialImage(section.title) : null;

                return (
                  <div key={section.id} className={isStrollerHub ? 'space-y-8' : 'space-y-6'}>
                    {isStrollerHub && sectionBreakdown && sectionBreakdown.subsections.length > 0 ? (
                      <>
                        {sectionBreakdown.introContent ? (
                          <GuidePostSurface
                            postId={`${guide.id}-${section.id}`}
                            content={sectionBreakdown.introContent}
                            contentClassName={contentClassName}
                            innerClassName={innerClassName}
                          />
                        ) : null}

                        {sectionBreakdown.subsections.map((subsection) => {
                          const decisionStrip =
                            section.title === 'Major Types and Categories'
                              ? getStrollerDecisionStrip(subsection.title)
                              : null;
                          const strollerCategoryVisual =
                            isStrollerHub && getStrollerCategoryVisual(subsection.title);

                          return (
                            <div key={subsection.id} className="space-y-5">
                              {strollerCategoryVisual ? (
                                <GuideCategoryFeatureRow
                                  id={subsection.id}
                                  title={subsection.title}
                                  content={stripLeadingGuideHeading(subsection.content)}
                                  postId={`${guide.id}-${section.id}-${subsection.id}`}
                                  imageSrc={strollerCategoryVisual.imageSrc}
                                  imageAlt={strollerCategoryVisual.imageAlt}
                                />
                              ) : (
                                <GuidePostSurface
                                  postId={`${guide.id}-${section.id}-${subsection.id}`}
                                  content={subsection.content}
                                  contentClassName={subsectionClassName}
                                  compact
                                  innerClassName={innerClassName}
                                />
                              )}

                              {decisionStrip ? (
                                <GuideDecisionStrip
                                  title={decisionStrip.title}
                                  bullets={decisionStrip.bullets}
                                  href={decisionStrip.href}
                                  ctaLabel={decisionStrip.ctaLabel}
                                  icon={decisionStrip.icon}
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <GuidePostSurface
                        postId={`${guide.id}-${section.id}`}
                        content={section.content}
                        contentClassName={contentClassName}
                        innerClassName={innerClassName}
                      />
                    )}

                    {isIntroduction ? (
                      <>
                        {showDisclosureAfterIntro ? <DisclosureCard text={disclosureText} /> : null}
                        <GuideCategoryCards
                          title={hubConfig.cardsTitle}
                          description={hubConfig.cardsDescription}
                          cards={hubConfig.cards}
                          variant={isStrollerHub ? 'stroller-hub' : 'default'}
                        />
                        <GuideDecisionHelper
                          title={hubConfig.decisionHelperTitle}
                          description={hubConfig.decisionHelperDescription}
                          items={hubConfig.decisionItems}
                        />
                        {isStrollerHub ? (
                          <>
                            <GuideKeywordDefinition
                              term="Travel system"
                              definition="A travel system simply means putting an infant car seat onto a stroller frame."
                              icon="carseat"
                            />
                            <GuideTravelSystemFinder />
                          </>
                        ) : null}
                      </>
                    ) : null}

                    {realityCheck ? <GuideRealityCheck text={realityCheck.text} icon={realityCheck.icon} /> : null}

                    {!isIntroduction && !isFinalSection && continueExploringBlock ? (
                      <GuideContinueExploring
                        title={continueExploringBlock.title}
                        description={continueExploringBlock.description}
                        links={continueExploringBlock.links}
                      />
                    ) : null}

                    {showDisclosureBeforeConclusion && section.title === 'Planning Tips' ? (
                      <DisclosureCard text={disclosureText} />
                    ) : null}

                    {editorialImage ? (
                      <GuideEditorialImage
                        eyebrow={editorialImage.eyebrow}
                        src={editorialImage.src}
                        alt={editorialImage.alt}
                        caption={editorialImage.caption}
                      />
                    ) : null}

                    {isStrollerHub && section.title === 'Planning Tips' ? (
                      <GuideComparisonCards
                        title="Popular stroller comparisons"
                        description="When the shortlist gets close, these are the faster comparison reads that usually answer the next real question."
                        cards={STROLLER_COMPARISON_CARDS}
                      />
                    ) : null}
                  </div>
                );
              })}

              <GuideFaqAccordion items={faqEntries} />

              {guide.founderSignatureEnabled && guide.founderSignatureText ? (
                <MarketingSurface className="rounded-[2rem] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fff8f6_0%,#fbf7f2_100%)] p-6 md:p-8">
                  <p className="font-script text-[2rem] leading-none text-[var(--color-accent-dark)]">Taylor</p>
                  <p className="mt-4 text-sm leading-7 text-neutral-700">{guide.founderSignatureText}</p>
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

              <GuideNextGuides title={isStrollerHub ? 'Read next' : undefined} items={nextGuideNavItems} />
            </div>

            {!isStrollerHub ? <GuideTableOfContents currentPath={sourceRoute} items={outline.tocItems} mode="desktop" /> : null}
          </div>
        </div>
      </section>
    </>
  );
}
