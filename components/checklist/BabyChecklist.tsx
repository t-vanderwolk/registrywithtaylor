'use client';

import '@/styles/checklist.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CHECKLIST_TYPES,
  DEFAULT_TYPE,
  DISCLOSURE,
  TWINS_CALLOUT,
  groupedItemsForType,
  itemsForType,
  type ChecklistType,
  type ResolvedItem,
  type RelatedReadingCard,
} from '@/lib/checklist/data';
import Image from 'next/image';
import { isRemoteImageUrl, resolveBlogCoverImage } from '@/lib/blog/images';
import { getBlogCategoryLabel } from '@/lib/blogCategories';
import {
  products as staticProducts,
  hasLiveLink,
  type ChecklistProduct,
} from '@/lib/checklist/products';
import { checklistAnalytics } from '@/lib/checklist/analytics';
import { pathForType } from '@/lib/checklist/variants';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

type GoodBuyGearOffer = { url: string | null; price: number | null };

/**
 * "Open Box … at GoodBuy Gear" badge, shown on a pick when the checklist page
 * finds a matching open-box offer. Reuses the shared `.tool-open-box-badge`
 * styles from the free tools so it looks identical site-wide.
 */
function GoodBuyGearBadge({ offer }: { offer?: GoodBuyGearOffer | null }) {
  if (!offer || (!offer.url && offer.price == null)) return null;
  const priceLabel = offer.price != null ? `$${Math.round(offer.price)}` : null;
  const label = priceLabel
    ? `Open box from ${priceLabel} at GoodBuy Gear`
    : 'Open box at GoodBuy Gear';
  const inner = (
    <>
      <span className="tool-open-box-badge__eyebrow">Open Box</span>
      {priceLabel ? <span className="tool-open-box-badge__price">from {priceLabel}</span> : null}
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
      className="tool-open-box-badge"
      aria-label={label}
      title={label}
    >
      {inner}
    </a>
  ) : (
    <span className="tool-open-box-badge" title={label}>
      {inner}
    </span>
  );
}

const formatPrice = (n: number): string => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

const STORAGE_PREFIX = 'tmbc-checklist-';

// Curated, branded print / save-as-PDF files by version (served from /public).
// When a version has one, the "Print / Save as PDF" button opens that PDF;
// versions without one fall back to printing the live, personalized checklist.
const CHECKLIST_PDFS: Partial<Record<ChecklistType, string>> = {
  girl: '/checklists/TMBC_Baby_Girl_Registry_Checklist.pdf',
  boy: '/checklists/TMBC_Baby_Boy_Registry_Checklist.pdf',
  neutral: '/checklists/TMBC_Gender_Neutral_Registry_Checklist.pdf',
  twins: '/checklists/TMBC_Twins_Registry_Checklist.pdf',
};

const isChecklistType = (value: string | null | undefined): value is ChecklistType =>
  Boolean(value) && CHECKLIST_TYPES.some((t) => t.id === value);

const labelFor = (type: ChecklistType) =>
  CHECKLIST_TYPES.find((t) => t.id === type)?.label ?? 'Neutral';

type Checked = Record<string, boolean>;

/**
 * Compact, link-only related-reading card. Shares the JournalCard styling family
 * (image panel, category tag, serif title, rose "Read" cue) but is smaller and
 * has no save/share actions — a supporting element, not a page-taker. The whole
 * card is a single link.
 */
function ReadingCard({ card, onNavigate }: { card: RelatedReadingCard; onNavigate: () => void }) {
  const cover = resolveBlogCoverImage(card.coverImage, card.category);
  return (
    <a href={`/blog/${card.slug}`} className="tmbc-read-card" onClick={onNavigate}>
      <span className="tmbc-read-card__media">
        <Image
          src={cover}
          alt={card.title}
          fill
          sizes="(max-width: 640px) 100vw, 320px"
          className="tmbc-read-card__img"
          loading="lazy"
          // Remote editorial CDNs (e.g. cylex) 403 Next's image optimizer's
          // server-side fetch, breaking the image. Match the site-wide convention:
          // serve remote covers as-is; only optimize local assets.
          unoptimized={isRemoteImageUrl(cover)}
        />
      </span>
      <span className="tmbc-read-card__body">
        {card.category ? (
          <span className="tmbc-read-card__tag">{getBlogCategoryLabel(card.category)}</span>
        ) : (
          <span className="tmbc-read-card__tag">Journal</span>
        )}
        <span className="tmbc-read-card__title">{card.title}</span>
        <span className="tmbc-read-card__cta">
          Read <span aria-hidden="true">→</span>
        </span>
      </span>
    </a>
  );
}

