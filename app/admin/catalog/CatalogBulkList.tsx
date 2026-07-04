'use client';

import { useState } from 'react';
import CatalogRowEditor, { type CatalogProduct } from './CatalogRowEditor';
import { bulkCatalogAction } from './actions';

const BAR_BTN = 'rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[0.72rem] font-semibold text-neutral-700 transition hover:border-neutral-300';

export default function CatalogBulkList({
  products,
  categories,
}: {
  products: CatalogProduct[];
  categories: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = products.length > 0 && selected.size === products.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));

  return (
    <div className="admin-stack gap-3">
      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" className="h-4 w-4" checked={allSelected} onChange={toggleAll} />
        Select all on this page
      </label>

      {products.map((p) => (
        <div key={p.id} className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-5 h-4 w-4 shrink-0"
            checked={selected.has(p.id)}
            onChange={() => toggle(p.id)}
            aria-label={`Select ${p.title}`}
          />
          <div className="min-w-0 flex-1">
            <CatalogRowEditor product={p} categories={categories} />
          </div>
        </div>
      ))}

      {selected.size > 0 ? (
        <form
          action={bulkCatalogAction}
          className="sticky bottom-4 z-10 mx-auto flex w-fit max-w-full flex-wrap items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
        >
          {[...selected].map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          <span className="px-1 text-[0.78rem] font-semibold text-neutral-700">{selected.size} selected</span>
          <button type="submit" name="_bulk" value="review" className={BAR_BTN}>Mark reviewed</button>
          <button type="submit" name="_bulk" value="hide" className={BAR_BTN}>Hide</button>
          <button
            type="submit"
            name="_bulk"
            value="delete"
            onClick={(e) => {
              if (!confirm(`Delete ${selected.size} product${selected.size === 1 ? '' : 's'}? This can't be undone.`)) e.preventDefault();
            }}
            className="rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-[0.72rem] font-semibold text-red-600 transition hover:border-red-300"
          >
            Delete
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="px-2 text-[0.72rem] font-semibold text-neutral-400">
            Clear
          </button>
        </form>
      ) : null}
    </div>
  );
}
