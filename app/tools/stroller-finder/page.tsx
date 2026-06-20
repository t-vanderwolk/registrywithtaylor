import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Stroller Finder — Browse by Brand | Taylor-Made Baby Co.',
  description:
    'Explore strollers by brand and model — see what makes each one stand out, the price range, and where to buy.',
  path: '/tools/stroller-finder',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Stroller finder by brand',
});

export default function StrollerFinderPage() {
  return (
    <SiteShell currentPath="/tools/stroller-finder">
      <main className="site-main">
        <PageViewTracker path="/tools/stroller-finder" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false}>
          <SectionIntro
            eyebrow="Tool"
            title="Stroller Finder"
            description="Every stroller, sorted by brand and then by type — with live Babylist prices, photos, and links."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10">
            <StrollerCatalogFinder />
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
