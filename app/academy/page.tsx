import Image from 'next/image';
import Link from 'next/link';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import NextBestDecisionCard from '@/components/academy/NextBestDecisionCard';
import TaylorsNoteCard from '@/components/academy/TaylorsNoteCard';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import { getAcademyHomeData } from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const home = getAcademyHomeData();
const ENTRY_PATHS = [
  {
    title: "I don't know where to start",
    description:
      'Start with the first-pass registry layer so the list gets clearer before the product tabs start multiplying.',
    href: '/academy/registry/what-to-register-first',
    ctaLabel: 'Start here ->',
  },
  {
    title: 'I feel overwhelmed by gear',
    description:
      'Start with the thinking layer first. That is usually where the gear conversation gets quieter.',
    href: '/academy/gear/how-to-think-about-baby-gear',
    ctaLabel: 'Calm the gear layer ->',
  },
  {
    title: 'I already started a registry',
    description:
      'Start with the cleanup pass so the list stops growing faster than the logic behind it.',
    href: '/academy/registry/mistakes-to-avoid',
    ctaLabel: 'Tighten the list ->',
  },
] as const;

export const metadata = buildMarketingMetadata({
  title: 'TMBC Baby Academy | Taylor-Made Baby Co.',
  description: 'A calm, structured way to prepare for baby without the overwhelm. Explore registry, nursery, gear, and postpartum learning paths inside TMBC Baby Academy.',
  path: '/academy',
  imagePath: '/assets/hero/hero-baby-editorial-v2.jpg',
  imageAlt: 'TMBC Baby Academy hero image.',
  keywords: home.paths.map((path) => path.title),
  category: 'TMBC Academy',
});

export default function AcademyHomePage() {
  return (
    <SiteShell currentPath="/academy">
      <main className="site-main min-h-0 bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.16),transparent_24%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.28),transparent_28%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_32%,#fffdfa_100%)]">
        <AcademyStructuredData
          data={[
            buildAcademyBreadcrumbStructuredData({
              breadcrumbs: [{ label: 'Academy' }],
              currentPath: '/academy',
            }),
            buildAcademyCollectionStructuredData({
              title: home.title,
              description: home.description,
              path: '/academy',
              breadcrumbs: [{ label: 'Academy' }],
              items: home.paths.map((pathCard) => ({
                href: pathCard.href,
                title: pathCard.title,
                description: pathCard.description,
              })),
              keywords: home.paths.map((pathCard) => pathCard.title),
            }),
          ]}
        />

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

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-14 lg:px-10">
          <TaylorsNoteCard
            title="This is usually where baby prep starts to feel like a group project in your head."
            body="You do not need to solve registry, nursery, gear, and postpartum all at once. Start with the decision that feels loudest, then let the next one stay smaller."
            supportingLine="The Academy works best when you follow the order, not when you open twelve tabs and call that a system."
          />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 md:pb-10 lg:px-10">
          <div className="rounded-[2rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-8 shadow-[0_22px_50px_rgba(58,36,43,0.08)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Start With Your Situation</p>
            <h2 className="mt-3 max-w-[18ch] font-serif text-[1.95rem] leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
              Choose the entry point that sounds most like your brain right now
            </h2>
            <p className="mt-5 max-w-[44rem] text-[0.98rem] leading-7 text-neutral-700 sm:text-[1.04rem] sm:leading-8">
              Most parents do not need more content. They need the right first move.
            </p>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {ENTRY_PATHS.map((entryPath) => (
                <Link
                  key={entryPath.title}
                  href={entryPath.href}
                  className="group flex h-full flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-5 py-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.24)] hover:bg-white hover:shadow-[0_20px_42px_rgba(58,36,43,0.08)]"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Entry path</p>
                  <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.06] tracking-[-0.04em] text-neutral-900">
                    {entryPath.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-neutral-700">{entryPath.description}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
                    {entryPath.ctaLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Choose Your Path</p>
              <h2 className="mt-3 font-serif text-[1.95rem] leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
                Choose the path that makes the next decision quieter
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
            <NextBestDecisionCard
              title={home.explanationTitle}
              description={home.explanationBody}
              progressMessage="You do not need the whole Academy at once. You need the next clean step."
              primary={ENTRY_PATHS[0]}
              secondary={ENTRY_PATHS[1]}
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
