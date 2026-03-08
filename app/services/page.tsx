import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import AddonServiceGroup from '@/components/services/AddonServiceGroup';
import type { AddonServiceCardData } from '@/components/services/AddonServiceCard';
import PlanningPackageCards from '@/components/services/PlanningPackageCards';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import QuoteMark from '@/components/ui/QuoteMark';
import SectionDivider from '@/components/ui/SectionDivider';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';
import { serviceAddonGroups } from '@/data/serviceAddons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Baby Prep Services — Taylor-Made Baby Co.',
  description:
    'Registry, gear, nursery, and home-prep support from Taylor-Made Baby Co. Get expert help choosing what to buy, what to skip, and what can wait.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

type ServiceChecklistProps = {
  items: string[];
  className?: string;
};

const packageIncludes = [
  {
    title: 'Stroller & Car Seat Decisions',
    description:
      'Narrow the options down to what fits your car, your routine, and how often you actually move through the day with baby.',
  },
  {
    title: 'Registry Strategy',
    description:
      'Build a registry that reflects real life, with better decisions on what belongs on the list, what can wait, and what is not worth the clutter.',
  },
  {
    title: 'Nursery Layout Planning',
    description:
      'Map sleep, feeding, diapering, and storage around how your space works so the room feels useful from day one.',
  },
];

const testimonials = [
  {
    label: 'Gear decisions',
    quote:
      'With four years between our kids, we quickly realized we were a little out of practice - and that baby gear had definitely evolved. Taylor helped us figure out what we could reuse, what was worth upgrading, and what we could skip entirely. It made the whole process feel calmer and much less chaotic. We only wish we had known about her the first time.',
    attribution: 'Philip & Lucia V., Santa Fe, NM · Parents of Two',
  },
  {
    label: 'Budget strategy',
    quote:
      'As a single mom of three boys on a really tight budget, I was worried about how we were going to afford everything we needed. Taylor helped me figure out what was safe to buy secondhand, what to look for with open-box deals, and where to spend money wisely - all in a completely judgment-free way. I walked into the baby store knowing exactly what we needed, with no panic and no second-guessing.',
    attribution: 'Cynthia C., Spokane, WA · Mother of Three',
  },
];

const allAddOnServices = serviceAddonGroups.flatMap((group) => group.services);

const pickAddOnServices = (titles: string[]) =>
  titles.flatMap((title) => {
    const service = allAddOnServices.find((entry) => entry.title === title);
    return service ? [service] : [];
  });

const eventPlanningServices: AddonServiceCardData[] = [
  {
    label: 'EVENT PLANNING',
    title: 'Gender Reveal',
    iconSrc: '/assets/icons/genderreveal.png',
    description:
      'Simple support for families who want a reveal moment that feels organized, low-stress, and easy to pull off.',
    features: [
      'Reveal concept and timing guidance',
      'Guest flow and hosting support',
      'Day-of setup checklist',
    ],
  },
  {
    label: 'EVENT PLANNING',
    title: 'Baby Shower',
    iconSrc: '/assets/icons/giftbox.png',
    description:
      'Light planning support for a baby shower that keeps the details manageable and the registry tied to what is actually useful.',
    features: [
      'Shower planning and timeline guidance',
      'Registry alignment and gift flow support',
      'Simple setup and hosting recommendations',
    ],
  },
  {
    label: 'EVENT PLANNING',
    title: 'Sip & See',
    iconSrc: '/assets/icons/sipsee.png',
    description:
      'Post-baby gathering support for families who want a warm, simple welcome moment without overcomplicating the logistics.',
    features: [
      'Guest timing and arrival planning',
      'Hosting flow and update support',
      'Registry and thank-you follow-through guidance',
    ],
  },
  {
    label: 'EVENT PLANNING',
    title: 'Birth Announcements',
    iconSrc: '/assets/icons/family.png',
    description:
      'Support with announcement timing, details, and coordination so sharing the news feels polished but still easy.',
    features: [
      'Announcement timing recommendations',
      'Details and wording guidance',
      'Mailing and delivery planning',
    ],
  },
  {
    label: 'EVENT PLANNING',
    title: 'Birthdays',
    iconSrc: '/assets/icons/celebration.png',
    description:
      'Simple planning help for baby and early birthday celebrations when you want a clear plan without turning it into a production.',
    features: [
      'Theme and scope guidance',
      'Guest flow and hosting plan',
      'Timeline and setup checklist',
    ],
  },
];

