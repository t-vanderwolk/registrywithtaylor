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
  categoryRelatedPosts,
  type ChecklistType,
  type ResolvedItem,
} from '@/lib/checklist/data';
import {
  products as staticProducts,
  hasLiveLink,
  type ChecklistProduct,
} from '@/lib/checklist/products';
import { checklistAnalytics } from '@/lib/checklist/analytics';
import { amazonSearchShopUrl, isAmazonAllowedForBrand } from '@/lib/affiliateShopFallbacks';

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

export default function BabyChecklist({
  initialType = DEFAULT_TYPE,
  products = staticProducts,
}: {
  initialType?: ChecklistType;
  /** Product picks keyed by id — from the DB (admin-editable) with a static fallback. */
  products?: Record<string, ChecklistProduct>;
}) {
  const [type, setType] = useState<ChecklistType>(initialType);
  const [checked, setChecked] = useState<Checked>({});
  const [hydrated, setHydrated] = useState(false);
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
    try {
      const param = new URLSearchParams(window.location.search).get('type');
      if (isChecklistType(param) && param !== initialType) {
        setHydrated(false);
        setType(param);
      }
    } catch {
      /* no-op */
    }
  }, [initialType]);

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

  return (
    <div className="tmbc-checklist" ref={rootRef}>
      {/* Print/PDF-only branding header */}
      <div className="tmbc-print-brand" aria-hidden="true">
        <div className="tmbc-print-brand__name">Taylor-Made Baby Co.</div>
        <div className="tmbc-print-brand__url">taylormadebabyco.com</div>
        <div>Baby Registry Checklist — {labelFor(type)}</div>
      </div>

      {/* Version selector */}
      <span className="tmbc-checklist__selector-label" id="tmbc-selector-label">
        Choose your checklist
      </span>
      <div
        className="tmbc-seg tmbc-checklist__selector"
        role="tablist"
        aria-label="Choose your checklist"
      >
        {CHECKLIST_TYPES.map((t) => (
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
        ))}
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
          <details className="tmbc-cat" key={group.category.id} open={idx === 0}>
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
              {(() => {
                const posts = categoryRelatedPosts[group.category.id];
                if (!posts || posts.length === 0) return null;
                return (
                  <div className="tmbc-related">
                    <span className="tmbc-related__label">Related reading</span>
                    <ul className="tmbc-related__links">
                      {posts.map((p) => (
                        <li key={p.slug}>
                          <a
                            className="tmbc-related__link"
                            href={`/blog/${p.slug}`}
                            onClick={() => checklistAnalytics.relatedPostClicked(type, group.category.id, p.slug)}
                          >
                            {p.label}
                            <span className="tmbc-related__arrow" aria-hidden="true">→</span>
                          </a>
                        </li>
                      ))}
                    </ul>
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
  );
}

function ChecklistRow({
  item,
  checked,
  onToggle,
  checklistType,
  productMap,
}: {
  item: ResolvedItem;
  checked: boolean;
  onToggle: (item: ResolvedItem, isChecked: boolean) => void;
  checklistType: ChecklistType;
  productMap: Record<string, ChecklistProduct>;
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
          <summary className="tmbc-item__toggle">Taylor&rsquo;s Take</summary>
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

            {recs.map((rec) => (
              <Recommendation key={rec.id} rec={rec} item={item} checklistType={checklistType} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function Recommendation({
  rec,
  item,
  checklistType,
}: {
  rec: ChecklistProduct;
  item: ResolvedItem;
  checklistType: ChecklistType;
}) {
  const babylistUrl = hasLiveLink(rec) ? rec.affiliateUrl : undefined;
  const amazonUrl =
    rec.amazonUrl ??
    (isAmazonAllowedForBrand(rec.brand)
      ? amazonSearchShopUrl(`${rec.brand} ${rec.product}`)
      : undefined);
  // Any other retailer (Target, brand-direct, etc.) when the pick isn't on
  // Babylist or Amazon. Falls back to a generic "Shop" label if unnamed.
  const otherUrl = rec.secondaryUrl;
  const otherLabel = rec.secondaryRetailer?.trim() || 'Shop';
  return (
    <div className="tmbc-rec">
      <div className="tmbc-rec__media">
        {rec.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="tmbc-rec__image"
            src={rec.imageUrl}
            alt={`${rec.brand} ${rec.product}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="tmbc-rec__image-fallback">{rec.brand}</span>
        )}
      </div>
      <div className="tmbc-rec__body">
        <p className="tmbc-rec__eyebrow">Taylor&rsquo;s Pick</p>
        <p className="tmbc-rec__brand">{rec.brand}</p>
        <p className="tmbc-rec__product">{rec.product}</p>
        {typeof rec.price === 'number' ? (
          <p className="tmbc-rec__price">
            {formatPrice(rec.price)}
            {rec.priceSource ? <span> via {rec.priceSource}</span> : null}
          </p>
        ) : null}
        <p className="tmbc-rec__review">{rec.review}</p>
        <p className="tmbc-rec__meta">
          <strong>Best for:</strong> {rec.bestFor}
        </p>
        <p className="tmbc-rec__meta">
          <strong>Standout:</strong> {rec.standout}
        </p>
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
              Babylist <span aria-hidden="true">→</span>
            </a>
          ) : (
            <p className="tmbc-rec__pending">Taylor&rsquo;s Pick — link coming soon.</p>
          )}
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
              Shop {otherLabel} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
