import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book a Consultation - Taylor-Made Baby Co.',
  description:
    'Request a consultation with Taylor for expert baby gear, registry, and baby-preparation guidance.',
  path: '/consultation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Free consultation request form',
});

type SearchParams = Promise<{ error?: string }> | undefined;

export default async function ConsultationPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <PageViewTracker path="/consultation" pageType="book" />

        <Hero
          className="homepage-hero"
          eyebrow="Consultation"
          title="Book a Consultation"
          subtitle="Submit your request and Taylor will follow up directly to begin a calmer, more expert-guided baby gear planning process."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Consultation planning form"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-2xl space-y-6">
              <ConsultationRequestForm errorCode={params?.error ?? null} />

              <p className="text-center text-sm text-neutral-600">
                Prefer to read the process first? <Link href="/#journey" className="link-underline">View the Journey</Link>
              </p>
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
