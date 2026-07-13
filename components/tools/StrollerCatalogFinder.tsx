'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';
import { trackToolOpened, trackToolSelection, trackToolAffiliateClick } from '@/lib/analytics/tools';

// Brand logos. Brands listed here show their logo; the rest show the brand name.
// Keys must match the catalog brand string exactly. Drop a file in
// /public/assets/logos and add the brand to extend this.
export const BRAND_LOGOS: Record<string, string> = {
  BOB: '/assets/logos/bob.png',
  'BOB Gear': '/assets/logos/bob.png',
  'Baby Jogger': '/assets/logos/babyjogger.png',
  'Baby Trend': '/assets/logos/babytrend.png',
  Bellini: '/assets/logos/bellini.png',
  Bombi: '/assets/logos/bombi.png',
  Britax: '/assets/logos/britax.png',
  Bugaboo: '/assets/logos/bugaboo.png',
  Bumbleride: '/assets/logos/bumbleride.png',
  Chicco: '/assets/logos/chicco.png',
  Clek: '/assets/logos/clek.png',
  Cybex: '/assets/logos/cybex.png',
  'Delta Children': '/assets/logos/deltachildren2.png',
  DFY: '/assets/logos/dfy2.png',
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
  Mercedes: '/assets/logos/mercedes.png',
  Mima: '/assets/logos/mimalogo.png',
  Mockingbird: '/assets/logos/mockingbird.png',
  Momcozy: '/assets/logos/momcozy.png',
  Mompush: '/assets/logos/mompush.png',
  Nuna: '/assets/logos/nuna.png',
  'Orbit Baby': '/assets/logos/orbitbaby.png',
  'Peg Perego': '/assets/logos/pegperego.png',
  'Radio Flyer': '/assets/logos/radioflyer.png',
  Romer: '/assets/logos/romer.png',
  'Safety 1st': '/assets/logos/safetyfirst.png',
  'Silver Cross': '/assets/logos/silver-cross-logo-1.webp',
  Stokke: '/assets/logos/stokke.png',
  Thule: '/assets/logos/thule.png',
  UPPAbaby: '/assets/logos/uppababy.png',
  Veer: '/assets/logos/veer.png',
  WonderFold: '/assets/logos/wonderfold2.png',
  'WonderFold Wagon': '/assets/logos/wonderfold2.png',
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
  'double-jogging',
  'jogging',
  'umbrella',
  'wagon',
];

type RetailerOffer = { price: number | null; url: string | null };
type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  source?: 'babylist' | 'macrobaby' | 'bombi' | 'amazon';
  retailers?: {
    babylist?: RetailerOffer | null;
    amazon?: RetailerOffer | null;
    macrobaby?: RetailerOffer | null;
    bombi?: RetailerOffer | null;
    anb?: RetailerOffer | null;
    goodbuygear?: RetailerOffer | null;
  } | null;
};
type FinderType = { category: string; label: string; products: FinderProduct[] };
type FinderBrand = { brand: string; count: number; types: FinderType[] };
type FlatProduct = FinderProduct & { brand: string; label: string };
type CategoryGroup = { category: string; label: string; products: FlatProduct[] };
type Mode = 'brand' | 'category';
type Kind = 'strollers' | 'carseats';

// Link straight to the stroller's results page. The slug is brand+model
// lower-cased, so it mirrors the travel-system "check by stroller" set exactly
// (the checker options are built from this same finder source) and resolves
// regardless of brand/model casing (e.g. "Cybex MIOS" → cybex-mios).
function compatHref(brand: string, model: string) {
  return travelSystemResultsHref('stroller', { brand, model });
}

function displayNameWithoutBrand(displayName: string, brand: string) {
  const normalizedBrand = brand.trim();
  if (!normalizedBrand) return displayName;
  const escapedBrand = normalizedBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const brandPrefix = new RegExp(`^(?:${escapedBrand}\\s+)+`, 'i');
  return displayName.replace(brandPrefix, '').trim() || displayName;
}

