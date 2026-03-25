import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyPathData,
  getAcademyPathSlugs,
  isAcademyPathSlug,
} from '@/lib/academy/content';
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
  });
}

export default async function AcademyPathPage({ params }: AcademyPathPageProps) {
  const { academyPath } = await params;

  if (!isAcademyPathSlug(academyPath)) {
    notFound();
  }

  const pathData = await getAcademyPathData(academyPath);

  return (
    <SiteShell currentPath={pathData.href}>
      <main className="site-main min-h-0 bg-[linear-gradient(180deg,#fcf8f2_0%,#f6ede3_42%,#fffdfa_100%)]">
        <PageViewTracker path={pathData.href} pageType="guide" slug={`academy-${academyPath}`} title={pathData.title} />

        <section className="mx-auto max-w-6xl px-6 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
          <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">
            <ol className="flex flex-wrap items-center gap-2">
              {pathData.breadcrumb.map((item, index) => (
                <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true" className="text-[#C9AB9D]">/</span> : null}
                  {item.href ? (
                    <Link href={item.href} className="transition duration-200 hover:text-[#5F463D]">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#5F463D]">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 md:pb-20 lg:px-10">
          <div className="overflow-hidden rounded-[2rem] border border-[rgba(114,90,77,0.12)] bg-[linear-gradient(135deg,rgba(255,253,249,0.98)_0%,rgba(249,240,231,0.96)_100%)] shadow-[0_24px_56px_rgba(48,31,24,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
              <div className="px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">{pathData.title} Path</p>
                <h1 className="mt-4 font-serif text-[3rem] leading-[0.92] tracking-[-0.05em] text-neutral-900 sm:text-[3.6rem]">
                  {pathData.heroTitle}
                </h1>
                <p className="mt-5 max-w-[42rem] text-[1.08rem] leading-8 text-neutral-700">{pathData.heroDescription}</p>
                <div className="mt-6 max-w-[42rem] space-y-4 text-[1rem] leading-8 text-neutral-700">
                  {pathData.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[16rem]">
                <Image
                  src={pathData.imagePath}
                  alt={pathData.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 md:pb-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Modules</p>
            <h2 className="mt-3 font-serif text-[2.2rem] leading-[0.96] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
              Follow the sequence
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {pathData.moduleCards.map((moduleCard, index) => (
              <Link
                key={moduleCard.slug}
                href={moduleCard.href}
                className="group flex h-full flex-col rounded-[1.8rem] border border-[rgba(114,90,77,0.12)] bg-white/92 px-6 py-6 shadow-[0_18px_40px_rgba(48,31,24,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(48,31,24,0.08)]"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Module {index + 1}</p>
                <h3 className="mt-4 font-serif text-[1.9rem] leading-[0.98] tracking-[-0.04em] text-neutral-900">
                  {moduleCard.title}
                </h3>
                <p className="mt-4 text-[1rem] leading-8 text-neutral-700">{moduleCard.description}</p>
                <span className="mt-auto pt-6 text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
                  {moduleCard.ctaLabel}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
