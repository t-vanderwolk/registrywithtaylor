import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import Hero from '@/components/ui/Hero';
import { H2 } from '@/components/ui/MarketingHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionDivider from '@/components/ui/SectionDivider';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { isAcademyEnabled } from '@/lib/featureFlags';

export const metadata = buildMarketingMetadata({
  title: 'Frequently Asked Questions | Taylor-Made Baby Co.',
  description:
    'Answers to common questions about baby gear guidance, registry consulting, car seat guidance, and the $75 Registry Consult.',
  path: '/faq',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Frequently asked questions about Taylor-Made Baby Co.',
  keywords: [
    'is baby gear consultation free',
    'what does a baby concierge do',
    'baby registry help',
    'car seat check Scottsdale',
    'TMBC Academy',
  ],
});

const consultationFaqs: FAQEntry[] = [
  {
    question: 'What is the Registry Consult?',
    answer:
      'A focused 45-minute virtual session for expecting parents who want help starting, editing, or making sense of their baby registry. It is $75, and you leave with personalized guidance and follow-up notes on your next best steps.',
  },
  {
    question: 'What happens during the session?',
    answer:
      'Taylor reviews your registry, your space, your lifestyle, and your timeline, then helps you narrow the biggest product decisions and get clear on what you actually need for the first few months.',
  },
  {
    question: 'Will I be meeting with Taylor directly?',
    answer: 'Yes. Every session is with Taylor personally.',
  },
  {
    question: 'What should I bring?',
    answer:
      'Come with your registry (even if it is unfinished), your biggest questions, and a general sense of your space and vehicle. You do not need to have anything figured out — that is what the session is for.',
  },
  {
    question: 'Is this a full buildout or concierge package?',
    answer:
      'No. This is a focused entry session, not a full concierge package — we use the time to get clear on what matters most next. If you want longer-term support with your registry, nursery, gear decisions, or full baby planning, reach out through the contact form and Taylor will point you toward the right level of support.',
  },
];

const servicesFaqs: FAQEntry[] = [
  {
    question: 'How much is the Registry Consult, and how long is it?',
    answer:
      'The Registry Consult is $75 for a focused 45-minute virtual session. It is the one paid service offered right now — a simple, expert-led way to get unstuck on your registry.',
  },
  {
    question: 'What can Taylor help with in the session?',
    answer:
      'Starting a registry from scratch, reviewing one that suddenly feels too long, and narrowing down stroller, car seat, feeding, sleep, and nursery basics — plus avoiding duplicates, unnecessary products, and trendy-but-not-useful items.',
  },
  {
    question: 'What if I want more than one session or ongoing support?',
    answer:
      'Reach out through the contact form. Taylor offers deeper, longer-term support for registry, nursery, stroller and car seat decisions, and full baby planning, and will help point you toward the right level.',
  },
  {
    question: 'Is the session virtual or in person?',
    answer:
      'The Registry Consult is virtual, so you can join from anywhere. In-person support in the Scottsdale, Arizona area is available on request through the contact form.',
  },
];

const carSeatFaqs: FAQEntry[] = [
  {
    question: 'What is a CPST?',
    answer:
      'A Certified Passenger Safety Technician (CPST) is a nationally certified specialist trained in the correct installation and use of child safety seats. Taylor holds this certification, which means car seat guidance at Taylor-Made Baby Co. is grounded in real safety training — not just product preference.',
  },
  {
    question: 'Can Taylor help me choose and install a car seat?',
    answer:
      'Yes. Car seat selection and comparison can be part of your Registry Consult, and Taylor partners with Lani Car Seats (a CPST service) for hands-on installation and safety checks. For deeper car seat support, reach out through the contact form.',
  },
];

const academyFaqs: FAQEntry[] = [
  {
    question: 'What is the TMBC Academy?',
    answer:
      'The Academy is a structured educational resource built around the decisions expecting parents face — registry strategy, nursery setup, gear selection, and postpartum preparation. It is organized into paths and modules that are meant to be followed in order. Three complete lessons are free with no account required. Full Academy access (all 29 modules, workbooks, and certificates) is included with every TMBC service package, or available separately for $97.',
  },
  {
    question: 'Is the Academy free?',
    answer:
      'Three complete lessons are free with no account required — The Art of the Registry, Nursery Foundations, and The Stroller Equation. Each includes a mini workbook and key takeaways. Full Academy access across all 29 modules is included with every TMBC service package, or available separately for $97. See the Academy pricing page for details.',
  },
  {
    question: 'How is the Academy different from a consultation?',
    answer:
      'The Academy gives you the framework and context. A consultation applies that framework to your specific home, car, routines, and registry. Most families find that doing some Academy modules before a consultation makes the session more focused and useful.',
  },
];

const generalFaqs: FAQEntry[] = [
  {
    question: 'What areas does Taylor serve?',
    answer:
      'Taylor-Made Baby Co. serves families virtually across the United States. In-person services are available in the Scottsdale, Arizona area.',
  },
  {
    question: 'How do I get started?',
    answer:
      'The best starting point is a Registry Consult — book a time and Taylor will follow up directly. If you are not ready to book, the Journal is available without any commitment.',
  },
  {
    question: 'How long does it take to hear back after submitting a consultation request?',
    answer:
      'Taylor personally reviews every request and follows up within 24 hours.',
  },
];

export default function FAQPage() {
  const academyEnabled = isAcademyEnabled();
  return (
    <SiteShell currentPath="/faq">
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow="FAQ"
          title="Questions, answered."
          subtitle={academyEnabled ? 'Everything you need to know before booking, browsing the Academy, or reaching out.' : 'Everything you need to know before booking your consult or reaching out.'}
          image="/assets/hero/hero-05.jpg"
          imageAlt=""
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="default">
          <div className="mx-auto max-w-3xl space-y-12">
            <RevealOnScroll>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">About the Registry Consult</H2>
                </div>
                <FAQAccordion items={consultationFaqs} />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">About the Service</H2>
                </div>
                <FAQAccordion items={servicesFaqs} />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120}>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">About Car Seat Guidance</H2>
                </div>
                <FAQAccordion items={carSeatFaqs} />
              </div>
            </RevealOnScroll>

            {academyEnabled ? (
              <RevealOnScroll delayMs={160}>
                <div className="space-y-6">
                  <div>
                    <SectionDivider />
                    <H2 className="text-neutral-900">About the Academy</H2>
                  </div>
                  <FAQAccordion items={academyFaqs} />
                </div>
              </RevealOnScroll>
            ) : null}

            <RevealOnScroll delayMs={200}>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">General Questions</H2>
                </div>
                <FAQAccordion items={generalFaqs} />
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-[2rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[2.5rem]">
              Still have a question?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600">
              Reach out directly or book a Registry Consult — either way, Taylor responds personally.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                <MotionCtaContent>Book a Registry Consult</MotionCtaContent>
              </Link>
              <Link
                href="/contact"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                <MotionCtaContent>Contact Taylor</MotionCtaContent>
              </Link>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
