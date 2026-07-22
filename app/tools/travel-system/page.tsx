import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import SectionIntro from '@/components/ui/SectionIntro';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

export const dynamic = 'force-dynamic';

// Per-brand metadata so a ?carSeatBrand= (or ?strollerBrand=) view is a distinct,
// indexable page with its own title + self-referencing canonical — the same
// pattern as the Stroller Finder's brand pages.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ carSeatBrand?: string | string[]; strollerBrand?: string | string[] }>;
}) {
  const { carSeatBrand, strollerBrand } = await searchParams;
  const carSeat = (Array.isArray(carSeatBrand) ? carSeatBrand[0] : carSeatBrand)?.trim();
  const stroller = (Array.isArray(strollerBrand) ? strollerBrand[0] : strollerBrand)?.trim();

  if (carSeat) {
    const brand = canonicalBrand(carSeat);
    return buildMarketingMetadata({
      title: `${brand} Car Seat Compatibility — Which Strollers Fit | Taylor-Made Baby Co.`,
      description: `See every stroller that works with ${brand} infant car seats — direct-fit and adapter-required — with live prices and where to buy.`,
      path: `/tools/travel-system?carSeatBrand=${encodeURIComponent(brand)}`,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brand} car seat compatibility`,
      keywords: [`${brand} car seat compatibility`, `${brand} compatible strollers`, `${brand} travel system`],
    });
  }

  if (stroller) {
    const brand = canonicalBrand(stroller);
    return buildMarketingMetadata({
      title: `${brand} Stroller Compatibility — Which Car Seats Fit | Taylor-Made Baby Co.`,
      description: `See every infant car seat that works with ${brand} strollers — direct-fit and adapter-required — with live prices and where to buy.`,
      path: `/tools/travel-system?strollerBrand=${encodeURIComponent(brand)}`,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brand} stroller compatibility`,
      keywords: [`${brand} stroller compatibility`, `${brand} compatible car seats`, `${brand} travel system`],
    });
  }

  return buildMarketingMetadata({
    title: 'Travel System Compatibility | Taylor-Made Baby Co.',
    description:
      'Select your stroller to see which infant car seats are compatible and what adapters you may need.',
    path: '/tools/travel-system',
    imagePath: '/assets/hero/hero-03.jpg',
    imageAlt: 'Travel system compatibility tool',
  });
}

export default async function TravelSystemCompatibilityPage() {
  const [strollers, carSeats] = await Promise.all([
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);

  return (
    <SiteShell currentPath="/tools/travel-system">
      <main className="site-main">
        <PageViewTracker path="/tools/travel-system" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <div className="mx-auto mb-6 max-w-4xl">
            <ToolBreadcrumb current="Travel System Checker" />
          </div>
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

        <ToolContactPrompt prompt="Still unsure whether your car seat truly fits your stroller — or which adapter you actually need? Message Taylor and she'll confirm the real-world fit for your setup." />
      </main>
    </SiteShell>
  );
}
