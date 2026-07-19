'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ToolAffiliateLink from '@/components/tools/ToolAffiliateLink';
import type { StrollerCompareItem } from '@/lib/server/strollerCompareCatalog';

const MAX_COLUMNS = 3;

function formatPrice(value: number | null): string | null {
  if (value == null) return null;
  return `$${Math.round(value)}`;
}

function formatWeight(value: number | null): string | null {
  if (value == null) return null;
  return `${value % 1 === 0 ? value : value.toFixed(1)} lbs`;
}

/** Value cell that can flag the "best" (lightest / highest) number in a row. */
function SpecValue({ text, best }: { text: string | null; best?: boolean }) {
  if (!text) return <span className="text-neutral-300">—</span>;
  return (
    <span className={best ? 'font-semibold text-[var(--color-accent-dark)]' : 'text-neutral-800'}>
      {text}
      {best ? <span className="ml-1 align-middle text-[0.6rem] uppercase tracking-wide text-[var(--color-accent-dark)]/70">best</span> : null}
    </span>
  );
}

function BoolValue({ value }: { value: boolean }) {
  return value ? (
    <span className="font-semibold text-[rgba(58,99,72,0.95)]">✓ Yes</span>
  ) : (
    <span className="text-neutral-400">—</span>
  );
}

/**
 * Full-width search bar for adding a stroller. Rendered OUTSIDE any horizontally
 * scrolling / overflow container so its results dropdown is never clipped.
 */
function AddBar({
  catalog,
  selectedIds,
  onAdd,
}: {
  catalog: StrollerCompareItem[];
  selectedIds: string[];
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const available = catalog.filter((item) => !selectedIds.includes(item.id));
    if (!q) return available.slice(0, 8);
    return available
      .filter((item) => `${item.brand} ${item.model} ${item.displayName}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [catalog, selectedIds, query]);

  return (
    <div ref={boxRef} className="relative mx-auto max-w-xl">
      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        placeholder="Search a stroller by brand or model to add…"
        aria-label="Search strollers to compare"
        className="w-full rounded-full border border-[rgba(215,161,175,0.5)] bg-white px-5 py-3 text-sm text-neutral-800 shadow-[0_6px_18px_rgba(72,49,56,0.05)] outline-none focus:border-[var(--color-accent-dark)]"
      />
      {open && matches.length > 0 ? (
        <ul className="absolute left-0 right-0 z-30 mt-2 max-h-80 overflow-auto rounded-[1rem] border border-[rgba(0,0,0,0.1)] bg-white p-1.5 shadow-[0_18px_40px_rgba(72,49,56,0.16)]">
          {matches.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onAdd(item.id);
                  setQuery('');
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-[0.75rem] px-3 py-2 text-left transition hover:bg-[#fdf1f4]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f6f0ec]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[0.55rem] font-semibold text-neutral-400">{item.brand}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-neutral-800">{item.displayName}</span>
                  {item.categoryLabel ? (
                    <span className="block truncate text-[0.72rem] text-neutral-500">{item.categoryLabel}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProductColumn({ item, onRemove }: { item: StrollerCompareItem; onRemove: () => void }) {
  const price = formatPrice(item.babylistPrice ?? item.macroBabyPrice ?? null);
  return (
    <div className="relative flex flex-col rounded-[1.4rem] border border-[rgba(215,161,175,0.28)] bg-white p-4 shadow-[0_10px_28px_rgba(72,49,56,0.06)]">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.displayName}`}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#f6f0ec] text-neutral-500 transition hover:bg-[#f0dfe4] hover:text-[var(--color-accent-dark)]"
      >
        ✕
      </button>
      <div className="flex h-32 items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.displayName} className="max-h-32 w-auto object-contain" />
        ) : (
          <span className="text-xs font-semibold text-neutral-400">{item.brand}</span>
        )}
      </div>
      <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]">{item.brand}</p>
      <p className="text-[1.02rem] font-semibold leading-snug text-neutral-900">{item.model}</p>
      {price ? <p className="mt-1 text-sm font-semibold text-neutral-700">{price}</p> : null}
    </div>
  );
}