const addOnSupportGroups = [
  {
    title: 'Home & Safety',
    description:
      'Support for nursery flow, safer setup, car seat help, and the home details that make life with baby feel more workable.',
    icon: 'homeSafety' as const,
    services: pickAddOnServices([
      'Gear Cleaning & Reset Strategy',
      'CPST Car Seat Installation & Safety Checks',
      'In-Home Baby & Toddler Proofing Installation',
      'Sibling & Pet Preparation',
    ]),
  },
  {
    title: 'Family & Caregiver Preparation',
    description:
      'Practical planning for grandparents, siblings, pets, caregivers, and families moving through a unique path to bringing baby home.',
    icon: 'familySupport' as const,
    services: pickAddOnServices([
      'Grandparents Planning Session',
      'Surrogacy & Adoption Planning Support',
      'Nanny Interview Preparation & Guidance',
    ]),
  },
  {
    title: 'Community',
    description:
      'For families who want connection, shared learning, and a supportive place to ask questions while preparing for baby.',
    icon: 'familySupport' as const,
    services: pickAddOnServices([
      'Virtual Parent Community Sessions',
      'Phoenix Parent Circles',
    ]),
  },
  {
    title: 'Event Planning',
    description:
      'For families who want light support around celebration details before or after baby arrives, without turning the work into a full-scale production.',
    icon: 'celebrations' as const,
    services: eventPlanningServices,
  },
];

