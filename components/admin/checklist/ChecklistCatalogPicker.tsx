'use client';

import { useEffect, useRef, useState } from 'react';

type Result = {
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
 * Prefills a checklist-pick form from the affiliate catalog. Searches
 * /api/admin/catalog/search and, on select, writes brand / product / affiliate +
 * Amazon links / image / price / retailer into the nearest <form>'s named inputs
 * (they're uncontrolled, so setting .value is enough). Taylor can still edit
 * anything afterward. Works in both the "Add a product" and each edit form.
 */
export default function ChecklistCatalogPicker() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/catalog/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  const fill = (r: Result) => {
    const form = rootRef.current?.closest('form');
    if (!form) return;
    const set = (name: string, value: string) => {
      const el = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (el) el.value = value;
    };
    set('brand', r.brand || '');
    set('product', r.name || r.title || '');
    if (r.affiliateUrl) set('affiliateUrl', r.affiliateUrl);
    if (r.amazonUrl) set('amazonUrl', r.amazonUrl);
    if (r.imageUrl) set('imageUrl', r.imageUrl);
    if (typeof r.price === 'number') set('price', String(r.price));
    set('retailer', r.retailer || 'Babylist');
    set('priceSource', r.retailer || 'Babylist');
    setOpen(false);
    setResults([]);
    setQ('');
  };

  return (
    <div ref={rootRef} className="relative sm:col-span-2">
      <label className="flex flex-col gap-1 text-[0.78rem] text-neutral-500">
        Prefill from affiliate catalog
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the catalog (e.g. Vista, PIPA, Tripp Trapp)…"
          className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800"
        />
        <span className="text-[0.72rem] text-neutral-400">
          Pick a match to fill brand, product, links, image, and price — then edit as needed.
        </span>
      </label>

      {open && (results.length > 0 || loading) && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg">
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-400">Searching…</li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.brand}-${r.title}-${i}`}>
                <button
                  type="button"
                  onClick={() => fill(r)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50"
                >
                  {r.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.imageUrl}
                      alt=""
                      className="h-8 w-8 flex-none rounded object-contain"
                    />
                  ) : (
                    <span className="h-8 w-8 flex-none rounded bg-neutral-100" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-800">
                      {r.brand} {r.name || r.title}
                    </span>
                    <span className="text-[0.72rem] text-neutral-400">
                      {r.retailer}
                      {typeof r.price === 'number' ? ` · $${r.price}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
