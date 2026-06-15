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

const ACADEMY_PATHS_PREVIEW = [
  {
    slug: 'registry',
    label: 'Registry Path',
    title: 'The Art of the Registry',
    modules: [
      { title: 'What to Register First', subhead: 'Think in daily jobs, not shopping categories.' },
      { title: 'Where to Register', subhead: 'Choose the platform, not the branding.' },
      { title: 'Shop Local & Get Support', subhead: 'Some gear requires physical contact. Most does not.' },
      { title: 'Welcome Boxes & Registry Perks', subhead: 'Treat samples like research data, not free stuff.' },
      { title: 'Loyalty, Rewards & Completion Discounts', subhead: 'The completion discount works best when you use it last.' },
      { title: 'Smart Purchasing Timeline', subhead: 'Three phases of baby buying, and what belongs in each one.' },
      { title: 'Registry Mistakes to Avoid', subhead: 'Five named traps that make registries longer without making them better.' },
      { title: 'Baby Showers & Gifting Strategy', subhead: 'The shower is a logistics event. Plan it like one.' },
    ],
  },
  {
    slug: 'gear',
    label: 'Gear Path',
    title: 'Baby Gear, Simplified',
    modules: [
      { title: 'How to Think About Baby Gear', subhead: 'Three variables. Every gear decision, forever.' },
      { title: 'Stroller Foundations', subhead: 'Choose your lane, then choose your stroller.' },
      { title: 'Car Seat Foundations', subhead: 'Understand the stage architecture, then let your car decide.' },
      { title: 'Travel Systems', subhead: 'Compatibility is a yes or no question. Plan it like one.' },
      { title: 'Travel With Baby', subhead: 'Four kinds of travel. Four different setups.' },
      { title: 'Daily Use Gear', subhead: 'Ask how often before you ask how much.' },
      { title: 'Feeding Setup & Flow', subhead: 'You are not choosing isolated products. You are building the system that has to work on a regular Tuesday.' },
      { title: 'Breast Pump', subhead: 'Choose the pump for the frequency, not the feature list.' },
      { title: 'Bottles & Baby Utensils', subhead: 'Nipple flow first. Quantity second. Brand last.' },
    ],
  },
  {
    slug: 'nursery',
    label: 'Nursery Path',
    title: 'Nursery That Works',
    modules: [
      { title: 'Vision & Lifestyle Foundations', subhead: 'Four questions before any product decisions.' },
      { title: 'Sleep Space Decisions', subhead: 'Four sleep jobs. Not one perfect product.' },
      { title: 'Furniture That Actually Works', subhead: 'Three pieces. One real decision. One honest evaluation.' },
      { title: 'Layout & Flow', subhead: 'Design the room for 2 AM, and it works fine at noon too.' },
      { title: 'Storage & Organization', subhead: 'Not how tidy it looks. How fast it resets.' },
      { title: 'Atmosphere & Safety', subhead: 'Safe sleep is what you remove. Atmosphere is what you add.' },
    ],
  },
  {
    slug: 'postpartum',
    label: 'Postpartum Path',
    title: 'The Fourth Trimester',
    modules: [
      { title: 'Healing & Recovery', subhead: 'Three phases. Not one blob called "recovery."' },
      { title: 'First-Weeks Home Rhythm', subhead: 'The anchor station approach to surviving the first stretch.' },
      { title: 'Feeding & Lactation', subhead: 'A fed baby is the goal. The path is yours to choose.' },
      { title: 'Rest & Sleep', subhead: 'Sleep debt is a logistics problem, not a personal one.' },
      { title: 'Emotional Wellness & Identity', subhead: 'Baby blues, PPD, and the identity shift that does not have a name.' },
      { title: 'Support Systems', subhead: 'Specific asks, built before you need them.' },
    ],
  },
] as const;

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
          secondaryCta={{ label: 'Book a Free Consultation', href: '/consultation' }}
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

        <section className="border-t border-black/5 bg-[#fffbf9]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:px-10">
            <div className="mb-10 max-w-2xl">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Inside the Academy</p>
              <h2 className="mt-3 font-serif text-[1.95rem] leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-[2.7rem]">
                29 modules. Four paths. One decision at a time.
              </h2>
              <p className="mt-5 text-[0.98rem] leading-7 text-neutral-600">
                Each module covers one concept clearly. The paths build in order — start wherever the noise is loudest.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ACADEMY_PATHS_PREVIEW.map((path) => (
                <div
                  key={path.slug}
                  className="rounded-[1.75rem] border border-[rgba(226,150,173,0.16)] bg-white px-7 py-7 shadow-[0_16px_40px_rgba(58,36,43,0.06)]"
                >
                  <p className="text-[0.67rem] uppercase tracking-[0.22em] text-[#A15B72]">
                    {path.label} · {path.modules.length} modules
                  </p>
                  <h3 className="mt-2 font-serif text-[1.35rem] tracking-[-0.03em] text-neutral-900">
                    {path.title}
                  </h3>
                  <ul className="mt-5">
                    {path.modules.map((module, i) => (
                      <li
                        key={module.title}
                        className="flex items-start gap-3 border-t border-black/[0.05] py-3 first:border-0 first:pt-0"
                      >
                        <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(217,134,162,0.12)] text-[0.65rem] font-semibold text-[#A15B72]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[0.95rem] font-medium leading-snug text-neutral-900">{module.title}</p>
                          <p className="mt-0.5 text-[0.84rem] italic leading-snug text-neutral-500">{module.subhead}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-[0.9rem] text-neutral-500">
              Full Academy access unlocks when enrollment opens.{' '}
              <Link href="/learn/waitlist" className="font-medium text-neutral-900 underline underline-offset-2">
                Join the waitlist →
              </Link>
            </p>
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
