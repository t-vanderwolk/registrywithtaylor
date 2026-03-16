import Image from 'next/image';
import Link from 'next/link';
import GuideGrid from '@/components/marketing/GuideGrid';
import PostContent from '@/components/blog/PostContent';
import GuideHubLayout from '@/components/guides/GuideHubLayout';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import GuideViewTracker from '@/components/guides/GuideViewTracker';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { GuideAnalyticsEvents, getGuideDestinationEvent } from '@/lib/guides/events';
import { getGuideHubConfig } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import { getAnalyticsPageType } from '@/lib/analytics';
import { isRemoteImageUrl } from '@/lib/blog/images';
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
  const shouldSkipAvatarOptimization = isRemoteImageUrl(guide.author.avatarUrl);

  if (guide.author.avatarUrl) {
    return (
      <Image
        src={guide.author.avatarUrl}
        alt={authorName}
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
        unoptimized={shouldSkipAvatarOptimization}
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
  categoryGuides = [],
  preview = false,
}: {
  guide: GuideArticleRecord;
  relatedGuides?: GuideCardItem[];
  categoryGuides?: GuideCardItem[];
  preview?: boolean;
}) {
  const displayDate = getGuideDisplayDate(guide);
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const tocItems = guide.tableOfContentsEnabled ? extractTocItems(articleContent) : [];
  const sourceRoute = preview
    ? `/admin/guides/${guide.id}/preview`
    : getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });
  const heroImage = guide.heroImageUrl?.trim() || null;
  const heroAlt = guide.heroImageAlt?.trim() || guide.title;
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(heroImage);
  const disclosureText = getDisclosureText(guide);
  const showDisclosureAfterIntro = guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const nextStepEvent = guide.nextStepCtaHref ? getGuideDestinationEvent(guide.nextStepCtaHref) : null;
  const nextStepDestinationPageType = guide.nextStepCtaHref ? getAnalyticsPageType(guide.nextStepCtaHref) : null;
  const wordCount = stripMarkdown(articleContent).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(3, Math.round(wordCount / 190));
  const primarySectionCount = tocItems.filter((item) => item.level === 2).length || tocItems.length || 1;
  const snapshotItems = [
    { label: 'Category', value: guide.category },
    { label: 'Published', value: formatArticleDate(displayDate) },
    { label: 'Read time', value: `${readingTime} min` },
    { label: 'Sections', value: String(primarySectionCount) },
  ];
  const showCategoryMenu = !preview && guide.slug === 'best-strollers' && categoryGuides.length > 0;
  const pillarPreviewTopics = tocItems.filter((item) => item.level === 2).slice(0, 4);
  const hubConfig = getGuideHubConfig(guide.slug, sourceRoute);

  if (hubConfig) {
    return (
      <>
        <GuideViewTracker
          guideId={guide.id}
          sourceRoute={sourceRoute}
          slug={guide.slug}
          title={guide.title}
          enabled={!preview}
        />

        <GuideHubLayout
          guide={guide}
          relatedGuides={relatedGuides}
          preview={preview}
          sourceRoute={sourceRoute}
          displayDate={displayDate}
          readingTime={readingTime}
          disclosureText={disclosureText}
          nextStepEvent={nextStepEvent}
          nextStepDestinationPageType={nextStepDestinationPageType}
        />
      </>
    );
  }

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
                  unoptimized={shouldSkipHeroImageOptimization}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-16">
          <div className="space-y-8">
            <MarketingSurface className="rounded-[1.5rem] border border-black/6 bg-white/82 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.04)] sm:p-5">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  {snapshotItems.map((item) => (
                    <div
                      key={item.label}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-black/6 bg-[rgba(248,243,238,0.9)] px-4 py-2 text-sm text-neutral-700"
                    >
                      <span className="text-[0.66rem] uppercase tracking-[0.18em] text-black/42">{item.label}</span>
                      <span className="text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                {tocItems.length > 0 ? (
                  <details className="rounded-[1.1rem] border border-black/6 bg-[rgba(252,247,242,0.76)] px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-medium text-neutral-800">
                      Jump to a section
                    </summary>
                    <nav className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Guide table of contents">
                      {tocItems.map((item, index) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`rounded-[0.95rem] border border-transparent px-3 py-2 text-sm leading-6 text-neutral-700 transition hover:border-[rgba(196,156,94,0.18)] hover:bg-white/72 hover:text-neutral-900 ${
                            item.level === 3 ? 'pl-5 text-black/58' : 'bg-white/56'
                          }`}
                        >
                          <span className="mr-2 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-accent-dark)]/70">
                            {index + 1}
                          </span>
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </details>
                ) : null}
              </div>
            </MarketingSurface>

            {showCategoryMenu ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
                <MarketingSurface className="rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf1eb_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    Start here
                  </p>
                  <h2 className="mt-4 font-serif text-[2.15rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:text-[2.45rem]">
                    Begin with the full stroller guide.
                  </h2>
                  <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-neutral-700">
                    If strollers still feel like one very large category, start with the pillar guide first. It gives you the full landscape, explains the tradeoffs, and makes the category guides below much easier to use.
                  </p>

                  {pillarPreviewTopics.length > 0 ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {pillarPreviewTopics.map((item, index) => (
                        <div
                          key={item.id}
                          className="rounded-[1.25rem] border border-black/6 bg-white/78 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.03)]"
                        >
                          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/42">Inside the pillar guide {index + 1}</p>
                          <p className="mt-2 text-sm leading-7 text-neutral-800">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href="#pillar-guide-content" className="btn btn--primary w-full sm:w-auto">
                      Begin with the Pillar Guide
                    </a>
                    <p className="text-sm leading-7 text-neutral-600">
                      Already know the stroller type you are narrowing? Jump straight to a category guide.
                    </p>
                  </div>
                </MarketingSurface>

                <MarketingSurface className="rounded-[2rem] border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:p-8">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Category guides</p>
                    <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">
                      Or jump to the stroller type you are comparing.
                    </h2>
                    <p className="text-sm leading-7 text-neutral-700">
                      These shorter category guides are useful when you already know the lane and want faster decision help.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {categoryGuides.map((categoryGuide, index) => (
                      <Link
                        key={categoryGuide.slug}
                        href={categoryGuide.href}
                        className="group block rounded-[1.35rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/42">Category guide {index + 1}</p>
                            <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                              {categoryGuide.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-neutral-700">{categoryGuide.description}</p>
                          </div>
                          <span className="pt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]">
                            Open
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </MarketingSurface>
              </div>
            ) : null}

            {showDisclosureAfterIntro ? <DisclosureCard text={disclosureText} /> : null}

            {/* Quick Decision Card */}
            <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm border border-rose-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif text-charcoal">Quick Assessment: Full-Size vs Compact</h2>
              </div>
              <p className="text-neutral-700 mb-6">Answer these questions to determine if a full-size stroller fits your lifestyle:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">✓</span>
                    Choose Full-Size If:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">You walk frequently with outings longer than 2 hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">You need stronger suspension for rough terrain</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">Storage capacity is a priority for your lifestyle</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-400 flex items-center justify-center text-white text-xs font-bold">✗</span>
                    Consider Compact If:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">You live in a small apartment or have limited storage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">Public transit or frequent travel is part of your routine</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-neutral-700">Easy storage and carrying is essential</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <p className="text-sm text-neutral-700">
                  <strong className="text-charcoal">Pro tip:</strong> Full-size strollers excel at comfort and capacity but require more storage space. 
                  If you're still unsure, read through the guide sections below to understand the trade-offs.
                </p>
              </div>
            </div>

            <div
              id="pillar-guide-content"
              className="relative overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,246,241,0.98)_100%)] px-5 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.05)] sm:rounded-[2.2rem] md:px-8 md:py-10"
            >
              <div className="absolute right-[-1.5rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.18)_0%,rgba(215,161,175,0)_72%)]" />
              <div className="relative">
                {/* Learning Path */}
                <div className="mb-8 rounded-2xl bg-white p-6 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal">Guide Structure</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">1</span>
                      <span className="text-sm text-neutral-700">What Defines a Full-Size Stroller</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">2</span>
                      <span className="text-sm text-neutral-700">Key Features & Benefits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">3</span>
                      <span className="text-sm text-neutral-700">When Full-Size Makes Sense</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">4</span>
                      <span className="text-sm text-neutral-700">Top Recommended Models</span>
                    </div>
                  </div>
                </div>

                <PostContent postId={guide.id} content={articleContent} className="guide-post-content" variant="guide" highlightBrandWordmark={guide.category === 'Strollers'} />

                {/* Knowledge Check */}
                <div className="mt-12 mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal">Knowledge Check</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-700 mb-4">Before moving to product recommendations, confirm you understand:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-neutral-700">Full-size strollers prioritize comfort and capacity over portability</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-neutral-700">Storage space and terrain type are key decision factors</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-neutral-700">Budget ranges from $500-$1500+ depending on features</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-neutral-700">Different models excel at different use cases</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Summary */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-charcoal">What You Learned</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Full-Size Stroller Characteristics:</h4>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    <li>• Larger footprint with more storage</li>
                    <li>• Superior suspension for rough terrain</li>
                    <li>• Better for longer outings</li>
                    <li>• More stable for heavier loads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Decision Factors:</h4>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    <li>• Lifestyle and activity patterns</li>
                    <li>• Storage space availability</li>
                    <li>• Budget and feature priorities</li>
                    <li>• Terrain and usage scenarios</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <strong className="text-charcoal">Next Steps:</strong> Review the recommended models below and consider your specific needs. 
                  If you're still unsure, our consultation service can help you make the perfect choice for your family.
                </p>
              </div>
            </div>

            {guide.affiliateModules.length > 0 ? (
              <div className="space-y-5">
                <MarketingSurface className="rounded-[2rem] border border-black/6 bg-white/94 p-6 md:p-8">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      Recommended Products
                    </p>
                    <h2 className="font-serif text-[2rem] leading-[1] tracking-[-0.04em] text-neutral-900">
                      Top Full-Size Stroller Picks
                    </h2>
                    <p className="text-sm leading-7 text-neutral-700">
                      Based on real parent feedback and expert analysis, these models consistently rank highest for full-size stroller performance.
                    </p>
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
