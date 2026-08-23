'use client';

import { useEffect, useRef, useState } from 'react';

type Result = {
  brand: string;
  product: string;
  imageUrl: string | null;
  price: number | null;
  priceSource: string | null;
  babylistUrl: string | null;
  amazonUrl: string | null;
  shopUrl: string | null;
  shopRetailer: string | null;
};

/**
 * Prefills a checklist-pick form from a `:::catalog-product` card that already
 * exists in a blog post. Searches /api/admin/blog/catalog-products and, on select,
 * writes brand / product / Babylist + Amazon + other-retailer links / image /
 * price into the nearest <form>'s named inputs. The reverse of the blog editor's
 * "Checklist pick" picker, so products flow both ways.
 */
export default function ChecklistBlogProductPicker() {
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
        const res = await fetch(`/api/admin/blog/catalog-products?q=${encodeURIComponent(query)}`);
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
    set('product', r.product || '');
    if (r.babylistUrl) set('affiliateUrl', r.babylistUrl);
    if (r.amazonUrl) set('amazonUrl', r.amazonUrl);
    if (r.shopUrl) set('secondaryUrl', r.shopUrl);
    if (r.shopRetailer) set('secondaryRetailer', r.shopRetailer);
    if (r.imageUrl) set('imageUrl', r.imageUrl);
    if (typeof r.price === 'number') set('price', String(r.price));
    if (r.priceSource) set('priceSource', r.priceSource);
    setOpen(false);
    setResults([]);
    setQ('');
  };

  return (
    <div ref={rootRef} className="relative sm:col-span-2">
      <label className="flex flex-col gap-1 text-[0.78rem] text-neutral-500">
        Prefill from a blog product card
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products you've added to blog posts…"
          className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800"
        />
        <span className="text-[0.72rem] text-neutral-400">
          Pull a product a card already exists for in the blog — fills brand, product, links, image, and price.
        </span>
      </label>

      {open && (results.length > 0 || loading) && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg">
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-400">Searching…</li>
          ) : (
            results.map((r, i) => {
              const retailers = [
                r.babylistUrl ? 'Babylist' : null,
                r.amazonUrl ? 'Amazon' : null,
                r.shopUrl ? r.shopRetailer || 'Other' : null,
              ].filter(Boolean);
              return (
                <li key={`${r.brand}-${r.product}-${i}`}>
                  <button
                    type="button"
                    onClick={() => fill(r)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50"
                  >
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt="" className="h-8 w-8 flex-none rounded object-contain" />
                    ) : (
                      <span className="h-8 w-8 flex-none rounded bg-neutral-100" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-neutral-800">
                        {r.brand} {r.product}
                      </span>
                      <span className="text-[0.72rem] text-neutral-400">
                        {typeof r.price === 'number' ? `$${r.price}` : 'No price'}
                        {retailers.length ? ` · ${retailers.join(', ')}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
