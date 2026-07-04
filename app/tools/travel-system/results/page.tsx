import type { Metadata } from 'next';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import SectionIntro from '@/components/ui/SectionIntro';
import StrollerProfilePanel from '@/components/tools/StrollerProfilePanel';
import ToolAffiliateLink from '@/components/tools/ToolAffiliateLink';
import { getStrollerRealSpecs } from '@/lib/server/strollerSpecLookup';
import {
  formatCompatibilityConfidence,
  formatCompatibilityType,
  type CompatibleCarSeatResult,
  type CompatibleStrollerResult,
  type CompatibilityType,
  type TravelSystemCarSeatOption,
  type TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { resolveCompatibilityCarSeatImage, resolveProductCardImage } from '@/lib/blog/productCardImages';
import {
  getTravelSystemCarSeats,
  getTravelSystemCompatibility,
  getTravelSystemCompatibilityByCarSeat,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';
import { babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';
import { findTravelSystemOptionBySlug } from '@/lib/travelSystemRouting';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type SelectionState =
  | { status: 'missing' }
  | { status: 'conflict' }
  | { status: 'invalid'; kind: 'stroller' | 'carSeat' }
  | {
      status: 'stroller';
      result: Awaited<ReturnType<typeof getTravelSystemCompatibility>> & {};
    }
  | {
      status: 'carSeat';
      result: Awaited<ReturnType<typeof getTravelSystemCompatibilityByCarSeat>> & {};
    };

const TYPE_ORDER: Array<{
  id: 'direct' | 'adapter' | 'other';
  title: string;
  description: string;
}> = [
  {
    id: 'direct',
    title: 'Direct Fit',
    description: 'These are the cleanest pairings in the current compatibility library.',
  },
  {
    id: 'adapter',
    title: 'Adapter Required',
    description: 'These work with an adapter. The adapter details shown are the existing stored details.',
  },
  {
    id: 'other',
    title: 'Limited Fit',
    description: 'These pairings have a compatibility note worth reading before you buy.',
  },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0]?.trim() ?? '' : value?.trim() ?? '';
}

function compatibilityBadgeClasses(type: CompatibilityType) {
  switch (type) {
    case 'DIRECT':
      return 'tool-badge--direct';
    case 'ADAPTER':
      return 'tool-badge--adapter';
    case 'LIMITED':
      return 'tool-badge--limited';
    case 'LOCKED':
      return 'tool-badge--locked';
    case 'INCOMPATIBLE':
    default:
      return 'tool-badge--incompatible';
  }
}

function resultBucket(item: { compatibilityType: CompatibilityType; adapterRequired: boolean }) {
  if (item.compatibilityType === 'DIRECT' && !item.adapterRequired) return 'direct';
  if (item.adapterRequired || item.compatibilityType === 'ADAPTER') return 'adapter';
  return 'other';
}

function groupByBrand<T extends { brand: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    if (!groups[item.brand]) groups[item.brand] = [];
    groups[item.brand].push(item);
    return groups;
  }, {});
}

function displayNameWithoutBrand(displayName: string, brand: string) {
  const normalizedBrand = brand.trim();
  if (!normalizedBrand) return displayName;
  const escapedBrand = normalizedBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const brandPrefix = new RegExp(`^(?:${escapedBrand}\\s+)+`, 'i');
  return displayName.replace(brandPrefix, '').trim() || displayName;
}

function countMatches<T extends { compatibilityType: CompatibilityType; adapterRequired: boolean }>(items: T[]) {
  return {
    total: items.length,
    direct: items.filter((item) => resultBucket(item) === 'direct').length,
    adapter: items.filter((item) => resultBucket(item) === 'adapter').length,
  };
}

