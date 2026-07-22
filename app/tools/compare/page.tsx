import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCompare from '@/components/tools/StrollerCompare';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import CheckIcon from '@/components/ui/CheckIcon';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import { getStrollerCompareCatalog } from '@/lib/server/strollerCompareCatalog';

// No "zero affiliate commission" claim here — this tool carries affiliate buy
// links, so that badge would contradict the disclosure used elsewhere on the site.
const HERO_BADGES = ['Free', 'Instant results', 'No sign-up required'];

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

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }} />

        <MarketingSection tone="ivory" spacing="spacious" reveal={false}>
          <div className="mx-auto max-w-3xl">
            <ToolBreadcrumb current="Compare Strollers" />

            {/* Quick path back to browsing strollers — by brand or by type — for
                shoppers who want to pick different models to compare. */}
            <nav aria-label="Browse strollers" className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8rem]">
              <span className="text-neutral-500">Browse all strollers:</span>
              <Link href="/tools/stroller-finder" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                By brand →
              </Link>
              <Link href="/tools/stroller-finder?view=category" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                By type →
              </Link>
            </nav>

            <p className="mkt-eyebrow mt-6">Free Tool · Instant Results · No Sign-Up</p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] tracking-[-0.03em] text-neutral-900">
              Stroller Comparison Tool: Compare Strollers Side by Side
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-neutral-600">
              Line up two or three strollers and see how they stack up — weight, fold, price, basket, modular, travel-system,
              overhead-bin, newborn and jogging readiness — with live prices and where to buy each one.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.78rem] font-medium text-[var(--color-accent-dark)]">
              {HERO_BADGES.map((badge) => (
                <li key={badge} className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="text-[var(--color-accent-dark)]">
                    <CheckIcon />
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <StrollerCompare catalog={catalog} initialIds={initialIds} />
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Still torn after comparing? Send Taylor your top two and how you'll actually use a stroller — she'll tell you which one fits your life, not just the spec sheet." />
      </main>
    </SiteShell>
  );
}
