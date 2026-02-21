import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Services — Taylor-Made Baby Co.',
  description:
    'Bespoke baby planning services from Taylor-Made Baby Co. covering registries, nursery design, events, and ongoing support.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero
          eyebrow="Services"
          title="Bespoke Planning Services"
          subtitle="Preparation doesn’t have to feel chaotic. It can feel steady. Structured. Thoughtful."
          primaryCta={{ label: 'Begin with a Consultation →', href: '/book' }}
          image="/assets/hero/hero-03.jpg"
          imageAlt="Service consultation planning"
          className="hero-bottom-fade hero-home-radial pb-16 z-20"
          showRibbon
          ribbonEnhanced
          contentStyle={{
            backgroundImage:
              'radial-gradient(circle at 24% 34%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.5) 44%, rgba(248,244,240,0.2) 72%, rgba(248,244,240,0) 100%)',
            borderRadius: '1.5rem',
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 2.8vw, 2rem)',
          }}
        />

     

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-6xl mx-auto">

            <div className="max-w-4xl mx-auto text-center mb-6">
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
                Support, structured around you.
              </h2>

              <div className="flex items-center justify-center gap-4 text-xs tracking-[0.25em] text-neutral-500 uppercase">
                <span className="h-px w-10 bg-neutral-300" />
                Choose Your Planning Experience
                <span className="h-px w-10 bg-neutral-300" />
              </div>
            </div>

            <div className="mt-16 services-packages-grid">

              {/* Focused Edit */}
              <div className="services-package-card">
                <h3 className="font-serif text-2xl mb-4">The Focused Edit</h3>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  One dedicated planning session to refine a specific decision —
                  whether that’s your registry, nursery layout, or gear shortlist.
                </p>

                <ul className="services-package-list">
                  <li>
                    <span className="services-package-check">✓</span>
                    1 Private Session
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Targeted Recommendations
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Written Follow-Up Notes
                  </li>
                </ul>

                <Link
                  href="/book?package=focused"
                  className="services-package-cta services-package-cta--secondary"
                >
                  Book the Focused Edit →
                </Link>
              </div>

              {/* Signature Plan */}
              <div className="services-package-card">
                <div className="services-package-badge">
                  Most Popular
                </div>
                <h3 className="font-serif text-2xl mb-4">The Signature Plan</h3>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  A structured, multi-session approach designed to guide you
                  from registry clarity to full nursery and home preparation.
                </p>

                <ul className="services-package-list">
                  <li>
                    <span className="services-package-check">✓</span>
                    3 Planning Sessions
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Registry + Nursery Planning
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Implementation Roadmap
                  </li>
                </ul>

                <Link
                  href="/book?package=signature"
                  className="services-package-cta services-package-cta--primary"
                >
                  Begin the Signature Plan →
                </Link>
              </div>

              {/* Private Concierge */}
              <div className="services-package-card">
                <h3 className="font-serif text-2xl mb-4">The Private Concierge</h3>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Your on-call pregnancy partner — ongoing guidance,
                  priority scheduling, and direct access throughout your journey.
                </p>

                <ul className="services-package-list">
                  <li>
                    <span className="services-package-check">✓</span>
                    Ongoing Support
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Priority Scheduling
                  </li>
                  <li>
                    <span className="services-package-check">✓</span>
                    Direct Message Access
                  </li>
                </ul>

                <Link
                  href="/book?package=concierge"
                  className="services-package-cta services-package-cta--secondary"
                >
                  Inquire About Private Concierge →
                </Link>
              </div>

            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="spacious"
          variant="wide"
          className="relative overflow-hidden services-blueprint-section"
        >
          <div className="relative mx-auto max-w-6xl services-blueprint-split">
            <div className="max-w-xl space-y-6 services-blueprint-content">
              <div className="services-blueprint-brand-lockup">
                <div className="services-blueprint-partnership">
                  <span aria-hidden className="services-blueprint-partnership-line" />
                  <span>In Partnership With</span>
                  <span aria-hidden className="services-blueprint-partnership-line" />
                </div>

                <Image
                  src="/assets/brand/albeebaby.png"
                  alt="Albee Baby"
                  width={180}
                  height={48}
                  className="services-blueprint-logo"
                />
              </div>

              <h2 className="services-blueprint-title">
                NYC In-Store Blueprint
              </h2>

              <p className="services-blueprint-kicker">
                Walk in prepared. Confident. Stress-free.
              </p>

              <p className="services-blueprint-body">
                Before you walk into your in-store appointment, we handle the Learn and Plan. You&apos;ll arrive clear on your needs, confident in your budget, and ready to test &amp; compare with purpose.
              </p>

              <p className="services-blueprint-body">
                The Albee Baby team will already be up to speed on your priorities, so your time in-store is productive — not overwhelming.
              </p>

              <Link
                href="/contact"
                className="services-blueprint-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore the NYC Blueprint
              </Link>
            </div>

            <div className="services-blueprint-image-shell">
              <Image
                src="/assets/brand/albeebabystore.png"
                alt="Albee Baby storefront in New York City"
                width={900}
                height={700}
                className="services-blueprint-image"
              />
            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="relative overflow-visible services-extended-section bg-white"
        >
          {/* Section Header */}
          <div className="services-extended-header max-w-3xl mx-auto text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-6">
              Extended Support
            </p>

            <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-[1.2] mb-6 text-neutral-900">
              Design Your Experience
            </h2>

            <div className="mx-auto w-16 h-px bg-neutral-200 mt-6 mb-12" />

            <p className="text-neutral-600 text-[15px] leading-7">
              Every family&apos;s preparation looks different. These additional baby planning services allow you to personalize your experience —
              from focused registry planning to postpartum home preparation and support through adoption or surrogacy.
            </p>

            <p className="text-neutral-600 text-[15px] leading-7 mt-4">
              Each service can be integrated into your core planning package
              or reserved as a dedicated session.
            </p>
          </div>


          {/* Three Column Structured Groups */}
          <div className="services-extended-grid relative mx-auto max-w-6xl">
            <div className="services-extended-divider hidden md:block absolute left-1/3 top-4 bottom-4 w-px bg-neutral-100" />
            <div className="services-extended-divider hidden md:block absolute left-2/3 top-4 bottom-4 w-px bg-neutral-100" />

            {/* Column 1 */}
            <div className="services-extended-column services-extended-group">
              <h3 className="font-serif text-xl tracking-tight text-neutral-800">
                Family & Transitions
              </h3>

              <div className="services-extended-card-stack">
                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Grandparents Planning Session</h4>
                  <p>
                    A structured baby planning consultation designed for grandparents
                    and extended family — aligning expectations, registry guidance,
                    and practical preparation.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Surrogacy & Adoption Planning Support</h4>
                  <p>
                    Tailored baby registry planning and newborn home preparation
                    for families growing through surrogacy or adoption,
                    including timeline coordination and travel planning support.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Sibling & Pet Preparation</h4>
                  <p>
                    Strategic guidance to help siblings and pets adjust smoothly
                    and safely to life with a newborn.
                  </p>
                </article>
              </div>
            </div>


            {/* Column 2 */}
            <div className="services-extended-column services-extended-group">
              <h3 className="font-serif text-xl tracking-tight text-neutral-800">
                Home & Gear Lifecycle
              </h3>

              <div className="services-extended-card-stack">
                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Postpartum Home Setup</h4>
                  <p>
                    Intentional newborn home preparation focused on recovery,
                    organization, and realistic daily flow.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Gear Cleaning & Reset Strategy</h4>
                  <p>
                    Expert guidance on cleaning, sanitizing, and preparing baby gear
                    for safe reuse.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Gear Resale Strategy</h4>
                  <p>
                    Consultation on reselling baby gear, pricing strategy,
                    and preparing items for resale or donation.
                  </p>
                </article>
              </div>
            </div>


            {/* Column 3 */}
            <div className="services-extended-column services-extended-group">
              <h3 className="font-serif text-xl tracking-tight text-neutral-800">
                Events & Registry Coordination
              </h3>

              <div className="services-extended-card-stack">
                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Shower Registry Coordination</h4>
                  <p>
                    Professional baby registry planning support to ensure your registry
                    is aligned before baby shower invitations are sent.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Welcome Box Registration Setup</h4>
                  <p>
                    Coordination of registry perks, completion discounts,
                    and welcome programs across major retailers.
                  </p>
                </article>

                <article className="services-extended-item-card">
                  <h4 className="services-extended-item-title">Sip & See Planning Support</h4>
                  <p>
                    Structured guidance for hosting a post-arrival gathering
                    while managing registry updates and gift coordination.
                  </p>
                </article>
              </div>
            </div>

          </div>


          {/* Integration Note */}
          <div className="max-w-2xl mx-auto text-center mt-20 text-neutral-500 text-[14px] leading-6">
            These extended baby planning services are designed to complement
            your registry planning, nursery design, and newborn preparation —
            providing structured, thoughtful support at every stage.
          </div>

          <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
            <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72]" />
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivoryWarm"
          spacing="spacious"
          container="default"
          className="!border-t-0 !pt-20 md:!pt-28"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-2xl font-serif leading-relaxed">
              “I walked into the baby store already knowing what we needed.
              No panic. No second-guessing. Just clarity.”
            </p>
            <p className="text-neutral-600">— TMBC Client</p>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="blush"
          spacing="spacious"
          container="narrow"
        >
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
              Start with confidence.
            </h2>

            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              Begin with a complimentary consultation and move forward with clarity — grounded, intentional, and even a little exciting.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book Your Complimentary Consultation
              </Link>
            </div>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
