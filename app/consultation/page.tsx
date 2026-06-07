import { Suspense } from 'react';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionDivider from '@/components/ui/SectionDivider';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book a Consultation - Taylor-Made Baby Co.',
  description:
    'Request a consultation with Taylor for expert baby gear, registry, and baby-preparation guidance.',
  path: '/consultation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Free consultation request form',
});

const consultationFaqs: FAQEntry[] = [
  {
    question: 'Is the consultation really complimentary?',
    answer:
      'Yes. The personal 1:1 video consultation is free. There is no cost to submit a request.',
  },
  {
    question: 'Will I be meeting with you directly?',
    answer: 'Yes. You will meet with me personally for your consultation.',
  },
  {
    question: 'What happens during the session?',
    answer:
      "We review your registry, your space, your lifestyle, and your timeline. Together, we identify what's essential, what may be unnecessary, and what best supports how you actually live. The goal is clarity — not more things.",
  },
  {
    question: "Can you help if I haven't built my registry yet?",
    answer:
      "Yes. We can start from zero. I'll help you prioritize what matters first based on your lifestyle, space, and timeline.",
  },
  {
    question: 'What should I prepare beforehand?',
    answer:
      "Come with your registry (even if it's unfinished), your biggest questions, and a sense of your space. You don't need to have everything figured out — that's what the session is for.",
  },
];

export default function ConsultationPage() {
  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <PageViewTracker path="/consultation" pageType="book" />

        <Hero
          className="homepage-hero"
          eyebrow="Consultation"
          title="Book a Consultation"
          subtitle="Walk through a guided intake, share what is actually going on in your home and registry, and Taylor will follow up with a session that starts from real context instead of guesswork."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Consultation planning form"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <SectionDivider />
                <h2 className="font-serif text-[1.7rem] leading-tight tracking-[-0.03em] text-neutral-900 sm:text-[2rem]">
                  A few questions before you start
                </h2>
              </div>
              <FAQAccordion items={consultationFaqs} />
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" container="narrow">
          <RevealOnScroll>
            <figure className="mx-auto max-w-2xl py-2 text-center">
              <blockquote>
                <p className="font-serif text-[1.7rem] leading-[1.15] tracking-[-0.03em] text-neutral-900 sm:text-[2rem]">
                  &ldquo;Taylor and I laughed the whole time but still able to get it done! Support I didn&rsquo;t know I needed!&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-6 text-[0.72rem] uppercase tracking-[0.18em] text-black/50">
                Expecting parent
              </figcaption>
            </figure>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-5xl space-y-6">
              <Suspense>
                <ConsultationRequestForm />
              </Suspense>

              <p className="text-center text-sm text-neutral-600">
                Prefer to read the process first?{' '}
                <Link href="/#journey" className="link-underline">
                  View the Journey
                </Link>
              </p>
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
