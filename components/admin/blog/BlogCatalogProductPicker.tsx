'use client';

import { useEffect, useRef, useState } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';

type CatalogResult = {
  brand: string;
  name: string;
  title: string;
  affiliateUrl: string | null;
  amazonUrl: string | null;
  imageUrl: string | null;
  price: number | null;
  retailer: string;
};

/**
 * Build a `:::product` styled block from a catalog row. Brand + Product are the
 * catalog's canonical values, so the render-time resolver
 * (lib/server/blogCatalogLinks) re-matches this to the live product and keeps the
 * buy link, image, and price fresh. The Link lines are an immediate fallback.
 */
function buildProductBlock(r: CatalogResult): string {
  const lines = [
    ':::product',
    `Brand: ${r.brand}`,
    `Product: ${r.name}`,
    'Review: Add a sentence on why this one earns a spot.',
    'Best for: Describe the family or scenario it suits best.',
  ];
  if (r.affiliateUrl) lines.push(`Link: Shop at ${r.retailer} | ${r.affiliateUrl}`);
  if (r.amazonUrl) lines.push(`Link: Shop at Amazon | ${r.amazonUrl}`);
  lines.push(':::');
  return lines.join('\n');
}

export default function BlogCatalogProductPicker({ onInsert }: { onInsert: (snippet: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogResult[]>([]);
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
      fetch(`/api/admin/catalog/search?q=${encodeURIComponent(q)}`)
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
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-admin">Catalog product</h3>
        <p className="admin-micro">
          Search the affiliate catalogue and insert a product card wired to the live buy link. The card refreshes its
          price and link automatically from the catalogue.
        </p>
      </div>

      {open ? (
        <>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or model (e.g. UPPAbaby Vista)"
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
          />

          {loading ? <p className="admin-micro">Searching…</p> : null}
          {!loading && query.trim().length >= 2 && results.length === 0 ? (
            <p className="admin-micro">No catalog products match “{query.trim()}”.</p>
          ) : null}
          {note ? <p className="admin-micro text-[var(--color-accent-dark)]">{note}</p> : null}

          {results.length > 0 ? (
            <div className="admin-stack max-h-80 gap-2 overflow-y-auto">
              {results.map((r, i) => (
                <div key={`${r.brand}-${r.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-2">
                  {r.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded bg-neutral-50 object-contain" />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded bg-neutral-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {r.brand} {r.name}
                    </p>
                    <p className="admin-micro">
                      {r.retailer}
                      {r.price != null ? ` · $${r.price.toFixed(2)}` : ''}
                      {r.amazonUrl ? ' · Amazon' : ''}
                    </p>
                  </div>
                  <AdminButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onInsert(buildProductBlock(r));
                      setNote(`Inserted ${r.brand} ${r.name} at your cursor.`);
                    }}
                  >
                    Insert
                  </AdminButton>
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex justify-start">
          <AdminButton type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Search catalog
          </AdminButton>
        </div>
      )}
    </div>
  );
}
