import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import { H1, Body } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import BabyChecklist from '@/components/checklist/BabyChecklist';
import { getChecklistProducts } from '@/lib/checklist/getChecklistProducts';
import { getChecklistRelatedReading } from '@/lib/checklist/getRelatedReading';
import { getPartnerLogos } from '@/lib/checklist/getPartnerLogos';
import { VARIANTS, VARIANT_SLUGS, isVariantSlug } from '@/lib/checklist/variants';

// ISR: product picks are admin-editable (DB); regenerate hourly.
export const revalidate = 3600;
// Only girl/boy/twins are valid paths — anything else 404s (no duplicate-content
// risk from arbitrary ?type-style params becoming pages).
export const dynamicParams = false;

type VariantParams = { params: Promise<{ variant: string }> };

export function generateStaticParams() {
  return VARIANT_SLUGS.map((variant) => ({ variant }));
}

export async function generateMetadata({ params }: VariantParams): Promise<Metadata> {
  const { variant } = await params;
  if (!isVariantSlug(variant)) return {};
  const meta = VARIANTS[variant];
  return buildMarketingMetadata({
    title: meta.title,
    description: meta.description,
    // Self-referencing canonical (buildMarketingMetadata derives it from path).
    path: `/resources/baby-checklist/${variant}`,
    imagePath: '/assets/hero/hero-05.jpg',
    imageAlt: meta.imageAlt,
    keywords: meta.keywords,
  });
}

/**
 * Server-renders the variant's H1, intro, and the checklist seeded to the right
 * version (initialType). Because the H1/meta/canonical are all set here per
 * path, each variant is independently indexable — the fix the SEO strategy calls
 * out as CRITICAL (the old ?type= page canonicalized everything back to neutral).
 */
export default async function BabyChecklistVariantPage({ params }: VariantParams) {
  const { variant } = await params;
  if (!isVariantSlug(variant)) notFound();
  const meta = VARIANTS[variant];

  const [products, relatedReading, retailerLogos] = await Promise.all([
    getChecklistProducts(),
    getChecklistRelatedReading(),
    getPartnerLogos(),
  ]);

  return (
    <SiteShell currentPath="/resources">
      <PageViewTracker path={`/resources/baby-checklist/${variant}`} pageType="other" />

      <MarketingSection tone="ivory" spacing="tight" container="default">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow">{meta.eyebrow}</p>
          <H1 className="mt-3 font-serif">{meta.h1}</H1>
          <Body className="mt-4 text-neutral-600">{meta.tagline}</Body>
          <Body className="mt-3 text-[0.95rem] text-neutral-500">{meta.intro}</Body>
        </div>
      </MarketingSection>

      <MarketingSection tone="white" spacing="spacious" container="wide">
        <BabyChecklist
          initialType={meta.type}
          products={products}
          relatedReading={relatedReading}
          retailerLogos={retailerLogos}
          linkSelector
        />
      </MarketingSection>
    </SiteShell>
  );
}
