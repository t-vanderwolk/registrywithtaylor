'use client';

import '@/styles/widgets.css';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { travelSystemResultsHref, travelSystemSlug } from '@/lib/travelSystemRouting';
import { trackToolOpened, trackToolSelection } from '@/lib/analytics/tools';
import { babylistBrandShopUrl, isAmazonAllowedForBrand } from '@/lib/affiliateShopFallbacks';
import { getDirectAffiliateLink, directShopLabel } from '@/lib/catalog/directAffiliateLinks';
import { strollerFinderBrandHref, strollerFinderCategoryHref } from '@/lib/resources/knowBeforeYouBuy';
import { finderSelectionFromSearch, type FinderSelection } from '@/lib/catalog/finderSelection';
import type { PublicStrollerBrand, PublicStrollerProduct } from '@/lib/server/publicStrollerCatalog';
import ToolRetailerCta from '@/components/tools/ToolRetailerCta';

// The finder's own two landing URLs, shared by the links and by the in-place
// selection below so they can never drift apart.
const FINDER_HREF = '/tools/stroller-finder';
const CATEGORY_PICKER_HREF = '/tools/stroller-finder?view=category';

// Brand marks now live in lib/catalog/brandLogos.ts so non-component code can
// use them too; re-exported here because the tools import it from this module.
export { BRAND_LOGOS } from '@/lib/catalog/brandLogos';
import { BRAND_LOGOS } from '@/lib/catalog/brandLogos';

// Everyday → specialty ordering for the category view (matches the API).
const CATEGORY_ORDER = [
  'full-size',
  'full-size-non-modular',
  'compact',
  'travel',
  'convertible-modular',
  'convertible-non-modular',
  'double',
  'jogging',
  'umbrella',
  'wagon',
];

// Every stroller brand always shows this full set of category sections, in this
// fixed order — even the buckets the brand has nothing in (an empty note shows).
// `match` maps the API's category keys into each display bucket.
export const STROLLER_BRAND_SECTIONS: { label: string; match: string[] }[] = [
  { label: 'Full-Size', match: ['full-size', 'full-size-non-modular'] },
  { label: 'Compact / Mid-Size', match: ['compact'] },
  { label: 'Single-to-Double', match: ['convertible-modular', 'convertible-non-modular'] },
  { label: 'Double', match: ['double', 'double-travel', 'double-jogging'] },
  { label: 'Travel', match: ['travel'] },
  { label: 'Jogging / All-Terrain', match: ['jogging'] },
  { label: 'Umbrella', match: ['umbrella'] },
];

type RetailerOffer = { price: number | null; url: string | null };
type FinderProduct = PublicStrollerProduct;
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

// Pre-select this stroller in the Compare tool (up to 3 can be added there).
function compareHref(brand: string, model: string) {
  return `/tools/compare?ids=${encodeURIComponent(travelSystemSlug({ brand, model }))}`;
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
type RetailerCtaMeta = {
  key: string;
  /** Display name, also used to look up the retailer's logo. */
  name: string;
  shopLabel: string;
  variant: 'primary' | 'secondary';
};

const RETAILER_CTAS: Array<RetailerCtaMeta & { key: 'babylist' | 'macrobaby' | 'bombi' | 'amazon' }> = [
  { key: 'babylist', name: 'Babylist', shopLabel: 'Add to Babylist', variant: 'primary' },
  { key: 'macrobaby', name: 'MacroBaby', shopLabel: 'Shop MacroBaby', variant: 'secondary' },
  { key: 'bombi', name: 'Bombi', shopLabel: 'Shop Bombi', variant: 'primary' },
  { key: 'amazon', name: 'Amazon', shopLabel: 'Shop Amazon', variant: 'secondary' },
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
        <img loading="lazy" decoding="async" src="/assets/logos/goodbuygear2.png" alt="" className="tool-open-box-badge__logo" />
      </span>
      {offer.url ? <span className="tool-open-box-badge__arrow" aria-hidden="true">→</span> : null}
    </>
  );

  return offer.url ? (
    <a
      href={offer.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="shopmyskip tool-open-box-badge"
      aria-label={label}
      title={label}
    >
      {content}
    </a>
  ) : (
    <span className="tool-open-box-badge" title={label}>{content}</span>
  );
}

export function CarSeatGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.5h3.2a2 2 0 0 1 1.98 1.7l1.02 6.8H8.2a2 2 0 0 1-1.98-1.7L5.2 5.2A1.5 1.5 0 0 1 6.68 3.5H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.2 12H18a2 2 0 0 1 2 2.2l-.3 2.8H11l-.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 20.5h8.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CompareGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="7" height="14" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="5" width="7" height="14" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.2v17.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2.2" />
    </svg>
  );
}

