'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// Brand logos. Brands listed here show their logo; the rest show the brand name.
// Keys must match the catalog brand string exactly. Drop a file in
// /public/assets/logos and add the brand to extend this.
export const BRAND_LOGOS: Record<string, string> = {
  'BOB Gear': '/assets/logos/bob.png',
  'Baby Jogger': '/assets/logos/babyjogger.png',
  'Baby Trend': '/assets/logos/babytrend.png',
  Bellini: '/assets/logos/bellini.png',
  Britax: '/assets/logos/britax.png',
  Bugaboo: '/assets/logos/bugaboo.png',
  Bumbleride: '/assets/logos/bumbleride.png',
  Chicco: '/assets/logos/chicco.png',
  Clek: '/assets/logos/clek.png',
  Cybex: '/assets/logos/cybex.png',
  'Delta Children': '/assets/logos/deltachildren.png',
  DFY: '/assets/logos/dfy.png',
  Ergobaby: '/assets/logos/ergobabylogo.png',
  Evenflo: '/assets/logos/evenflo.png',
  Graco: '/assets/logos/graco.png',
  'Guava Family': '/assets/logos/guava.png',
  Ingenuity: '/assets/logos/ingenuity.png',
  Inglesina: '/assets/logos/inglesinalogo.png',
  Joie: '/assets/logos/joie.png',
  Joolz: '/assets/logos/joolz.png',
  Larktale: '/assets/logos/larktale.png',
  'Maxi-Cosi': '/assets/logos/maxi-cosi.png',
  Mima: '/assets/logos/mima.png',
  Mockingbird: '/assets/logos/mockingbird.png',
  Momcozy: '/assets/logos/momcozy.png',
  Mompush: '/assets/logos/mompush.png',
  Nuna: '/assets/logos/nuna.png',
  'Orbit Baby': '/assets/logos/orbitbaby.png',
  'Peg Perego': '/assets/logos/peg.png',
  'Radio Flyer': '/assets/logos/radioflyer.png',
  Romer: '/assets/logos/romer.png',
  'Safety 1st': '/assets/logos/safetyfirst.png',
  'Silver Cross': '/assets/logos/silver-cross-logo-1.webp',
  Stokke: '/assets/logos/stokke.png',
  Thule: '/assets/logos/thule.png',
  UPPAbaby: '/assets/logos/uppababy.png',
  Veer: '/assets/logos/veer.png',
  'WonderFold Wagon': '/assets/logos/wonderfold.png',
  Zoe: '/assets/logos/zoe.png',
};

// Everyday → specialty ordering for the category view (matches the API).
const CATEGORY_ORDER = [
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
  'umbrella',
  'wagon',
];

type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
};
type FinderType = { category: string; label: string; products: FinderProduct[] };
type FinderBrand = { brand: string; count: number; types: FinderType[] };
type FlatProduct = FinderProduct & { brand: string; label: string };
type CategoryGroup = { category: string; label: string; products: FlatProduct[] };
type Mode = 'brand' | 'category';
type Kind = 'strollers' | 'carseats';

function compatHref(brand: string, model: string) {
  return `/tools/travel-system?strollerBrand=${encodeURIComponent(brand)}&strollerModel=${encodeURIComponent(model)}`;
}

function carSeatCompatHref(brand: string, model: string) {
  return `/tools/travel-system?carSeatBrand=${encodeURIComponent(brand)}&carSeatModel=${encodeURIComponent(model)}`;
}