function ServiceChecklist({ items, className = '' }: ServiceChecklistProps) {
  return (
    <ul className={['space-y-4 leading-relaxed', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          <CheckIcon />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero image="/assets/hero/hero-03.jpg" imageAlt="" className="services-hero">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Baby Planning Support
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-2xl text-neutral-700">
              Choose the level of guidance that fits your family, from a focused baby gear consultation to complete
              registry, nursery, and home-preparation support.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 max-w-2xl text-sm leading-relaxed text-black/70 md:text-base">
              Strollers, car seats, sleep spaces, feeding gear, nursery setup, registry structure, travel gear, and
              babyproofing.
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/contact?service=consultation"
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Complimentary Consultation
              </Link>

              <Link
                href="#choose-support"
                className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Compare Support Options
              </Link>
            </div>
          </div>
        </Hero>

        <MarketingSection
          id="choose-support"
          tone="white"
          spacing="default"
          container="default"
          className="services-page-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mb-6 font-serif leading-tight">
                Choose Your Support
              </H2>

              <Body className="mx-auto max-w-3xl text-neutral-600">
                Here&apos;s the tea: you do not need to sort every registry and gear decision on your own. These three
                packages are built to meet families at different levels of support, while keeping the work practical and
                focused on what actually fits.
              </Body>
            </div>
          </RevealOnScroll>

          <PlanningPackageCards className="mt-16" />

          <p className="mt-16 border-t border-black/5 pt-12 text-center text-base font-medium leading-relaxed text-charcoal/70 md:mt-20">
            Not sure which option fits best?{' '}
            <Link
              href="/contact?service=consultation"
              className="link-underline transition-colors duration-200 hover:text-charcoal"
            >
              Start with the complimentary consultation
            </Link>
            .
          </p>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="default"
          className="services-page-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mb-6 font-serif leading-tight">
                What Each Package Includes
              </H2>

              <Body className="mx-auto max-w-3xl text-neutral-600">
                Every package is tailored, but the work stays grounded in real baby-prep outcomes: clearer decisions,
                fewer unnecessary purchases, and a home setup that feels more ready for daily life.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packageIncludes.map((item) => (
              <MarketingSurface key={item.title} className="h-full bg-white/90">
                <H3 className="font-serif text-neutral-900">
                  {item.title}
                </H3>
                <Body className="mt-4 text-neutral-600">
                  {item.description}
                </Body>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <section
          aria-labelledby="addon-support-services-heading"
          className="services-page-section bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 pb-24 md:px-8 lg:px-0">
            <RevealOnScroll>
              <div className="mx-auto mb-12 max-w-4xl text-center md:mb-14">
                <div className="flex justify-center">
                  <SectionDivider />
                </div>

                <p className="mt-8 text-xs uppercase tracking-[0.24em] text-charcoal/55">
                  Optional Add-On Support
                </p>

                <div id="addon-support-services-heading">
                  <H2 className="mt-5 font-serif leading-tight text-black">
                    Add-On Support by Situation
                  </H2>
                </div>

                <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-neutral-700">
                  Some families want extra help beyond the core package.
                </p>
                <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-neutral-600">
                  These add-ons layer in support for preparation, safety, caregivers, and community without taking over
                  the main plan.
                </p>
              </div>
            </RevealOnScroll>

            <div>
              {addOnSupportGroups.map((group, index) => (
                <AddonServiceGroup
                  key={group.title}
                  headingId={`addon-group-${index}`}
                  isFirst={index === 0}
                  {...group}
                />
              ))}
            </div>
          </div>
        </section>

        <MarketingSection
          tone="ivoryWarm"
          spacing="default"
          container="default"
          className="services-page-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <p className="mt-8 text-sm uppercase tracking-[0.2em] text-charcoal/60">
                Retailer Expertise
              </p>

              <H2 className="mt-5 font-serif">
                Retailer Expertise &amp; Partnerships
              </H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                Retail support is not the main service. It is one more way I help families prepare before they shop,
                identify the right products, and use store appointments more efficiently.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <MarketingSurface className="flex h-full flex-col rounded-2xl p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                In partnership with Tot Squad
              </p>

              <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden rounded-[1.25rem] border border-black/5 bg-[#f3ede5]">
                <Image
                  src="/assets/brand/target.png"
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  alt="Target"
                  className="object-fill opacity-95"
                />
              </div>

              <H3 className="mt-8 font-serif">
                Target Baby Concierge
              </H3>

              <Body className="mt-5 text-neutral-600">
                Families using Target Baby Concierge can access free one-on-one help for registry and gear decisions.
                I help you show up with a shortlist, clearer questions, and a better sense of what actually fits.
              </Body>

              <ServiceChecklist
                items={[
                  'Prep before the appointment',
                  'Shortlist strollers, car seats, and feeding gear',
                  'Use store time to compare the right products',
                ]}
                className="mt-8 text-charcoal/80"
              />

              <a
                href="https://babyconcierge.totsquad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary mt-10 w-full justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book Target Baby Concierge
              </a>
            </MarketingSurface>

            <MarketingSurface className="flex h-full flex-col rounded-2xl p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                Retailer expertise with Albee Baby
              </p>

              <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden rounded-[1.25rem] border border-black/5 bg-[#f3ede5]">
                <Image
                  src="/assets/brand/albeebabystore.png"
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  alt="Albee Baby"
                  className="object-fill opacity-95"
                />
              </div>

              <H3 className="mt-8 font-serif">
                NYC Store Visit Prep
              </H3>

              <Body className="mt-5 text-neutral-600">
                If you are planning an in-store visit in NYC, I help you sort registry priorities, budget guardrails,
                and which big-ticket items are worth testing in person before you walk in.
              </Body>

              <ServiceChecklist
                items={[
                  'Know what to test before you go',
                  'Compare the right gear in store',
                  'Leave with clearer next steps',
                ]}
                className="mt-8 text-charcoal/80"
              />

              <Link
                href="/contact"
                className="btn btn--secondary mt-10 w-full justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Ask About Store Visit Prep
              </Link>
            </MarketingSurface>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="default"
          container="default"
          className="services-page-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif">
                What Families Say
              </H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                Families usually come away with clearer gear decisions, less registry guesswork, better spending
                choices, and a setup that feels much more ready for real life.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <MarketingSurface key={testimonial.attribution} className="h-full rounded-2xl bg-[#F7F4EF] p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                  {testimonial.label}
                </p>

                <div className="relative mt-6">
                  <QuoteMark />
                  <p className="relative text-lg font-serif leading-relaxed text-neutral-900 md:text-xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <p className="mt-8 text-sm text-neutral-600">
                  - {testimonial.attribution}
                </p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <FinalCTA
          className="services-page-section mt-8 md:mt-10"
          title="Start your baby preparation with confidence."
          description="Book a consultation and get clear guidance on registry decisions, gear choices, nursery setup, and the preparation ahead."
        />
      </main>
    </SiteShell>
  );
}
