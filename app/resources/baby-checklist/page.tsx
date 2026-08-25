import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import { H1, Body } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import BabyChecklist from '@/components/checklist/BabyChecklist';
import { getChecklistProducts } from '@/lib/checklist/getChecklistProducts';
import { getChecklistStructure } from '@/lib/checklist/getChecklistStructure';
import { getChecklistRelatedReading } from '@/lib/checklist/getRelatedReading';
import { getPartnerLogos } from '@/lib/checklist/getPartnerLogos';
import { resolveBlogGoodBuyGearOffers } from '@/lib/server/blogGoodBuyGear';

// ISR: the product picks are admin-editable (DB); regenerate hourly so edits go
// live without a deploy, while the page stays cached/fast.
export const revalidate = 3600;

export const metadata = buildMarketingMetadata({
  title: 'Baby Registry Checklist | Taylor-Made Baby Co.',
  description:
    'Build a practical baby registry checklist with expert guidance from Taylor-Made Baby Co. Choose a girl, boy, gender-neutral, or twins checklist and personalize it as you plan.',
  path: '/resources/baby-checklist',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Taylor-Made Baby Co. baby registry checklist',
  keywords: [
    'baby registry checklist',
    'baby checklist',
    'newborn essentials checklist',
    'twins registry checklist',
    'what to put on baby registry',
  ],
});

/**
 * Statically rendered (no dynamic APIs) for performance. The page server-renders
 * the default (neutral) version as semantic HTML so the content is crawlable;
 * the client component honors a ?type= deep link after hydration. All four
 * versions share the same canonical (`/resources/baby-checklist`), set above, so
 * the near-identical variants never create duplicate-indexing problems.
 */
export default async function BabyChecklistPage() {
  const [products, structure, relatedReading, retailerLogos] = await Promise.all([
    getChecklistProducts(),
    getChecklistStructure(),
    getChecklistRelatedReading(),
    getPartnerLogos(),
  ]);
  // Match each pick against GoodBuy Gear's open-box feed; picks with a match get
  // an "Open Box … at GoodBuy Gear" badge.
  const goodBuyGearOffers = await resolveBlogGoodBuyGearOffers(
    Object.values(products).map((p) => ({ brand: p.brand, productName: p.product })),
  );
  return (
    <SiteShell currentPath="/resources">
      <PageViewTracker path="/resources/baby-checklist" pageType="other" />

      <MarketingSection tone="ivory" spacing="tight" container="default">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow">Free Planning Tool</p>
          <H1 className="mt-3 font-serif">Build Your Baby Registry Checklist</H1>
          <Body className="mt-4 text-neutral-600">
            Start with the essentials. Skip the clutter. Make it yours.
          </Body>
          <Body className="mt-3 text-[0.95rem] text-neutral-500">
            A calm, editorial checklist you can personalize and save — organized by how you actually
            plan, with Taylor&rsquo;s take on what to register for early, what to try first, and what
            can wait. Choose a girl, boy, gender-neutral, or twins version. The core gear is the
            same; only the styling suggestions change.
          </Body>
        </div>
      </MarketingSection>

      <MarketingSection tone="white" spacing="spacious" container="wide">
        <BabyChecklist
          products={products}
          categories={structure.categories}
          items={structure.items}
          relatedReading={relatedReading}
          retailerLogos={retailerLogos}
          goodBuyGearOffers={goodBuyGearOffers}
          linkSelector
        />
      </MarketingSection>
    </SiteShell>
  );
}
