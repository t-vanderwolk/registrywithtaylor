import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import SectionIntro from '@/components/ui/SectionIntro';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Stroller Finder — Browse by Brand | Taylor-Made Baby Co.',
  description:
    'Explore strollers by brand and model — see what makes each one stand out, the price range, and where to buy.',
  path: '/tools/stroller-finder',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Stroller finder by brand',
});

export default async function StrollerFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = (Array.isArray(category) ? category[0] : category)?.trim() || null;

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
            <StrollerCatalogFinder initialCategory={initialCategory} />
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Torn between two strollers, or not sure a model fits your car and life? Send it to Taylor and get a straight answer — no sales pressure." />
      </main>
    </SiteShell>
  );
}
