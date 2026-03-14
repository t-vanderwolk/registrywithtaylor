import Image from 'next/image';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import { FALLBACK_AFFILIATE_PARTNER_LOGO_SRC } from '@/lib/affiliatePartnerLogos';
import { isRemoteImageUrl } from '@/lib/blog/images';
import {
  WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS,
  WHAT_I_HELP_FAMILIES_CHOOSE_TITLE,
} from '@/lib/marketing/copy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';

export const metadata = buildMarketingMetadata({
  title: 'About — Taylor-Made Baby Co.',
  description:
    'Learn how Taylor-Made Baby Co. helps families sort baby gear, registries, nurseries, and home prep with practical expert guidance.',
  path: '/about',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'About Taylor-Made Baby Co.',
});

export default async function AboutPage() {
  const affiliatePartners = await listAffiliatePartnerOptions();
  const partnersWithLogos = affiliatePartners.filter(
    (partner) => partner.logoUrl && partner.logoUrl !== FALLBACK_AFFILIATE_PARTNER_LOGO_SRC,
  );

  return (
    <SiteShell currentPath="/about">
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow="Meet Taylor"
          title="A Baby Gear Expert for the Real-Life Details of Early Parenthood"
          subtitle="I help families sort registry strategy, strollers, car seats, nursery setup, and the other baby-prep decisions that stack up fast."
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          image="/assets/hero/hero-05.jpg"
          imageAlt="Soft baby essentials arranged for planning"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-3xl space-y-8">
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
                  Here&apos;s the tea: baby gear gets confusing fast, and the early decisions matter more than they
                  look at first.
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

        <MarketingSection tone="white" container="wide" spacing="default">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <RevealOnScroll>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                Trusted retail and service partners.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
                {partnersWithLogos.map((partner) => {
                  const href = partner.defaultDestinationUrl ?? partner.website;
                  const logo = (
                    <div className="flex min-h-[4.75rem] min-w-[10.5rem] items-center justify-center px-4 py-3 md:min-h-[5.25rem] md:min-w-[11.5rem]">
                      <Image
                        src={partner.logoUrl ?? FALLBACK_AFFILIATE_PARTNER_LOGO_SRC}
                        alt={partner.name}
                        width={220}
                        height={72}
                        className="h-auto max-h-10 w-auto max-w-[9.5rem] object-contain opacity-90 transition duration-200 group-hover:opacity-100 md:max-h-12 md:max-w-[10.5rem]"
                        loading="lazy"
                        unoptimized={isRemoteImageUrl(partner.logoUrl)}
                      />
                    </div>
                  );

                  if (!href) {
                    return (
                      <div key={partner.id} className="inline-flex items-center justify-center">
                        {logo}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={partner.id}
                      href={href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="group inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                      aria-label={`Visit ${partner.name}`}
                    >
                      {logo}
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