// Retailer CTAs, stacked on each card in priority order. Babylist is primary
// when present, MacroBaby is the fallback primary, and Amazon is secondary only.
const RETAILER_CTAS: Array<{
  key: 'babylist' | 'macrobaby' | 'bombi' | 'amazon';
  shopLabel: string;
  btnClass: string;
}> = [
  { key: 'babylist', shopLabel: 'Add to Babylist', btnClass: 'tool-btn--primary' },
  { key: 'macrobaby', shopLabel: 'Shop MacroBaby', btnClass: 'tool-btn--secondary' },
  { key: 'bombi', shopLabel: 'Shop Bombi', btnClass: 'tool-btn--primary' },
  { key: 'amazon', shopLabel: 'Shop Amazon', btnClass: 'tool-btn--secondary' },
];

function formatOpenBoxPrice(price: number) {
  return Number.isInteger(price) ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
}

export function BabylistHeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="15" height="13" viewBox="0 0 16 14" fill="none" aria-hidden="true" className={className}>
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

// The Amazon "a + smile" mark. The smile is Amazon orange; the wordmark inherits
// the button's text color so it reads on both light and dark CTA styles.
export function AmazonMark({ className = '' }: { className?: string }) {
  return (
    <svg width="52" height="17" viewBox="0 0 62 20" fill="none" aria-hidden="true" className={className}>
      <text x="0" y="14" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" letterSpacing="-0.5" fill="currentColor">
        amazon
      </text>
      <path d="M4 17.2 Q26 22.5 50 17.2" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M46 15.6 L50 17.4 L46.5 19.4" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function OpenBoxBadge({
  offer,
}: {
  offer?: RetailerOffer | null;
}) {
  if (!offer || (!offer.url && offer.price == null)) return null;

  const label =
    offer.price != null
      ? `Open box from ${formatOpenBoxPrice(offer.price)} at GoodBuy Gear`
      : 'Open box at GoodBuy Gear';
  const content = (
    <>
      <span className="tool-open-box-badge__eyebrow">Open Box</span>
      {offer.price != null ? (
        <span className="tool-open-box-badge__price">from {formatOpenBoxPrice(offer.price)}</span>
      ) : null}
      <span className="tool-open-box-badge__retailer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logos/goodbuygear2.png" alt="" className="tool-open-box-badge__logo" />
      </span>
      {offer.url ? <span className="tool-open-box-badge__arrow" aria-hidden="true">→</span> : null}
    </>
  );

  return offer.url ? (
    <a
      href={offer.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="tool-open-box-badge"
      aria-label={label}
      title={label}
    >
      {content}
    </a>
  ) : (
    <span className="tool-open-box-badge" title={label}>{content}</span>
  );
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
  // Each retailer shows only when it actually carries this model. Babylist is
  // the visible product-card CTA; open-box stays separate as a sticker badge.
  const retailers = product.retailers ?? null;
  const offers: Array<{ meta: (typeof RETAILER_CTAS)[number]; offer: RetailerOffer }> = [];
  for (const meta of RETAILER_CTAS) {
    const offer = retailers?.[meta.key] ?? null;
    if (offer && (offer.url || offer.price != null)) offers.push({ meta, offer });
  }
  const openBoxOffer = retailers?.goodbuygear ?? null;
  const displayPrice =
    retailers?.babylist?.price ??
    retailers?.macrobaby?.price ??
    retailers?.bombi?.price ??
    product.price;
  const priceSource =
    retailers?.babylist?.price != null
      ? 'Babylist'
      : retailers?.macrobaby?.price != null
        ? 'MacroBaby'
        : retailers?.bombi?.price != null
          ? 'Bombi'
          : null;
  const displayTitle = displayNameWithoutBrand(product.model || product.name, brand);

  return (
    <div className="tool-card tool-card--interactive tool-product-card">
      <div className="tool-card__media tool-product-card__media">
        <OpenBoxBadge offer={openBoxOffer} />
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{brand}</span>
        )}
      </div>
      <div className="tool-product-card__body">
        {showBrand ? (
          <p className="tool-product-card__brand">{brand}</p>
        ) : null}
        <p className="tool-product-card__title">{displayTitle}</p>
        {displayPrice != null ? (
          <p className="tool-product-card__price">
            ${displayPrice.toFixed(2)}
            {priceSource ? <span>via {priceSource}</span> : null}
          </p>
        ) : null}

        <div className="tool-product-card__actions">
          {offers.map(({ meta, offer }, index) => (
            <a
              key={meta.key}
              href={offer.url ?? undefined}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                trackToolAffiliateClick('stroller-finder', {
                  product: `${brand} ${displayTitle}`.trim(),
                  retailer: meta.key,
                  brand,
                  url: offer.url,
                })
              }
              className={`tool-btn ${index === 0 ? 'tool-btn--primary' : meta.btnClass} tool-btn--block flex items-center justify-center gap-2`}
            >
              {meta.key === 'babylist' ? <BabylistHeartIcon className="shrink-0" /> : null}
              {meta.key === 'amazon' ? (
                <>
                  <span>Shop on</span>
                  <AmazonMark className="shrink-0 translate-y-[1px]" />
                  <span aria-hidden="true">→</span>
                </>
              ) : (
                <span>{meta.shopLabel} →</span>
              )}
            </a>
          ))}
          {offers.length === 0 && openBoxOffer?.url ? (
            <a
              href={openBoxOffer.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                trackToolAffiliateClick('stroller-finder', {
                  product: `${brand} ${displayTitle}`.trim(),
                  retailer: 'goodbuygear',
                  brand,
                  url: openBoxOffer.url,
                })
              }
              className="tool-btn tool-btn--primary tool-btn--block flex items-center justify-center gap-2"
            >
              <span>Shop open box at GoodBuy Gear →</span>
            </a>
          ) : null}
          {product.model ? (
            <Link href={compatHref(brand, product.model)} className="tool-utility-link">
              Compatible car seats →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function StrollerCatalogFinder({
  initialCategory = null,
}: {
  /** When set (from ?category=), open the finder in category view on that bucket. */
  initialCategory?: string | null;
} = {}) {
  const kind: Kind = 'strollers'; // finder is strollers-only; car seats live in the checker
  const [brands, setBrands] = useState<FinderBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>(initialCategory ? 'category' : 'brand');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [query, setQuery] = useState('');

  const noun = kind === 'strollers' ? 'stroller' : 'car seat';
  const nounPlural = kind === 'strollers' ? 'strollers' : 'car seats';

  // Products come straight from the local affiliate catalog, bucketed by type.
  // Strollers and car seats share the same response shape, so the UI is reused.
  useEffect(() => {
    setLoading(true);
    fetch('/api/catalog/strollers')
      .then((r) => (r.ok ? r.json() : { brands: [] }))
      .then((d) => setBrands(Array.isArray(d.brands) ? d.brands : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  // Fire once when the finder mounts.
  useEffect(() => {
    trackToolOpened('stroller-finder', initialCategory ? { entryCategory: initialCategory } : {});
  }, [initialCategory]);

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
                    onClick={() => {
                      trackToolSelection('stroller-finder', 'category', c.category);
                      setSelectedCategory(c.category);
                    }}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {brands.map((b) => (
                <button
                  key={b.brand}
                  type="button"
                  onClick={() => {
                    trackToolSelection('stroller-finder', 'brand', b.brand);
                    setSelectedBrand(b.brand);
                  }}
                  className="tool-card tool-card--interactive tool-brand-card"
                >
                  {/* Fixed-size box so every brand logo renders at a uniform footprint */}
                  <div className="tool-brand-card__mark">
                    {BRAND_LOGOS[b.brand] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={BRAND_LOGOS[b.brand]} alt={b.brand} className="tool-brand-card__logo" />
                    ) : (
                      <span className="tool-brand-card__fallback">{b.brand}</span>
                    )}
                  </div>
                  <span className="tool-brand-card__count">
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
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2.5">
                      <h4 className="font-serif text-[1.6rem] leading-none tracking-[-0.02em] text-neutral-900">
                        {t.label}
                      </h4>
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]/75">
                        {t.products.length} {noun}{t.products.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <span className="mt-2.5 block h-[3px] w-12 rounded-full bg-[var(--color-cta-pink)]" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
