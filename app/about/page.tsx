import Image from 'next/image';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import {
  WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS,
  WHAT_I_HELP_FAMILIES_CHOOSE_TITLE,
} from '@/lib/marketing/copy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { aboutStructuredData } from '@/lib/marketing/aboutStructuredData';
import PodcastFeature from '@/components/marketing/PodcastFeature';

// ─── Static affiliate partner list ────────────────────────────────────────────
const ABOUT_PAGE_PARTNERS: { name: string; logo: string; href?: string }[] = [
  { name: 'Silver Cross', logo: '/assets/logos/silver-cross-logo-1.webp', href: 'https://www.silvercrossus.com' },
  { name: 'mima', logo: '/affiliate-logos/mima.png', href: 'https://www.mimakids.com' },
  { name: 'Babylist', logo: '/assets/logos/babylist.png', href: 'https://www.babylist.com' },
  { name: 'macrobaby', logo: '/assets/logos/macrobaby-logo.webp', href: 'https://www.macrobaby.com' },
  { name: 'Momcozy', logo: '/assets/logos/momcozy.png', href: 'https://www.momcozy.com' },
  { name: 'Baby Brezza', logo: '/assets/logos/babybrezzalogo.png', href: 'https://www.babybrezza.com' },
  { name: 'BabyQuip', logo: '/assets/logos/babyquip.png', href: 'https://www.babyquip.com' },
  { name: 'dadada Baby', logo: '/assets/logos/dadadadalogo.png', href: 'https://dadadababy.com' },
  { name: 'Ergobaby', logo: '/assets/logos/ergobabylogo.png', href: 'https://www.ergobaby.com' },
  { name: 'Happiest Baby', logo: '/assets/logos/happiestbaby-logo.png', href: 'https://www.happiestbaby.com' },
  { name: 'Jool Baby', logo: '/assets/logos/joolbabylogo.png', href: 'https://joolbaby.com' },
  { name: 'Kyte Baby', logo: '/assets/logos/kytebaby-logo.png', href: 'https://kytebaby.com' },
  { name: 'Munchkin', logo: '/assets/logos/munchkin.png', href: 'https://www.munchkin.com' },
  { name: 'Nanit', logo: '/assets/logos/nanit.png', href: 'https://www.nanit.com' },
  { name: 'Veer', logo: '/affiliate-logos/veer.png', href: 'https://www.veercycle.com' },
];

