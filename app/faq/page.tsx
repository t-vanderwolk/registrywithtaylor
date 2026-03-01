import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import Hero from '@/components/ui/Hero';
import { Body, H2 } from '@/components/ui/MarketingHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionDivider from '@/components/ui/SectionDivider';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'FAQ — Taylor-Made Baby Co.',
  description:
    'Frequently asked questions about Taylor-Made Baby Co.\'s services, process, and support.',
  path: '/faq',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Frequently asked questions',
});

const complimentaryConsultationFaqs: FAQEntry[] = [
  {
    question: 'Is the consultation really complimentary?',
    answer:
      "Yes. The virtual consultation is offered through the Target Baby Concierge program powered by Tot Squad. There is no cost to book the session.",
  },
  {
    question: 'Do I need to register at Target first?',
    answer:
      "Yes. The consultation is part of the Target Baby Concierge experience. Once your registry is created, you can schedule your session and I'll serve as your dedicated Baby Specialist through Tot Squad.",
  },
  {
    question: 'Will I be meeting with you directly?',
    answer: "Yes. When you book through the Tot Squad platform, you'll meet with me personally for your consultation.",
  },
  {
    question: 'What happens during the session?',
    answer:
      "We review your registry, your space, your lifestyle, and your timeline. Together, we identify what's essential, what may be unnecessary, and what best supports how you actually live. The goal is clarity - not more things.",
  },
  {
    question: 'How long is the consultation?',
    answer:
      'Most sessions are 30 minutes. Occasionally, they may run slightly longer depending on your needs.',
  },
  {
    question: 'What should I prepare beforehand?',
    answer:
      "Come with your registry (even if it's unfinished), your biggest questions, and a sense of your space. You don't need to have everything figured out - that's what the session is for.",
  },
  {
    question: "Can you help if I haven't built my registry yet?",
    answer:
      "Yes. We can start from zero. I'll help you prioritize what matters first based on your lifestyle, space, and timeline.",
  },
  {
    question: 'What retailers can we use?',
    answer:
      'Target is a great foundation, and we can compare across other retailers when it makes sense for your needs.',
  },
];

const afterConsultationFaqs: FAQEntry[] = [
  {
    question: 'What happens after our session?',
    answer:
      'Some families feel fully confident moving forward independently. Others choose continued support through Taylor-Made Baby Co. for more structured, private planning. There is no obligation either way.',
  },
  {
    question: 'Am I required to book private services?',
    answer:
      'No. The complimentary consultation stands on its own. If you\'d like additional support - nursery planning, registry refinement, gear strategy, or ongoing guidance - those services are available separately through Taylor-Made Baby Co.',
  },
  {
    question: 'What\'s the difference between Tot Squad and Taylor-Made Baby Co.?',
    answer:
      'Tot Squad powers the Target Baby Concierge program, which provides complimentary registry consultations. Taylor-Made Baby Co. offers private, personalized planning services for families who want continued guidance beyond that initial session.',
  },
];

const privatePlanningFaqs: FAQEntry[] = [
  {
    question: 'What do private services include?',
    answer:
      'Private services may include registry refinement, nursery layout and design guidance, product comparison and gear strategy, personal shopping support, and ongoing planning sessions. Each engagement is tailored to your family.',
  },
  {
    question: 'Do you work with families outside Scottsdale?',
    answer:
      'Yes. Most consultations are virtual and available nationwide. In-home support may be available for select clients.',
  },
  {
    question: 'Do you receive commission on products you recommend?',
    answer:
      'I may receive affiliate compensation from certain retail partners, but recommendations are always based on what fits your lifestyle, space, and priorities - not on commission. Clarity and trust come first.',
  },
  {
    question: 'How do I know if private planning is right for me?',
    answer:
      "If you're looking for continued structure, thoughtful decision-making, and a calm, guided approach to preparation - private planning may be a strong fit. If you're unsure, begin with your complimentary consultation.",
  },
  {
    question: 'Do you offer nursery design, or just layout + function?',
    answer:
      'Both. We start with calm function and safety, then refine the aesthetic so the space supports real daily flow.',
  },
  {
    question: "What does 'white-glove' support mean?",
    answer:
      'Priority scheduling, ongoing guidance, and direct support as decisions evolve throughout your pregnancy.',
  },
];

export default function FAQPage() {
  return (
    <SiteShell currentPath="/faq">
      <main className="site-main">
        <Hero
          image="/assets/hero/hero-05.jpg"
          imageAlt=""
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Frequently Asked Questions
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              A little clarity before we begin.
            </Body>
            <p className="hero-load-reveal hero-load-reveal--2 text-sm uppercase tracking-[0.2em] text-charcoal/60">
              Baby Gear Specialist · Brand-Trained Expertise · Private Planning for Modern Families
            </p>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="default" container="default">
          <div className="max-w-3xl mx-auto space-y-12">

            {/* FAQ Groups */}
            <div className="space-y-12">

              {/* Complimentary Consultation */}
              <RevealOnScroll>
                <div className="space-y-6">
                  <div>
                    <SectionDivider />
                    <H2 className="text-neutral-900">
                      Complimentary Consultation
                    </H2>
                  </div>

                  <FAQAccordion items={complimentaryConsultationFaqs} />
                </div>
              </RevealOnScroll>

              {/* After the Consultation */}
              <RevealOnScroll delayMs={100}>
                <div className="space-y-6">
                  <div>
                    <SectionDivider />
                    <H2 className="text-neutral-900">
                      After the Consultation
                    </H2>
                  </div>

                  <FAQAccordion items={afterConsultationFaqs} />
                </div>
              </RevealOnScroll>

              {/* Private Planning Services */}
              <RevealOnScroll delayMs={180}>
                <div className="space-y-6">
                  <div>
                    <SectionDivider />
                    <H2 className="text-neutral-900">
                      Private Planning Services
                    </H2>
                  </div>

                  <FAQAccordion items={privatePlanningFaqs} />
                </div>
              </RevealOnScroll>

            </div>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
