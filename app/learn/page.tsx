import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import LearnHero from '@/components/learn/LearnHero';
import FreeLessonCard, { type LessonCardData } from '@/components/learn/FreeLessonCard';
import AcademyUpsellCard from '@/components/learn/AcademyUpsellCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import { getAcademyPathData, getAcademyPathSlugs } from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Academy',
  description:
    'A calm, structured way to prepare for baby — registry, nursery, gear, and postpartum. Start with free preview lessons. No account required.',
  path: '/learn',
  imagePath: '/assets/editorial/registry.jpg',
  imageAlt: 'Taylor-Made Baby Academy',
  keywords: [
    'baby preparation course',
    'baby academy',
    'registry lesson',
    'nursery planning',
    'baby gear guide',
    'postpartum preparation',
  ],
});

const freeLessons: LessonCardData[] = [
  {
    lessonNumber: 1,
    title: 'The Art of the Registry',
    description:
      'Why most registries fail and how to create one that actually supports your lifestyle.',
    estimatedMinutes: 15,
    href: '/learn/art-of-the-registry',
    badge: 'Free Lesson',
    available: true,
  },
  {
    lessonNumber: 2,
    title: 'Nursery Foundations',
    description:
      'Everything you need to know about sleep spaces, furniture, layout, storage, and safety — before you buy a thing.',
    estimatedMinutes: 18,
    href: '/learn/nursery-foundations',
    badge: 'Free Lesson',
    available: true,
  },
  {
    lessonNumber: 3,
    title: 'The Stroller Equation',
    description:
      'The best stroller for someone else might be completely wrong for you. Learn the variables and all six categories so you can solve the equation with your own life.',
    estimatedMinutes: 20,
    href: '/learn/stroller-foundations',
    badge: 'Free Lesson',
    available: true,
  },
];

// Path accent colors for the path grid
const PATH_ACCENTS: Record<string, { eyebrow: string; badge: string }> = {
  registry: { eyebrow: 'Registry Path', badge: '8 modules' },
  nursery: { eyebrow: 'Nursery Path', badge: '6 modules' },
  gear: { eyebrow: 'Gear Path', badge: '9 modules' },
  postpartum: { eyebrow: 'Postpartum Path', badge: '6 modules' },
};

