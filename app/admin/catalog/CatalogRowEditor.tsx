'use client';

import { useState, type ReactNode } from 'react';
import { PRODUCT_TYPES, STROLLER_PRODUCT_TYPES } from '@/lib/catalog/taxonomy';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { saveEnrichment, deleteCatalogProduct } from './actions';

export type CatalogEnrichment = {
  tmbcCategory: string | null;
  tmbcSubcategory: string | null;
  productType: string | null;
  parentJourney: string | null;
  reviewStatus: string;
  needsReview: boolean;
  confidenceScore: number | null;
  isPublic: boolean;
  isFeatured: boolean;
  isTaylorPick: boolean;
  isRecommended: boolean;
  isWorthKnowing: boolean;
  isSkipForMost: boolean;
  taylorsNote: string | null;
  internalNotes: string | null;
  tags: string[];
} | null;

export type CatalogProduct = {
  id: string;
  title: string;
  brand: string | null;
  imageUrl: string | null;
  productTypePath: string | null;
  price: number | null;
  affiliateUrl: string | null;
  manualAmazonUrl: string | null;
  isActiveInFeed: boolean;
  enrichment: CatalogEnrichment;
};

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'pink' | 'gold' | 'muted' }) {
  const cls = {
    neutral: 'bg-neutral-100 text-neutral-600',
    pink: 'bg-[rgba(216,137,160,0.14)] text-[var(--color-accent-dark)]',
    gold: 'bg-[rgba(198,167,94,0.16)] text-[#7a5b1e]',
    muted: 'bg-neutral-100 text-neutral-400',
  }[tone];
  return <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] ${cls}`}>{children}</span>;
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-[0.82rem] text-neutral-600">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}

export default function CatalogRowEditor({ product, categories }: { product: CatalogProduct; categories: string[] }) {
  const e = product.enrichment;
  const [open, setOpen] = useState(false);
  const currentProductType = e?.productType ?? '';
  const otherProductTypes = PRODUCT_TYPES.filter((type) => !STROLLER_PRODUCT_TYPES.includes(type as (typeof STROLLER_PRODUCT_TYPES)[number]));
  const hasCustomProductType = currentProductType && !PRODUCT_TYPES.includes(currentProductType as (typeof PRODUCT_TYPES)[number]);

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-4">
      <div className="flex items-start gap-4">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-neutral-50 object-contain" />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-lg bg-neutral-100" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900">{product.title}</p>
          <p className="text-sm text-neutral-500">
            {product.brand ?? 'Unknown brand'}
            {e?.tmbcCategory ? ` · ${e.tmbcCategory}` : ' · Uncategorized'}
            {e?.productType ? ` · ${e.productType}` : ''}
            {product.price != null ? ` · $${product.price.toFixed(2)}` : ''}
          </p>
          <p className="truncate text-xs text-neutral-400">{product.productTypePath}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {e?.needsReview ? <Badge tone="gold">Needs review</Badge> : null}
            {e?.reviewStatus === 'REVIEWED' ? <Badge tone="neutral">Reviewed</Badge> : null}
            {e?.reviewStatus === 'HIDDEN' ? <Badge tone="muted">Hidden</Badge> : null}
            {e?.isTaylorPick ? <Badge tone="pink">Taylor pick</Badge> : null}
            {e?.isRecommended ? <Badge tone="pink">Recommended</Badge> : null}
            {e?.isPublic ? <Badge tone="neutral">Public</Badge> : null}
            {!product.isActiveInFeed ? <Badge tone="muted">Inactive in feed</Badge> : null}
            {e?.confidenceScore != null ? <Badge tone="muted">conf {e.confidenceScore.toFixed(2)}</Badge> : null}
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
        <form action={saveEnrichment} className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
          <input type="hidden" name="rawProductId" value={product.id} />

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            TMBC category
            <select name="tmbcCategory" defaultValue={e?.tmbcCategory ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            Product type
            <select name="productType" defaultValue={currentProductType} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
              <option value="">—</option>
              <optgroup label="Stroller types">
                {STROLLER_PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </optgroup>
              <optgroup label="Other product types">
                {otherProductTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </optgroup>
              {hasCustomProductType ? <option value={currentProductType}>{currentProductType}</option> : null}
            </select>
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            Subcategory
            <input name="tmbcSubcategory" defaultValue={e?.tmbcSubcategory ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            Journey
            <input name="parentJourney" defaultValue={e?.parentJourney ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Tags (comma-separated)
            <input name="tags" defaultValue={e?.tags?.join(', ') ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Taylor’s note
            <textarea name="taylorsNote" defaultValue={e?.taylorsNote ?? ''} rows={2} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <p className="admin-eyebrow sm:col-span-2 mt-1">Product & buy-links (human-owned — the feed sync won’t overwrite)</p>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Title
            <input name="title" defaultValue={product.title} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            Brand
            <input name="brand" defaultValue={product.brand ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
            Price ($)
            <input name="price" type="number" step="0.01" defaultValue={product.price ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Image URL
            <input name="imageUrl" defaultValue={product.imageUrl ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Babylist / affiliate URL
            <input name="affiliateUrl" defaultValue={product.affiliateUrl ?? ''} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
            Amazon affiliate link (manual override)
            <input name="manualAmazonUrl" defaultValue={product.manualAmazonUrl ?? ''} placeholder="https://www.amazon.com/dp/…?tag=taylormadebab-20" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
          </label>

          <fieldset className="flex flex-wrap gap-x-4 gap-y-2 sm:col-span-2">
            <Check name="isPublic" label="Public" defaultChecked={e?.isPublic} />
            <Check name="isTaylorPick" label="Taylor pick" defaultChecked={e?.isTaylorPick} />
            <Check name="isRecommended" label="Recommended" defaultChecked={e?.isRecommended} />
            <Check name="isWorthKnowing" label="Worth knowing" defaultChecked={e?.isWorthKnowing} />
            <Check name="isSkipForMost" label="Skip for most" defaultChecked={e?.isSkipForMost} />
            <Check name="isFeatured" label="Featured" defaultChecked={e?.isFeatured} />
          </fieldset>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            {product.affiliateUrl ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="text-sm text-[var(--color-accent-dark)] underline"
              >
                View on Babylist →
              </a>
            ) : null}
            <span className="flex-1" />
            <button name="_action" value="hide" type="submit" className="rounded-full border border-neutral-200 px-4 py-2 text-[0.78rem] font-semibold text-neutral-600">
              Hide
            </button>
            <button name="_action" value="save" type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold text-white">
              Save + mark reviewed
            </button>
          </div>
        </form>
      ) : null}

      {open ? (
        <form action={deleteCatalogProduct} className="mt-3 flex justify-end border-t border-neutral-100 pt-3">
          <input type="hidden" name="rawProductId" value={product.id} />
          <ConfirmButton
            message={`Delete "${product.title}"? This removes the product and its enrichment from the catalog.`}
            className="rounded-full border border-red-200 px-4 py-2 text-[0.78rem] font-semibold text-red-600"
          >
            Delete product
          </ConfirmButton>
        </form>
      ) : null}
    </div>
  );
}
