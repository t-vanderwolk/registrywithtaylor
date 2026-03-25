import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import { getAcademyHomeData } from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'TMBC Baby Academy | Taylor-Made Baby Co.',
  description: 'A calm, structured way to prepare for baby without the overwhelm. Explore nursery, gear, and postpartum learning paths inside TMBC Baby Academy.',
  path: '/academy',
  imagePath: '/assets/hero/hero-baby-editorial-v2.jpg',
  imageAlt: 'TMBC Baby Academy hero image.',
});

export default function AcademyHomePage() {
  const home = getAcademyHomeData();

  return (
    <SiteShell currentPath="/academy">
      <main className="site-main min-h-0 bg-[linear-gradient(180deg,#fcf8f2_0%,#f5ece3_38%,#fffdfa_100%)]">
        <PageViewTracker path="/academy" pageType="guide" slug="academy" title={home.title} />

        <section className="relative overflow-hidden border-b border-black/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(223,183,161,0.22)_0%,rgba(223,183,161,0)_70%)]" />
          <div className="mx-auto max-w-6xl px-6 pb-18 pt-14 sm:px-8 md:pb-24 md:pt-18 lg:px-10">
            <div className="max-w-4xl">
              <p className="text-[0.76rem] uppercase tracking-[0.24em] text-[#8A6C62]">TMBC Baby Academy</p>
              <h1 className="mt-4 max-w-[12ch] font-serif text-[3.1rem] leading-[0.92] tracking-[-0.06em] text-neutral-900 sm:text-[3.8rem] md:text-[4.5rem]">
                {home.title}
              </h1>
              <p className="mt-6 max-w-[44rem] text-[1.1rem] leading-8 text-neutral-700">{home.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {home.paths.map((pathCard) => (
              <Link
                key={pathCard.slug}
                href={pathCard.href}
                className="group overflow-hidden rounded-[2rem] border border-[rgba(114,90,77,0.12)] bg-white/92 shadow-[0_22px_50px_rgba(48,31,24,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(48,31,24,0.1)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={pathCard.imagePath}
                    alt={pathCard.imageAlt}
                    fill
                    priority={pathCard.slug === 'nursery'}
                    sizes="(min-width: 1024px) 30rem, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 px-6 py-6">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">{pathCard.eyebrow}</p>
                  <h2 className="font-serif text-[2rem] leading-[0.96] tracking-[-0.04em] text-neutral-900">
                    {pathCard.title}
                  </h2>
                  <p className="text-[1rem] leading-8 text-neutral-700">{pathCard.description}</p>
                  <span className="inline-flex text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
                    {'Open path ->'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-black/5 bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe6_100%)]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20 lg:px-10">
            <div className="rounded-[2rem] border border-[rgba(114,90,77,0.12)] bg-white/88 px-6 py-8 shadow-[0_20px_44px_rgba(48,31,24,0.06)] sm:px-8 md:px-10">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">How TMBC Academy Works</p>
              <h2 className="mt-3 max-w-[18ch] font-serif text-[2.2rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
                {home.explanationTitle}
              </h2>
              <p className="mt-5 max-w-[44rem] text-[1.04rem] leading-8 text-neutral-700">{home.explanationBody}</p>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