export default async function LearnPage() {
  const pathSlugs = getAcademyPathSlugs();
  const paths = await Promise.all(pathSlugs.map((slug) => getAcademyPathData(slug)));

  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: 'var(--color-ivory)' }}>

        {/* ─── Hero ───────────────────────────────────────────────────── */}
        <LearnHero />

        {/* ─── Free preview lessons ───────────────────────────────────── */}
        <MarketingSection
          id="preview-lessons"
          tone="white"
          spacing="spacious"
          reveal={false}
        >
          <RevealOnScroll>
            <SectionIntro
              eyebrow="Free Preview Lessons"
              title="Start your journey here."
              description="Three complete lessons — no account required. Each includes a workbook and key takeaways."
              contentWidthClassName="max-w-3xl"
            />
          </RevealOnScroll>

          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3">
            {freeLessons.map((lesson, index) => (
              <RevealOnScroll key={lesson.title} delayMs={index * 80}>
                <FreeLessonCard lesson={lesson} />
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* ─── Travel System Compatibility Tool (CTA to dedicated page) ─ */}
        <MarketingSection
          id="travel-system"
          tone="ivory"
          spacing="spacious"
          reveal={false}
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl">
              <SectionIntro
                eyebrow="Free Tool"
                title="Check stroller-to-car-seat compatibility."
                description="Confirm your specific stroller and infant car seat work together before you buy either one. Where an adapter is required, the tool tells you which one."
                contentWidthClassName="max-w-3xl"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf2ec_100%)] p-8 shadow-[0_20px_60px_rgba(55,40,46,0.06)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                Travel System Checker
              </p>
              <h3 className="mt-3 font-serif text-[1.8rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
                Stroller-first or car seat-first — it works either way.
              </h3>
              <p className="mt-4 text-[1rem] leading-[1.85] text-neutral-700">
                Pick your stroller to see which infant seats fit, or start with the car seat to find
                compatible strollers. The tool flags when an adapter is needed and links to current pricing on Babylist and Amazon.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tools/travel-system"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.9rem] font-semibold text-white shadow-[0_8px_20px_rgba(55,40,46,0.18)] transition duration-200 hover:opacity-90"
                >
                  Open the Compatibility Tool
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <p className="mt-5 text-[0.78rem] text-neutral-500">
                Free to use. No account required. Covers 50+ strollers and 25+ infant car seats.
              </p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* ─── Stroller Matchmaker Quiz (CTA to dedicated page) ──────── */}
        <MarketingSection
          id="stroller-quiz"
          tone="white"
          spacing="spacious"
          reveal={false}
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl">
              <SectionIntro
                eyebrow="Free Tool"
                title="Find your stroller category."
                description="There is no universal best stroller — only the one that fits your actual life. Answer 8 questions and we'll match you to the right category with specific picks."
                contentWidthClassName="max-w-3xl"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf2ec_100%)] p-8 shadow-[0_20px_60px_rgba(55,40,46,0.06)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/80">
                Stroller Matchmaker
              </p>
              <h3 className="mt-3 font-serif text-[1.8rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
                Six categories. One that actually fits your life.
              </h3>
              <p className="mt-4 text-[1rem] leading-[1.85] text-neutral-700">
                Full size, compact, travel, single-to-double convertible, double, or jogging — each one solves a different job. The quiz matches you to the right category and gives you Taylor's top picks in that lane.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tools/stroller-quiz"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.9rem] font-semibold text-white shadow-[0_8px_20px_rgba(55,40,46,0.18)] transition duration-200 hover:opacity-90"
                >
                  Take the Quiz
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <p className="mt-5 text-[0.78rem] text-neutral-500">
                Free to use. No account required. Takes about 2 minutes.</p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* ─── Full Academy path grid ─────────────────────────────────── */}
        <section className="border-t border-[rgba(0,0,0,0.05)] px-5 py-14 sm:px-8 sm:py-20" style={{ backgroundColor: '#faf9f6' }}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
                  Full Academy
                </p>
                <h2 className="mt-3 font-serif text-[2rem] leading-[0.96] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
                  Four paths. One complete preparation system.
                </h2>
                <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.8] text-neutral-600">
                  The full Academy walks you through every decision — in order, without overwhelm.
                  Each path stands alone or connects to the others.
                </p>
              </div>
              <Link
                href="/learn/pricing"
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(216,137,160,0.28)] transition-all duration-200 hover:bg-[var(--color-cta-pink-hover)]"
              >
                See pricing
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {paths.map((path) => {
                const accent = PATH_ACCENTS[path.slug];
                const firstModule = path.moduleCards[0];
                return (
                  <Link
                    key={path.slug}
                    href={`/learn/${path.slug}`}
                    className="group flex flex-col gap-4 overflow-hidden rounded-[1.45rem] border border-[rgba(215,161,175,0.22)] bg-white p-6 shadow-[0_10px_28px_rgba(72,49,56,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(72,49,56,0.09)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
                        {accent?.eyebrow}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-[rgba(232,154,174,0.1)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]">
                        {accent?.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-[1.45rem] leading-tight tracking-[-0.03em] text-neutral-900">
                      {path.title}
                    </h3>
                    <p className="flex-1 text-[0.9rem] leading-relaxed text-neutral-600">
                      {path.shortDescription}
                    </p>

                    {firstModule && (
                      <p className="text-[0.78rem] text-neutral-400">
                        Starts with: {firstModule.title}
                      </p>
                    )}

                    <span className="text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-0.5">
                      Open path →
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="mt-6 text-center text-[0.8rem] text-neutral-400">
              Full Academy access requires enrollment.{' '}
              <Link href="/learn/pricing" className="underline underline-offset-2 hover:text-neutral-600">
                See pricing →
              </Link>
            </p>
          </div>
        </section>

        {/* ─── Upsell card ────────────────────────────────────────────── */}
        <MarketingSection tone="ivory" spacing="spacious" reveal={false}>
          <RevealOnScroll>
            <AcademyUpsellCard />
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
