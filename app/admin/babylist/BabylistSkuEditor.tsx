'use client';

import { Fragment, useState } from 'react';

type Row = {
  id: string;
  brand: string;
  model: string;
  name: string;
  babylistSku: string | null;
  babylistPrice: number | null;
  babylistUrl: string | null;
  babylistUpdatedAt: string | null;
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type SearchItem = {
  sku: string;
  name: string;
  manufacturer: string | null;
  price: number | null;
  imageUrl: string | null;
};

export default function BabylistSkuEditor({ strollers }: { strollers: Row[] }) {
  const [skus, setSkus] = useState<Record<string, string>>(() =>
    Object.fromEntries(strollers.map((s) => [s.id, s.babylistSku ?? ''])),
  );
  const [state, setState] = useState<Record<string, SaveState>>({});

  // Per-row catalog search
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [searching, setSearching] = useState(false);

  async function save(id: string) {
    setState((m) => ({ ...m, [id]: 'saving' }));
    try {
      const res = await fetch(`/api/admin/strollers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ babylistSku: skus[id] ?? '' }),
      });
      setState((m) => ({ ...m, [id]: res.ok ? 'saved' : 'error' }));
    } catch {
      setState((m) => ({ ...m, [id]: 'error' }));
    }
  }

  async function runSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/babylist/search?q=${encodeURIComponent(q)}`);
      const data = res.ok ? await res.json() : { items: [] };
      setResults(Array.isArray(data.items) ? data.items : []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function openFind(row: Row) {
    if (openRow === row.id) {
      setOpenRow(null);
      return;
    }
    setOpenRow(row.id);
    void runSearch(row.name);
  }

  function assign(rowId: string, sku: string) {
    setSkus((m) => ({ ...m, [rowId]: sku }));
    setState((m) => ({ ...m, [rowId]: 'idle' }));
    setOpenRow(null);
    setResults([]);
    setQuery('');
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">
            <th className="py-2 pr-4 font-semibold">Stroller</th>
            <th className="py-2 pr-4 font-semibold">Live</th>
            <th className="py-2 pr-4 font-semibold">Babylist SKU</th>
            <th className="py-2 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {strollers.map((s) => {
            const st = state[s.id] ?? 'idle';
            const dirty = (skus[s.id] ?? '') !== (s.babylistSku ?? '');
            return (
              <Fragment key={s.id}>
                <tr className="border-b border-black/5 align-middle">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium text-neutral-900">{s.name}</div>
                    <div className="text-[0.72rem] text-neutral-400">
                      {s.brand} ::: {s.model}
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    {s.babylistUrl ? (
                      <span className="font-semibold text-[var(--gold)]">
                        {s.babylistPrice != null ? `$${s.babylistPrice.toFixed(2)}` : 'linked'}
                      </span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={skus[s.id] ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSkus((m) => ({ ...m, [s.id]: v }));
                          setState((m) => ({ ...m, [s.id]: 'idle' }));
                        }}
                        placeholder="e.g. 2015760"
                        className="w-36 rounded-lg border border-black/12 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none focus:border-[var(--color-accent-dark)]"
                      />
                      <button
                        type="button"
                        onClick={() => openFind(s)}
                        className="rounded-full border border-black/12 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-neutral-600 transition hover:bg-black/[0.03]"
                      >
                        {openRow === s.id ? 'Close' : 'Find'}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={() => save(s.id)}
                      disabled={st === 'saving' || !dirty}
                      className="rounded-full bg-[var(--color-cta-pink)] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-cta-pink-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {st === 'saving' ? 'Saving…' : st === 'saved' ? 'Saved ✓' : st === 'error' ? 'Retry' : 'Save'}
                    </button>
                  </td>
                </tr>

                {openRow === s.id && (
                  <tr className="border-b border-black/5 bg-[rgba(251,247,244,0.6)]">
                    <td colSpan={4} className="px-3 py-3">
                      <input
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => void runSearch(e.target.value)}
                        placeholder="Search the Babylist catalog…"
                        className="mb-3 w-full max-w-md rounded-lg border border-black/12 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-dark)]"
                      />
                      {searching ? (
                        <p className="text-[0.8rem] text-neutral-400">Searching…</p>
                      ) : results.length === 0 ? (
                        <p className="text-[0.8rem] text-neutral-400">
                          No matches. (Run <code>cacheBabylistCatalog.ts</code> if the catalog mirror is empty.)
                        </p>
                      ) : (
                        <ul className="grid gap-1.5">
                          {results.map((r) => (
                            <li key={r.sku}>
                              <button
                                type="button"
                                onClick={() => assign(s.id, r.sku)}
                                className="flex w-full items-center gap-3 rounded-lg border border-black/8 bg-white px-3 py-2 text-left transition hover:border-[var(--color-accent-dark)] hover:bg-[rgba(216,137,160,0.05)]"
                              >
                                {r.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={r.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded object-contain" />
                                ) : (
                                  <span className="h-9 w-9 shrink-0 rounded bg-black/5" />
                                )}
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[0.85rem] font-medium text-neutral-900">{r.name}</span>
                                  <span className="block text-[0.7rem] text-neutral-400">
                                    {r.manufacturer ?? '—'} · SKU {r.sku}
                                  </span>
                                </span>
                                {r.price != null && (
                                  <span className="shrink-0 text-[0.82rem] font-semibold text-[var(--gold)]">
                                    ${r.price.toFixed(2)}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
