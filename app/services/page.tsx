import PageViewTracker from '@/components/analytics/PageViewTracker';
import HomeEditorialBreak from '@/components/home/HomeEditorialBreak';
import SiteShell from '@/components/SiteShell';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import ServiceCards from '@/components/marketing/ServiceCards';
import MarketingSection from '@/components/layout/MarketingSection';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import TwoTierTestimonials from '@/components/marketing/TwoTierTestimonials';
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
    price: '$79',
    description: 'Furniture placement, room flow, and sleep environment guidance.',
  },
  {
    title: 'Registry Refresh',
    price: '$79',
    description: 'Review and refine your registry after your baby shower or later in pregnancy.',
  },
  {
    title: 'Baby Gear Troubleshooting',
    price: '$59',
    description: 'Help with strollers, carriers, monitors, feeding gear, and everyday gear questions.',
  },
  {
    title: 'Travel With Baby Planning',
    price: '$59',
    description: 'Guidance on travel strollers, car seats, and flying with an infant.',
  },
  {
    title: 'Postpartum Preparation',
    price: '$79',
    description: 'Support planning feeding stations, recovery supplies, and home organization.',
  },
  {
    title: 'Sibling and Animal Introduction Prep',
    price: '$59',
    description: 'Guidance for smoother introductions, safer transitions, and realistic prep before baby comes home.',
  },
];

const servicesStrolleriaReviews = [
  {
    quote: "Taylor took what could have been a very overwhelming experience and made it so simple and easy. She spent 3+ hours with me as we talked through the pros/cons of each brand and was so patient and kind... Corporate, if you're reading this, time to give Taylor a promotion/raise!",
    name: 'Amanda M.',
    source: 'Strolleria client',
  },
  {
    quote: "She listened to what we were looking for, and was so honest and transparent about all of the baby gear we were considering. We ended up buying something completely different than our 'online research' because of her help.",
    name: 'Kathryn G.',
    source: 'Strolleria client',
  },
  {
    quote: 'She is truly a wealth of knowledge and guided us in the right direction based on our individual needs and preferences. Not only did we leave feeling confident in our selections, but Taylor made the entire process fun and exciting.',
    name: 'Caihlan S.',
    source: 'Strolleria client',
  },
  {
    quote: 'We came in not knowing what we wanted and Taylor listened to our preferences/lifestyle and provided us with great recommendations. She definitely made the process less overwhelming for us.',
    name: 'Talie W.',
    source: 'Strolleria client',
  },
  {
    quote: 'Taylor showed us more options than we would have known to ask about, which led to us completely changing what we wanted for our whole stroller setup.',
    name: 'Jennifer R.',
    source: 'Strolleria client',
  },
] as const;

const servicesAnonymousQuotes = [
  {
    quote: "Taylor's knowledge made us more comfortable understanding the landscape of baby gear — what we actually need and what we don't — and how to build a system that works for our needs.",
    attribution: 'First-time parent',
  },
  {
    quote: 'Taylor has been great with providing structure and clarity on the items I need to get and when.',
    attribution: 'Expecting parent',
  },
  {
    quote: 'Taylor was AMAZING going through our registry and providing expert recommendations!',
    attribution: 'First-time parent',
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
          className="homepage-hero services-hero"
          eyebrow="Advisory Services"
          title="Premium Baby Gear Guidance, Built Around Real-Life Fit"
          subtitle="Taylor-Made Baby Co. offers advisor-led support for registry strategy, stroller and car seat decisions, nursery setup, and the purchase timing that makes the whole process feel more manageable."
          primaryCta={{ label: 'Book a Free Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Explore the Academy', href: '/academy' }}
          tagline="Registry Strategy • Strollers • Car Seats • Nursery Setup"
          image="/assets/hero/hero-03.jpg"
          imageAlt="Baby registry and gear planning scene"
          contentClassName="homepage-hero-content services-hero-content"
          ribbonClassName="translate-y-6 md:translate-y-8"
          staggerContent
        />

        <ServiceCards
          packages={servicePackages}
          eyebrow="Ways to work with Taylor"
          title="Choose the level of advisor support that matches the decisions in front of you."
          description="The packages are designed around how much judgment and planning support you want in the mix, from one focused decision to full baby-preparation guidance."
          className="services-page-section"
        />

        <MarketingSection tone="ivory" spacing="spacious" className="services-page-section">
          <SectionIntro
            eyebrow="Optional Add-Ons"
            title="Additional support for the preparation areas that need a little more attention."
            description="These add-ons are available when you want help with one specific layer of planning without turning it into a larger engagement."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {optionalAddOns.map((addOn) => (
              <MarketingSurface
                key={addOn.title}
                className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-[1.4rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
                    {addOn.title}
                  </h3>
                  <span className="shrink-0 font-[family-name:var(--font-accent)] text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-[var(--color-accent-dark)]">
                    {addOn.price}
                  </span>
                </div>
                <p className="mt-3 max-w-none text-sm leading-7 text-neutral-700">{addOn.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <HomeEditorialBreak
          imageSrc="/assets/editorial/nursery.jpg"
          imageAlt="Neutral nursery with crib, dresser, chair, and soft natural light."
          tone="blush"
          eyebrow="Preparation that feels like relief"
          title="The room should help at 2:14 AM."
          description="Good planning is not about making everything prettier. It is about making everything easier to live with."
        />

        <MarketingSection tone="white" spacing="spacious" className="services-page-section">
          <SectionIntro
            eyebrow="Why it works"
            title="Expert guidance feels different when it is grounded in compatibility, not just product features."
            description="The point is not to hand you a longer list. It is to help you choose what fits your home, your routine, and the way you actually plan to use it."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6">
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

        <MarketingSection tone="ivory" spacing="default" className="services-page-section">
          <SectionIntro
            eyebrow="Common questions"
            title="A few answers before you book."
            description="A little clarity now makes the next step easier."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
            <FAQAccordion items={serviceFaqs} className="bg-[#f7f2eb]" />
          </div>
        </MarketingSection>

        <TwoTierTestimonials
          eyebrow="Client Stories"
          title="What families say"
          strolleriaReviews={servicesStrolleriaReviews}
          anonymousQuotes={servicesAnonymousQuotes}
          anonymousColumns={3}
          className="services-page-section"
        />

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <NewsletterCapture />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
