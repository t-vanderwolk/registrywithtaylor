import Link from 'next/link';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import SectionDivider from '@/components/ui/SectionDivider';
import { Body, Eyebrow, H1 } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { getPublicStrollerCatalogBrands } from '@/lib/server/publicStrollerCatalog';
import {
  strollerCategories,
  strollerFinderCategoryHref,
  strollerFinderBrandHref,
} from '@/lib/resources/knowBeforeYouBuy';

export const dynamic = 'force-dynamic';
const getFinderBrands = cache(getPublicStrollerCatalogBrands);

type FinderSearchParams = {
  brand?: string | string[];
  category?: string | string[];
  view?: string | string[];
};

async function getFinderSelection(params: FinderSearchParams) {
  const brands = await getFinderBrands();
  if (brands.length === 0) throw new Error('The public stroller catalog is unavailable.');
  const requestedBrand = (Array.isArray(params.brand) ? params.brand[0] : params.brand)?.trim();
  const requestedCategory = (Array.isArray(params.category) ? params.category[0] : params.category)?.trim();
  const brand = requestedBrand
    ? brands.find((entry) => entry.brand.toLowerCase() === canonicalBrand(requestedBrand).toLowerCase())
    : null;
  if (requestedBrand && !brand) notFound();
  const category = !brand && requestedCategory
    ? brands.flatMap((entry) => entry.types).find((type) => type.category === requestedCategory)
    : null;
  if (!brand && requestedCategory && !category) notFound();
  const categoryEntry = category
    ? { slug: category.category, name: strollerCategories.find((entry) => entry.slug === category.category)?.name ?? category.label }
    : null;
  return { brands, brandName: brand?.brand ?? null, categoryEntry, requestedBrand };
}

// Popular brands supplement the crawlable links in the server-rendered catalog.
const POPULAR_FINDER_BRANDS = [
  'UPPAbaby', 'Nuna', 'Bugaboo', 'Cybex', 'Baby Jogger', 'Doona',
  'Silver Cross', 'Mockingbird', 'Thule', 'Stokke', 'Joolz', 'Peg Perego',
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

// Per-filter metadata still gives each ?brand= / ?category= view a useful title and
// description for humans and for link previews, but these filtered states are NOT
// offered to Google as separate indexable pages: they canonicalise to the clean
// /tools/stroller-finder landing page and serve `noindex, follow`.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<FinderSearchParams>;
}) {
  const { brandName, categoryEntry } = await getFinderSelection(await searchParams);

  if (brandName) {
    return buildMarketingMetadata({
      title: `${brandName} Strollers — Compare Models, Prices & Compatibility | Taylor-Made Baby Co.`,
      description: `Every ${brandName} stroller in one place — models by type, live prices, photos, where to buy, and which infant car seats each one fits.`,
      path: '/tools/stroller-finder',
      noindex: true,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brandName} strollers`,
      keywords: [`${brandName} strollers`, `${brandName} stroller comparison`, `${brandName} travel system`],
    });
  }

  if (categoryEntry) {
    return buildMarketingMetadata({
      title: `${categoryEntry.name} Strollers — Browse Models, Prices & Compatibility | Taylor-Made Baby Co.`,
      description: `Browse ${categoryEntry.name.toLowerCase()} strollers by model, price, retailer availability, and travel-system compatibility.`,
      path: '/tools/stroller-finder',
      noindex: true,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${categoryEntry.name} strollers`,
      keywords: [
        `${categoryEntry.name} strollers`,
        `${categoryEntry.name} stroller comparison`,
        `${categoryEntry.name} travel system strollers`,
      ],
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
  searchParams: Promise<FinderSearchParams>;
}) {
  const params = await searchParams;
  const { view } = params;
  const { brands, brandName: initialBrand, categoryEntry, requestedBrand } = await getFinderSelection(params);
  if (requestedBrand && initialBrand && requestedBrand !== initialBrand) {
    permanentRedirect(strollerFinderBrandHref(initialBrand));
  }
  const initialCategory = categoryEntry?.slug ?? null;
  const initialMode = !initialBrand && (Array.isArray(view) ? view[0] : view)?.trim() === 'category' ? 'category' : null;
  const availableCategories = new Set<string>(brands.flatMap((brand) => brand.types.map((type) => type.category)));
  const pageTitle = initialBrand
    ? `${initialBrand} Strollers`
    : categoryEntry
      ? `${categoryEntry.name} Strollers`
      : 'Stroller Finder';
  const pageDescription = initialBrand
    ? `Browse ${initialBrand} strollers by model, type, live prices, photos, and shopping links.`
    : categoryEntry
      ? `Browse ${categoryEntry.name.toLowerCase()} strollers by model, price, retailer availability, and travel-system compatibility.`
      : 'Browse our growing stroller catalog by brand and type — with live Babylist prices, photos, and shopping links.';

  return (
    <SiteShell currentPath="/tools/stroller-finder">
      <main className="site-main">
        <PageViewTracker path="/tools/stroller-finder" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <div className="mx-auto mb-6 max-w-4xl">
            <ToolBreadcrumb current="Stroller Finder" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center">
              <SectionDivider />
            </div>
            <Eyebrow className="mt-3 justify-center">Tool</Eyebrow>
            <H1 className="mx-auto mt-4 max-w-4xl tracking-[0]">{pageTitle}</H1>
            <Body className="mx-auto mt-4 max-w-none text-neutral-600">{pageDescription}</Body>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/tools/compare"
              className="link-underline text-sm font-semibold text-[var(--color-accent-dark)]"
            >
              Torn between a few? Compare strollers side by side →
            </Link>
          </div>

          <div className="mt-10">
            <StrollerCatalogFinder
              key={`${initialBrand ?? ''}:${initialCategory ?? ''}:${initialMode ?? ''}`}
              brands={brands}
              initialCategory={initialCategory}
              initialBrand={initialBrand}
              initialMode={initialMode}
            />
          </div>
        </MarketingSection>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(finderFaqSchema) }} />

        {/* Supporting navigation and FAQs accompany the server-rendered products. */}
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
                {strollerCategories.filter((cat) => availableCategories.has(cat.slug)).map((cat) => (
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
                {POPULAR_FINDER_BRANDS.filter((name) => brands.some((brand) => brand.brand === name)).map((b) => (
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
