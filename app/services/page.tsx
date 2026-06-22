import PageViewTracker from '@/components/analytics/PageViewTracker';
import HomeEditorialBreak from '@/components/home/HomeEditorialBreak';
import SiteShell from '@/components/SiteShell';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import RegistryConsultOffer from '@/components/marketing/RegistryConsultOffer';
import MarketingSection from '@/components/layout/MarketingSection';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import TwoTierTestimonials from '@/components/marketing/TwoTierTestimonials';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Registry Consult ($75) | Taylor-Made Baby Co.',
  description:
    'Book a focused 45-minute virtual Registry Consult ($75) — expert help starting, editing, or making sense of your baby registry, from strollers and car seats to feeding, sleep, and nursery basics.',
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
    question: 'What happens in a Registry Consult?',
    answer:
      'A focused 45-minute virtual session. We start, edit, or make sense of your registry together — narrowing the biggest product decisions and getting clear on what you actually need for the first few months. You leave with follow-up notes and your next best steps.',
  },
  {
    question: 'What can Taylor help with in the session?',
    answer:
      'Starting a registry from scratch, reviewing one that suddenly feels too long, and narrowing down stroller, car seat, feeding, sleep, and nursery basics — plus avoiding duplicates, unnecessary products, and trendy-but-not-useful items.',
  },
  {
    question: 'Is this a full buildout or concierge package?',
    answer:
      'No — this is a focused entry session, not a full concierge package. We use the time to get clear on what matters most next. If you want longer-term support with your registry, nursery, gear decisions, or full baby planning, reach out through the contact form and Taylor will point you toward the right level of support.',
  },
  {
    question: 'Does the session work virtually?',
    answer:
      'Yes. It is built to work virtually, with guidance shaped around your real home, vehicle, and routine.',
  },
] as const;

export default function ServicesPage() {

  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <PageViewTracker path="/services" pageType="services" />

        <Hero
          className="homepage-hero services-hero"
          eyebrow="Introductory Registry Consults Now Open"
          title="Registry Consult — $75"
          subtitle="Bring me the registry chaos. I’ll help you find the first clear path through it — a focused, 45-minute virtual session for expecting parents starting, editing, or making sense of a baby registry."
          primaryCta={{ label: 'Book a Registry Consult', href: '/book' }}
          secondaryCta={{ label: 'Contact Taylor', href: '/contact' }}
          tagline="Registry Strategy • Strollers • Car Seats • Feeding • Sleep • Nursery"
          image="/assets/hero/hero-03.jpg"
          imageAlt="Baby registry and gear planning scene"
          contentClassName="homepage-hero-content services-hero-content"
          ribbonClassName="translate-y-6 md:translate-y-8"
          staggerContent
        />

        <RegistryConsultOffer variant="full" className="services-page-section" />

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
