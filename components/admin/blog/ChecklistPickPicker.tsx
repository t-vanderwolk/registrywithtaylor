'use client';

import { useEffect, useRef, useState } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';

type PickResult = {
  id: string;
  brand: string;
  product: string;
  bestFor: string | null;
  babylistUrl: string | null;
  amazonUrl: string | null;
  secondaryUrl: string | null;
  secondaryRetailer: string | null;
  price: number | null;
  priceSource: string | null;
  imageUrl: string | null;
  badge: string | null;
};

/**
 * Build a `:::catalog-product` block from a checklist pick — the same card the
 * pick renders on the checklist, reused inside a blog post. Only the retailer
 * links actually set on the pick are emitted, so a pick with just Amazon (or just
 * another retailer) inserts exactly those buttons.
 */
function buildBlock(p: PickResult): string {
  const lines = [':::catalog-product', `Brand: ${p.brand}`, `Product: ${p.product}`];
  if (p.bestFor) lines.push(`Note: ${p.bestFor}`);
  if (p.imageUrl) lines.push(`Image: ${p.imageUrl}`);
  if (p.price != null) lines.push(`Price: $${p.price}${p.priceSource ? ` via ${p.priceSource}` : ''}`);
  if (p.babylistUrl) lines.push(`Babylist: ${p.babylistUrl}`);
  if (p.amazonUrl) lines.push(`Amazon: ${p.amazonUrl}`);
  if (p.secondaryUrl) {
    lines.push(`Shop: ${p.secondaryUrl}`);
    if (p.secondaryRetailer) lines.push(`Retailer: ${p.secondaryRetailer}`);
  }
  lines.push(':::');
  return lines.join('\n');
}

export default function ChecklistPickPicker({ onInsert }: { onInsert: (snippet: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PickResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/admin/checklist/search?q=${encodeURIComponent(q)}`)
        .then((r) => (r.ok ? r.json() : { results: [] }))
        .then((d) => setResults(Array.isArray(d.results) ? d.results : []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="admin-stack gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
      <div className="admin-stack gap-1.5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-admin">Checklist pick</h3>
        <p className="admin-micro">
          Insert a product you already set up as a checklist pick. Its image, price, and Babylist / Amazon /
          other-retailer links come straight from the pick — edit them in Admin → Checklist.
        </p>
      </div>

      {open ? (
        <>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a checklist pick (brand or product)"
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
          />

          {loading ? <p className="admin-micro">Searching…</p> : null}
          {!loading && query.trim().length >= 2 && results.length === 0 ? (
            <p className="admin-micro">No checklist picks match “{query.trim()}”.</p>
          ) : null}
          {note ? <p className="admin-micro text-[var(--color-accent-dark)]">{note}</p> : null}

          {results.length > 0 ? (
            <div className="admin-stack max-h-80 gap-2 overflow-y-auto">
              {results.map((p) => {
                const retailers = [
                  p.babylistUrl ? 'Babylist' : null,
                  p.amazonUrl ? 'Amazon' : null,
                  p.secondaryUrl ? p.secondaryRetailer || 'Other' : null,
                ].filter(Boolean);
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-2">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded bg-neutral-50 object-contain" />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded bg-neutral-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {p.brand} {p.product}
                      </p>
                      <p className="admin-micro">
                        {p.price != null ? `$${p.price}` : 'No price'}
                        {retailers.length ? ` · ${retailers.join(', ')}` : ' · no links'}
                      </p>
                    </div>
                    <AdminButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onInsert(buildBlock(p));
                        setNote(`Inserted ${p.brand} ${p.product} at your cursor.`);
                      }}
                    >
                      Insert
                    </AdminButton>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex justify-start">
          <AdminButton type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Search checklist picks
          </AdminButton>
        </div>
      )}
    </div>
  );
}
