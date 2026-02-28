import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
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
          showRibbon
          ribbonClassName="translate-y-0 md:translate-y-1"
          image="/assets/hero/hero-03.jpg"
          imageAlt="Service consultation planning"
          className="hero-home-radial hero-bottom-fade md:pb-24 z-20"
          contentClassName="marketing-hero-content marketing-hero-content--wide"
          contentStyle={{
            borderRadius: '32px',
            padding: '3.5rem 3rem',
          }}
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Private Planning Services
            </h1>

            <p className="hero-load-reveal hero-load-reveal--1 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              Structured support from registry clarity to full home preparation.
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact?service=consultation"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Begin with a Consultation →
              </Link>
            </div>
          </div>
        </Hero>

        <section className="w-full bg-white border-t border-b border-charcoal/5">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
              <p>Baby Gear Specialist</p>
              <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand-Trained Expertise</p>
              <p>Private Planning for Modern Families</p>
            </div>
          </div>
        </section>

     

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="!py-28 md:!py-32"
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
            

            
              <div className="mt-16 grid gap-12 md:gap-16 services-packages-grid">

              {/* Focused Edit */}
              <div className="min-w-0 h-full flex flex-col rounded-2xl border border-black/5 bg-white p-8 md:p-10 shadow-sm">
                <h3 className="font-serif text-2xl mb-4">The Focused Edit</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Ideal for one key decision.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  One dedicated session to refine a key decision — registry, nursery layout, or gear shortlist.
                </p>

                <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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
                  Reserve the Focused Edit
                  <span className="cta-arrow ml-2">→</span>
                </Link>
              </div>

              {/* Signature Plan */}
              <div className="min-w-0 h-full flex flex-col rounded-2xl border border-black/5 bg-white p-8 md:p-10 shadow-md">
                <span className="mb-4 inline-block text-xs uppercase tracking-[0.25em] text-[color:var(--gold)] opacity-80">
                  Most Popular
                </span>
                <h3 className="font-serif text-2xl mb-4">The Signature Plan</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Best for full preparation from registry to nursery.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  A structured multi-session approach guiding you from registry decisions to nursery and home setup.
                </p>

                <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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
              <div className="min-w-0 h-full flex flex-col rounded-2xl border border-black/5 bg-white p-8 md:p-10 shadow-sm">
                <h3 className="font-serif text-2xl mb-4">The Private Concierge</h3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  For families who want ongoing, white-glove guidance.
                </p>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Ongoing, high-touch guidance with priority scheduling and direct support throughout your pregnancy.
                </p>

                <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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
                  Explore Private Concierge
                  <span className="cta-arrow ml-2">→</span>
                </Link>
              </div>

              </div>
            

            <p className="mt-12 mx-auto text-center text-sm text-charcoal/60">
              Trusted by families across Scottsdale and beyond.
            </p>

            <p className="mt-16 border-t border-black/5 pt-10 text-center text-base font-medium text-charcoal/70 leading-relaxed">
              Not sure which option fits best?{' '}
              <a
                href="/contact?service=consultation"
                className="underline underline-offset-4 hover:text-charcoal transition-colors duration-200"
              >
                Begin with a complimentary consultation →
              </a>
            </p>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="spacious"
          variant="wide"
          className="relative overflow-hidden services-blueprint-section !py-28 md:!py-32"
        >
          <div className="relative mx-auto max-w-6xl services-blueprint-split">
            
              <div className="max-w-xl space-y-8 services-blueprint-content">
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
                You arrive ready to test and compare with purpose, while the Albeebaby team supports a smooth
                in-store experience.
              </p>

              <Link
                href="/contact"
                className="services-blueprint-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore the NYC Blueprint
              </Link>
              </div>
            

            
              <div className="services-blueprint-image-shell mt-12 mb-12 md:my-0">
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

        <section className="design-experience-wrapper relative overflow-visible !py-28 md:!py-32">
          <div className="design-experience-inner">
            
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl mb-4">
                  Design Your Experience
                </h2>
                <p className="max-w-2xl mx-auto text-neutral-600 leading-relaxed">
                  Flexible add-ons that complement your core package — tailored to your registry, home, and milestones.
                </p>
                <h3 className="mt-16 text-sm uppercase tracking-[0.2em] text-charcoal/60">
                  Optional Add-Ons
                </h3>

                {/* Section Divider */}
                <div className="flex justify-center mt-12 mb-16">
                  <div className="w-16 h-px bg-black/10" aria-hidden="true" />
                </div>
              </div>
            

            <div className="category-grid">
              
                <div className="service-category">
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Planning
                </h3>
                <div className="addon-grid mt-10 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-10 md:!gap-12">
                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Grandparents Planning Session
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Planning support for grandparents and extended family.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Surrogacy &amp; Adoption Planning Support
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Tailored planning for families growing through surrogacy or adoption.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Sibling &amp; Pet Preparation
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Safety-first transition planning for siblings and pets.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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
              

              
                <div className="service-category mt-20 md:mt-24">
                <hr className="border-black/5 my-12" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Home &amp; Gear
                </h3>
                <div className="addon-grid mt-10 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-10 md:!gap-12">
                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Postpartum Home Setup
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Recovery-focused setup for a calm, functional daily flow.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gear Cleaning &amp; Reset Strategy
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Guidance for cleaning and preparing gear for safe reuse.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gear Resale Strategy
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Support for reselling gear with confidence and clear strategy.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="rounded-2xl border border-black/5 bg-white p-8 md:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                    <span className="uppercase text-xs tracking-widest text-charcoal/60">
                      Safety &amp; Installation
                    </span>

                    <h3 className="mt-4 mb-4 text-2xl tracking-tight">
                      CPST Car Seat Installation &amp; Safety Checks
                    </h3>

                    <p className="mt-4 text-charcoal/80 leading-relaxed">
                      Certified car seat support provided in collaboration with Lani Car Seat Consulting, offering both in-person installation in Phoenix and virtual safety checks nationwide.
                    </p>

                    <ul className="mt-6 space-y-4 text-charcoal/80 leading-relaxed">
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Professional installation and hands-on harness education
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Virtual safety checks and compatibility review
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Ongoing fit guidance as your child grows
                      </li>
                    </ul>

                  </article>
                </div>
                </div>
              

              
                <div className="service-category mt-20 md:mt-24">
                <hr className="border-black/5 my-12" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Events &amp; Coordination
                </h3>
                <div className="addon-grid mt-10 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-10 md:!gap-12">
                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Shower Registry Coordination
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Registry support before invitations go out.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Gender Reveal Planning &amp; Coordination
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Personalized reveal planning with polished, low-stress coordination.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Welcome Box Registration Setup
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Support for retailer perks, welcome programs, and discounts.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

                  <article className="addon-card p-8 md:p-10 !transition-shadow !duration-300 !transform-none hover:!transform-none">
                    <h4 className="font-serif text-2xl leading-tight mb-4">
                      Sip &amp; See Planning Support
                    </h4>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Thoughtful support for a smooth post-arrival gathering.
                    </p>
                    <ul className="services-package-list space-y-4 leading-relaxed text-charcoal/80">
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

              <div className="service-category mt-20 md:mt-24">
                <hr className="border-black/5 my-12" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Family &amp; Household Support
                </h3>
                <div className="addon-grid mt-10 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-10 md:!gap-12">
                  <article className="rounded-2xl border border-black/5 bg-white p-8 md:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                    <span className="uppercase text-xs tracking-widest text-charcoal/60">
                      Family &amp; Household Support
                    </span>

                    <h3 className="mt-4 mb-4 text-2xl tracking-tight">
                      Nanny Interview Preparation &amp; Guidance
                    </h3>

                    <p className="mt-4 text-charcoal/80 leading-relaxed">
                      Structured support to help you confidently interview and evaluate caregivers for your growing family.
                    </p>

                    <ul className="mt-6 space-y-4 text-charcoal/80 leading-relaxed">
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Customized interview question framework
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Compatibility and experience evaluation guidance
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#C6A75E]">✓</span>
                        Post-interview clarity and decision support
                      </li>
                    </ul>

                  </article>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 w-full z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
            <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72]" />
          </div>
        </section>

        <MarketingSection
          tone="ivoryWarm"
          spacing="spacious"
          container="default"
          className="!border-t-0 !py-28 md:!py-32"
        >
          
            <div className="max-w-3xl mx-auto px-6 py-10 md:px-10 text-center space-y-8">
              <p className="text-lg md:text-xl font-serif leading-relaxed">
                “I walked into the baby store already knowing what we needed.
                No panic. No second-guessing. Just clarity.”
              </p>
              <p className="text-neutral-600">— TMBC Client, Scottsdale</p>
            </div>
          
        </MarketingSection>

        <FinalCTA className="!pt-20 !pb-24 md:!py-20" />
      </main>
    </SiteShell>
  );
}
