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
          image="/assets/hero/hero-03.jpg"
          imageAlt="Service consultation planning"
          className="hero-bottom-fade pb-20 md:pb-24 z-20"
          contentClassName="max-w-2xl"
          showRibbon
          ribbonClassName="translate-y-1 md:translate-y-2"
          contentStyle={{
            borderRadius: '32px',
            padding: '3.5rem 3rem',
          }}
        >
          <div className="space-y-6">
            <p className="text-xs tracking-[0.25em] uppercase text-neutral-500">
              Services
            </p>

            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Bespoke Planning Services
            </h1>

            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              Preparation doesn’t have to feel chaotic. It can feel steady. Structured. Thoughtful.
            </p>

            <p className="mx-auto max-w-2xl text-center text-sm text-neutral-600 leading-relaxed">
              Private, structured planning for modern families — from registry clarity to full home preparation.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/how-it-works#step-1"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Begin with a Consultation →
              </Link>
            </div>
          </div>
        </Hero>

        <section className="bg-white border-t border-b border-charcoal/5">
          <div className="grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
            <p>Baby Gear Specialist</p>
            <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand Trained Expertise</p>
            <p>Private Planning for Modern Families</p>
          </div>
        </section>

     

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

              <p className="text-sm text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Led by a baby gear specialist experienced in guiding families through major purchasing decisions and
                real-life setup planning.
              </p>

              <div className="flex items-center justify-center gap-4 text-xs tracking-[0.25em] text-neutral-500 uppercase">
                <span className="h-px w-10 bg-neutral-300" />
                Choose Your Planning Experience
                <span className="h-px w-10 bg-neutral-300" />
              </div>
            </div>

            <div className="mt-16 services-packages-grid">

              {/* Focused Edit */}
              <div className="package-card">
                <h3 className="font-serif text-2xl mb-4">The Focused Edit</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Ideal for one key decision.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  One dedicated session to refine a key decision — registry, nursery layout, or gear shortlist.
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
                  href="/contact?service=focused-edit"
                  className="services-package-cta services-package-cta--secondary"
                >
                  Book the Focused Edit
                  <span className="cta-arrow ml-2">→</span>
                </Link>
              </div>

              {/* Signature Plan */}
              <div className="package-card">
                <div className="services-package-badge rounded-full !px-3 !py-1 text-xs tracking-wide !shadow-none">
                  Most Popular Choice
                </div>
                <h3 className="font-serif text-2xl mb-4">The Signature Plan</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Best for full preparation from registry to nursery.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  A structured multi-session approach guiding you from registry decisions to nursery and home setup.
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
                  href="/contact?service=signature-plan"
                  className="services-package-cta services-package-cta--primary"
                >
                  Begin the Signature Plan
                  <span className="cta-arrow ml-2">→</span>
                </Link>
              </div>

              {/* Private Concierge */}
              <div className="package-card">
                <h3 className="font-serif text-2xl mb-4">The Private Concierge</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  For families who want ongoing, white-glove guidance.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Ongoing, high-touch guidance with priority scheduling and direct support throughout your pregnancy.
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
                  href="/contact?service=private-concierge"
                  className="services-package-cta services-package-cta--secondary"
                >
                  Inquire About Private Concierge
                  <span className="cta-arrow ml-2">→</span>
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
                  <span>In partnership with</span>
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

              <p className="text-sm text-neutral-600 leading-relaxed">
                Designed for families planning an in-store visit in NYC.
              </p>

              <p className="services-blueprint-kicker">
                Walk in prepared and compare with confidence.
              </p>

              <p className="services-blueprint-body">
                Before your appointment, I handle the planning — registry priorities, budget guardrails, and a gear
                shortlist tailored to your home.
              </p>

              <p className="services-blueprint-body">
                You arrive ready to test and compare with purpose, while the in-store partner team supports a smooth
                in-store experience.
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

        <section className="design-experience-wrapper relative overflow-visible">
          <div className="design-experience-inner">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl mb-4">
                Design Your Experience
              </h2>
              <p className="max-w-2xl mx-auto text-neutral-600 leading-relaxed">
                Flexible add-ons that complement your core package — tailored to your registry, home, and milestones.
              </p>
            </div>

            <div className="category-grid">
              <div className="service-category">
                <h3 className="text-lg md:text-xl font-medium tracking-[0.06em] uppercase text-neutral-700 text-center mb-4">
                  Planning
                </h3>
                <div className="addon-grid">
                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Grandparents Planning Session
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Planning support for grandparents and extended family.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Family alignment guidance
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Registry gifting clarity
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Practical preparation plan
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Surrogacy &amp; Adoption Planning Support
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Tailored planning for families growing through surrogacy or adoption.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Timeline and travel coordination
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Registry strategy alignment
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Newborn setup planning
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Sibling &amp; Pet Preparation
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Safety-first transition planning for siblings and pets.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Introduction game plan
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Safety and routine guidance
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Adjustment support strategy
                      </li>
                    </ul>
                  </article>
                </div>
              </div>

              <div className="service-category">
                <h3 className="text-lg md:text-xl font-medium tracking-[0.06em] uppercase text-neutral-700 text-center mb-4">
                  Home &amp; Gear
                </h3>
                <div className="addon-grid">
                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Postpartum Home Setup
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Recovery-focused setup for a calm, functional daily flow.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Recovery-first room planning
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Feeding and sleep station flow
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Essentials organization strategy
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gear Cleaning &amp; Reset Strategy
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Guidance for cleaning and preparing gear for safe reuse.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Sanitizing best practices
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Reuse readiness checklist
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Donation and resale prep
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gear Resale Strategy
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Support for reselling gear with confidence and clear strategy.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Platform and pricing strategy
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Listing and staging guidance
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Resale vs donation decisions
                      </li>
                    </ul>
                  </article>
                </div>
              </div>

              <div className="service-category">
                <h3 className="text-lg md:text-xl font-medium tracking-[0.06em] uppercase text-neutral-700 text-center mb-4">
                  Events &amp; Coordination
                </h3>
                <div className="addon-grid">
                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Shower Registry Coordination
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Registry support before invitations go out.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Registry audit and refinement
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Priority item sequencing
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Gift flow timing strategy
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gender Reveal Planning &amp; Coordination
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Personalized reveal planning with polished, low-stress coordination.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Reveal concept planning
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Vendor and timeline coordination
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Day-of setup guidance
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Welcome Box Registration Setup
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Support for retailer perks, welcome programs, and discounts.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Retailer perk mapping
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Completion discount tracking
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Enrollment setup support
                      </li>
                    </ul>
                  </article>

                  <article className="addon-card">
                    <span className="addon-label">Optional Add-On</span>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Sip &amp; See Planning Support
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Thoughtful support for a smooth post-arrival gathering.
                    </p>
                    <ul className="services-package-list">
                      <li>
                        <span className="services-package-check">✓</span>
                        Event timeline planning
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Registry update guidance
                      </li>
                      <li>
                        <span className="services-package-check">✓</span>
                        Gift coordination strategy
                      </li>
                    </ul>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
            <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72]" />
          </div>
        </section>

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
            <p className="text-neutral-600">— TMBC Client, Chicago</p>
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
