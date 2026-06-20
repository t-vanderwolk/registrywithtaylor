'use client';

import { useEffect, useState } from 'react';
import {
  STROLLER_CATEGORY_LABELS,
  TRAVEL_SYSTEM_ENTITIES,
  type StrollerCategory,
} from '@/lib/guides/travelSystemCompatibility';
import { babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';

type Live = { babylistUrl: string | null; babylistPrice: number | null; babylistImage: string | null };
type FinderStroller = { model: string; category: StrollerCategory };
type FinderType = { key: StrollerCategory; label: string; items: FinderStroller[] };
type FinderBrand = { brand: string; count: number; types: FinderType[] };

// Brand logos. Brands listed here show their logo; the rest show the brand name.
// Drop a file in /public/assets/logos and add the brand to extend this.
const BRAND_LOGOS: Record<string, string> = {
  'Silver Cross': '/assets/logos/silver-cross-logo-1.webp',
};

// Order types so the brand view reads from everyday → specialty.
const TYPE_ORDER: StrollerCategory[] = [
  'full-size',
  'full-size-non-modular',
  'compact',
  'travel',
  'convertible-modular',
  'convertible-non-modular',
  'double',
  'double-travel',
  'double-jogging',
  'jogging',
  'wagon',
];

// All strollers, grouped brand → type, from the canonical entity list.
function buildBrands(): FinderBrand[] {
  const byBrand = new Map<string, FinderStroller[]>();
  for (const e of TRAVEL_SYSTEM_ENTITIES) {
    const category = e.strollerCategory;
    if (e.type !== 'stroller' || !category) continue;
    const list = byBrand.get(e.brand) ?? [];
    list.push({ model: e.shortLabel, category });
    byBrand.set(e.brand, list);
  }

  const brands: FinderBrand[] = [];
  for (const [brand, items] of byBrand) {
    const byType = new Map<StrollerCategory, FinderStroller[]>();
    for (const it of items) {
      const l = byType.get(it.category) ?? [];
      l.push(it);
      byType.set(it.category, l);
    }
    const types: FinderType[] = [...byType.entries()]
      .map(([key, its]) => ({
        key,
        label: STROLLER_CATEGORY_LABELS[key],
        items: its.sort((a, b) => a.model.localeCompare(b.model)),
      }))
      .sort((a, b) => TYPE_ORDER.indexOf(a.key) - TYPE_ORDER.indexOf(b.key));
    brands.push({ brand, count: items.length, types });
  }
  return brands.sort((a, b) => a.brand.localeCompare(b.brand));
}

const BRANDS = buildBrands();

export default function StrollerCatalogFinder() {
  const [selected, setSelected] = useState<string | null>(null);
  const [live, setLive] = useState<Record<string, Live>>({});

  // Pull live Babylist price / photo / link for every stroller once on mount.
  useEffect(() => {
    const items = BRANDS.flatMap((b) =>
      b.types.flatMap((t) => t.items.map((i) => `${b.brand}:::${i.model}`)),
    );
    if (items.length === 0) return;
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(items.join(','))}`)
      .then((r) => (r.ok ? r.json() : { results: {} }))
      .then((d) => setLive(d.results ?? {}))
      .catch(() => undefined);
  }, []);

  const current = BRANDS.find((b) => b.brand === selected) ?? null;

  if (!current) {
    return (
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
          Browse by brand
        </p>
        <h3 className="mt-1 font-serif text-[1.5rem] leading-tight text-neutral-900">
          Pick a brand to see every stroller, sorted by type
        </h3>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BRANDS.map((b) => (
            <button
              key={b.brand}
              type="button"
              onClick={() => setSelected(b.brand)}
              className="flex flex-col items-start gap-1 rounded-[1.1rem] border border-[rgba(215,161,175,0.22)] bg-white px-5 py-4 text-left shadow-[0_4px_14px_rgba(72,49,56,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(72,49,56,0.08)]"
            >
              {BRAND_LOGOS[b.brand] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={BRAND_LOGOS[b.brand]} alt={b.brand} className="h-7 w-auto max-w-[7.5rem] object-contain" />
              ) : (
                <span className="font-serif text-[1.15rem] text-neutral-900">{b.brand}</span>
              )}
              <span className="text-[0.75rem] text-neutral-400">
                {b.count} stroller{b.count === 1 ? '' : 's'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setSelected(null)}
        className="text-[0.8rem] font-semibold text-[var(--color-accent-dark)] transition hover:underline"
      >
        ← All brands
      </button>
      {BRAND_LOGOS[current.brand] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BRAND_LOGOS[current.brand]}
          alt={current.brand}
          className="mt-3 h-10 w-auto max-w-[12rem] object-contain"
        />
      ) : (
        <h3 className="mt-3 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-neutral-900">
          {current.brand}
        </h3>
      )}
      <p className="mt-1 text-[0.82rem] text-neutral-400">
        {current.count} strollers · live prices &amp; links via Babylist
      </p>

      <div className="mt-8 space-y-10">
        {current.types.map((t) => (
          <div key={t.key}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
              {t.label}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.items.map((item) => {
                const info = live[`${current.brand}:::${item.model}`];
                const href = babylistAffiliateUrl(current.brand, item.model, 'stroller', info?.babylistUrl);
                const img = info?.babylistImage ?? null;
                return (
                  <div
                    key={item.model}
                    className="flex flex-col overflow-hidden rounded-[1.1rem] border border-[rgba(215,161,175,0.2)] bg-white shadow-[0_4px_14px_rgba(72,49,56,0.04)]"
                  >
                    <div className="flex h-40 w-full items-center justify-center bg-[rgba(251,247,244,0.7)] p-3">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={`${current.brand} ${item.model}`}
                          className="max-h-full w-auto object-contain"
                        />
                      ) : (
                        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-300">
                          {current.brand}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
                      <p className="font-serif text-[1.05rem] leading-tight text-neutral-900">{item.model}</p>
                      {info?.babylistPrice != null ? (
                        <p className="text-[0.9rem] font-semibold text-[var(--gold)]">
                          ${info.babylistPrice.toFixed(2)}
                          <span className="ml-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
                            via Babylist
                          </span>
                        </p>
                      ) : (
                        <p className="text-[0.78rem] text-neutral-300">See price at Babylist</p>
                      )}
                      <a
                        href={href}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.76rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
                      >
                        Shop on Babylist →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