export const metadata = buildMarketingMetadata({
  title: 'About Taylor Vanderwolk, Baby Registry Consultant | Taylor-Made Baby Co.',
  description:
    'Meet Taylor Vanderwolk, certified baby registry consultant and Tot Squad specialist with 7+ years of baby gear expertise. Book your $75 registry consult.',
  path: '/about',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Taylor Vanderwolk baby registry consultant workspace',
  keywords: [
    'baby registry consultant',
    'Taylor Vanderwolk',
    'baby gear expert',
    'baby registry help',
    'Tot Squad certified specialist',
    'Target Baby Concierge',
    'stroller consultant',
  ],
});

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <main className="site-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
        />
        <Hero
          className="homepage-hero"
          eyebrow="Meet Taylor"
          title="Meet Taylor Vanderwolk, Baby Registry Consultant & Certified Baby Gear Expert"
          subtitle="I help expecting parents build confident baby registries and make the right stroller, car seat, nursery, and gear decisions, without the overwhelm, the algorithm noise, or the sponsored advice."
          primaryCta={{ label: 'Book a Registry Consultation ($75)', href: '/book' }}
          image="/assets/hero/hero-05.jpg"
          imageAlt="Taylor Vanderwolk baby registry consultant workspace"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-3xl space-y-8">
            <RevealOnScroll>
              <div className="flex justify-center">
                <Image
                  src="/assets/taylor.jpeg"
                  alt="Taylor Vanderwolk, Baby Gear Expert and Registry Consultant"
                  width={280}
                  height={340}
                  className="rounded-2xl object-cover shadow-md"
                  priority
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">
                A Baby Gear Expert in the Details
              </H2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={60}>
              <Body className="text-neutral-700">
                I am a Baby Gear Expert and Registry Consultant who helps families figure out what to buy, what to
                skip, and what can wait.
              </Body>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120}>
              <div className="space-y-6 text-left">
                <Body className="text-neutral-700">
                  Baby gear decisions arrive fast and compound quickly. The early choices shape the first year in ways
                  most families only understand after the fact.
                </Body>

                <Body className="text-neutral-700">
                  With hands-on experience across premium retail floors, national pilot programs, and private
                  consulting, I&apos;ve guided hundreds of families through the early decisions that shape day-to-day
                  life with a baby.
                </Body>

                <Body className="text-neutral-700">
                  From registry structure to stroller and car seat strategy to feeding gear, sleep space, and
                  nursery flow, my work lives at the intersection of safety, design, and real-life functionality.
                </Body>

                <Body className="text-neutral-700">
                  When you invite me into that space - into your home, your routines, your questions at 10 p.m. - you&apos;re
                  trusting me with more than a checklist. You&apos;re trusting me with your story.
                </Body>

                <Body className="text-neutral-700">That&apos;s a responsibility I don&apos;t take lightly.</Body>

                <Body className="text-neutral-700">
                  My role isn&apos;t to sell you more. It&apos;s to help you build a baby setup that works in your actual
                  home and routine.
                </Body>

                <Body className="font-medium text-neutral-900">{WHAT_I_HELP_FAMILIES_CHOOSE_TITLE}</Body>

                <ul className="space-y-5 pt-2 leading-relaxed text-neutral-700">
                  {WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-8">
            <RevealOnScroll>
              <div>
                <H2 className="font-serif text-neutral-900">
                  The Taylor-Made Approach
                </H2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-1 pt-1">
                <H3 className="font-serif text-neutral-900">Real life over registry noise.</H3>
                <H3 className="font-serif text-neutral-900">Fit over features.</H3>
                <H3 className="font-serif text-neutral-900">Buy with purpose, not pressure.</H3>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={170}>
              <div className="space-y-6">
                <Body className="text-neutral-700">
                  Today&apos;s baby market offers endless options - and endless opinions. But more options don&apos;t create
                  better decisions. They create pressure.
                </Body>

                <Body className="text-neutral-700">The Taylor-Made approach is built on real-life fit.</Body>

                <Body className="text-neutral-700">
                  We slow the process down.
                  <br />
                  We look at how you actually live.
                  <br />
                  We consider your space, your routines, your budget, and your long-term plans.
                </Body>

                <Body className="text-neutral-700">Then we figure out what to buy, what to skip, and what can wait.</Body>

                <Body className="text-neutral-700">
                  No panic buying.
                  <br />
                  No trend chasing.
                  <br />
                  No &quot;just in case&quot; overload.
                </Body>

                <Body className="text-neutral-700">Just practical decisions that make sense for your real life.</Body>

                <Body className="text-neutral-700">Because the goal isn&apos;t to have everything.</Body>

                <Body className="text-neutral-700">It&apos;s to have what fits.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-7">
            <RevealOnScroll>
              <div>
                <H2 className="font-serif text-neutral-900">
                  What Makes This Different
                </H2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-6">
                <H3 className="text-neutral-900">Most baby guidance starts with products.</H3>
                <H3 className="text-neutral-900">This starts with how you actually live.</H3>

                <Body className="text-neutral-700">
                  Your home.
                  <br />
                  Your routines.
                  <br />
                  Your comfort level with risk, spending, and space.
                  <br />
                  Your decision-making style.
                </Body>

                <Body className="text-neutral-700">This isn&apos;t a template registry.</Body>
                <Body className="text-neutral-700">It isn&apos;t a sales floor disguised as advice.</Body>
                <Body className="text-neutral-700">And it isn&apos;t a checklist handed over and forgotten.</Body>

                <Body className="text-neutral-700">It&apos;s structured support for registry decisions, gear comparisons, nursery setup, and the daily details around getting ready for baby.</Body>

                <Body className="text-neutral-700">
                  Baby prep is nuanced. Emotional. Sometimes overwhelming in ways no one talks about.
                </Body>

                <Body className="text-neutral-700">
                  What makes this different is the level of care and discernment applied to every recommendation,
                  every comparison, every pause before a purchase.
                </Body>

                <H3 className="text-neutral-900">Not louder.</H3>
                <H3 className="text-neutral-900">Just more useful.</H3>

                <Body className="text-neutral-700">Because when baby prep fits your real life, the next season feels a whole lot steadier.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <PodcastFeature />

        <MarketingSection tone="white" container="wide" spacing="default" reveal={false}>
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <RevealOnScroll>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                Trusted retail and service partners.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-5 sm:gap-8">
                {ABOUT_PAGE_PARTNERS.map((partner) => {
                  const inner = (
                    <div className="flex h-16 items-center justify-center px-2 sm:h-20">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={160}
                        height={56}
                        className="h-8 w-auto max-w-full object-contain opacity-75 transition duration-200 group-hover:opacity-100 sm:h-10 md:h-12"
                        loading="lazy"
                      />
                    </div>
                  );

                  if (!partner.href) {
                    return (
                      <div key={partner.name} className="flex items-center justify-center">
                        {inner}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={partner.name}
                      href={partner.href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="group flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                      aria-label={`Visit ${partner.name}`}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