async function loadSelection(searchParams?: SearchParams): Promise<SelectionState> {
  const params = searchParams ? await searchParams : {};
  const strollerSlug = firstParam(params.stroller);
  const carSeatSlug = firstParam(params.carSeat);

  if (!strollerSlug && !carSeatSlug) return { status: 'missing' };
  if (strollerSlug && carSeatSlug) return { status: 'conflict' };

  if (strollerSlug) {
    const strollers = await getTravelSystemStrollers();
    const stroller = findTravelSystemOptionBySlug(strollers, strollerSlug);
    if (!stroller) return { status: 'invalid', kind: 'stroller' };

    const result = await getTravelSystemCompatibility(stroller.brand, stroller.model);
    if (!result) return { status: 'invalid', kind: 'stroller' };

    return { status: 'stroller', result };
  }

  const carSeats = await getTravelSystemCarSeats();
  const carSeat = findTravelSystemOptionBySlug(carSeats, carSeatSlug);
  if (!carSeat) return { status: 'invalid', kind: 'carSeat' };

  const result = await getTravelSystemCompatibilityByCarSeat(carSeat.brand, carSeat.model);
  if (!result) return { status: 'invalid', kind: 'carSeat' };

  return { status: 'carSeat', result };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const selection = await loadSelection(searchParams);

  if (selection.status === 'stroller') {
    return buildMarketingMetadata({
      title: `Compatible Infant Car Seats for ${selection.result.stroller.displayName} | Taylor-Made Baby Co.`,
      description: `See direct-fit and adapter-required infant car seats for ${selection.result.stroller.displayName}.`,
      path: '/tools/travel-system/results',
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: 'Travel system compatibility results',
    });
  }

  if (selection.status === 'carSeat') {
    return buildMarketingMetadata({
      title: `Compatible Strollers for ${selection.result.carSeat.displayName} | Taylor-Made Baby Co.`,
      description: `See direct-fit and adapter-required strollers for ${selection.result.carSeat.displayName}.`,
      path: '/tools/travel-system/results',
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: 'Travel system compatibility results',
    });
  }

  return {
    ...buildMarketingMetadata({
      title: 'Travel System Results | Taylor-Made Baby Co.',
      description: 'Choose a stroller or infant car seat to see travel-system compatibility results.',
      path: '/tools/travel-system/results',
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: 'Travel system compatibility results',
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

function BabylistHeartIcon() {
  return (
    <svg width="15" height="13" viewBox="0 0 16 14" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 13S1 8.5 1 4.5A3.5 3.5 0 0 1 7.75 2.9 3.5 3.5 0 0 1 15 4.5C15 8.5 8 13 8 13Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SiteShell currentPath="/tools/travel-system">
      <main className="site-main">
        <PageViewTracker path="/tools/travel-system/results" pageType="other" />
        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <div className="mx-auto max-w-3xl rounded-[1.6rem] border border-[rgba(215,161,175,0.22)] bg-white/94 px-6 py-10 text-center shadow-[0_18px_42px_rgba(72,49,56,0.08)]">
            <p className="tool-eyebrow">Travel system results</p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] tracking-[-0.03em] text-neutral-900">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600">{description}</p>
            <Link href="/tools/travel-system" className="tool-btn tool-btn--primary mt-7 px-5 py-3">
              Back to Travel System Tool
            </Link>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}

function SelectedSummaryCard({
  kind,
  option,
  total,
  direct,
  adapter,
  hideSummary = false,
}: {
  kind: 'stroller' | 'carSeat';
  option: TravelSystemStrollerOption | TravelSystemCarSeatOption;
  total: number;
  direct: number;
  adapter: number;
  /** When the "About this stroller" panel owns the description, skip it here. */
  hideSummary?: boolean;
}) {
  const resolvedImage =
    kind === 'stroller'
      ? resolveProductCardImage({ brand: option.brand, productName: option.displayName })
      : resolveCompatibilityCarSeatImage({ brand: option.brand, productName: option.displayName });
  const imageSrc = option.babylistImage ?? option.macroBabyImage ?? resolvedImage?.src ?? null;
  const imageAlt = option.babylistImage || option.macroBabyImage ? option.displayName : resolvedImage?.alt;
  const displayTitle = displayNameWithoutBrand(option.displayName, option.brand);

  return (
    <section className="grid gap-5 rounded-[1.8rem] border border-[rgba(215,161,175,0.22)] bg-white/95 p-5 shadow-[0_18px_42px_rgba(72,49,56,0.08)] md:grid-cols-[12rem_1fr] md:p-6">
      <div className="tool-product-card__media min-h-[11rem] rounded-[1.2rem] border border-[rgba(215,161,175,0.14)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={imageAlt ?? option.displayName} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{option.brand}</span>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="tool-product-card__brand">{option.brand}</p>
        <h2 className="mt-2 font-serif text-[clamp(1.75rem,4vw,2.6rem)] leading-[1.02] tracking-[-0.03em] text-neutral-900">
          {displayTitle}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="tool-chip">{kind === 'stroller' ? 'Stroller' : 'Infant car seat'}</span>
          <span className="tool-chip">{total} match{total === 1 ? '' : 'es'}</span>
          <span className="tool-chip">{direct} direct</span>
          <span className="tool-chip">{adapter} adapter</span>
          {kind === 'carSeat' && (option as TravelSystemCarSeatOption).travelSystemOnly ? (
            <span className="tool-chip bg-[rgba(216,137,160,0.14)] text-[var(--color-accent-dark)]">Travel system only</span>
          ) : null}
        </div>
        {!hideSummary && option.summary ? (
          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">{option.summary}</p>
        ) : null}
      </div>
    </section>
  );
}

function AdapterCallout({
  item,
}: {
  item: Pick<
    CompatibleCarSeatResult | CompatibleStrollerResult,
    'adapterImage' | 'adapterPrice' | 'adapterRequired' | 'adapterType' | 'adapterUrl'
  >;
}) {
  if (!item.adapterRequired) {
    return (
      <p className="text-[0.72rem] font-semibold text-[rgba(58,99,72,0.92)]">
        Direct fit, no adapter needed
      </p>
    );
  }

  return (
    <div className="tool-adapter-callout">
      <div className="tool-adapter-callout__details">
        {item.adapterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.adapterImage} alt="" className="tool-adapter-callout__image" />
        ) : null}
        <div className="min-w-0">
          <p className="tool-adapter-callout__eyebrow">Adapter needed</p>
          <p className="tool-adapter-callout__name">
            {item.adapterType ?? 'Car seat adapter'}
          </p>
          {item.adapterPrice != null ? (
            <p className="tool-adapter-callout__price">${item.adapterPrice.toFixed(2)}</p>
          ) : null}
        </div>
      </div>

      {item.adapterUrl ? (
        <ToolAffiliateLink
          tool="travel-system-checker"
          href={item.adapterUrl}
          product={item.adapterType ?? 'Car seat adapter'}
          retailer="adapter"
          className="tool-adapter-callout__link"
          ariaLabel={`Shop adapter: ${item.adapterType ?? 'car seat adapter'}`}
        >
          Shop adapter
        </ToolAffiliateLink>
      ) : (
        <span className="tool-adapter-callout__missing">Adapter link unavailable</span>
      )}
    </div>
  );
}

function ResultCard({
  item,
  productKind,
}: {
  item: CompatibleCarSeatResult | CompatibleStrollerResult;
  productKind: 'stroller' | 'carSeat';
}) {
  const babylistUrl =
    item.babylistUrl || item.babylistPrice != null
      ? babylistAffiliateUrl(item.brand, item.model, productKind, item.babylistUrl)
      : null;
  const macroBabyUrl = item.macroBabyUrl ?? null;
  const primaryCta = babylistUrl
    ? { label: 'Babylist', url: babylistUrl, source: 'babylist' as const }
    : macroBabyUrl
      ? { label: 'MacroBaby', url: macroBabyUrl, source: 'macrobaby' as const }
      : null;
  const amazonUrl = primaryCta ? item.amazonUrl ?? null : null;
  const displayPrice = item.babylistPrice ?? item.macroBabyPrice ?? null;
  const priceSource = item.babylistPrice != null ? 'Babylist' : item.macroBabyPrice != null ? 'MacroBaby' : null;
  const displayTitle = displayNameWithoutBrand(item.displayName, item.brand);

  return (
    <article className="tool-card tool-product-card">
      <div className="tool-card__media tool-product-card__media tool-product-card__media--result">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.imageAlt ?? item.displayName} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{item.brand}</span>
        )}
      </div>
      <div className="tool-product-card__body">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="tool-product-card__brand">{item.brand}</p>
            <h4 className="tool-product-card__title">{displayTitle}</h4>
            {displayPrice != null ? (
              <p className="tool-product-card__price">
                ${displayPrice.toFixed(2)}
                {priceSource ? <span>via {priceSource}</span> : null}
              </p>
            ) : null}
          </div>
          <span className={`tool-badge shrink-0 ${compatibilityBadgeClasses(item.compatibilityType)}`}>
            {formatCompatibilityType(item.compatibilityType)}
          </span>
        </div>

        <AdapterCallout item={item} />

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">
            {formatCompatibilityConfidence(item.confidence)} confidence
          </span>
          {productKind === 'carSeat' && (item as CompatibleCarSeatResult).travelSystemOnly ? (
            <span className="ml-auto rounded-full bg-[rgba(216,137,160,0.14)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-dark)]">
              Travel system only
            </span>
          ) : null}
          {primaryCta ? (
            <ToolAffiliateLink
              tool="travel-system-checker"
              href={primaryCta.url}
              product={`${item.brand} ${displayTitle}`.trim()}
              retailer={primaryCta.source}
              brand={item.brand}
              className="tool-btn tool-btn--primary ml-auto min-h-0 px-3 py-2 text-[0.68rem]"
            >
              {primaryCta.source === 'babylist' ? <BabylistHeartIcon /> : null}
              {primaryCta.label}
            </ToolAffiliateLink>
          ) : null}
          {amazonUrl ? (
            <ToolAffiliateLink
              tool="travel-system-checker"
              href={amazonUrl}
              product={`${item.brand} ${displayTitle}`.trim()}
              retailer="amazon"
              brand={item.brand}
              className="tool-btn tool-btn--secondary min-h-0 px-3 py-2 text-[0.68rem]"
            >
              Amazon
            </ToolAffiliateLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ResultsSection<T extends CompatibleCarSeatResult | CompatibleStrollerResult>({
  items,
  productKind,
  brandLabel,
}: {
  items: T[];
  productKind: 'stroller' | 'carSeat';
  brandLabel: string;
}) {
  return (
    <div className="space-y-6">
      {TYPE_ORDER.map((section) => {
        const sectionItems = items.filter((item) => resultBucket(item) === section.id);
        if (sectionItems.length === 0) return null;

        const brandGroups = groupByBrand(sectionItems);

        return (
          <section
            key={section.id}
            className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-4">
              <div>
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                  {sectionItems.length} option{sectionItems.length === 1 ? '' : 's'}
                </p>
                <h3 className="mt-1 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {section.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">{section.description}</p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {Object.entries(brandGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([brand, brandItems]) => (
                  <div key={brand}>
                    <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      {brandLabel}: {brand}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {brandItems.map((item) => (
                        <ResultCard
                          key={`${item.brand}-${item.model}-${item.compatibilityType}`}
                          item={item}
                          productKind={productKind}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default async function TravelSystemResultsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const selection = await loadSelection(searchParams);

  if (selection.status === 'missing') {
    return (
      <EmptyState
        title="Choose a stroller or infant car seat first."
        description="Start from the Travel System Tool so we can check the right side of the pairing."
      />
    );
  }

  if (selection.status === 'conflict') {
    return (
      <EmptyState
        title="Choose one starting point."
        description="Use either a stroller or an infant car seat in the results URL, not both."
      />
    );
  }

  if (selection.status === 'invalid') {
    return (
      <EmptyState
        title={selection.kind === 'stroller' ? 'We could not find that stroller.' : 'We could not find that infant car seat.'}
        description="The compatibility library may use a slightly different model name. Head back to the selector and choose it from the list."
      />
    );
  }

  const isStrollerFirst = selection.status === 'stroller';
  const selected = isStrollerFirst ? selection.result.stroller : selection.result.carSeat;
  const results = isStrollerFirst ? selection.result.compatibleCarSeats : selection.result.compatibleStrollers;
  const counts = countMatches(results);
  const resultNoun = isStrollerFirst ? 'compatible infant car seats' : 'compatible strollers';
  const directLine = `${counts.direct} work${counts.direct === 1 ? 's' : ''} directly.`;
  const adapterLine = `${counts.adapter} require${counts.adapter === 1 ? 's' : ''} an adapter.`;

  // Real, feed-backed specs for the selected stroller (weight, seat limit, fold).
  const strollerRealSpecs = isStrollerFirst
    ? await getStrollerRealSpecs(selected.brand, selected.model)
    : null;

  return (
    <SiteShell currentPath="/tools/travel-system">
      <main className="site-main">
        <PageViewTracker path="/tools/travel-system/results" pageType="other" />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <SectionIntro
            eyebrow="Travel System Results"
            title="Your Travel System Results"
            description={`We found ${counts.total} ${resultNoun} for ${selected.displayName}. ${directLine} ${adapterLine}`}
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 space-y-8">
            <SelectedSummaryCard
              kind={isStrollerFirst ? 'stroller' : 'carSeat'}
              option={selected}
              total={counts.total}
              direct={counts.direct}
              adapter={counts.adapter}
              hideSummary={isStrollerFirst}
            />

            {isStrollerFirst ? (
              <StrollerProfilePanel
                brand={selected.brand}
                model={selected.model}
                fallbackSummary={selected.summary}
                realSpecs={strollerRealSpecs}
              />
            ) : null}

            {results.length > 0 ? (
              <ResultsSection
                items={results}
                productKind={isStrollerFirst ? 'carSeat' : 'stroller'}
                brandLabel={isStrollerFirst ? 'Brand' : 'Stroller brand'}
              />
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-[rgba(0,0,0,0.14)] bg-[#fcfaf7] px-6 py-8 text-center">
                <h3 className="font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  No compatible results are listed yet.
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
                  No {resultNoun} are currently listed for {selected.displayName}. Compatibility changes, so this is a good moment to check the selector again or get a second read before buying.
                </p>
                <Link href="/tools/travel-system" className="tool-btn tool-btn--primary mt-6 px-5 py-3">
                  Back to Travel System Tool
                </Link>
              </div>
            )}
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
