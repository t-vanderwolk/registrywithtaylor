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

export const metadata = buildMarketingMetadata({
  title: 'Frequently Asked Questions | Taylor-Made Baby Co.',
  description:
    'Answers to the most common questions about baby gear guidance, registry consulting, car seat checks, the free consultation, and the TMBC Academy.',
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
    question: 'Is the consultation really free?',
    answer:
      'Yes. The initial 1:1 video consultation is complimentary. There is no cost to submit a request or meet with Taylor for the first time. The consultation is how we figure out which level of support actually fits your situation.',
  },
  {
    question: 'What happens during the consultation?',
    answer:
      'Taylor reviews your registry, your space, your lifestyle, and your timeline. Together you identify what decisions need to be made, what can wait, and which package — if any — makes sense for where you are.',
  },
  {
    question: 'Will I be meeting with Taylor directly?',
    answer: 'Yes. Every consultation is with Taylor personally.',
  },
  {
    question: 'What should I bring to the consultation?',
    answer:
      'Come with your registry (even if it is unfinished), your biggest questions, and a general sense of your space and vehicle. You do not need to have anything figured out — that is what the session is for.',
  },
  {
    question: 'Do I have to buy anything after the consultation?',
    answer:
      'No. The consultation is genuinely no-pressure. Some families book a package afterward. Some leave with enough clarity to move forward on their own. Both outcomes are fine.',
  },
];

const servicesFaqs: FAQEntry[] = [
  {
    question: 'What is included in the Focused Session?',
    answer:
      'One 90-minute session focused on a single gear or registry decision. Taylor builds a shortlist, walks through the recommendation logic, and gives clear buy-now, skip, or wait guidance. A written summary is included after the session. The Focused Session is $199.',
  },
  {
    question: 'What is included in the Signature Package?',
    answer:
      'Three 90-minute sessions structured across registry strategy, stroller and car seat decisions, nursery planning, and purchase timing. The Signature Package also includes a car seat check with Lani Car Seats and a complimentary childproofing quote from AZ Childproofers. A written plan is included after each session. The Signature Package is $797 – $997.',
  },
  {
    question: 'What is the Private Concierge?',
    answer:
      'Ongoing advisor access scoped to your specific decisions, timeline, and preparation stage. The Private Concierge includes everything in the Signature Package plus extended support as priorities evolve. Pricing starts at $1,997 and is discussed during an initial scoping conversation. Use the contact form to start that conversation.',
  },
  {
    question: 'Are the sessions virtual or in person?',
    answer:
      'Both options are available. Sessions can be conducted virtually from anywhere, or in person for clients in the Scottsdale, Arizona area.',
  },
  {
    question: 'What about Lani Car Seats and AZ Childproofers — are those available outside Arizona?',
    answer:
      'Yes. Both partners offer virtual services for clients outside Arizona. In-person services are available for Arizona clients.',
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
      'Yes. Car seat selection, comparison, and installation guidance are included in the Signature Package and Private Concierge through Taylor\'s partnership with Lani Car Seats. Standalone car seat help is also available as an add-on.',
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
      'The best starting point is a free consultation. Submit a request through the consultation page and Taylor will follow up directly. If you are not ready to book, the Academy and Journal are both available without any commitment.',
  },
  {
    question: 'How long does it take to hear back after submitting a consultation request?',
    answer:
      'Taylor personally reviews every request and follows up within 24 hours.',
  },
];

export default function FAQPage() {
  return (
    <SiteShell currentPath="/faq">
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow="FAQ"
          title="Questions, answered."
          subtitle="Everything you need to know before booking, browsing the Academy, or reaching out."
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
                  <H2 className="text-neutral-900">About the Free Consultation</H2>
                </div>
                <FAQAccordion items={consultationFaqs} />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">About the Services and Packages</H2>
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

            <RevealOnScroll delayMs={160}>
              <div className="space-y-6">
                <div>
                  <SectionDivider />
                  <H2 className="text-neutral-900">About the Academy</H2>
                </div>
                <FAQAccordion items={academyFaqs} />
              </div>
            </RevealOnScroll>

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
              Reach out directly or book the free consultation — either way, Taylor responds personally.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/consultation"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                <MotionCtaContent>Book a Free Consultation</MotionCtaContent>
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
