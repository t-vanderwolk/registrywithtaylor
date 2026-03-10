import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Consultation Request Received - Taylor-Made Baby Co.',
  description: 'Your consultation request has been received.',
  path: '/consultation/confirmation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Consultation request received',
});

export default function ConsultationConfirmationPage() {
  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <MarketingSection tone="white" spacing="default" container="narrow">
          <MarketingSurface className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="marketing-hero-headline">
              Request Received
            </h1>
            <p className="text-lg leading-relaxed text-neutral-700">
              Your consultation request has been received. Taylor will respond shortly.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/how-it-works" className="btn btn--secondary">
                Back to How It Works
              </Link>
              <Link href="/" className="btn btn--primary">
                Return Home
              </Link>
            </div>
          </MarketingSurface>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