function ProductCard({
  brand,
  product,
  showBrand = false,
  kind = 'strollers',
}: {
  brand: string;
  product: FinderProduct;
  showBrand?: boolean;
  kind?: Kind;
}) {
  return (
    <div className="tool-card tool-card--interactive overflow-hidden">
      <div className="tool-card__media">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="text-[0.64rem] uppercase tracking-[0.16em] text-neutral-300">{brand}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
        {showBrand ? (
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">{brand}</p>
        ) : null}
        <p className="font-serif text-[1.04rem] leading-tight text-neutral-900">{product.model || product.name}</p>
        {product.price != null ? (
          <p className="tool-price">
            ${product.price.toFixed(2)}
            <span className="tool-price__note">via Babylist</span>
          </p>
        ) : (
          <p className="text-[0.78rem] text-neutral-300">See price at Babylist</p>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          {product.affiliateUrl ? (
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="tool-btn tool-btn--primary tool-btn--block"
            >
              Shop on Babylist →
            </a>
          ) : null}
          {product.model ? (
            <Link
              href={kind === 'strollers' ? compatHref(brand, product.model) : carSeatCompatHref(brand, product.model)}
              className="tool-btn tool-btn--text self-start"
            >
              {kind === 'strollers' ? 'Check compatible infant car seats →' : 'Check compatible strollers →'}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function StrollerCatalogFinder() {
  const [kind, setKind] = useState<Kind>('strollers');
  const [brands, setBrands] = useState<FinderBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('brand');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const noun = kind === 'strollers' ? 'stroller' : 'car seat';
  const nounPlural = kind === 'strollers' ? 'strollers' : 'car seats';

  // Products come straight from the local affiliate catalog, bucketed by type.
  // Strollers and car seats share the same response shape, so the UI is reused.
  useEffect(() => {
    setLoading(true);
    fetch(kind === 'strollers' ? '/api/catalog/strollers' : '/api/catalog/carseats')
      .then((r) => (r.ok ? r.json() : { brands: [] }))
      .then((d) => setBrands(Array.isArray(d.brands) ? d.brands : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, [kind]);

  const totalCount = useMemo(() => brands.reduce((n, b) => n + b.count, 0), [brands]);
  const q = query.trim().toLowerCase();

  // Regroup the brand → type → product tree into category → products.
  const categories = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, CategoryGroup>();
    for (const b of brands) {
      for (const t of b.types) {
        if (!map.has(t.category)) map.set(t.category, { category: t.category, label: t.label, products: [] });
        for (const p of t.products) map.get(t.category)!.products.push({ ...p, brand: b.brand, label: t.label });
      }
    }
    return [...map.values()]
      .map((g) => ({
        ...g,
        products: g.products.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)),
      }))
      .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
  }, [brands]);

  const searchResults = useMemo<FlatProduct[]>(() => {
    if (!q) return [];
    const out: FlatProduct[] = [];
    for (const b of brands) {
      for (const t of b.types) {
        for (const p of t.products) {
          if (`${b.brand} ${p.model} ${p.name}`.toLowerCase().includes(q)) {
            out.push({ ...p, brand: b.brand, label: t.label });
          }
        }
      }
    }
    return out.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
  }, [q, brands]);

  function switchMode(next: Mode) {
    setMode(next);
    setSelectedBrand(null);
    setSelectedCategory(null);
  }

  function switchKind(next: Kind) {
    if (next === kind) return;
    setKind(next);
    setSelectedBrand(null);
    setSelectedCategory(null);
    setQuery('');
  }

  const currentBrand = brands.find((b) => b.brand === selectedBrand) ?? null;
  const currentCategory = categories.find((c) => c.category === selectedCategory) ?? null;

  return (
    <section className="tool-shell">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <span className="tool-eyebrow">{kind === 'strollers' ? 'Stroller finder' : 'Car seat finder'}</span>
        <h2 className="tool-title">Find your {noun} — by brand or by type</h2>
        <p className="tool-lead">
          {loading
            ? 'Loading the live catalog…'
            : `${totalCount} ${nounPlural} across ${brands.length} brands — live prices and links from Babylist. Search a name, pick a brand, or browse by the kind of ${noun} you need.`}
        </p>
      </div>

      {/* Strollers / Car seats toggle */}
      <div className="tool-segment mt-5 w-full max-w-[22rem]">
        <button
          type="button"
          aria-pressed={kind === 'strollers'}
          onClick={() => switchKind('strollers')}
          className="tool-segment__btn"
        >
          <span className="tool-segment__label">Strollers</span>
        </button>
        <button
          type="button"
          aria-pressed={kind === 'carseats'}
          onClick={() => switchKind('carseats')}
          className="tool-segment__btn"
        >
          <span className="tool-segment__label">Car seats</span>
        </button>
      </div>

      {!loading && brands.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Mode toggle */}
          <div className="tool-segment w-full max-w-[22rem]">
            <button
              type="button"
              aria-pressed={mode === 'brand'}
              onClick={() => switchMode('brand')}
              className="tool-segment__btn"
            >
              <span className="tool-segment__label">By brand</span>
            </button>
            <button
              type="button"
              aria-pressed={mode === 'category'}
              onClick={() => switchMode('category')}
              className="tool-segment__btn"
            >
              <span className="tool-segment__label">By type</span>
            </button>
          </div>

          {/* Search */}
          <div className="w-full sm:max-w-xs">
            <label htmlFor="finder-search" className="tool-label">
              Search {nounPlural}
            </label>
            <input
              id="finder-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={kind === 'strollers' ? 'Try Vista, Cruz, City Mini, YOYO…' : 'Try KeyFit, Pipa, Mesa, Aton…'}
              className="tool-input"
            />
          </div>
        </div>
      ) : null}

      {/* Body */}
      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="tool-skeleton h-64" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <p className="text-[0.9rem] text-neutral-400">
            No {nounPlural} available yet — the catalog import hasn’t run, or all matches are hidden.
          </p>
        ) : q ? (
          /* ── Search results (mode-independent) ── */
          <div className="tool-fade-up">
            <p className="tool-eyebrow-bar mb-4 text-[0.7rem] text-neutral-500">
              {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for “{query.trim()}”
            </p>
            {searchResults.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((p, i) => (
                  <ProductCard key={`${p.brand}-${p.model}-${i}`} brand={p.brand} product={p} showBrand kind={kind} />
                ))}
              </div>
            ) : (
              <p className="text-[0.9rem] text-neutral-400">
                Nothing matched that. Try a brand or core model name — or{' '}
                <button type="button" onClick={() => setQuery('')} className="tool-btn tool-btn--text">
                  clear the search
                </button>
                .
              </p>
            )}
          </div>
        ) : mode === 'category' ? (
          /* ── Browse by category ── */
          !currentCategory ? (
            <div className="tool-fade-up">
              <p className="tool-eyebrow-bar mb-4 text-[0.7rem]">Browse by type</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <button
                    key={c.category}
                    type="button"
                    onClick={() => setSelectedCategory(c.category)}
                    className="tool-card tool-card--interactive items-start gap-1 px-5 py-4 text-left"
                  >
                    <span className="font-serif text-[1.12rem] leading-tight text-neutral-900">{c.label}</span>
                    <span className="text-[0.72rem] text-neutral-400">
                      {c.products.length} {noun}{c.products.length === 1 ? '' : 's'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="tool-fade-up">
              <nav className="flex items-center gap-1.5 text-[0.78rem]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="font-semibold text-[var(--color-accent-dark)] transition hover:underline"
                >
                  All types
                </button>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-500">{currentCategory.label}</span>
              </nav>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <h3 className="font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-neutral-900">
                  {currentCategory.label}
                </h3>
                <span className="tool-chip">
                  {currentCategory.products.length} {noun}{currentCategory.products.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {currentCategory.products.map((p, i) => (
                  <ProductCard key={`${p.brand}-${p.model}-${i}`} brand={p.brand} product={p} showBrand kind={kind} />
                ))}
              </div>
            </div>
          )
        ) : /* ── Browse by brand ── */
        !currentBrand ? (
          <div className="tool-fade-up">
            <p className="tool-eyebrow-bar mb-4 text-[0.7rem]">Browse by brand</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {brands.map((b) => (
                <button
                  key={b.brand}
                  type="button"
                  onClick={() => setSelectedBrand(b.brand)}
                  className="tool-card tool-card--interactive items-center justify-center gap-2.5 px-3 py-5 text-center sm:px-5 sm:py-6"
                >
                  {/* Fixed-size box so every brand logo renders at a uniform footprint */}
                  <div className="flex h-14 w-full items-center justify-center">
                    {BRAND_LOGOS[b.brand] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={BRAND_LOGOS[b.brand]} alt={b.brand} className="max-h-full max-w-[78%] object-contain" />
                    ) : (
                      <span className="font-serif text-[1.2rem] leading-tight text-neutral-900">{b.brand}</span>
                    )}
                  </div>
                  <span className="text-[0.72rem] text-neutral-400">
                    {b.count} {noun}{b.count === 1 ? '' : 's'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tool-fade-up">
            <nav className="flex items-center gap-1.5 text-[0.78rem]">
              <button
                type="button"
                onClick={() => setSelectedBrand(null)}
                className="font-semibold text-[var(--color-accent-dark)] transition hover:underline"
              >
                All brands
              </button>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500">{currentBrand.brand}</span>
            </nav>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              {BRAND_LOGOS[currentBrand.brand] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={BRAND_LOGOS[currentBrand.brand]}
                  alt={currentBrand.brand}
                  className="h-10 w-auto max-w-[12rem] object-contain"
                />
              ) : (
                <h3 className="font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-neutral-900">
                  {currentBrand.brand}
                </h3>
              )}
              <span className="tool-chip">
                {currentBrand.count} {noun}{currentBrand.count === 1 ? '' : 's'}
              </span>
            </div>

            <div className="mt-8 space-y-10">
              {currentBrand.types.map((t) => (
                <div key={t.category}>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                    {t.label}
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {t.products.map((item, i) => (
                      <ProductCard key={`${item.name}-${i}`} brand={currentBrand.brand} product={item} kind={kind} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
