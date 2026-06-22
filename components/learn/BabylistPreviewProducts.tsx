'use client';

import { useEffect, useState } from 'react';
import { babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';

export type BabylistPreviewItem = {
  /** Section/category label shown above the product name. */
  label: string;
  blurb?: string;
  /** Catalogue items (strollers / car seats): resolve live price + photo + link. */
  brand?: string;
  model?: string;
  kind?: 'stroller' | 'carSeat';
  /** Editorial image used until the live Babylist product photo loads (or if unsynced). */
  imageFallback?: string;
  /** Curated items (e.g. nursery): supply title + Babylist link + image directly. */
  name?: string;
  href?: string;
  image?: string;
  /** Small note shown in place of a live price (e.g. "Shop the category"). */
  priceNote?: string;
};

type Live = { babylistUrl: string | null; babylistPrice: number | null; babylistImage: string | null };

/**
 * Renders a grid of shoppable Babylist product cards for a free-preview lesson.
 * Pulls live price/photo/link from the synced catalogue via /api/babylist/lookup;
 * every card still gets a Babylist affiliate link via babylistAffiliateUrl, so it
 * works even before a product is synced.
 */
export default function BabylistPreviewProducts({
  heading = 'Shop these on Babylist',
  items,
}: {
  heading?: string;
  items: BabylistPreviewItem[];
}) {
  // Only catalogue items (brand + model, no explicit href) need the live lookup.
  const key = items
    .filter((i) => i.brand && i.model && !i.href)
    .map((i) => `${i.brand}:::${i.model}`)
    .join(',');
  const [live, setLive] = useState<Record<string, Live>>({});

  useEffect(() => {
    if (!key) return;
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : { results: {} }))
      .then((d) => setLive(d.results ?? {}))
      .catch(() => undefined);
  }, [key]);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
          Shop the category
        </p>
        <h3 className="font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[1.8rem]">
          {heading}
        </h3>
        <p className="text-[0.8rem] leading-[1.6] text-neutral-400">
          Live prices and links via Babylist. As a Babylist partner, Taylor-Made Baby Co. may earn a commission.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const info =
            item.brand && item.model && !item.href ? live[`${item.brand}:::${item.model}`] : undefined;
          const title = item.name ?? `${item.brand ?? ''} ${item.model ?? ''}`.trim();
          const href =
            item.href ??
            babylistAffiliateUrl(item.brand ?? '', item.model ?? '', item.kind ?? 'stroller', info?.babylistUrl);
          const img = item.image ?? info?.babylistImage ?? item.imageFallback ?? null;
          return (
            <div
              key={`${item.label}-${title}`}
              className="flex flex-col overflow-hidden rounded-[1.1rem] border border-[rgba(215,161,175,0.2)] bg-white shadow-[0_4px_14px_rgba(72,49,56,0.04)]"
            >
              {img ? (
                <div className="flex h-44 w-full items-center justify-center bg-[rgba(251,247,244,0.7)] p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={title} className="max-h-full w-auto object-contain" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-1.5 px-5 py-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                  {item.label}
                </p>
                <p className="font-serif text-[1.12rem] leading-tight text-neutral-900">{title}</p>
                {item.blurb ? (
                  <p className="text-[0.85rem] leading-[1.6] text-neutral-500">{item.blurb}</p>
                ) : null}
                {info?.babylistPrice != null ? (
                  <p className="mt-0.5 text-[0.95rem] font-semibold text-[var(--gold)]">
                    ${info.babylistPrice.toFixed(2)}
                    <span className="ml-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
                      via Babylist
                    </span>
                  </p>
                ) : item.priceNote ? (
                  <p className="mt-0.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
                    {item.priceNote}
                  </p>
                ) : null}
                <a
                  href={href}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-5 py-2 text-[0.8rem] font-semibold text-white transition duration-200 hover:bg-[var(--color-cta-pink-hover)]"
                >
                  Shop on Babylist →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
