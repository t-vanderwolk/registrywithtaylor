import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import { H1, H2, H3, Body } from '@/components/ui/MarketingHeading';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import BabyChecklist from '@/components/checklist/BabyChecklist';
import { getChecklistProducts } from '@/lib/checklist/getChecklistProducts';
import { getChecklistRelatedReading } from '@/lib/checklist/getRelatedReading';
import { getPartnerLogos } from '@/lib/checklist/getPartnerLogos';
import { resolveBlogGoodBuyGearOffers } from '@/lib/server/blogGoodBuyGear';
import {
  VARIANTS,
  VARIANT_SLUGS,
  TWINS_QUANTITY_GUIDANCE,
  isVariantSlug,
} from '@/lib/checklist/variants';
import { buildVariantStructuredData } from '@/lib/checklist/variantStructuredData';

// ISR: product picks are admin-editable (DB); regenerate hourly.
export const revalidate = 3600;
// Only girl/boy/twins are valid paths — anything else 404s.
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
    path: `/resources/baby-checklist/${variant}`,
    imagePath: '/assets/hero/hero-05.jpg',
    imageAlt: meta.imageAlt,
    keywords: meta.keywords,
  });
}

/**
 * Server-renders the variant's H1, intro, twins-specific guidance, and a visible
 * FAQ (mirrored as FAQPage schema), plus a self BreadcrumbList — so each variant
 * is independently indexable and rich-result eligible.
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
  const goodBuyGearOffers = await resolveBlogGoodBuyGearOffers(
    Object.values(products).map((p) => ({ brand: p.brand, productName: p.product })),
  );

  return (
    <SiteShell currentPath="/resources">
      <PageViewTracker path={`/resources/baby-checklist/${variant}`} pageType="other" />

      {/* WebPage + BreadcrumbList + FAQPage schema for this variant. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVariantStructuredData(variant)) }}
      />

      <MarketingSection tone="ivory" spacing="tight" container="default">
        <div className="mx-auto mb-5 max-w-2xl">
          <ToolBreadcrumb current={meta.breadcrumbLabel} />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow">{meta.eyebrow}</p>
          <H1 className="mt-3 font-serif">{meta.h1}</H1>
          <Body className="mt-4 text-neutral-600">{meta.tagline}</Body>
          <Body className="mt-3 text-[0.95rem] text-neutral-500">{meta.intro}</Body>
        </div>
      </MarketingSection>

      {/* Twins-only: genuinely unique quantity guidance (what doubles vs. shared). */}
      {variant === 'twins' && (
        <MarketingSection tone="white" spacing="tight" container="default">
          <div className="mx-auto max-w-4xl">
            <H2 className="text-center font-serif">{TWINS_QUANTITY_GUIDANCE.heading}</H2>
            <Body className="mx-auto mt-3 max-w-2xl text-center text-neutral-600">
              {TWINS_QUANTITY_GUIDANCE.intro}
            </Body>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {TWINS_QUANTITY_GUIDANCE.columns.map((col) => (
                <div
                  key={col.title}
                  className="rounded-2xl border border-[var(--ck-border,#e7d7d8)] bg-white p-5 shadow-[0_1px_2px_rgba(74,70,71,0.04)]"
                >
                  <H3 className="text-[1.05rem]">{col.title}</H3>
                  <p className="mt-1 text-[0.8rem] uppercase tracking-[0.12em] text-neutral-400">
                    {col.note}
                  </p>
                  <ul className="mt-3 space-y-2 text-[0.95rem] leading-6 text-neutral-700">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden className="text-[var(--color-accent-dark,#c98791)]">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </MarketingSection>
      )}

      <MarketingSection tone="white" spacing="spacious" container="wide">
        <BabyChecklist
          initialType={meta.type}
          products={products}
          relatedReading={relatedReading}
          retailerLogos={retailerLogos}
          goodBuyGearOffers={goodBuyGearOffers}
          linkSelector
        />
      </MarketingSection>

      {/* Visible FAQ — mirrors the FAQPage schema above (required for it to be valid). */}
      <MarketingSection tone="ivory" spacing="spacious" container="default">
        <div className="mx-auto max-w-3xl">
          <H2 className="text-center font-serif">Frequently Asked Questions</H2>
          <div className="mt-8 space-y-3">
            {meta.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-[var(--ck-border,#e7d7d8)] bg-white px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-serif text-[1.05rem] text-neutral-900 marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 text-[0.95rem] leading-7 text-neutral-700">{f.a}</p>
              </details>
            ))}
          </div>

          {/* Internal cross-links between the versions for link equity + discovery. */}
          <p className="mt-10 text-center text-[0.95rem] text-neutral-600">
            Also available:{' '}
            <Link href="/resources/baby-checklist/girl" className="link-underline">
              baby girl
            </Link>
            ,{' '}
            <Link href="/resources/baby-checklist/boy" className="link-underline">
              baby boy
            </Link>
            ,{' '}
            <Link href="/resources/baby-checklist/twins" className="link-underline">
              twins
            </Link>
            , and the{' '}
            <Link href="/resources/baby-checklist" className="link-underline">
              gender-neutral
            </Link>{' '}
            registry checklists.
          </p>
        </div>
      </MarketingSection>
    </SiteShell>
  );
}
