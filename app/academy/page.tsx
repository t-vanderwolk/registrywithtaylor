import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import { getAcademyHomeData } from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'TMBC Baby Academy | Taylor-Made Baby Co.',
  description: 'A calm, structured way to prepare for baby without the overwhelm. Explore registry, nursery, gear, and postpartum learning paths inside TMBC Baby Academy.',
  path: '/academy',
  imagePath: '/assets/hero/hero-baby-editorial-v2.jpg',
  imageAlt: 'TMBC Baby Academy hero image.',
});

export default function AcademyHomePage() {
  const home = getAcademyHomeData();

  return (
    <SiteShell currentPath="/academy">
      <main className="site-main min-h-0 bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.16),transparent_24%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.28),transparent_28%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_32%,#fffdfa_100%)]">
        <PageViewTracker path="/academy" pageType="guide" slug="academy" title={home.title} />

        <Hero
          className="homepage-hero"
          eyebrow="TMBC Baby Academy"
          title={home.title}
          subtitle={home.description}
          primaryCta={{ label: 'Start with Registry', href: '/academy/registry' }}
          secondaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          tagline="Registry • Nursery • Gear • Postpartum"
          image="/assets/hero/hero-baby-editorial-v2.jpg"
          imageAlt="TMBC Baby Academy hero image"
          imageClassName="object-cover object-[72%_center]"
          overlayStyle={{
            background:
              'linear-gradient(90deg, rgba(255,250,252,0.97) 0%, rgba(255,250,252,0.9) 24%, rgba(255,250,252,0.72) 40%, rgba(255,250,252,0.36) 58%, rgba(255,250,252,0.14) 76%, rgba(255,250,252,0.08) 100%)',
          }}
          contentClassName="homepage-hero-content"
          ribbonClassName="translate-y-6 md:translate-y-8"
          staggerContent
        />

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Choose Your Path</p>
              <h2 className="mt-3 font-serif text-[1.95rem] leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
                Start where the decision feels loudest
              </h2>
            </div>
            <p className="academy-script-note academy-script-note--tilt-right max-w-[11ch] text-left lg:text-right">
              take the calmer route first
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {home.paths.map((pathCard, index) => (
              <Link
                key={pathCard.slug}
                href={pathCard.href}
                className="academy-load-in academy-sheen group overflow-hidden rounded-[2rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,248,251,0.92)_100%)] shadow-[0_22px_50px_rgba(58,36,43,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(217,134,162,0.28)] hover:shadow-[0_28px_60px_rgba(58,36,43,0.12)]"
                style={{ animationDelay: `${110 + index * 80}ms` }}
              >
                <div className="relative aspect-[4/3] bg-[linear-gradient(135deg,rgba(253,244,247,0.98),rgba(247,231,236,0.9)_54%,rgba(250,241,231,0.92))]">
                  <Image
                    src={pathCard.imagePath}
                    alt={pathCard.imageAlt}
                    fill
                    priority={pathCard.slug === 'registry'}
                    sizes="(min-width: 1024px) 30rem, 100vw"
                    className="object-contain p-4 sm:p-6"
                  />
                </div>
                <div className="space-y-4 px-6 py-6">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
                    <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.45),rgba(217,134,162,0))]" />
                  </div>
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{pathCard.eyebrow}</p>
                  <h2 className="font-serif text-[1.72rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2rem]">
                    {pathCard.title}
                  </h2>
                  <p className="text-[0.98rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">{pathCard.description}</p>
                  <span className="inline-flex text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
                    {'Open path ->'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-black/5 bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe6_100%)]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:px-10">
            <div className="rounded-[2rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,248,251,0.9)_100%)] px-6 py-8 shadow-[0_20px_44px_rgba(58,36,43,0.08)] sm:px-8 md:px-10">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">How TMBC Academy Works</p>
              <h2 className="mt-3 max-w-[18ch] font-serif text-[1.95rem] leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
                {home.explanationTitle}
              </h2>
              <p className="academy-script-note academy-script-note--sm academy-script-note--tilt-left mt-4">
                one thoughtful layer at a time
              </p>
              <p className="mt-5 max-w-[44rem] text-[0.98rem] leading-7 text-neutral-700 sm:text-[1.04rem] sm:leading-8">{home.explanationBody}</p>
              <div className="mt-8 max-w-lg">
                <GuideHandwrittenNote
                  eyebrow="Taylor's note"
                  title="Start with the layer underneath the decision."
                  description="That is usually the moment baby prep stops feeling like a pile and starts feeling like a plan."
                  presentation="margin"
                  showEyebrow
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
