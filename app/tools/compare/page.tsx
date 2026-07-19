import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCompare from '@/components/tools/StrollerCompare';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import ToolsNav from '@/components/tools/ToolsNav';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import { getStrollerCompareCatalog } from '@/lib/server/strollerCompareCatalog';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Stroller Comparison Tool — Compare Strollers Side by Side | Taylor-Made Baby Co.',
  description:
    'Compare up to three strollers head-to-head — weight, fold, price, max child weight, newborn and jogging readiness — with live prices and where to buy.',
  path: '/tools/compare',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Compare strollers side by side',
  keywords: [
    'stroller comparison tool',
    'compare strollers',
    'stroller comparison chart',
    'stroller weight comparison',
    'best stroller comparison',
    'side by side stroller comparison',
  ],
});

const compareSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/tools/compare#app`,
      name: 'Stroller Comparison Tool',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      url: `${SITE_URL}/tools/compare`,
      description:
        'Free side-by-side stroller comparison tool — weigh strollers against each other on weight, fold, price, max child weight, and newborn and jogging readiness.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Taylor-Made Baby Co.' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE_URL}/resources` },
        { '@type': 'ListItem', position: 3, name: 'Stroller Comparison Tool', item: `${SITE_URL}/tools/compare` },
      ],
    },
  ],
};

export default async function StrollerComparePage({
  searchParams,
}: {
  searchParams?: Promise<{ ids?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : {};
  const rawIds = Array.isArray(params.ids) ? params.ids[0] : params.ids;
  const initialIds = (rawIds ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  const catalog = await getStrollerCompareCatalog();

  return (
    <SiteShell currentPath="/tools/compare">
      <main className="site-main">
        <PageViewTracker path="/tools/compare" pageType="other" />

        <ToolsNav current="compare" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }} />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <SectionIntro
            eyebrow="Tool"
            title="Compare Strollers Side by Side"
            description="Line up two or three strollers and see how they stack up on weight, fold, price, and newborn or jogging readiness — then see where to buy each one."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10">
            <StrollerCompare catalog={catalog} initialIds={initialIds} />
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Still torn after comparing? Send Taylor your top two and how you'll actually use a stroller — she'll tell you which one fits your life, not just the spec sheet." />
      </main>
    </SiteShell>
  );
}
