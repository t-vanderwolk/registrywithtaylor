import { Suspense } from 'react';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Intake Form — Taylor-Made Baby Co.',
  description:
    'Fill out your intake form so Taylor can come to your free consultation fully prepared.',
  path: '/consultation/intake',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Consultation intake form',
});

export default function ConsultationIntakePage() {
  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <PageViewTracker path="/consultation/intake" pageType="book" />

        <Hero
          className="homepage-hero"
          eyebrow="Intake Form"
          title="Help me come prepared."
          subtitle="This form helps me understand your home, routine, and the decisions you're working through — so our 30-minute call can start from context instead of scratch."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Consultation intake form"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-5xl space-y-6">
              <Suspense>
                <ConsultationRequestForm
                  successPath="/consultation/confirmation"
                  submitLabel="Submit My Intake"
                />
              </Suspense>
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
