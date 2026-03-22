import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Travel System Compatibility | Taylor-Made Baby Co.',
  description:
    'Select your stroller to see which infant car seats are compatible and what adapters you may need.',
  path: '/tools/travel-system',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Travel system compatibility tool',
});

export default async function TravelSystemCompatibilityPage() {
  const [strollers, carSeats] = await Promise.all([
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);

  return (
    <SiteShell currentPath="/tools/travel-system">
      <main className="site-main">
        <PageViewTracker path="/tools/travel-system" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false}>
          <SectionIntro
            eyebrow="Tool"
            title="Travel System Compatibility"
            description="Start with your stroller or your infant car seat to see what works together — and where adapters start to matter."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10">
            <TravelSystemGenerator strollers={strollers} carSeats={carSeats} />
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
