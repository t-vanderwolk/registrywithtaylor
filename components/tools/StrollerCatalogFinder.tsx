'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Brand logos. Brands listed here show their logo; the rest show the brand name.
// Drop a file in /public/assets/logos and add the brand to extend this.
const BRAND_LOGOS: Record<string, string> = {
  'Silver Cross': '/assets/logos/silver-cross-logo-1.webp',
};

type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
};
type FinderType = { category: string; label: string; products: FinderProduct[] };
type FinderBrand = { brand: string; count: number; types: FinderType[] };

export default function StrollerCatalogFinder() {
  const [brands, setBrands] = useState<FinderBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  // Strollers come straight from the local affiliate catalog, bucketed by type.
  useEffect(() => {
    fetch('/api/catalog/strollers')
      .then((r) => (r.ok ? r.json() : { brands: [] }))
      .then((d) => setBrands(Array.isArray(d.brands) ? d.brands : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const current = brands.find((b) => b.brand === selected) ?? null;

  if (loading) {
    return <p className="text-[0.85rem] text-neutral-400">Loading strollers…</p>;
  }
  if (brands.length === 0) {
    return (
      <p className="text-[0.85rem] text-neutral-400">
        No strollers available yet — the catalog import hasn’t run, or all matches are hidden.
      </p>
    );
  }

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
          {brands.map((b) => (
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
        {current.count} stroller{current.count === 1 ? '' : 's'} · live prices &amp; links via Babylist
      </p>

      <div className="mt-8 space-y-10">
        {current.types.map((t) => (
          <div key={t.category}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
              {t.label}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.products.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex flex-col overflow-hidden rounded-[1.1rem] border border-[rgba(215,161,175,0.2)] bg-white shadow-[0_4px_14px_rgba(72,49,56,0.04)]"
                >
                  <div className="flex h-40 w-full items-center justify-center bg-[rgba(251,247,244,0.7)] p-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="max-h-full w-auto object-contain" />
                    ) : (
                      <span className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-300">
                        {current.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
                    <p className="font-serif text-[1.02rem] leading-tight text-neutral-900">{item.name}</p>
                    {item.price != null ? (
                      <p className="text-[0.9rem] font-semibold text-[var(--gold)]">
                        ${item.price.toFixed(2)}
                        <span className="ml-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
                          via Babylist
                        </span>
                      </p>
                    ) : (
                      <p className="text-[0.78rem] text-neutral-300">See price at Babylist</p>
                    )}
                    <div className="mt-auto flex flex-col gap-2 pt-1.5">
                      {item.affiliateUrl ? (
                        <a
                          href={item.affiliateUrl}
                          target="_blank"
                          rel="sponsored nofollow noopener noreferrer"
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.76rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
                        >
                          Shop on Babylist →
                        </a>
                      ) : null}
                      {item.model ? (
                        <Link
                          href={`/tools/travel-system?strollerBrand=${encodeURIComponent(
                            current.brand,
                          )}&strollerModel=${encodeURIComponent(item.model)}`}
                          className="inline-flex w-fit items-center gap-1.5 text-[0.73rem] font-semibold text-[var(--color-accent-dark)] transition hover:underline"
                        >
                          Check compatible infant car seats →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