export default function StrollerCompare({
  catalog,
  initialIds,
}: {
  catalog: StrollerCompareItem[];
  initialIds: string[];
}) {
  const byId = useMemo(() => new Map(catalog.map((item) => [item.id, item])), [catalog]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    initialIds.filter((id) => byId.has(id)).slice(0, MAX_COLUMNS),
  );

  // Keep the URL in sync so a comparison can be shared and the back button works.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedIds.length) params.set('ids', selectedIds.join(','));
    const query = params.toString();
    window.history.replaceState(null, '', query ? `/tools/compare?${query}` : '/tools/compare');
  }, [selectedIds]);

  const selected = selectedIds.map((id) => byId.get(id)!).filter(Boolean);

  const add = (id: string) =>
    setSelectedIds((ids) => (ids.includes(id) || ids.length >= MAX_COLUMNS ? ids : [...ids, id]));
  const remove = (id: string) => setSelectedIds((ids) => ids.filter((existing) => existing !== id));
  const reset = () => setSelectedIds([]);

  const columns = Math.max(selected.length, 1);
  const gridStyle = { gridTemplateColumns: `minmax(9rem,0.8fr) repeat(${columns}, minmax(11rem, 1fr))` };

  const ownWeights = selected.map((s) => s.ownWeightLbs).filter((w): w is number => w != null);
  const maxWeights = selected.map((s) => s.maxWeightLbs).filter((w): w is number => w != null);
  const lightest = ownWeights.length ? Math.min(...ownWeights) : null;
  const highestMax = maxWeights.length ? Math.max(...maxWeights) : null;

  const rows: { label: string; render: (item: StrollerCompareItem) => ReactNode }[] = [
    { label: 'Price', render: (i) => <SpecValue text={formatPrice(i.babylistPrice ?? i.macroBabyPrice ?? null)} /> },
    { label: 'Type', render: (i) => <SpecValue text={i.categoryLabel} /> },
    {
      label: 'Stroller weight',
      render: (i) => <SpecValue text={formatWeight(i.ownWeightLbs)} best={lightest != null && i.ownWeightLbs === lightest} />,
    },
    {
      label: 'Holds up to',
      render: (i) => <SpecValue text={formatWeight(i.maxWeightLbs)} best={highestMax != null && i.maxWeightLbs === highestMax} />,
    },
    { label: 'Fold', render: (i) => <SpecValue text={i.foldType} /> },
    { label: 'Newborn-ready', render: (i) => <BoolValue value={i.suitableFromBirth} /> },
    { label: 'Jogging-ready', render: (i) => <BoolValue value={i.suitableForJogging} /> },
  ];

  return (
    <div>
      {/* Add / status bar (kept out of any overflow container so the dropdown is never clipped) */}
      <div className="flex flex-col items-center gap-2">
        {selected.length < MAX_COLUMNS ? (
          <AddBar catalog={catalog} selectedIds={selectedIds} onAdd={add} />
        ) : (
          <p className="text-sm font-medium text-neutral-500">Comparing 3 strollers — remove one to swap in another.</p>
        )}
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="link-underline text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-400 hover:text-[var(--color-accent-dark)]"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {selected.length === 0 ? (
        <div className="mt-8 rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-6 py-10 text-center">
          <h2 className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-neutral-900">
            Add two or three strollers to compare
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-neutral-600">
            Search above to line up strollers side by side — weight, fold, price, newborn and jogging readiness, all in one view.
          </p>
        </div>
      ) : (
        <>
          {/* Product columns */}
          <div className="mt-8 overflow-x-auto">
            <div className="grid min-w-[30rem] items-stretch gap-4" style={gridStyle}>
              <div aria-hidden />
              {selected.map((item) => (
                <ProductColumn key={item.id} item={item} onRemove={() => remove(item.id)} />
              ))}
            </div>
          </div>

          {/* Spec table */}
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[30rem] overflow-hidden rounded-[1.4rem] border border-[rgba(0,0,0,0.07)] bg-white/95">
              {rows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid items-center gap-4 px-4 py-3.5 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcf7f8]'}`}
                  style={gridStyle}
                >
                  <div className="text-[0.72rem] font-bold uppercase tracking-[0.13em] text-neutral-500">{row.label}</div>
                  {selected.map((item) => (
                    <div key={item.id}>{row.render(item)}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Buy + compatibility actions */}
          <div className="mt-4 overflow-x-auto">
            <div className="grid min-w-[30rem] items-start gap-4" style={gridStyle}>
              <div aria-hidden />
              {selected.map((item) => {
                const babylist = item.babylistUrl;
                const amazon = item.amazonUrl;
                const macro = !babylist ? item.macroBabyUrl : null;
                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    {babylist ? (
                      <ToolAffiliateLink
                        tool="stroller-compare"
                        href={babylist}
                        product={item.displayName}
                        retailer="babylist"
                        brand={item.brand}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
                      >
                        Shop on Babylist
                      </ToolAffiliateLink>
                    ) : macro ? (
                      <ToolAffiliateLink
                        tool="stroller-compare"
                        href={macro}
                        product={item.displayName}
                        retailer="macrobaby"
                        brand={item.brand}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
                      >
                        Shop on MacroBaby
                      </ToolAffiliateLink>
                    ) : null}
                    {amazon ? (
                      <ToolAffiliateLink
                        tool="stroller-compare"
                        href={amazon}
                        product={item.displayName}
                        retailer="amazon"
                        brand={item.brand}
                        className="inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-4 py-2 text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]"
                      >
                        Shop on Amazon
                      </ToolAffiliateLink>
                    ) : null}
                    <Link
                      href={`/tools/travel-system/results?stroller=${encodeURIComponent(item.id)}`}
                      className="link-underline mt-1 text-center text-[0.74rem] font-semibold text-[var(--color-accent-dark)]"
                    >
                      Compatible car seats →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
