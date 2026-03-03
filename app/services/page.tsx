import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import QuoteMark from '@/components/ui/QuoteMark';
import SectionDivider from '@/components/ui/SectionDivider';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import type { ReactNode } from 'react';

export const metadata = buildMarketingMetadata({
  title: 'Services — Taylor-Made Baby Co.',
  description:
    'Bespoke baby planning services from Taylor-Made Baby Co. covering registries, nursery design, events, and ongoing support.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

type ServiceChecklistProps = {
  items: string[];
  className?: string;
};

const authorityItems = [
  'Baby Gear Specialist',
  'Brand-Trained Expertise',
  'Private Planning for Modern Families',
];

function ServiceChecklist({ items, className = '' }: ServiceChecklistProps) {
  return (
    <ul className={['space-y-6 leading-relaxed', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          <CheckIcon />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AddOnTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h4 className={['text-xl md:text-2xl tracking-tight', className].filter(Boolean).join(' ')}>
      {children}
    </h4>
  );
}

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero
          image="/assets/hero/hero-03.jpg"
          imageAlt=""
          className="services-hero"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Private Planning Services
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Structured support from registry clarity to full home preparation.
            </Body>

            <div className="hero-load-reveal hero-load-reveal--3 pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact?service=consultation"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Complimentary Consultation
              </Link>
            </div>
          </div>
        </Hero>

        <section className="border-y border-black/5 bg-white py-4">
          <div className="container">
            <p className="text-center text-sm uppercase tracking-[0.2em] text-black/60 md:hidden">
              Baby Gear Specialist · Brand-Trained Expertise · Private Planning for Modern Families
            </p>
            <AuthorityStrip items={authorityItems} className="hidden mt-0 md:flex md:gap-8" />
          </div>
        </section>

        <MarketingSection
          tone="white"
          spacing="default"
          container="default"
          className="services-page-section"
        >
          <div className="max-w-6xl mx-auto">
          
              <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
                <div className="flex justify-center">
                  <SectionDivider />
                </div>

                <H2 className="mb-6 font-serif leading-tight">
                  Support, structured around you.
                </H2>

                <Body className="mx-auto mb-8 max-w-3xl text-neutral-600">
                  Led by a baby gear specialist experienced in guiding families through major purchasing decisions and
                  real-life setup planning.
                </Body>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 px-2 text-center text-xs uppercase leading-relaxed tracking-[0.25em] text-neutral-500">
                  <span className="h-px w-10 bg-neutral-300" />
                  Choose Your Planning Experience
                  <span className="h-px w-10 bg-neutral-300" />
                </div>
              </div>
            

            
              <div className="mt-20 grid gap-14 md:mt-24 md:gap-20 services-packages-grid">

              {/* Focused Edit */}
              <MarketingSurface className="marketing-card-hover min-h-0 h-full flex flex-col bg-white/60 transition-[transform,box-shadow] duration-300 hover:shadow-md">
                <H3 className="mb-4 font-serif">The Focused Edit</H3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Ideal for one key decision.
                </p>

                <Body className="mb-6 text-neutral-600">
                  One dedicated session to refine a key decision — registry, nursery layout, or gear shortlist.
                </Body>

                <ServiceChecklist
                  items={[
                    '1 Private Session',
                    'Targeted Recommendations',
                    'Written Follow-Up Notes',
                  ]}
                  className="mb-8 text-charcoal/80"
                />

                <Link
                  href="/contact?service=focused-edit"
                  className="btn btn--secondary mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  Reserve the Focused Edit <span aria-hidden className="ml-2">→</span>
                </Link>
              </MarketingSurface>

              {/* Signature Plan */}
              <MarketingSurface className="marketing-card-hover min-h-0 h-full flex flex-col bg-white/70 shadow-md transition-[transform,box-shadow] duration-300 hover:shadow-md">
                <div className="mb-4">
                  <span className="pointer-events-none inline-block rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-black/70 select-none">
                    Most Popular
                  </span>
                </div>
                <H3 className="mb-4 font-serif">The Signature Plan</H3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  Best for full preparation from registry to nursery.
                </p>

                <Body className="mb-6 text-neutral-600">
                  A structured multi-session approach guiding you from registry decisions to nursery and home setup.
                </Body>

                <ServiceChecklist
                  items={[
                    '3 Planning Sessions',
                    'Registry + Nursery Planning',
                    'Implementation Roadmap',
                  ]}
                  className="mb-8 text-charcoal/80"
                />

                <Link
                  href="/contact?service=signature-plan"
                  className="btn btn--primary mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  Begin Your Signature Plan <span aria-hidden className="ml-2">→</span>
                </Link>
              </MarketingSurface>

              {/* Private Concierge */}
              <MarketingSurface className="marketing-card-hover min-h-0 h-full flex flex-col bg-white/60 transition-[transform,box-shadow] duration-300 hover:shadow-md">
                <H3 className="mb-4 font-serif">The Private Concierge</H3>
                <p className="text-sm text-neutral-600 mt-2 mb-4">
                  For families who want ongoing, white-glove guidance.
                </p>

                <Body className="mb-6 text-neutral-600">
                  Ongoing, high-touch guidance with priority scheduling and direct support throughout your pregnancy.
                </Body>

                <ServiceChecklist
                  items={[
                    'Ongoing Support',
                    'Priority Scheduling',
                    'Direct Message Access',
                  ]}
                  className="mb-8 text-charcoal/80"
                />

                <Link
                  href="/contact?service=private-concierge"
                  className="btn btn--secondary mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  Explore Private Concierge <span aria-hidden className="ml-2">→</span>
                </Link>
              </MarketingSurface>

              </div>
            

            <p className="mt-16 mx-auto text-center text-sm text-charcoal/60 md:mt-20">
              Trusted by families across Scottsdale and beyond.
            </p>

            <p className="mt-20 border-t border-black/5 pt-12 text-center text-base font-medium text-charcoal/70 leading-relaxed md:mt-24">
              Not sure which option fits best?{' '}
              <Link
                href="/contact?service=consultation"
                className="link-underline transition-colors duration-200 hover:text-charcoal"
              >
                Schedule Your Complimentary Consultation
              </Link>
            </p>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" variant="wide" className="relative overflow-hidden services-blueprint-section services-page-section">
          <div className="relative mx-auto max-w-5xl services-blueprint-split">
            
              <MarketingSurface className="services-blueprint-content h-full max-w-none space-y-8">
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

              <div>
                <SectionDivider />
                <H2 className="services-blueprint-title">
                  NYC In-Store Blueprint
                </H2>
              </div>

              <Body className="text-neutral-600">
                Designed for families planning an in-store visit in NYC.
              </Body>

              <H3 className="services-blueprint-kicker font-serif">
                Walk in prepared and compare with confidence.
              </H3>

              <Body className="services-blueprint-body">
                Before your appointment, I handle the planning — registry priorities, budget guardrails, and a gear
                shortlist tailored to your home.
              </Body>

              <Body className="services-blueprint-body">
                You arrive ready to test and compare with purpose, while the Albeebaby team supports a smooth
                in-store experience.
              </Body>

              <Link
                href="/contact"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore the NYC Blueprint
              </Link>
              </MarketingSurface>
            

            
              <div className="services-blueprint-image-shell mt-12 md:my-0">
                <div className="rounded-2xl border border-black/5 bg-white/40 p-2 shadow-sm md:h-full">
                  <Image
                    src="/assets/brand/albeebabystore.png"
                    alt="Albee Baby storefront in New York City"
                    width={900}
                    height={700}
                    className="services-blueprint-image rounded-xl"
                  />
                </div>
              </div>
            
          </div>
        </MarketingSection>

        <section className="design-experience-wrapper section-base services-page-section relative overflow-visible">
          <div className="design-experience-inner">
            
              <div className="text-center mb-20 md:mb-24">
                <div className="flex justify-center">
                  <SectionDivider />
                </div>

                <H2 className="mb-4 font-serif">
                  Design Your Experience
                </H2>
                <Body className="mx-auto max-w-2xl text-neutral-600">
                  Flexible add-ons that complement your core package — tailored to your registry, home, and milestones.
                </Body>
                <div className="mt-16 flex justify-center">
                  <p className="text-center text-sm uppercase tracking-[0.2em] text-charcoal/60">
                    Optional Add-Ons
                  </p>
                </div>
                <div className="mx-auto mt-12 h-px w-full max-w-5xl bg-black/5" aria-hidden="true" />
                <div className="mt-10 flex justify-center">
                  <SectionDivider />
                </div>
              </div>
            

            <div className="category-grid">
              
                <div className="service-category">
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Planning
                </h3>
                <div className="addon-grid mt-12 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-12 md:!gap-14 xl:!gap-16">
                  <MarketingSurface className="marketing-card-hover h-full">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Grandparents Planning Session
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Planning support for grandparents and extended family.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Family alignment guidance',
                        'Registry gifting clarity',
                        'Practical preparation plan',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Surrogacy &amp; Adoption Planning Support
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Tailored planning for families growing through surrogacy or adoption.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Timeline and travel coordination',
                        'Registry strategy alignment',
                        'Newborn setup planning',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Sibling &amp; Pet Preparation
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Safety-first transition planning for siblings and pets.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Introduction game plan',
                        'Safety and routine guidance',
                        'Adjustment support strategy',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>
                </div>
                </div>
              

              
                <div className="service-category mt-20 md:mt-28">
                <hr className="my-10 border-black/5 md:my-14" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Home &amp; Gear
                </h3>
                <div className="addon-grid mt-12 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-12 md:!gap-14 xl:!gap-16">
                  <MarketingSurface className="marketing-card-hover h-full">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Postpartum Home Setup
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Recovery-focused setup for a calm, functional daily flow.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Recovery-first room planning',
                        'Feeding and sleep station flow',
                        'Essentials organization strategy',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Gear Cleaning &amp; Reset Strategy
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Guidance for cleaning and preparing gear for safe reuse.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Sanitizing best practices',
                        'Reuse readiness checklist',
                        'Donation and resale prep',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Gear Resale Strategy
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Support for reselling gear with confidence and clear strategy.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Platform and pricing strategy',
                        'Listing and staging guidance',
                        'Resale vs donation decisions',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <span className="uppercase text-xs tracking-widest text-charcoal/60">
                      Safety &amp; Installation
                    </span>

                    <AddOnTitle className="mt-5 mb-5">
                      CPST Car Seat Installation &amp; Safety Checks
                    </AddOnTitle>

                    <Body className="mt-4 mb-8 text-charcoal/80">
                      Certified car seat support provided in collaboration with Lani Car Seat Consulting, offering both in-person installation in Phoenix and virtual safety checks nationwide.
                    </Body>

                    <ServiceChecklist
                      items={[
                        'Professional installation and hands-on harness education',
                        'Virtual safety checks and compatibility review',
                        'Ongoing fit guidance as your child grows',
                      ]}
                      className="mt-6 text-charcoal/80"
                    />

                  </MarketingSurface>
                </div>
                </div>
              

              
                <div className="service-category mt-20 md:mt-28">
                <hr className="my-10 border-black/5 md:my-14" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Events &amp; Coordination
                </h3>
                <div className="addon-grid mt-12 !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 !gap-12 md:!gap-14 xl:!gap-16">
                  <MarketingSurface className="marketing-card-hover h-full">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Frequently Requested</p>
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Shower Registry Coordination
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Registry support before invitations go out.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Registry audit and refinement',
                        'Priority item sequencing',
                        'Gift flow timing strategy',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Gender Reveal Planning &amp; Coordination
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Personalized reveal planning with polished, low-stress coordination.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Reveal concept planning',
                        'Vendor and timeline coordination',
                        'Day-of setup guidance',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Welcome Box Registration Setup
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Support for retailer perks, welcome programs, and discounts.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Retailer perk mapping',
                        'Completion discount tracking',
                        'Enrollment setup support',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>

                  <MarketingSurface className="marketing-card-hover h-full">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Sip &amp; See Planning Support
                    </AddOnTitle>
                    <Body className="mb-8 text-neutral-600">
                      Thoughtful support for a smooth post-arrival gathering.
                    </Body>
                    <ServiceChecklist
                      items={[
                        'Event timeline planning',
                        'Registry update guidance',
                        'Gift coordination strategy',
                      ]}
                      className="text-charcoal/80"
                    />
                  </MarketingSurface>
                </div>
                </div>

              <div className="service-category mt-20 md:mt-28">
                <hr className="my-10 border-black/5 md:my-14" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
                  Family &amp; Household Support
                </h3>
                <div className="mt-12 flex justify-center">
                  <MarketingSurface className="marketing-card-hover h-full w-full max-w-sm">
                    <AddOnTitle className="mb-5 font-serif leading-tight">
                      Nanny Interview Preparation &amp; Guidance
                    </AddOnTitle>

                    <Body className="mb-8 text-neutral-600">
                      Structured support to help you confidently interview and evaluate caregivers for your growing family.
                    </Body>

                    <ServiceChecklist
                      items={[
                        'Customized interview question framework',
                        'Compatibility and experience evaluation guidance',
                        'Post-interview clarity and decision support',
                      ]}
                      className="text-charcoal/80"
                    />

                  </MarketingSurface>
                </div>
              </div>
            </div>
          </div>

        </section>

        <MarketingSection
          tone="ivoryWarm"
          spacing="default"
          container="default"
          className="services-page-section mt-6 !border-t-0 md:mt-8"
        >
          
            <div className="mx-auto max-w-3xl px-6 py-10 text-center space-y-8 md:px-10">
              <div className="relative px-6 py-10 md:px-10">
                <QuoteMark />
                <p className="relative text-lg font-serif leading-relaxed md:text-xl">
                  “I walked into the baby store already knowing what we needed.
                  No panic. No second-guessing. Just clarity.”
                </p>
              </div>
              <p className="text-neutral-600">— TMBC Client, Scottsdale</p>
            </div>
          
        </MarketingSection>

        <FinalCTA className="services-page-section mt-8 md:mt-10" />
      </main>
    </SiteShell>
  );
}
