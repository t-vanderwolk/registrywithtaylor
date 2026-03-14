import Image from 'next/image';
import GuideGrid from '@/components/marketing/GuideGrid';
import PostContent from '@/components/blog/PostContent';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import GuideViewTracker from '@/components/guides/GuideViewTracker';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { GuideAnalyticsEvents, getGuideDestinationEvent } from '@/lib/guides/events';
import { getAnalyticsPageType } from '@/lib/analytics';
import type { GuideCardItem } from '@/lib/guides/presentation';
import { getGuideDisplayDate } from '@/lib/guides/status';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';
import { slugify } from '@/lib/slugify';

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

const formatArticleDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

function stripMarkdown(value: string) {
  return value
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTocItems(content: string): TocItem[] {
  const lines = content.split('\n');
  const usedIds = new Map<string, number>();

  return lines.flatMap((rawLine) => {
    const line = rawLine.trim();

    if (!line.startsWith('## ') && !line.startsWith('### ')) {
      return [];
    }

    const level = line.startsWith('### ') ? 3 : 2;
    const label = stripMarkdown(line.replace(/^###?\s+/, ''));
    if (!label) {
      return [];
    }

    const baseId = slugify(label) || 'section';
    const seenCount = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, seenCount + 1);

    return [
      {
        id: seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`,
        label,
        level,
      },
    ];
  });
}

function getDisclosureText(guide: GuideArticleRecord) {
  return (
    guide.affiliateDisclosureText?.trim() ||
    'Some links in this guide are affiliate links. Taylor-Made Baby Co. may earn a commission at no additional cost to you.'
  );
}

function DisclosureCard({ text }: { text: string }) {
  return (
    <MarketingSurface className="rounded-[1.75rem] border border-black/6 bg-white/90 p-5 text-sm leading-7 text-neutral-700">
      {text}
    </MarketingSurface>
  );
}

function AuthorAvatar({ guide }: { guide: GuideArticleRecord }) {
  const authorName = guide.author.name.trim();

  if (guide.author.avatarUrl) {
    return (
      <Image
        src={guide.author.avatarUrl}
        alt={authorName}
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-dark)] text-sm font-semibold uppercase tracking-[0.18em] text-white">
      {authorName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)}
    </div>
  );
}

export default function GuideArticleView({
  guide,
  relatedGuides = [],
  preview = false,
}: {
  guide: GuideArticleRecord;
  relatedGuides?: GuideCardItem[];
  preview?: boolean;
}) {
  const displayDate = getGuideDisplayDate(guide);
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const tocItems = guide.tableOfContentsEnabled ? extractTocItems(articleContent) : [];
  const sourceRoute = preview ? `/admin/guides/${guide.id}/preview` : `/guides/${guide.slug}`;
  const heroImage = guide.heroImageUrl?.trim() || null;
  const heroAlt = guide.heroImageAlt?.trim() || guide.title;
  const disclosureText = getDisclosureText(guide);
  const showDisclosureAfterIntro = guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const nextStepEvent = guide.nextStepCtaHref ? getGuideDestinationEvent(guide.nextStepCtaHref) : null;
  const nextStepDestinationPageType = guide.nextStepCtaHref ? getAnalyticsPageType(guide.nextStepCtaHref) : null;

  return (
    <>
      <GuideViewTracker
        guideId={guide.id}
        sourceRoute={sourceRoute}
        slug={guide.slug}
        title={guide.title}
        enabled={!preview}
      />

      <section className="border-b border-black/5 bg-[linear-gradient(180deg,#fbf7f2_0%,#f5eee5_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:px-10 lg:py-18">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[0.76rem] uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                {guide.category}
              </p>
              <h1 className="max-w-[13ch] font-serif text-[2.35rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:max-w-[14ch] sm:text-[3.4rem] lg:text-[4.4rem]">
                {guide.title}
              </h1>
              {guide.excerpt ? (
                <p className="max-w-[44rem] text-[1.02rem] leading-8 text-neutral-700 md:text-[1.08rem]">
                  {guide.excerpt}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-[1.6rem] border border-black/6 bg-white/88 px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
              <AuthorAvatar guide={guide} />
              <div className="space-y-1">
                <p className="text-[0.74rem] uppercase tracking-[0.2em] text-black/45">Guide author</p>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900">{guide.author.name}</p>
                <p className="text-sm text-neutral-600">
                  Published {formatArticleDate(displayDate)}
                  {guide.topicCluster ? ` · ${guide.topicCluster}` : ''}
                </p>
              </div>
            </div>
          </div>

          {heroImage ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[4/3.65]">
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  priority={!preview}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(15rem,0.36fr)_minmax(0,0.64fr)] lg:items-start lg:gap-14 lg:px-10 lg:py-16">
          <aside className="order-2 space-y-5 lg:order-1 lg:sticky lg:top-6">
            <MarketingSurface className="rounded-[1.6rem] border border-black/6 bg-white/92 p-5 sm:rounded-[1.8rem] sm:p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Guide snapshot</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">
                <p>Category: {guide.category}</p>
                {guide.targetKeyword ? <p>Target keyword: {guide.targetKeyword}</p> : null}
                {guide.secondaryKeywords.length > 0 ? (
                  <p>Secondary keywords: {guide.secondaryKeywords.slice(0, 3).join(', ')}</p>
                ) : null}
                {guide.author.bio ? <p>{guide.author.bio}</p> : null}
              </div>
            </MarketingSurface>

            {tocItems.length > 0 ? (
              <MarketingSurface className="rounded-[1.6rem] border border-black/6 bg-white/92 p-5 sm:rounded-[1.8rem] sm:p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">On this page</p>
                <nav className="mt-4 space-y-2" aria-label="Guide table of contents">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm leading-7 text-neutral-700 transition hover:text-neutral-900 ${
                        item.level === 3 ? 'pl-4' : ''
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </MarketingSurface>
            ) : null}

            {guide.consultationCtaEnabled ? (
              <MarketingSurface className="rounded-[1.6rem] border border-[rgba(196,156,94,0.22)] bg-[linear-gradient(180deg,#fff7f6_0%,#fbf7f2_100%)] p-5 sm:rounded-[1.8rem] sm:p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                  Need tailored advice?
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  Bring your shortlist, registry, stroller, car seat, or nursery questions to Taylor when you want an expert recommendation matched to your life.
                </p>
                <GuideTrackedLink
                  guideId={guide.id}
                  href="/book"
                  event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                  sourceRoute={sourceRoute}
                  className="btn btn--primary mt-5 w-full justify-center"
                  track={!preview}
                  meta={{
                    ctaLabel: guide.consultationCtaLabel?.trim() || 'Book a Consultation',
                    placement: 'sidebar',
                    slug: guide.slug,
                    title: guide.title,
                  }}
                >
                  {guide.consultationCtaLabel?.trim() || 'Book a Consultation'}
                </GuideTrackedLink>
              </MarketingSurface>
            ) : null}
          </aside>

          <div className="order-1 space-y-8 lg:order-2">
            {showDisclosureAfterIntro ? <DisclosureCard text={disclosureText} /> : null}

            <div className="rounded-[1.75rem] border border-black/6 bg-white/94 px-5 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:rounded-[2rem] md:px-8 md:py-10">
              <PostContent postId={guide.id} content={articleContent} className="guide-post-content" />
            </div>

            {showDisclosureBeforeConclusion ? <DisclosureCard text={disclosureText} /> : null}

            {guide.affiliateModules.length > 0 ? (
              <div className="space-y-5">
                {showDisclosureBeforeAffiliates ? <DisclosureCard text={disclosureText} /> : null}
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
                            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                              {module.title}
                            </p>
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
              </div>
            ) : null}

            {guide.faqItems.length > 0 ? (
              <MarketingSurface className="rounded-[2rem] border border-black/6 bg-white/94 p-6 md:p-8">
                <div className="space-y-2">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">FAQ</p>
                  <h2 className="font-serif text-[2rem] leading-[1] tracking-[-0.04em] text-neutral-900">
                    Common questions parents still ask after reading
                  </h2>
                </div>
                <div className="mt-8 space-y-4">
                  {guide.faqItems.map((faq, index) => (
                    <details
                      key={`${guide.id}-faq-${index}`}
                      className="rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-[#fdf9f4] px-5 py-4"
                    >
                      <summary className="cursor-pointer list-none font-serif text-[1.3rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
                        {faq.question}
                      </summary>
                      <p className="mt-4 text-sm leading-7 text-neutral-700">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </MarketingSurface>
            ) : null}

            {guide.founderSignatureEnabled && guide.founderSignatureText ? (
              <MarketingSurface className="rounded-[2rem] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fff8f6_0%,#fbf7f2_100%)] p-6 md:p-8">
                <p className="font-script text-[2rem] leading-none text-[var(--color-accent-dark)]">Taylor</p>
                <p className="mt-4 text-sm leading-7 text-neutral-700">{guide.founderSignatureText}</p>
              </MarketingSurface>
            ) : null}

            {(guide.consultationCtaEnabled || guide.newsletterCtaEnabled || guide.nextStepCtaHref) ? (
              <MarketingSurface className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                  Next step
                </p>
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
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-600">
                    {guide.newsletterCtaDescription}
                  </p>
                ) : null}
              </MarketingSurface>
            ) : null}
          </div>
        </div>
      </section>

      {relatedGuides.length > 0 ? (
        <GuideGrid
          guides={relatedGuides}
          compact
          eyebrow="Related guides"
          title="Keep building your plan with the next category that connects to this decision."
          description="Use the next guide to narrow the adjacent category, compare the right tradeoffs, and move into the next decision with more clarity."
        />
      ) : null}
    </>
  );
}
