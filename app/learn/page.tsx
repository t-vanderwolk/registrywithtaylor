import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import LearnHero from '@/components/learn/LearnHero';
import FreeLessonCard, { type LessonCardData } from '@/components/learn/FreeLessonCard';
import AcademyUpsellCard from '@/components/learn/AcademyUpsellCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import { getAcademyPathData, getAcademyPathSlugs } from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

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
  // Fetch all 4 paths for the path grid + travel system tool data
  const pathSlugs = getAcademyPathSlugs();
  const [paths, strollers, carSeats] = await Promise.all([
    Promise.all(pathSlugs.map((slug) => getAcademyPathData(slug))),
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);

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

        {/* ─── Travel System Compatibility Tool (free) ────────────────── */}
        <MarketingSection
          id="travel-system"
          tone="ivory"
          spacing="spacious"
          reveal={false}
        >
          <RevealOnScroll>
            <SectionIntro
              eyebrow="Free Tool"
              title="Check stroller-to-car-seat compatibility."
              description="Confirm your specific stroller and infant car seat work together before you buy either one. Where an adapter is required, the tool tells you which one."
              contentWidthClassName="max-w-3xl"
            />
          </RevealOnScroll>
          <div className="mt-10">
            <TravelSystemGenerator strollers={strollers} carSeats={carSeats} />
          </div>
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
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[var(--color-accent-dark)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(212,123,145,0.28)] transition-all duration-200 hover:bg-[#c76b82]"
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
