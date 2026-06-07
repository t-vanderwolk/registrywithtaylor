import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import LessonCTA from '@/components/learn/LessonCTA';
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

type LearnPathPageProps = {
  params: Promise<{ path: string }>;
};

export function generateStaticParams() {
  return getAcademyPathSlugs().map((path) => ({ path }));
}

export async function generateMetadata({ params }: LearnPathPageProps): Promise<Metadata> {
  const { path } = await params;

  if (!isAcademyPathSlug(path)) return {};

  const pathData = await getAcademyPathData(path);

  return buildMarketingMetadata({
    title: `${pathData.title} Path | Taylor-Made Baby Academy`,
    description: pathData.heroDescription,
    path: `/learn/${path}` as `/${string}`,
    imagePath: pathData.imagePath as `/${string}`,
    imageAlt: pathData.imageAlt,
    keywords: [
      pathData.title,
      ...pathData.moduleCards.map((m) => m.title).slice(0, 4),
      ...pathData.learningHighlights.slice(0, 3),
    ],
    category: 'TMBC Academy',
  });
}

export default async function LearnPathPage({ params }: LearnPathPageProps) {
  const { path } = await params;

  if (!isAcademyPathSlug(path)) notFound();

  const pathData = await getAcademyPathData(path);

  const breadcrumbs = [
    { label: 'Academy', href: '/learn' },
    { label: `${pathData.title} Path` },
  ];

  const firstModule = pathData.moduleCards[0];

  return (
    <SiteShell currentPath={`/learn/${path}`}>
      <main className="site-main min-h-0" style={{ backgroundColor: '#faf9f6' }}>
        <AcademyStructuredData
          data={[
            buildAcademyBreadcrumbStructuredData({
              breadcrumbs,
              currentPath: `/learn/${path}`,
            }),
            buildAcademyCollectionStructuredData({
              title: `${pathData.title} Path`,
              description: pathData.heroDescription,
              path: `/learn/${path}`,
              breadcrumbs,
              items: pathData.moduleCards.map((m) => ({
                href: `/learn/${path}/${m.slug}`,
                title: m.title,
                description: m.description,
              })),
              keywords: [pathData.title, ...pathData.learningHighlights.slice(0, 4)],
            }),
          ]}
        />

        {/* ─── Path hero ─────────────────────────────────────────────────── */}
        <section className="border-b border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fffdfb_0%,#fdf8f5_100%)] px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-neutral-400">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.label} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden className="text-neutral-300">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors duration-200 hover:text-[var(--color-accent-dark)]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-accent-dark)]" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center lg:gap-14">
              {/* Copy */}
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
                  {pathData.title} Path
                </p>
                <h1 className="mt-4 font-serif text-[2.2rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3rem] lg:text-[3.4rem]">
                  {pathData.heroTitle}
                </h1>
                <p className="mt-5 max-w-[44ch] text-[1.02rem] leading-[1.8] text-neutral-600 sm:text-[1.08rem]">
                  {pathData.heroDescription}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-white/80 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-[0_6px_16px_rgba(72,49,56,0.04)]">
                    {pathData.moduleCards.length} modules
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-white/80 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-[0_6px_16px_rgba(72,49,56,0.04)]">
                    Learn it in order. Buy later.
                  </span>
                </div>

                {firstModule && (
                  <div className="mt-8">
                    <Link
                      href={`/learn/${path}/${firstModule.slug}`}
                      className="btn btn--primary inline-flex"
                    >
                      Start Module 1
                    </Link>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(135deg,rgba(253,244,247,0.98),rgba(247,231,236,0.9)_54%,rgba(250,241,231,0.92))] shadow-[0_24px_60px_rgba(58,36,43,0.08)] lg:block">
                <Image
                  src={pathData.imagePath}
                  alt={pathData.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 480px, 40vw"
                  className="object-contain p-6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── What you'll learn ─────────────────────────────────────────── */}
        <section className="border-b border-[rgba(0,0,0,0.05)] px-5 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Summary */}
              <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.2)] bg-white/90 px-6 py-7 shadow-[0_10px_28px_rgba(72,49,56,0.05)] sm:px-8 sm:py-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                  What this path covers
                </p>
                <div className="mt-4 space-y-3 text-[0.98rem] leading-[1.8] text-neutral-600">
                  {pathData.overallSummary.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(250,241,244,0.96)_100%)] px-6 py-7 shadow-[0_10px_28px_rgba(72,49,56,0.05)] sm:px-8 sm:py-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                  What you&apos;ll walk away with
                </p>
                <ul className="mt-4 space-y-3">
                  {pathData.learningHighlights.slice(0, 6).map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span className="text-[0.96rem] leading-[1.75] text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Module grid ───────────────────────────────────────────────── */}
        <section className="px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                Modules
              </p>
              <h2 className="mt-3 font-serif text-[1.9rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.4rem]">
                The clearest order through this path
              </h2>
              <p className="mt-3 max-w-[48ch] text-[0.98rem] leading-[1.8] text-neutral-600">
                {pathData.moduleSectionDescription}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pathData.moduleCards.map((moduleCard, index) => (
                <Link
                  key={moduleCard.slug}
                  href={`/learn/${path}/${moduleCard.slug}`}
                  className="group flex flex-col gap-4 rounded-[1.45rem] border border-[rgba(215,161,175,0.22)] bg-white p-6 shadow-[0_10px_28px_rgba(72,49,56,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(72,49,56,0.09)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
                      Module {index + 1}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[rgba(232,154,174,0.1)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                      Lesson
                    </span>
                  </div>
                  <h3 className="font-serif text-[1.3rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.45rem]">
                    {moduleCard.title}
                  </h3>
                  <p className="flex-1 text-[0.9rem] leading-relaxed text-neutral-600">
                    {moduleCard.description}
                  </p>
                  <span className="text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-0.5">
                    {moduleCard.ctaLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Lesson CTA ────────────────────────────────────────────────── */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <LessonCTA
              heading={`Start the ${pathData.title} path`}
              body="Begin at Module 1 and let each lesson make the next decision quieter."
              primaryLabel="Start Module 1"
              primaryHref={firstModule ? `/learn/${path}/${firstModule.slug}` : '/learn'}
              secondaryLabel="Back to Academy"
              secondaryHref="/learn"
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
