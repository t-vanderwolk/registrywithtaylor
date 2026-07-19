'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ToolAffiliateLink from '@/components/tools/ToolAffiliateLink';
import type { StrollerCompareItem } from '@/lib/server/strollerCompareCatalog';

const MAX_COLUMNS = 3;
const ORDINAL = ['first', 'second', 'third'];

function formatPrice(value: number | null): string | null {
  if (value == null) return null;
  return `$${Math.round(value)}`;
}

function formatWeight(value: number | null): string | null {
  if (value == null) return null;
  return `${value % 1 === 0 ? value : value.toFixed(1)} lbs`;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
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
 * The active "Add a stroller" slot: a clearly-labelled search field with a
 * results dropdown. Rendered inside the (non-overflow) slot grid so the dropdown
 * is never clipped.
 */
function AddSlot({
  slotNumber,
  catalog,
  selectedIds,
  onAdd,
}: {
  slotNumber: number;
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
    <div
      ref={boxRef}
      className="relative flex min-h-[15rem] flex-col rounded-[1.4rem] border-2 border-dashed border-[rgba(215,161,175,0.6)] bg-[#fdf7f9] p-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-cta-pink)] text-sm font-bold text-white">
          {slotNumber}
        </span>
        <p className="text-[0.82rem] font-semibold text-neutral-700">Add a stroller</p>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.12)] bg-white px-4 py-2.5 text-neutral-500 focus-within:border-[var(--color-accent-dark)]">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          placeholder="Search brand or model…"
          aria-label={`Search a stroller for slot ${slotNumber}`}
          className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </label>

      <p className="mt-3 text-[0.78rem] leading-6 text-neutral-400">
        Start typing to pick your {ORDINAL[slotNumber - 1] ?? 'next'} stroller.
      </p>

      {open && matches.length > 0 ? (
        <ul className="absolute left-3 right-3 top-[7.5rem] z-30 max-h-72 overflow-auto rounded-[1rem] border border-[rgba(0,0,0,0.1)] bg-white p-1.5 shadow-[0_18px_40px_rgba(72,49,56,0.18)]">
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

/** A passive capacity placeholder (shown to the right of the active add slot). */
function PlaceholderSlot({ slotNumber, onFocusAdd }: { slotNumber: number; onFocusAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onFocusAdd}
      className="flex min-h-[15rem] flex-col items-center justify-center gap-2 rounded-[1.4rem] border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-white/40 p-4 text-center transition hover:border-[rgba(215,161,175,0.6)] hover:bg-[#fdf7f9]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-400">+</span>
      <span className="text-[0.8rem] font-medium text-neutral-400">Add a {ORDINAL[slotNumber - 1] ?? 'next'} stroller</span>
    </button>
  );
}

function ProductColumn({ item, index, onRemove }: { item: StrollerCompareItem; index: number; onRemove: () => void }) {
  const price = formatPrice(item.babylistPrice ?? item.macroBabyPrice ?? null);
  return (
    <div className="relative flex min-h-[15rem] flex-col rounded-[1.4rem] border border-[rgba(215,161,175,0.35)] bg-white p-4 shadow-[0_10px_28px_rgba(72,49,56,0.06)]">
      <div className="flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-cta-pink)] text-sm font-bold text-white">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.displayName}`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6f0ec] text-neutral-500 transition hover:bg-[#f0dfe4] hover:text-[var(--color-accent-dark)]"
        >
          ✕
        </button>
      </div>
      <div className="mt-1 flex h-28 items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.displayName} className="max-h-28 w-auto object-contain" />
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

  // Focusing the active search from a passive placeholder card.
  const gridRef = useRef<HTMLDivElement>(null);
  const focusActiveAdd = () => gridRef.current?.querySelector<HTMLInputElement>('input[type="text"]')?.focus();

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
    {
      label: 'Basket capacity',
      render: (i) => <SpecValue text={i.basketCapacityLbs != null ? `${i.basketCapacityLbs} lb limit` : i.basketCapacity} />,
    },
    { label: 'Modular', render: (i) => <BoolValue value={i.modular} /> },
    { label: 'Travel system compatible', render: (i) => <BoolValue value={i.travelSystemCompatible} /> },
    { label: 'Fits overhead bin', render: (i) => <BoolValue value={i.fitsOverheadBin} /> },
    { label: 'Newborn-ready', render: (i) => <BoolValue value={i.suitableFromBirth} /> },
    { label: 'Jogging-ready', render: (i) => <BoolValue value={i.suitableForJogging} /> },
  ];

  // Build the slot row: filled product columns, then the active add slot, then
  // passive placeholders up to 3 — so the "add up to 3" structure is obvious.
  const firstEmpty = selected.length;

  return (
    <div>
      {/* Instruction + clear */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-neutral-600">
          {selected.length === 0
            ? 'Pick up to 3 strollers to compare side by side.'
            : selected.length === 1
              ? 'Add one or two more to compare them side by side.'
              : `Comparing ${selected.length} strollers.`}
        </p>
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

      {/* Slot cards (no overflow wrapper, so the search dropdown is never clipped) */}
      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: MAX_COLUMNS }).map((_, index) => {
          if (index < selected.length) {
            const item = selected[index];
            return <ProductColumn key={item.id} item={item} index={index} onRemove={() => remove(item.id)} />;
          }
          if (index === firstEmpty) {
            return (
              <AddSlot
                key={`add-${index}`}
                slotNumber={index + 1}
                catalog={catalog}
                selectedIds={selectedIds}
                onAdd={add}
              />
            );
          }
          return <PlaceholderSlot key={`ph-${index}`} slotNumber={index + 1} onFocusAdd={focusActiveAdd} />;
        })}
      </div>

      {selected.length >= 1 ? (
        <>
          {/* Spec table */}
          <div className="mt-8 overflow-x-auto">
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
                        className="tool-btn tool-btn--primary min-h-0 px-4 py-2 text-[0.78rem]"
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
                        className="tool-btn tool-btn--primary min-h-0 px-4 py-2 text-[0.78rem]"
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
                        className="tool-btn tool-btn--ghost min-h-0 px-4 py-2 text-[0.78rem]"
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
      ) : null}
    </div>
  );
}
