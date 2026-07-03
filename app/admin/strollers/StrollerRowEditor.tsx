'use client';

import { useState } from 'react';
import { updateStroller, deleteStroller } from './actions';

export type StrollerSpec = {
  priceRange: string | null;
  lifestyle: string[];
  foldType: string | null;
  isExpandable: boolean;
  maxWeightLbs: number | null;
  ownWeightLbs: number | null;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
} | null;

export type StrollerRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
  amazonUrl: string | null;
  babylistUrl: string | null;
  babylistImage: string | null;
  babylistPrice: number | null;
  compatibilityCount: number;
  spec: StrollerSpec;
};

const field = 'rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';
const labelCls = 'admin-stack gap-1 text-[0.78rem] text-neutral-500';

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-[0.82rem] text-neutral-600">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}

export default function StrollerRowEditor({ stroller }: { stroller: StrollerRow }) {
  const [open, setOpen] = useState(false);
  const s = stroller;
  const spec = s.spec;

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-4">
      <div className="flex items-start gap-4">
        {s.babylistImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.babylistImage} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-neutral-50 object-contain" />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-lg bg-neutral-100" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900">{s.displayName || `${s.brand} ${s.model}`}</p>
          <p className="text-sm text-neutral-500">
            {s.brand} · {s.model}
            {s.babylistPrice != null ? ` · $${s.babylistPrice.toFixed(2)}` : ''}
            {` · ${s.compatibilityCount} car-seat match${s.compatibilityCount === 1 ? '' : 'es'}`}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {s.amazonUrl ? <span className="rounded-full bg-[rgba(198,167,94,0.16)] px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-[#7a5b1e]">Amazon link</span> : null}
            {s.summary ? <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-neutral-600">Summary</span> : null}
            {spec ? <span className="rounded-full bg-[rgba(216,137,160,0.14)] px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-[var(--color-accent-dark)]">Specs</span> : null}
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
          <form action={updateStroller} className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={s.id} />

            <label className={labelCls}>
              Display name
              <input name="displayName" defaultValue={s.displayName ?? ''} className={field} />
            </label>
            <label className={labelCls}>
              Amazon affiliate link
              <input name="amazonUrl" defaultValue={s.amazonUrl ?? ''} placeholder="https://www.amazon.com/dp/…?tag=taylormadebab-20" className={field} />
            </label>

            <label className={`${labelCls} sm:col-span-2`}>
              Summary
              <textarea name="summary" defaultValue={s.summary ?? ''} rows={3} className={field} />
            </label>

            <p className="admin-eyebrow sm:col-span-2 mt-1">Quiz specs</p>

            <label className={labelCls}>
              Price range
              <select name="priceRange" defaultValue={spec?.priceRange ?? ''} className={field}>
                <option value="">—</option>
                <option value="budget">budget</option>
                <option value="mid">mid</option>
                <option value="premium">premium</option>
                <option value="luxury">luxury</option>
              </select>
            </label>
            <label className={labelCls}>
              Fold type
              <select name="foldType" defaultValue={spec?.foldType ?? ''} className={field}>
                <option value="">—</option>
                <option value="one-hand">one-hand</option>
                <option value="compact">compact</option>
                <option value="standard">standard</option>
              </select>
            </label>

            <label className={`${labelCls} sm:col-span-2`}>
              Lifestyle tags (comma-separated: city, suburban, trail, travel)
              <input name="lifestyle" defaultValue={spec?.lifestyle?.join(', ') ?? ''} className={field} />
            </label>

            <label className={labelCls}>
              Max child weight (lbs)
              <input name="maxWeightLbs" type="number" defaultValue={spec?.maxWeightLbs ?? ''} className={field} />
            </label>
            <label className={labelCls}>
              Own weight (lbs)
              <input name="ownWeightLbs" type="number" step="0.1" defaultValue={spec?.ownWeightLbs ?? ''} className={field} />
            </label>
            <label className={labelCls}>
              Budget min ($)
              <input name="budgetMin" type="number" defaultValue={spec?.budgetMin ?? ''} className={field} />
            </label>
            <label className={labelCls}>
              Budget max ($)
              <input name="budgetMax" type="number" defaultValue={spec?.budgetMax ?? ''} className={field} />
            </label>

            <fieldset className="flex flex-wrap gap-x-4 gap-y-2 sm:col-span-2">
              <Check name="isExpandable" label="Expandable" defaultChecked={spec?.isExpandable} />
              <Check name="suitableFromBirth" label="Suitable from birth" defaultChecked={spec?.suitableFromBirth ?? true} />
              <Check name="suitableForJogging" label="Jogging" defaultChecked={spec?.suitableForJogging} />
            </fieldset>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              {s.amazonUrl ? (
                <a href={s.amazonUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-sm text-[var(--color-accent-dark)] underline">
                  View Amazon link →
                </a>
              ) : null}
              {s.babylistUrl ? (
                <a href={s.babylistUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-sm text-[var(--color-accent-dark)] underline">
                  View Babylist →
                </a>
              ) : null}
              <span className="flex-1" />
              <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold text-white">
                Save stroller
              </button>
            </div>
          </form>

          <form
            action={deleteStroller}
            className="mt-3 flex justify-end border-t border-neutral-100 pt-3"
            onSubmit={(e) => {
              if (!confirm(`Delete ${s.displayName || `${s.brand} ${s.model}`}? This also removes its specs and ${s.compatibilityCount} compatibility row(s).`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className="rounded-full border border-red-200 px-4 py-2 text-[0.78rem] font-semibold text-red-600">
              Delete stroller
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
