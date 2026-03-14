import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import CTASection from '@/components/marketing/CTASection';
import ServiceCards from '@/components/marketing/ServiceCards';
import MarketingSection from '@/components/layout/MarketingSection';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { servicePackages } from '@/lib/marketing/siteContent';

export const metadata = buildMarketingMetadata({
  title: 'Baby Gear Advisory Services | Taylor-Made Baby Co.',
  description:
    'Advisor-led baby gear and baby preparation services for registry planning, stroller and car seat decisions, nursery setup, and purchase timing.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Taylor-Made Baby Co. advisory services.',
});

const fitMoments = [
  {
    title: 'You want expert judgment',
    description: 'Not another list of links, but a clearer sense of what actually deserves your attention.',
  },
  {
    title: 'You want decisions matched to real life',
    description: 'Your car, storage, travel habits, budget, and room layout should shape the recommendations.',
  },
  {
    title: 'You want to buy with confidence',
    description: 'The goal is a better plan, fewer mismatched purchases, and less second-guessing.',
  },
] as const;

const engagementPrinciples = [
  {
    title: 'Decision guidance first',
    description: 'Every engagement is built around better recommendations, not generic consulting hours.',
  },
  {
    title: 'Lifestyle compatibility',
    description: 'Taylor helps you choose what fits your home, vehicle, routines, and long-term plan.',
  },
  {
    title: 'Clear next steps',
    description: 'You leave with a smarter shortlist, more confidence, and a better sense of what to buy now, later, or not at all.',
  },
] as const;

const optionalAddOns = [
  {
    title: 'Nursery Layout Planning',
    description: 'Furniture placement, room flow, and sleep environment guidance.',
  },
  {
    title: 'Registry Refresh',
    description: 'Review and refine your registry after your baby shower or later in pregnancy.',
  },
  {
    title: 'Baby Gear Troubleshooting',
    description: 'Help with strollers, carriers, monitors, feeding gear, and everyday gear questions.',
  },
  {
    title: 'Travel With Baby Planning',
    description: 'Guidance on travel strollers, car seats, and flying with an infant.',
  },
  {
    title: 'Postpartum Preparation',
    description: 'Support planning feeding stations, recovery supplies, and home organization.',
  },
  {
    title: 'Sibling and Animal Introduction Prep',
    description: 'Guidance for smoother introductions, safer transitions, and realistic prep before baby comes home.',
  },
] as const;

const serviceFaqs: FAQEntry[] = [
  {
    question: 'Where should I start if I am not sure which package fits?',
    answer:
      'Start with a consultation. That conversation helps Taylor understand your decision stage, the categories in play, and which level of support makes the most sense.',
  },
  {
    question: 'What kinds of decisions can Taylor help with?',
    answer:
      'Common topics include strollers, infant car seats, registry strategy, nursery setup, travel gear, and the timing of what to buy now versus later.',
  },
  {
    question: 'Do these services work virtually?',
    answer:
      'Yes. The advisory model is designed to work virtually, with recommendations shaped around your real home, vehicle, and routine.',
  },
  {
    question: 'How is this different from generic consulting?',
    answer:
      'The service is positioned as advisor support: category expertise, recommendation logic, and lifestyle-fit guidance applied to the decisions that matter most.',
  },
] as const;

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <PageViewTracker path="/services" pageType="services" />

        <Hero
          className="homepage-hero"
          eyebrow="Advisory Services"
          title="Premium Baby Gear Guidance, Built Around Real-Life Fit"
          subtitle="Taylor-Made Baby Co. offers advisor-led support for registry strategy, stroller and car seat decisions, nursery setup, and the purchase timing that makes the whole process feel more manageable."
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Explore the Guides', href: '/guides' }}
          tagline="Registry Planning • Strollers • Infant Car Seats • Nursery Setup"
          image="/assets/hero/hero-03.jpg"
          imageAlt="Baby registry and gear planning scene"
          contentClassName="homepage-hero-content"
          ribbonClassName="translate-y-6 md:translate-y-8"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Who this is for"
            title="This is for parents who want better decisions, not just more information."
            description="If you want real guidance instead of researching in circles, this is where Taylor helps make the next decisions feel clearer."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {fitMoments.map((moment) => (
              <MarketingSurface key={moment.title} className="h-full">
                <h3 className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {moment.title}
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{moment.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <ServiceCards
          packages={servicePackages}
          eyebrow="Ways to work with Taylor"
          title="Choose the level of advisor support that matches the decisions in front of you."
          description="The packages are designed around how much judgment and planning support you want in the mix, from one focused decision to full baby-preparation guidance."
        />

        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="Optional Add-Ons"
            title="Additional support for the preparation areas that need a little more attention."
            description="These add-ons are available when you want help with one specific layer of planning without turning it into a larger engagement."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {optionalAddOns.map((addOn) => (
              <MarketingSurface
                key={addOn.title}
                className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]"
              >
                <h3 className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {addOn.title}
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{addOn.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Why it works"
            title="Expert guidance feels different when it is grounded in compatibility, not just product features."
            description="The point is not to hand you a longer list. It is to help you choose what fits your home, your routine, and the way you actually plan to use it."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {engagementPrinciples.map((principle) => (
              <MarketingSurface key={principle.title} className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/78">
                  Advisor-led
                </p>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{principle.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="Common questions"
            title="A few answers before you book."
            description="A little clarity now makes the next step easier."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mx-auto mt-10 max-w-4xl">
            <FAQAccordion items={serviceFaqs} className="bg-[#f7f2eb]" />
          </div>
        </MarketingSection>

        <CTASection
          eyebrow="Next step"
          title="Book a consultation when you want Taylor's judgment on the decisions that matter most."
          description="Start with a conversation, then choose the level of support that fits the complexity of your baby gear and preparation questions."
        />
      </main>
    </SiteShell>
  );
}
