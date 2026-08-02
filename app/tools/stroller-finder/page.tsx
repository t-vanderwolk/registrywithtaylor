import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import SectionIntro from '@/components/ui/SectionIntro';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import {
  strollerCategories,
  strollerFinderCategoryHref,
  strollerFinderBrandHref,
} from '@/lib/resources/knowBeforeYouBuy';

// Popular brands surfaced as indexable ?brand= links so the base Finder page has
// real crawlable content and internal links (the catalog itself loads client-side).
const POPULAR_FINDER_BRANDS = [
  'UPPAbaby', 'Nuna', 'Bugaboo', 'Cybex', 'Baby Jogger', 'Doona',
  'Silver Cross', 'Mockingbird', 'Thule', 'Babyzen', 'Joolz', 'Peg Perego',
];

const FINDER_FAQS = [
  {
    q: 'How does the Stroller Finder work?',
    a: 'Browse our growing stroller catalog by brand or by type. Each stroller shows a photo, a short summary, live retailer prices where available, and links to where you can buy it. Pick a type or brand to narrow things down, then open the compare tool to line up two or three side by side.',
  },
  {
    q: 'Is the Stroller Finder free?',
    a: 'Yes. The Stroller Finder is completely free with no sign-up required. If you want a recommendation tailored to your home, vehicle, and budget, you can book a 1-hour Registry Consult with Taylor for $75.',
  },
  {
    q: 'Are the prices and links up to date?',
    a: 'Prices are pulled from retailer data and refreshed regularly, but they can change at any time. Always confirm the current price and availability on the retailer’s page before purchasing.',
  },
  {
    q: 'Which stroller brands are included?',
    a: 'The catalog covers major brands including UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, Doona, Silver Cross, Mockingbird, Thule, Babyzen, Joolz, and Peg Perego, and it keeps growing.',
  },
];

const finderFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/tools/stroller-finder#faq`,
  mainEntity: FINDER_FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

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
  searchParams: Promise<{ category?: string | string[]; brand?: string | string[]; view?: string | string[] }>;
}) {
  const { category, brand, view } = await searchParams;
  const initialCategory = (Array.isArray(category) ? category[0] : category)?.trim() || null;
  const initialBrand = (Array.isArray(brand) ? brand[0] : brand)?.trim() || null;
  const initialMode = (Array.isArray(view) ? view[0] : view)?.trim() === 'category' ? 'category' : null;

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
            description="Browse our growing stroller catalog by brand and type — with live Babylist prices, photos, and shopping links."
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
            <StrollerCatalogFinder initialCategory={initialCategory} initialBrand={initialBrand} initialMode={initialMode} />
          </div>
        </MarketingSection>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(finderFaqSchema) }} />

        {/* Server-rendered SEO content: browse-by-type, popular brands, how-to, FAQ.
            The catalog above is client-rendered, so this gives crawlers real content
            and internal links to the indexable category/brand landing pages. */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-[1.6rem] tracking-[-0.02em] text-neutral-900">
                How to use the Stroller Finder
              </h2>
              <p className="text-[0.98rem] leading-8 text-neutral-700">
                Start with a stroller type or a brand. Each result shows a photo, a short summary of what makes
                the stroller stand out, live retailer prices where available, and links to where you can buy it.
                Once you have a shortlist, open the{' '}
                <Link href="/tools/compare" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                  stroller comparison tool
                </Link>{' '}
                to line up two or three side by side, or the{' '}
                <Link href="/tools/travel-system" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                  travel system checker
                </Link>{' '}
                to see which infant car seats fit. Not sure where to begin? The{' '}
                <Link href="/tools/stroller-quiz" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                  stroller quiz
                </Link>{' '}
                narrows it to a type in about a minute.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-[1.6rem] tracking-[-0.02em] text-neutral-900">Browse strollers by type</h2>
              <div className="flex flex-wrap gap-2.5">
                {strollerCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={strollerFinderCategoryHref(cat.slug)}
                    className="rounded-full border border-[rgba(215,161,175,0.35)] bg-white px-4 py-2 text-[0.85rem] font-medium text-neutral-700 transition hover:border-[var(--color-cta-pink)] hover:text-[var(--color-accent-dark)]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-[1.6rem] tracking-[-0.02em] text-neutral-900">Popular stroller brands</h2>
              <div className="flex flex-wrap gap-2.5">
                {POPULAR_FINDER_BRANDS.map((b) => (
                  <Link
                    key={b}
                    href={strollerFinderBrandHref(b)}
                    className="rounded-full border border-[rgba(215,161,175,0.35)] bg-white px-4 py-2 text-[0.85rem] font-medium text-neutral-700 transition hover:border-[var(--color-cta-pink)] hover:text-[var(--color-accent-dark)]"
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="font-serif text-[1.6rem] tracking-[-0.02em] text-neutral-900">
                Stroller Finder — frequently asked questions
              </h2>
              <dl className="space-y-5">
                {FINDER_FAQS.map((f) => (
                  <div key={f.q}>
                    <dt className="font-serif text-[1.15rem] leading-snug text-neutral-900">{f.q}</dt>
                    <dd className="mt-2 text-[0.95rem] leading-8 text-neutral-700">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Torn between two strollers, or not sure a model fits your car and life? Send it to Taylor and get a straight answer — no sales pressure." />
      </main>
    </SiteShell>
  );
}