function ProductCard({
  brand,
  product,
  showBrand = false,
  kind = 'strollers',
  index = 0,
}: {
  brand: string;
  product: FinderProduct;
  showBrand?: boolean;
  kind?: Kind;
  index?: number;
}) {
  // Each retailer shows only when it actually carries this model. Babylist is
  // the visible product-card CTA; open-box stays separate as a sticker badge.
  const retailers = product.retailers ?? null;
  const offers: Array<{ meta: RetailerCtaMeta; offer: RetailerOffer }> = [];
  for (const meta of RETAILER_CTAS) {
    const offer = retailers?.[meta.key] ?? null;
    if (offer && (offer.url || offer.price != null)) offers.push({ meta, offer });
  }
  // Hand-added store links (Target, Nordstrom, a brand's own site) are exact
  // buy links, each named for its store: after Babylist/MacroBaby/Bombi, ahead
  // of Amazon.
  const storeOffers: Array<{ meta: RetailerCtaMeta; offer: RetailerOffer }> = (product.extraRetailers ?? []).map((link) => ({
    meta: { key: `store:${link.url}`, name: link.retailer, shopLabel: `Shop ${link.retailer}`, variant: 'secondary' },
    offer: { url: link.url, price: null },
  }));
  const amazonAt = offers.findIndex((o) => o.meta.key === 'amazon');
  offers.splice(amazonAt < 0 ? offers.length : amazonAt, 0, ...storeOffers);
  // Guarantee every card shows a shoppable primary (Babylist/MacroBaby/Bombi) AND
  // an Amazon button. When an exact retailer link is missing, fall back to an
  // affiliate-tracked Babylist brand-store link and/or a tagged Amazon search.
  const fallbackKind = kind === 'carseats' ? 'carseat' : 'stroller';
  // Some brands (e.g. Nuna) don't authorize Amazon third-party sales — drop any
  // real Amazon offer for them.
  const amazonAllowed = isAmazonAllowedForBrand(brand);
  if (!amazonAllowed) {
    for (let i = offers.length - 1; i >= 0; i--) {
      if (offers[i].meta.key === 'amazon') offers.splice(i, 1);
    }
  }
  const hasPrimaryOffer = offers.some((o) => o.meta.key === 'babylist' || o.meta.key === 'macrobaby' || o.meta.key === 'bombi');
  const babylistMeta = RETAILER_CTAS.find((m) => m.key === 'babylist')!;
  if (!hasPrimaryOffer) {
    // An exact store link leads; the Babylist brand shop follows it.
    offers.splice(storeOffers.length, 0, { meta: babylistMeta, offer: { url: babylistBrandShopUrl(brand, fallbackKind), price: null } });
  }
  // No Amazon search fallback: a card only shows an Amazon button when a real
  // Amazon link exists for the product. If it's not on Amazon, we don't fake it.
  // Brands with a direct program (Mima, Silver Cross) lead with their direct
  // affiliate link; Babylist stays available as a secondary button.
  const directUrl = getDirectAffiliateLink(brand, product.model);
  if (directUrl) {
    offers.unshift({
      // Brand-direct: the brand's own name drives both the label and the logo.
      meta: { key: 'direct', name: brand, shopLabel: directShopLabel(brand), variant: 'secondary' },
      offer: { url: directUrl, price: null },
    });
  }
  const openBoxOffer = retailers?.goodbuygear ?? null;
  const displayPrice =
    retailers?.babylist?.price ??
    retailers?.macrobaby?.price ??
    retailers?.bombi?.price ??
    retailers?.amazon?.price ??
    product.price;
  const priceSource =
    retailers?.babylist?.price != null
      ? 'Babylist'
      : retailers?.macrobaby?.price != null
        ? 'MacroBaby'
        : retailers?.bombi?.price != null
          ? 'Bombi'
          : retailers?.amazon?.price != null
            ? 'Amazon'
            : null;
  const displayTitle = displayNameWithoutBrand(product.displayModel || product.model || product.name, brand);

  return (
    <div
      className="tool-card tool-card--interactive tool-product-card tool-product-card--rich"
      style={{ '--card-i': String(Math.min(index, 11)) } as CSSProperties}
    >
      {product.model ? (
        <Link
          href={compareHref(brand, product.model)}
          className="tool-product-card__compare-pill"
          aria-label={`Compare the ${brand} ${displayTitle} against other strollers`}
        >
          Compare →
        </Link>
      ) : null}
      <div className="tool-card__media tool-product-card__media">
        <OpenBoxBadge offer={openBoxOffer} />
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img loading="lazy" decoding="async" src={product.image} alt={product.name} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{brand}</span>
        )}
      </div>
      <div className="tool-product-card__body">
        {showBrand ? (
          <p className="tool-product-card__brand">{brand}</p>
        ) : null}
        <p className="tool-product-card__title">{displayTitle}</p>
        {product.summary ? (
          <p className="tool-product-card__summary">{product.summary}</p>
        ) : null}
        {displayPrice != null ? (
          <p className="tool-product-card__price">
            ${displayPrice.toFixed(2)}
            {priceSource ? <span>via {priceSource}</span> : null}
          </p>
        ) : null}

        <div className="tool-product-card__actions">
          {offers.map(({ meta, offer }, index) => (
            <ToolRetailerCta
              key={meta.key}
              tool="stroller-finder"
              href={offer.url ?? ''}
              retailer={meta.name}
              product={`${brand} ${displayTitle}`.trim()}
              brand={brand}
              variant={index === 0 ? 'primary' : meta.variant}
              mark
            >
              {meta.shopLabel}
            </ToolRetailerCta>
          ))}
          {/* GoodBuy Gear is open-box resale, not a retail channel for a new
              product, so it never stands in as a card's buy button. Its only
              public surface is the dedicated OpenBoxBadge on the card image. */}
          {product.model ? (
            <div className="tool-card-secondary">
              <Link
                href={compatHref(brand, product.model)}
                className="tool-card-secondary__action tool-card-secondary__action--compat"
                aria-label={`See car seats compatible with the ${brand} ${displayTitle}`}
              >
                <span className="tool-card-secondary__icon" aria-hidden="true">
                  <CarSeatGlyph />
                </span>
                <span className="tool-card-secondary__text">
                  <span className="tool-card-secondary__title">Compatible car seats</span>
                </span>
                <span className="tool-card-secondary__arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function StrollerCatalogFinder({
  brands,
  initialCategory = null,
  initialBrand = null,
  initialMode = null,
}: {
  brands: PublicStrollerBrand[];
  /** When set (from ?category=), open the finder in category view on that bucket. */
  initialCategory?: string | null;
  /** When set (from ?brand=), open the finder on that brand's page — used by the
   *  "back to <brand>" breadcrumb on the compatibility results page. */
  initialBrand?: string | null;
  /** When 'category' (from ?view=category), open the type picker with nothing
   *  selected — used by the Compare tool's "Browse by type" link. */
  initialMode?: 'brand' | 'category' | null;
}) {
  const kind: Kind = 'strollers'; // finder is strollers-only; car seats live in the checker
  const [mode, setMode] = useState<Mode>(initialCategory || initialMode === 'category' ? 'category' : 'brand');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [query, setQuery] = useState('');

  const noun = kind === 'strollers' ? 'stroller' : 'car seat';
  const nounPlural = kind === 'strollers' ? 'strollers' : 'car seats';

  // Fire once when the finder mounts.
  useEffect(() => {
    trackToolOpened('stroller-finder', initialCategory ? { entryCategory: initialCategory } : {});
  }, [initialCategory]);

  const shellRef = useRef<HTMLElement | null>(null);
  const brandNames = useMemo(() => brands.map((b) => b.brand), [brands]);

  const applySelection = useCallback((next: FinderSelection) => {
    setSelectedBrand(next.brand);
    setSelectedCategory(next.category);
    setMode(next.mode);
  }, []);

  // A real navigation — a deep link, the "back to <brand>" breadcrumb on the
  // results page, a link from another page — arrives as new props. The page
  // deliberately does NOT remount this component per selection any more, so
  // `useState(initialBrand)` alone would only ever read the first value.
  useEffect(() => {
    applySelection({
      brand: initialBrand,
      category: initialCategory,
      mode: initialCategory || initialMode === 'category' ? 'category' : 'brand',
    });
  }, [applySelection, initialBrand, initialCategory, initialMode]);

  // Selections made inside the finder only push the URL (see `selectInPlace`),
  // so Back / Forward — and a history restore that hands this component the
  // props of a different entry — have to be read back off the URL.
  useEffect(() => {
    const sync = () => applySelection(finderSelectionFromSearch(window.location.search, brandNames));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [applySelection, brandNames]);

  /**
   * Apply a tile's selection immediately, and keep the URL shareable.
   *
   * The tiles keep real hrefs — crawlers, middle-click and "open in new tab"
   * still work — but a plain left click no longer navigates. Every product of
   * every brand is already in `brands`, so the new view is a state change, not
   * a server round trip: navigating re-ran the whole page (it is force-dynamic,
   * so it re-queried the entire catalog), rebuilt the finder, replayed every
   * entrance animation and scrolled the page back to the top — which read as a
   * full reload. `history.pushState` is understood by the App Router, so the
   * URL stays shareable and `?brand=` still server-renders on a cold load.
   */
  const selectInPlace = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string, next: FinderSelection) => {
      // Leave new-tab, new-window and middle clicks to the browser.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      applySelection(next);
      window.history.pushState(null, '', href);
      // Only scroll when the finder's own header has scrolled off the top;
      // otherwise the page stays exactly where it was.
      const top = shellRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) window.scrollTo({ top: window.scrollY + top - 16, behavior: 'smooth' });
    },
    [applySelection],
  );

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
    applySelection({ brand: null, category: null, mode: next });
    window.history.replaceState(null, '', next === 'category' ? CATEGORY_PICKER_HREF : FINDER_HREF);
  }

  const currentBrand = brands.find((b) => b.brand === selectedBrand) ?? null;
  const currentCategory = categories.find((c) => c.category === selectedCategory) ?? null;

  // Strollers: render the category sections in this fixed order, skipping any the
  // brand has nothing in; leftover buckets (e.g. Wagon) with products are appended.
  // Car seats keep their own single-section shape.
  const brandSections: { label: string; products: FinderProduct[] }[] = !currentBrand
    ? []
    : kind === 'strollers'
      ? (() => {
          const covered = new Set(STROLLER_BRAND_SECTIONS.flatMap((s) => s.match));
          const fixed = STROLLER_BRAND_SECTIONS.map((s) => ({
            label: s.label,
            products: currentBrand.types.filter((t) => s.match.includes(t.category)).flatMap((t) => t.products),
          }));
          const extras = currentBrand.types
            .filter((t) => !covered.has(t.category))
            .map((t) => ({ label: t.label, products: t.products }));
          return [...fixed, ...extras].filter((s) => s.products.length > 0);
        })()
      : currentBrand.types.map((t) => ({ label: t.label, products: t.products }));

  return (
    <section ref={shellRef} className="tool-shell">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <span className="tool-eyebrow">{kind === 'strollers' ? 'Stroller finder' : 'Car seat finder'}</span>
        <h2 className="tool-title">Find your {noun} — by brand or by type</h2>
        <p className="tool-lead">
          {`${totalCount} ${nounPlural} across ${brands.length} brands — live prices and links from Babylist. Search a name, pick a brand, or browse by the kind of ${noun} you need.`}
        </p>
      </div>

      {brands.length > 0 ? (
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
        {brands.length === 0 ? (
          <p className="text-[0.9rem] text-neutral-400">
            The stroller catalog is temporarily unavailable. Please try again shortly.
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
                  <ProductCard key={`${p.brand}-${p.model}-${i}`} brand={p.brand} product={p} showBrand kind={kind} index={i} />
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
                  <Link
                    key={c.category}
                    href={strollerFinderCategoryHref(c.category)}
                    prefetch={false}
                    onClick={(event) => {
                      trackToolSelection('stroller-finder', 'category', c.category);
                      selectInPlace(event, strollerFinderCategoryHref(c.category), {
                        brand: null,
                        category: c.category,
                        mode: 'category',
                      });
                    }}
                    className="tool-card tool-card--interactive items-start gap-1 px-5 py-4 text-left"
                  >
                    <span className="font-serif text-[1.12rem] leading-tight text-neutral-900">{c.label}</span>
                    <span className="text-[0.72rem] text-neutral-400">
                      {c.products.length} {noun}{c.products.length === 1 ? '' : 's'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="tool-fade-up">
              <nav className="flex items-center gap-1.5 text-[0.78rem]">
                <Link
                  href={CATEGORY_PICKER_HREF}
                  prefetch={false}
                  onClick={(event) =>
                    selectInPlace(event, CATEGORY_PICKER_HREF, { brand: null, category: null, mode: 'category' })
                  }
                  className="font-semibold text-[var(--color-accent-dark)] transition hover:underline"
                >
                  All types
                </Link>
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
                  <ProductCard key={`${p.brand}-${p.model}-${i}`} brand={p.brand} product={p} showBrand kind={kind} index={i} />
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
                <Link
                  key={b.brand}
                  href={strollerFinderBrandHref(b.brand)}
                  prefetch={false}
                  onClick={(event) => {
                    trackToolSelection('stroller-finder', 'brand', b.brand);
                    selectInPlace(event, strollerFinderBrandHref(b.brand), {
                      brand: b.brand,
                      category: null,
                      mode: 'brand',
                    });
                  }}
                  className="tool-card tool-card--interactive tool-brand-card"
                >
                  {/* Fixed-size box so every brand logo renders at a uniform footprint */}
                  <div className="tool-brand-card__mark">
                    {BRAND_LOGOS[b.brand] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img loading="lazy" decoding="async" src={BRAND_LOGOS[b.brand]} alt={b.brand} className="tool-brand-card__logo" />
                    ) : (
                      <span className="tool-brand-card__fallback">{b.brand}</span>
                    )}
                  </div>
                  <span className="tool-brand-card__count">
                    {b.count} {noun}{b.count === 1 ? '' : 's'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="tool-fade-up">
            <nav className="flex items-center gap-1.5 text-[0.78rem]">
              <Link
                href={FINDER_HREF}
                prefetch={false}
                onClick={(event) => selectInPlace(event, FINDER_HREF, { brand: null, category: null, mode: 'brand' })}
                className="font-semibold text-[var(--color-accent-dark)] transition hover:underline"
              >
                All brands
              </Link>
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
              {brandSections.map((t) => (
                <div key={t.label}>
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
                      <ProductCard key={`${item.name}-${i}`} brand={currentBrand.brand} product={item} kind={kind} index={i} />
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
