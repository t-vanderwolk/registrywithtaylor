import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import AcademyJourneyNavigator from '@/components/academy/AcademyJourneyNavigator';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyPathData,
  getAcademyPathSlugs,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type AcademyPathPageProps = {
  params: Promise<{
    academyPath: string;
  }>;
};

export function generateStaticParams() {
  return getAcademyPathSlugs().map((academyPath) => ({ academyPath }));
}

export async function generateMetadata({ params }: AcademyPathPageProps): Promise<Metadata> {
  const { academyPath } = await params;

  if (!isAcademyPathSlug(academyPath)) {
    return {};
  }

  const pathData = await getAcademyPathData(academyPath);

  return buildMarketingMetadata({
    title: `${pathData.title} Path | TMBC Baby Academy`,
    description: pathData.heroDescription,
    path: `/academy/${academyPath}`,
    imagePath: pathData.imagePath as `/${string}`,
    imageAlt: pathData.imageAlt,
    keywords: [
      pathData.title,
      ...pathData.moduleCards.map((moduleCard) => moduleCard.title).slice(0, 4),
      ...pathData.learningHighlights.slice(0, 4),
    ],
    category: 'TMBC Academy',
  });
}

export default async function AcademyPathPage({ params }: AcademyPathPageProps) {
  const { academyPath } = await params;

  if (!isAcademyPathSlug(academyPath)) {
    notFound();
  }

  const pathData = await getAcademyPathData(academyPath);
  const pathOverviewLine = `Inside this path: ${pathData.moduleCards
    .map((moduleCard) => moduleCard.title)
    .slice(0, 4)
    .join(', ')}${pathData.moduleCards.length > 4 ? ', and more.' : '.'}`;

  return (
    <SiteShell currentPath={pathData.href}>
      <main className="site-main min-h-0 bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.16),transparent_24%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.3),transparent_28%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_34%,#fffdfa_100%)]">
        <AcademyStructuredData
          data={[
            buildAcademyBreadcrumbStructuredData({
              breadcrumbs: pathData.breadcrumb,
              currentPath: pathData.href,
            }),
            buildAcademyCollectionStructuredData({
              title: `${pathData.title} Path`,
              description: pathData.heroDescription,
              path: pathData.href,
              breadcrumbs: pathData.breadcrumb,
              items: pathData.moduleCards.map((moduleCard) => ({
                href: moduleCard.href,
                title: moduleCard.title,
                description: moduleCard.description,
              })),
              keywords: [
                pathData.title,
                ...pathData.learningHighlights.slice(0, 5),
              ],
            }),
          ]}
        />
        <PageViewTracker path={pathData.href} pageType="guide" slug={`academy-${academyPath}`} title={pathData.title} />

        <section className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
          <nav aria-label="Breadcrumb" className="academy-load-in academy-load-in--1 text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
            <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
              {pathData.breadcrumb.map((item, index) => (
                <li key={`${item.label}-${index}`} className="inline-flex min-w-0 flex-wrap items-center gap-2">
                  {index > 0 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.34)]">/</span> : null}
                  {item.href ? (
                    <Link href={item.href} className="max-w-full break-words transition duration-200 hover:text-[#8F4C62]">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="max-w-full break-words text-[#8F4C62]">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-10">
          <div className="academy-load-in academy-load-in--2 overflow-hidden rounded-[2.25rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,242,246,0.97)_38%,rgba(249,240,231,0.96)_100%)] shadow-[0_28px_64px_rgba(58,36,43,0.10)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
              <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{pathData.title} Path</p>
                <h1 className="mt-4 break-words font-serif text-[2.1rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3.6rem]">
                  {pathData.heroTitle}
                </h1>
                <p className="mt-5 max-w-[42rem] break-words text-[1rem] leading-7 text-neutral-700 sm:text-[1.08rem] sm:leading-8">{pathData.heroDescription}</p>
                <p className="mt-4 max-w-[42rem] break-words text-[0.98rem] leading-8 text-neutral-700 sm:text-[1rem]">
                  {pathOverviewLine}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(217,134,162,0.18)] bg-white/76 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62] shadow-[0_12px_26px_rgba(58,36,43,0.06)]">
                    Learn it in order. Buy later.
                  </span>
                  <span className="academy-script-note academy-script-note--sm academy-script-note--tilt-left">this is the calmer route</span>
                </div>
                <p className="academy-handwritten-aside mt-3">Read the sequence first. Shop after the thinking gets quieter.</p>
                <div className="mt-6 max-w-[42rem] space-y-4 text-[1rem] leading-8 text-neutral-700">
                  {pathData.intro.map((paragraph) => (
                    <p key={paragraph} className="break-words">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[14rem] bg-[linear-gradient(135deg,rgba(253,244,247,0.98),rgba(247,231,236,0.9)_54%,rgba(250,241,231,0.92))] sm:min-h-[16rem]">
                <Image
                  src={pathData.imagePath}
                  alt={pathData.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-contain p-4 sm:p-8"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-14 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <div className="academy-load-in academy-load-in--3 rounded-[1.9rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_18px_40px_rgba(58,36,43,0.07)] sm:px-8 sm:py-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Overall Summary</p>
              <h2 className="mt-3 font-serif text-[1.92rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.45rem]">
                What this path will actually help you do
              </h2>
              <div className="mt-5 max-w-[44rem] space-y-4 text-[0.98rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">
                {pathData.overallSummary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="academy-load-in academy-load-in--4 rounded-[1.9rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(250,241,244,0.96)_100%)] px-6 py-7 shadow-[0_18px_40px_rgba(58,36,43,0.07)] sm:px-8 sm:py-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">What You&apos;ll Learn</p>
              <ul className="mt-5 space-y-3 text-[0.98rem] leading-7 text-neutral-700">
                {pathData.learningHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#D986A2]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-14 lg:px-10">
          <AcademyJourneyNavigator currentPathSlug={pathData.slug} />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Modules</p>
            <h2 className="mt-3 font-serif text-[1.95rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
              What you&apos;ll learn, module by module
            </h2>
            <p className="academy-script-note academy-script-note--sm academy-script-note--tilt-right mt-4">one calm module at a time</p>
            <p className="mt-4 text-[0.98rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">{pathData.moduleSectionDescription}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {pathData.moduleCards.map((moduleCard, index) => (
              <Link
                key={moduleCard.slug}
                href={moduleCard.href}
                className="academy-load-in academy-sheen group flex h-full flex-col rounded-[1.9rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-6 shadow-[0_20px_46px_rgba(58,36,43,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(217,134,162,0.26)] hover:shadow-[0_26px_58px_rgba(58,36,43,0.1)]"
                style={{ animationDelay: `${140 + index * 90}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
                  <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.45),rgba(217,134,162,0))]" />
                </div>
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Module {index + 1}</p>
                <h3 className="mt-4 font-serif text-[1.65rem] leading-[1] tracking-[-0.04em] text-neutral-900 sm:text-[1.9rem]">
                  {moduleCard.title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">{moduleCard.description}</p>
                <span className="mt-auto pt-6 text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
                  {moduleCard.ctaLabel}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 max-w-lg">
            <GuideHandwrittenNote
              eyebrow="Little reminder"
              title="Read the path in order. It works better that way."
              description="The goal is not to consume more content. The goal is to make the next decision feel smaller and smarter."
              presentation="margin"
              showEyebrow
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