export default function BabyChecklist({
  initialType = DEFAULT_TYPE,
  products = staticProducts,
  relatedReading = {},
  retailerLogos = {},
  goodBuyGearOffers = {},
  linkSelector = false,
}: {
  initialType?: ChecklistType;
  /**
   * When true, the version selector renders as real links to each version's
   * path-based URL (/resources/baby-checklist/<girl|boy|twins>, neutral → base)
   * so switching is a full navigation to an independently-indexed page. When
   * false, it switches client-side (legacy in-page behavior).
   */
  linkSelector?: boolean;
  /** Product picks keyed by id — from the DB (admin-editable) with a static fallback. */
  products?: Record<string, ChecklistProduct>;
  /** Resolved blog cards per category id — built server-side from live posts. */
  relatedReading?: Record<string, RelatedReadingCard[]>;
  /** Affiliate-partner logos (from /admin/partners), keyed by normalized name/slug. */
  retailerLogos?: Record<string, string>;
  /**
   * GoodBuy Gear open-box offers matched to picks, keyed by
   * blogProductKey(brand, product). Present only when a live open-box match
   * exists — the card then shows the "Open Box … at GoodBuy Gear" badge.
   */
  goodBuyGearOffers?: Record<string, { url: string | null; price: number | null }>;
}) {
  const [type, setType] = useState<ChecklistType>(initialType);
  const [checked, setChecked] = useState<Checked>({});
  const [hydrated, setHydrated] = useState(false);
  // Which category accordion is currently open — drives the right-hand reading
  // column so it only shows posts relevant to what the visitor is looking at.
  const [openCategory, setOpenCategory] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Load this version's saved progress from localStorage (client only). Runs on
  // mount and whenever the version changes. Server + first client render show
  // everything unchecked, so there is no hydration mismatch.
  useEffect(() => {
    let next: Checked = {};
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + type);
      if (raw) next = JSON.parse(raw) as Checked;
    } catch {
      next = {};
    }
    setChecked(next);
    setHydrated(true);
  }, [type]);

  // Persist on change (per version).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + type, JSON.stringify(checked));
    } catch {
      /* storage may be unavailable (private mode) — checklist still works */
    }
  }, [checked, type, hydrated]);

  // Honor a ?type= deep link on mount. The page is statically rendered with the
  // default version (best for performance + a clean canonical); if the visitor
  // arrived on e.g. ?type=twins, switch to it client-side.
  useEffect(() => {
    // On path-based variant pages (linkSelector), the URL path — not ?type= —
    // drives the version, so ignore the query param to keep content in sync with
    // the canonical.
    if (linkSelector) return;
    try {
      const param = new URLSearchParams(window.location.search).get('type');
      if (isChecklistType(param) && param !== initialType) {
        setHydrated(false);
        setType(param);
      }
    } catch {
      /* no-op */
    }
  }, [initialType, linkSelector]);

  // Fire checklist_started on load and on each version switch.
  useEffect(() => {
    checklistAnalytics.started(type);
  }, [type]);

  // Print / Save as PDF: open every accordion before printing so nothing is
  // hidden, then restore the previous open/closed state afterward. Also covers
  // the browser's own Ctrl/Cmd+P.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const openAll = () =>
      root.querySelectorAll('details').forEach((d) => {
        d.dataset.prevOpen = String(d.open);
        d.open = true;
      });
    const restore = () =>
      root.querySelectorAll('details').forEach((d) => {
        if (d.dataset.prevOpen !== undefined) {
          d.open = d.dataset.prevOpen === 'true';
          delete d.dataset.prevOpen;
        }
      });
    window.addEventListener('beforeprint', openAll);
    window.addEventListener('afterprint', restore);
    return () => {
      window.removeEventListener('beforeprint', openAll);
      window.removeEventListener('afterprint', restore);
    };
  }, []);

  const groups = useMemo(() => groupedItemsForType(type), [type]);
  const allItems = useMemo(() => itemsForType(type), [type]);
  const total = allItems.length;
  const done = allItems.reduce((n, i) => (checked[i.id] ? n + 1 : n), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Seed the reading column to the first category (rendered open by default), and
  // re-seed when the version changes. Toggling clears/updates it from there, so
  // an empty right column means no category is open.
  useEffect(() => {
    setOpenCategory(groups[0]?.category.id ?? '');
  }, [groups]);

  const selectType = useCallback(
    (next: ChecklistType) => {
      if (next === type) return;
      setHydrated(false);
      setType(next);
      // Reflect the version in the URL without a navigation. The canonical stays
      // the base path (set in page metadata), so this never creates duplicates.
      try {
        const url = new URL(window.location.href);
        if (next === DEFAULT_TYPE) url.searchParams.delete('type');
        else url.searchParams.set('type', next);
        window.history.replaceState({}, '', url.toString());
      } catch {
        /* no-op */
      }
    },
    [type],
  );

  const toggle = useCallback(
    (item: ResolvedItem, isChecked: boolean) => {
      setChecked((prev) => ({ ...prev, [item.id]: isChecked }));
      if (isChecked) checklistAnalytics.itemChecked(type, item.category, item.id);
    },
    [type],
  );

  const reset = useCallback(() => {
    const ok = window.confirm(
      `Reset your ${labelFor(type)} checklist? This clears the items you have checked for this version.`,
    );
    if (!ok) return;
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_PREFIX + type);
    } catch {
      /* no-op */
    }
  }, [type]);

  const print = useCallback(() => {
    checklistAnalytics.printed(type);
    // If this version has a curated, branded PDF, open it (view / save / print
    // from there). Otherwise print the live, personalized checklist.
    const pdf = CHECKLIST_PDFS[type];
    if (pdf) {
      window.open(pdf, '_blank', 'noopener,noreferrer');
      return;
    }
    window.print();
  }, [type]);

  // The right-hand reading column follows the open category. When no category is
  // open (openCategory === ''), it shows nothing.
  const activeCategory = openCategory;
  const sidebarCards = activeCategory ? relatedReading[activeCategory] ?? [] : [];

  return (
    <div className="tmbc-checklist" ref={rootRef}>
      {/* Print/PDF-only branding header */}
      <div className="tmbc-print-brand" aria-hidden="true">
        <div className="tmbc-print-brand__name">Taylor-Made Baby Co.</div>
        <div className="tmbc-print-brand__url">taylormadebabyco.com</div>
        <div>Baby Registry Checklist — {labelFor(type)}</div>
      </div>

      <div className="tmbc-checklist__grid">
        <div className="tmbc-checklist__main">

      {/* Version selector */}
      <span className="tmbc-checklist__selector-label" id="tmbc-selector-label">
        Choose your checklist
      </span>
      <div
        className="tmbc-seg tmbc-checklist__selector"
        role="tablist"
        aria-label="Choose your checklist"
      >
        {CHECKLIST_TYPES.map((t) =>
          linkSelector ? (
            <a
              key={t.id}
              role="tab"
              aria-selected={t.id === type}
              className="tmbc-seg__btn"
              href={pathForType(t.id)}
            >
              {t.label}
            </a>
          ) : (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === type}
              className="tmbc-seg__btn"
              onClick={() => selectType(t.id)}
            >
              {t.label}
            </button>
          ),
        )}
      </div>

      {/* Overall progress + actions */}
      <div className="tmbc-checklist__toolbar">
        <div className="tmbc-progress__label">
          <strong>Your checklist</strong>
          <span className="tmbc-progress__pct">
            {pct}% complete <span aria-hidden="true">·</span> {done} of {total}
          </span>
        </div>
        <div
          className="tmbc-bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall checklist progress"
        >
          <div className="tmbc-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="tmbc-actions">
          <button type="button" className="tmbc-actions__btn" onClick={print}>
            Print / Save as PDF
          </button>
          <button type="button" className="tmbc-actions__btn" onClick={reset}>
            Reset checklist
          </button>
        </div>
      </div>

      {/* Twins-only planning callout */}
      {type === 'twins' && (
        <div className="tmbc-callout">
          <p className="tmbc-callout__heading">{TWINS_CALLOUT.heading}</p>
          <p className="tmbc-callout__body">{TWINS_CALLOUT.body}</p>
        </div>
      )}

      {/* Affiliate disclosure — visible, not dominant */}
      <p className="tmbc-disclosure">{DISCLOSURE}</p>

      {/* Categories */}
      {groups.map((group, idx) => {
        const catItems = group.items;
        const catDone = catItems.reduce((n, i) => (checked[i.id] ? n + 1 : n), 0);
        return (
          <details
            className="tmbc-cat"
            key={group.category.id}
            open={idx === 0}
            onToggle={(e) => {
              if (e.currentTarget.open) setOpenCategory(group.category.id);
              else if (openCategory === group.category.id) setOpenCategory('');
            }}
          >
            <summary className="tmbc-cat__summary">
              <span className="tmbc-cat__name">{group.category.title}</span>
              <span className="tmbc-cat__meta">
                <span>
                  {catDone} of {catItems.length} complete
                </span>
                <span className="tmbc-cat__chevron" aria-hidden="true" />
              </span>
            </summary>
            <div className="tmbc-cat__body">
              {/* Mobile-only: related reading at the top of this category. On
                  desktop it lives in the sticky right column instead. */}
              {(() => {
                const cards = relatedReading[group.category.id];
                if (!cards || cards.length === 0) return null;
                return (
                  <div className="tmbc-related tmbc-related--inline">
                    <p className="tmbc-related__eyebrow">Straight from Taylor</p>
                    <h4 className="tmbc-related__heading">Baby gear guidance</h4>
                    <div className="tmbc-related__grid">
                      {cards.map((card) => (
                        <ReadingCard
                          key={card.slug}
                          card={card}
                          onNavigate={() =>
                            checklistAnalytics.relatedPostClicked(type, group.category.id, card.slug)
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
              {catItems.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  checked={Boolean(checked[item.id])}
                  onToggle={toggle}
                  checklistType={type}
                  productMap={products}
                  retailerLogos={retailerLogos}
                  goodBuyGearOffers={goodBuyGearOffers}
                />
              ))}
            </div>
          </details>
        );
      })}

      {/* Quiet consultation CTA */}
      <section className="tmbc-consult" aria-labelledby="tmbc-consult-title">
        <h2 className="tmbc-consult__title" id="tmbc-consult-title">
          Still not sure what belongs on your registry?
        </h2>
        <p className="tmbc-consult__body">
          Your registry should fit your home, lifestyle, budget, and the way you actually plan to
          parent — not somebody else&rsquo;s checklist.
        </p>
        <a
          className="tmbc-consult__cta"
          href="/book"
          onClick={() => checklistAnalytics.consultationCta()}
        >
          Book a Registry Strategy Session
        </a>
        <a className="tmbc-consult__secondary" href="/blog/taylors-registry-essentials">
          Explore Taylor&rsquo;s Registry Essentials
        </a>
      </section>
        </div>

        {sidebarCards.length > 0 && (
          <aside className="tmbc-checklist__aside" aria-label="Related reading from Taylor">
            <div className="tmbc-related tmbc-related--aside">
              <p className="tmbc-related__eyebrow">Straight from Taylor</p>
              <h4 className="tmbc-related__heading">Baby gear guidance</h4>
              <div className="tmbc-related__grid">
                {sidebarCards.map((card) => (
                  <ReadingCard
                    key={card.slug}
                    card={card}
                    onNavigate={() =>
                      checklistAnalytics.relatedPostClicked(type, activeCategory, card.slug)
                    }
                  />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function ChecklistRow({
  item,
  checked,
  onToggle,
  checklistType,
  productMap,
  retailerLogos,
  goodBuyGearOffers,
}: {
  item: ResolvedItem;
  checked: boolean;
  onToggle: (item: ResolvedItem, isChecked: boolean) => void;
  checklistType: ChecklistType;
  productMap: Record<string, ChecklistProduct>;
  retailerLogos: Record<string, string>;
  goodBuyGearOffers: Record<string, GoodBuyGearOffer>;
}) {
  // Admin-assigned picks (ChecklistProduct.checklistItemId === this item) take
  // precedence over the static recommendationId wiring in data.ts, so Taylor can
  // re-slot picks from the admin. Falls back to the static wiring when none are
  // assigned in the DB.
  const assigned = Object.values(productMap)
    .filter((p) => p.checklistItemId === item.id)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const recIds =
    item.recommendationIds && item.recommendationIds.length
      ? item.recommendationIds
      : item.recommendationId
        ? [item.recommendationId]
        : [];
  const recs = assigned.length
    ? assigned
    : recIds
        .map((id) => productMap[id])
        .filter((p): p is ChecklistProduct => Boolean(p));
  const hasMore = Boolean(item.taylorsTake || recs.length || item.styleSuggestions);
  const inputId = `tmbc-ck-${item.id}`;

  return (
    <div className="tmbc-item">
      <div className="tmbc-item__row">
        <input
          type="checkbox"
          className="tmbc-item__check"
          id={inputId}
          checked={checked}
          onChange={(e) => onToggle(item, e.target.checked)}
        />
        <label className="tmbc-item__label" htmlFor={inputId}>
          <span className="tmbc-item__title">
            {item.title}
            {item.badge && <span className="tmbc-badge">{item.badge}</span>}
            {item.label && <span className="tmbc-badge tmbc-badge--qty">{item.label}</span>}
          </span>
          {item.note && <p className="tmbc-item__note">{item.note}</p>}
        </label>
      </div>

      {hasMore && (
        <details className="tmbc-item__more">
          <summary className="tmbc-item__toggle">Taylor&rsquo;s Top Picks</summary>
          <div className="tmbc-item__detail">
            {item.taylorsTake && (
              <div className="tmbc-take">
                <p className="tmbc-take__label">Taylor&rsquo;s Take</p>
                <p className="tmbc-take__body">{item.taylorsTake}</p>
              </div>
            )}

            {item.styleSuggestions && item.styleSuggestions.length > 0 && (
              <div className="tmbc-style">
                <p className="tmbc-style__label">Style notes (optional)</p>
                <ul>
                  {item.styleSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="tmbc-recs">
              {recs.map((rec) => (
                <Recommendation
                  key={rec.id}
                  rec={rec}
                  item={item}
                  checklistType={checklistType}
                  retailerLogos={retailerLogos}
                  goodBuyGearOffer={goodBuyGearOffers[blogProductKey(rec.brand, rec.product)]}
                />
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

// Retailer → logo asset (public/assets/logos). Babylist + Amazon are always
// available; the "other retailer" gets a logo only when we have one, otherwise
// the button falls back to text. Keys are the lowercased, alphanumeric label.
const RETAILER_LOGOS: Record<string, string> = {
  babylist: '/assets/logos/babylist.png',
  amazon: '/assets/logos/amazon.png',
  macrobaby: '/assets/logos/macrobaby-logo.webp',
  strolleria: '/assets/logos/strolleria.png',
  myregistry: '/assets/logos/myregistry-logo.png',
  babyquip: '/assets/logos/babyquip.png',
};

const retailerLogo = (
  retailer?: string | null,
  dynamic?: Record<string, string>,
): string | null => {
  if (!retailer) return null;
  const key = retailer.toLowerCase().replace(/[^a-z0-9]+/g, '');
  // Curated static logos first (Babylist/Amazon icons), then admin Affiliate
  // Partner logos (from /admin/partners) for any other retailer.
  return RETAILER_LOGOS[key] ?? dynamic?.[key] ?? null;
};

/** Small retailer logo rendered inside a shop CTA. Renders nothing if unknown.
 *  `dynamic` supplies partner logos keyed by normalized name/slug. */
function RetailerLogo({
  retailer,
  dynamic,
}: {
  retailer?: string | null;
  dynamic?: Record<string, string>;
}) {
  const src = retailerLogo(retailer, dynamic);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" className="tmbc-rec__cta-logo" />;
}

function Recommendation({
  rec,
  item,
  checklistType,
  retailerLogos,
  goodBuyGearOffer,
}: {
  rec: ChecklistProduct;
  item: ResolvedItem;
  checklistType: ChecklistType;
  retailerLogos: Record<string, string>;
  goodBuyGearOffer?: GoodBuyGearOffer;
}) {
  const babylistUrl = hasLiveLink(rec) ? rec.affiliateUrl : undefined;
  // Only show the Amazon CTA when a real Amazon link is entered for this pick —
  // no auto-generated Amazon search fallback.
  const amazonUrl = rec.amazonUrl?.trim() ? rec.amazonUrl : undefined;
  // Any other retailer (Target, brand-direct, etc.) when the pick isn't on
  // Babylist or Amazon. Falls back to a generic "Shop" label if unnamed.
  const otherUrl = rec.secondaryUrl;
  const otherLabel = rec.secondaryRetailer?.trim() || 'Shop';
  return (
    <div className="tmbc-rec">
      {rec.badge?.trim() ? (
        <span className="tmbc-rec__pill">{rec.badge.trim()}</span>
      ) : null}
      <div className="tmbc-rec__media">
        {rec.imageUrl ? (
          <Image
            className="tmbc-rec__image"
            src={rec.imageUrl}
            alt={`${rec.brand} ${rec.product}`}
            fill
            sizes="(max-width: 640px) 90vw, 260px"
            style={{ objectFit: 'contain' }}
            loading="lazy"
            // Retailer CDNs can 403 the optimizer's server fetch; serve remote
            // product images directly (site-wide convention).
            unoptimized={isRemoteImageUrl(rec.imageUrl)}
          />
        ) : (
          <span className="tmbc-rec__image-fallback">{rec.brand}</span>
        )}
      </div>
      <div className="tmbc-rec__body">
        <p className="tmbc-rec__brand">{rec.brand}</p>
        <p className="tmbc-rec__product">{rec.product}</p>
        {typeof rec.price === 'number' ? (
          <p className="tmbc-rec__price">
            {formatPrice(rec.price)}
            {rec.priceSource ? <span> via {rec.priceSource}</span> : null}
          </p>
        ) : null}
        {/* GoodBuy Gear open-box match (if any) — stays visible even when the
            "Taylor's take" detail is collapsed on mobile. */}
        {goodBuyGearOffer ? (
          <div className="tmbc-rec__openbox">
            <GoodBuyGearBadge offer={goodBuyGearOffer} />
          </div>
        ) : null}
        <div className="tmbc-rec__actions">
          {babylistUrl ? (
            <a
              className="tmbc-rec__cta tmbc-rec__cta--babylist"
              href={babylistUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                checklistAnalytics.affiliateClicked({
                  checklistType,
                  itemId: item.id,
                  productId: rec.id,
                  product: rec.product,
                  brand: rec.brand,
                  retailer: 'Babylist',
                  url: babylistUrl,
                })
              }
            >
              <RetailerLogo retailer="Babylist" />
              Babylist <span aria-hidden="true">→</span>
            </a>
          ) : null}
          {amazonUrl ? (
            <a
              className="tmbc-rec__cta tmbc-rec__cta--amazon"
              href={amazonUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                checklistAnalytics.affiliateClicked({
                  checklistType,
                  itemId: item.id,
                  productId: rec.id,
                  product: rec.product,
                  brand: rec.brand,
                  retailer: 'Amazon',
                  url: amazonUrl,
                })
              }
            >
              <RetailerLogo retailer="Amazon" />
              Shop Amazon <span aria-hidden="true">→</span>
            </a>
          ) : null}
          {otherUrl ? (
            <a
              className="tmbc-rec__cta tmbc-rec__cta--other"
              href={otherUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() =>
                checklistAnalytics.affiliateClicked({
                  checklistType,
                  itemId: item.id,
                  productId: rec.id,
                  product: rec.product,
                  brand: rec.brand,
                  retailer: otherLabel,
                  url: otherUrl,
                })
              }
            >
              <RetailerLogo retailer={otherLabel} dynamic={retailerLogos} />
              Shop {otherLabel} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
