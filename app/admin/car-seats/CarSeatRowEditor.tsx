'use client';

import { useState } from 'react';
import { updateCarSeat, deleteCarSeat } from './actions';

export type CarSeatRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  seatType: string;
  summary: string | null;
  amazonUrl: string | null;
  babylistUrl: string | null;
  babylistImage: string | null;
  babylistPrice: number | null;
  compatibilityCount: number;
};

const field = 'rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';
const labelCls = 'admin-stack gap-1 text-[0.78rem] text-neutral-500';

export default function CarSeatRowEditor({ carSeat }: { carSeat: CarSeatRow }) {
  const [open, setOpen] = useState(false);
  const c = carSeat;

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-4">
      <div className="flex items-start gap-4">
        {c.babylistImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.babylistImage} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-neutral-50 object-contain" />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-lg bg-neutral-100" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900">{c.displayName || `${c.brand} ${c.model}`}</p>
          <p className="text-sm text-neutral-500">
            {c.brand} · {c.model} · {c.seatType.toLowerCase().replace(/_/g, ' ')}
            {c.babylistPrice != null ? ` · $${c.babylistPrice.toFixed(2)}` : ''}
            {` · ${c.compatibilityCount} stroller match${c.compatibilityCount === 1 ? '' : 'es'}`}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {c.amazonUrl ? <span className="rounded-full bg-[rgba(198,167,94,0.16)] px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-[#7a5b1e]">Amazon link</span> : null}
            {c.summary ? <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-neutral-600">Summary</span> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 text-sm font-semibold text-[var(--color-accent-dark)] underline"
        >
          {open ? 'Close' : 'Edit'}
        </button>
      </div>

      {open ? (
        <>
          <form action={updateCarSeat} className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={c.id} />
            <label className={labelCls}>
              Display name
              <input name="displayName" defaultValue={c.displayName ?? ''} className={field} />
            </label>
            <label className={labelCls}>
              Seat type
              <select name="seatType" defaultValue={c.seatType} className={field}>
                <option value="INFANT">Infant</option>
                <option value="CONVERTIBLE">Convertible</option>
                <option value="ALL_IN_ONE">All-in-one</option>
              </select>
            </label>
            <label className={`${labelCls} sm:col-span-2`}>
              Amazon affiliate link
              <input name="amazonUrl" defaultValue={c.amazonUrl ?? ''} placeholder="https://www.amazon.com/dp/…?tag=taylormadebab-20" className={field} />
            </label>
            <label className={`${labelCls} sm:col-span-2`}>
              Summary
              <textarea name="summary" defaultValue={c.summary ?? ''} rows={3} className={field} />
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              {c.amazonUrl ? (
                <a href={c.amazonUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-sm text-[var(--color-accent-dark)] underline">
                  View Amazon link →
                </a>
              ) : null}
              {c.babylistUrl ? (
                <a href={c.babylistUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-sm text-[var(--color-accent-dark)] underline">
                  View Babylist →
                </a>
              ) : null}
              <a href={`/admin/catalog/compatibility?carSeatId=${c.id}`} className="text-sm font-semibold text-[var(--color-accent-dark)] underline">
                Manage stroller matches ({c.compatibilityCount}) →
              </a>
              <span className="flex-1" />
              <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold text-white">
                Save car seat
              </button>
            </div>
          </form>

          <form
            action={deleteCarSeat}
            className="mt-3 flex justify-end border-t border-neutral-100 pt-3"
            onSubmit={(e) => {
              if (!confirm(`Delete ${c.displayName || `${c.brand} ${c.model}`}? This also removes its ${c.compatibilityCount} compatibility row(s).`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={c.id} />
            <button type="submit" className="rounded-full border border-red-200 px-4 py-2 text-[0.78rem] font-semibold text-red-600">
              Delete car seat
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
