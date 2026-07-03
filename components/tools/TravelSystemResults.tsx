'use client';

import { useState } from 'react';
import { BRAND_LOGOS } from './StrollerCatalogFinder';
import {
  formatCompatibilityConfidence,
  formatCompatibilityType,
  type CompatibleCarSeatResult,
  type CompatibleStrollerResult,
  type CompatibilityType,
} from '@/lib/compatibilityEngine';
import { babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';

type ResultItem = CompatibleCarSeatResult | CompatibleStrollerResult;

const TYPE_ORDER: Array<{
  id: 'direct' | 'adapter' | 'other';
  title: string;
  description: string;
}> = [
  {
    id: 'direct',
    title: 'Direct Fit',
    description: 'These brands click straight onto the stroller, no adapter needed. Tap a brand to see its seats.',
  },
  {
    id: 'adapter',
    title: 'Adapter Required',
    description:
      'Each of these brands works through one stroller-to-brand adapter. Tap a brand to see the exact adapter and the seats it covers.',
  },
  {
    id: 'other',
    title: 'Limited Fit',
    description: 'These pairings carry a compatibility note worth reading before you buy. Tap a brand to see the seats.',
  },
];

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

/** One stroller-to-brand adapter, shown once above a brand's expanded seats. */
function BrandAdapterCallout({ item }: { item: ResultItem }) {
  return (
    <div className="tool-adapter-callout mb-4">
      <div className="tool-adapter-callout__details">
        {item.adapterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.adapterImage} alt="" className="tool-adapter-callout__image" />
        ) : null}
        <div className="min-w-0">
          <p className="tool-adapter-callout__eyebrow">One adapter covers {item.brand}</p>
          <p className="tool-adapter-callout__name">{item.adapterType ?? 'Car seat adapter'}</p>
          {item.adapterPrice != null ? (
            <p className="tool-adapter-callout__price">${item.adapterPrice.toFixed(2)}</p>
          ) : null}
        </div>
      </div>

      {item.adapterUrl ? (
        <a
          href={item.adapterUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="tool-adapter-callout__link"
          aria-label={`Shop adapter for ${item.brand}: ${item.adapterType ?? 'car seat adapter'}`}
        >
          Shop adapter
        </a>
      ) : (
        <span className="tool-adapter-callout__missing">Adapter link unavailable</span>
      )}
    </div>
  );
}

/** A single seat/stroller product card — no per-item adapter (that's brand-level). */
function ResultCard({ item, productKind }: { item: ResultItem; productKind: 'stroller' | 'carSeat' }) {
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

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-neutral-400">
            {formatCompatibilityConfidence(item.confidence)} confidence
          </span>
          {primaryCta ? (
            <a
              href={primaryCta.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="tool-btn tool-btn--primary ml-auto min-h-0 px-3 py-2 text-[0.68rem]"
            >
              {primaryCta.source === 'babylist' ? <BabylistHeartIcon /> : null}
              {primaryCta.label}
            </a>
          ) : null}
          {amazonUrl ? (
            <a
              href={amazonUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="tool-btn tool-btn--secondary min-h-0 px-3 py-2 text-[0.68rem]"
            >
              Amazon
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function BrandGroup({
  brand,
  items,
  isAdapter,
  productKind,
}: {
  brand: string;
  items: ResultItem[];
  isAdapter: boolean;
  productKind: 'stroller' | 'carSeat';
}) {
  const [open, setOpen] = useState(false);
  const logo = BRAND_LOGOS[brand];
  const brandAdapter = isAdapter
    ? items.find((item) => item.adapterRequired && (item.adapterUrl || item.adapterImage)) ?? items[0]
    : null;

  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(0,0,0,0.08)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[rgba(215,161,175,0.06)]"
      >
        <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-[0.8rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] px-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={brand} className="max-h-8 max-w-full object-contain" />
          ) : (
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">{brand}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[1.1rem] leading-tight tracking-[-0.02em] text-neutral-900">{brand}</span>
          <span className="text-[0.72rem] text-neutral-500">
            {items.length} seat{items.length === 1 ? '' : 's'}
            {isAdapter ? ' • adapter' : ' • direct fit'}
          </span>
        </span>
        <span
          aria-hidden
          className={`shrink-0 text-[var(--color-accent-dark)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ⌄
        </span>
      </button>

      {open ? (
        <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-4">
          {isAdapter && brandAdapter ? <BrandAdapterCallout item={brandAdapter} /> : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .slice()
              .sort((a, b) => a.model.localeCompare(b.model))
              .map((item) => (
                <ResultCard key={`${item.brand}-${item.model}-${item.compatibilityType}`} item={item} productKind={productKind} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TravelSystemResults({
  results,
  productKind,
}: {
  results: ResultItem[];
  productKind: 'stroller' | 'carSeat';
}) {
  return (
    <div className="space-y-6">
      {TYPE_ORDER.map((section) => {
        const sectionItems = results.filter((item) => resultBucket(item) === section.id);
        if (sectionItems.length === 0) return null;

        const brandGroups = groupByBrand(sectionItems);
        const isAdapter = section.id === 'adapter';
        const brandCount = Object.keys(brandGroups).length;

        return (
          <section
            key={section.id}
            className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6"
          >
            <div className="border-b border-[rgba(0,0,0,0.06)] pb-4">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                {brandCount} brand{brandCount === 1 ? '' : 's'} • {sectionItems.length} seat
                {sectionItems.length === 1 ? '' : 's'}
              </p>
              <h3 className="mt-1 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                {section.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">{section.description}</p>
            </div>

            <div className="mt-5 space-y-3">
              {Object.entries(brandGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([brand, brandItems]) => (
                  <BrandGroup
                    key={brand}
                    brand={brand}
                    items={brandItems}
                    isAdapter={isAdapter}
                    productKind={productKind}
                  />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
