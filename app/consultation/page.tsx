import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { Body } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book Your Free Consultation - Taylor-Made Baby Co.',
  description:
    'Request your free 45-minute video consultation with Taylor to plan your registry with clarity.',
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
        <Hero image="/assets/hero/hero-06.jpg" imageAlt="Consultation planning form">
          <div className="space-y-6">
            <h1 className="marketing-hero-headline hero-load-reveal">
              Book Your Free 45-Minute Consultation
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-2xl text-neutral-700">
              Submit your request and Taylor will follow up directly to begin your Learn + Plan process.
            </Body>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-2xl space-y-6">
              <ConsultationRequestForm errorCode={params?.error ?? null} />

              <p className="text-center text-sm text-neutral-600">
                Prefer to read the process first? <Link href="/how-it-works" className="link-underline">View How It Works</Link>
              </p>
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
