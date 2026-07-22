import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import SectionIntro from '@/components/ui/SectionIntro';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

// Per-brand metadata so each ?brand= view is a distinct, indexable page with its
// own title + self-referencing canonical, instead of all collapsing onto the base
// finder. Category views keep the base metadata (they carry their own canonical
// via the category deep-links).
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string | string[] }>;
}) {
  const { brand } = await searchParams;
  const brandName = (Array.isArray(brand) ? brand[0] : brand)?.trim() || null;

  if (brandName) {
    return buildMarketingMetadata({
      title: `${brandName} Strollers — Compare Models, Prices & Compatibility | Taylor-Made Baby Co.`,
      description: `Every ${brandName} stroller in one place — models by type, live prices, photos, where to buy, and which infant car seats each one fits.`,
      path: `/tools/stroller-finder?brand=${encodeURIComponent(brandName)}`,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brandName} strollers`,
      keywords: [`${brandName} strollers`, `${brandName} stroller comparison`, `${brandName} travel system`],
    });
  }

  return buildMarketingMetadata({
    title: 'Stroller Finder — Browse by Brand | Taylor-Made Baby Co.',
    description:
      'Explore strollers by brand and model — see what makes each one stand out, the price range, and where to buy.',
    path: '/tools/stroller-finder',
    imagePath: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller finder by brand',
  });
}

export default async function StrollerFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; brand?: string | string[] }>;
}) {
  const { category, brand } = await searchParams;
  const initialCategory = (Array.isArray(category) ? category[0] : category)?.trim() || null;
  const initialBrand = (Array.isArray(brand) ? brand[0] : brand)?.trim() || null;

  return (
    <SiteShell currentPath="/tools/stroller-finder">
      <main className="site-main">
        <PageViewTracker path="/tools/stroller-finder" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <div className="mx-auto mb-6 max-w-4xl">
            <ToolBreadcrumb current="Stroller Finder" />
          </div>
          <SectionIntro
            eyebrow="Tool"
            title="Stroller Finder"
            description="Every stroller, sorted by brand and then by type — with live Babylist prices, photos, and links."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-4 text-center">
            <Link
              href="/tools/compare"
              className="link-underline text-sm font-semibold text-[var(--color-accent-dark)]"
            >
              Torn between a few? Compare strollers side by side →
            </Link>
          </div>

          <div className="mt-10">
            <StrollerCatalogFinder initialCategory={initialCategory} initialBrand={initialBrand} />
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Torn between two strollers, or not sure a model fits your car and life? Send it to Taylor and get a straight answer — no sales pressure." />
      </main>
    </SiteShell>
  );
}
