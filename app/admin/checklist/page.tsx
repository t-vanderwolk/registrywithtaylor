import prismaBase from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import ChecklistCatalogPicker from '@/components/admin/checklist/ChecklistCatalogPicker';
import ChecklistBlogProductPicker from '@/components/admin/checklist/ChecklistBlogProductPicker';
import { categories, checklistItems } from '@/lib/checklist/data';
import {
  createChecklistProduct,
  updateChecklistProduct,
  deleteChecklistProduct,
} from './actions';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Checklist Products · Admin',
  robots: { index: false, follow: false },
};

// ChecklistProduct lands in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const field = 'w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';
const lbl = 'flex flex-col gap-1 text-[0.78rem] text-neutral-500';

// Checklist lines grouped by category, for the "displays under" dropdown.
const itemGroups = categories.map((c) => ({
  id: c.id,
  title: c.title,
  items: checklistItems
    .filter((it) => it.category === c.id)
    // De-dupe (an item id is unique) and keep authoring order.
    .map((it) => ({ id: it.id, title: it.title })),
}));
const itemLabel = new Map(checklistItems.map((it) => [it.id, it.title]));
const itemCategory = new Map(checklistItems.map((it) => [it.id, it.category]));

/** Grouped <select> of every checklist line, so a pick can be slotted anywhere. */
function ItemSelect({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  return (
    <select name={name} defaultValue={defaultValue ?? ''} className={field}>
      <option value="">— Use default placement —</option>
      {itemGroups.map((g) => (
        <optgroup key={g.id} label={g.title}>
          {g.items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.title}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

type Row = {
  id: string;
  brand: string;
  product: string;
  review: string;
  bestFor: string;
  standout: string;
  affiliateUrl: string;
  amazonUrl: string | null;
  secondaryUrl: string | null;
  secondaryRetailer: string | null;
  checklistItemId: string | null;
  price: number | null;
  priceSource: string | null;
  retailer: string | null;
  imageUrl: string | null;
  badge: string | null;
  disclosure: boolean;
};

/** One editable pick (collapsed accordion + edit/delete forms). */
function ProductRow({ r }: { r: Row }) {
  // A pick is "live" once it has ANY retailer link — Babylist, Amazon, or other.
  // No single retailer (Babylist) is required.
  const live = Boolean(
    (r.affiliateUrl && r.affiliateUrl !== 'AFFILIATE_LINK_NEEDED') || r.amazonUrl || r.secondaryUrl,
  );
  const placement = r.checklistItemId ? itemLabel.get(r.checklistItemId) : null;
  return (
    <details className="rounded-lg border border-neutral-200 bg-white p-4">
      <summary className="flex cursor-pointer items-center justify-between gap-3">
        <span className="font-semibold text-neutral-800">
          {r.brand} {r.product}
        </span>
        <span className="flex items-center gap-2 text-xs text-neutral-400">
          {placement ? (
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">{placement}</span>
          ) : null}
          {typeof r.price === 'number' ? <span>${r.price}</span> : null}
          {live ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">live</span>
          ) : (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5">no link</span>
          )}
        </span>
      </summary>

      <form action={updateChecklistProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={r.id} />
        <ChecklistCatalogPicker />
        <ChecklistBlogProductPicker />
        <label className={lbl}>Brand<input name="brand" defaultValue={r.brand} className={field} /></label>
        <label className={lbl}>Product<input name="product" defaultValue={r.product} className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Review<textarea name="review" rows={2} defaultValue={r.review} className={field} /></label>
        <label className={lbl}>Best for<input name="bestFor" defaultValue={r.bestFor} className={field} /></label>
        <label className={lbl}>Standout<input name="standout" defaultValue={r.standout} className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Babylist link (optional)<input name="affiliateUrl" defaultValue={r.affiliateUrl === 'AFFILIATE_LINK_NEEDED' ? '' : r.affiliateUrl} placeholder="https://babylist.pxf.io/…" className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Amazon link (optional)<input name="amazonUrl" defaultValue={r.amazonUrl ?? ''} className={field} /></label>
        <label className={lbl}>Other retailer name<input name="secondaryRetailer" defaultValue={r.secondaryRetailer ?? ''} placeholder="Target, Pottery Barn Kids…" className={field} /></label>
        <label className={lbl}>Other retailer link<input name="secondaryUrl" defaultValue={r.secondaryUrl ?? ''} placeholder="https://…" className={field} /></label>
        <label className={lbl}>Price<input name="price" defaultValue={r.price ?? ''} className={field} /></label>
        <label className={lbl}>Price source<input name="priceSource" defaultValue={r.priceSource ?? ''} className={field} /></label>
        <label className={lbl}>Retailer<input name="retailer" defaultValue={r.retailer ?? ''} className={field} /></label>
        <label className={lbl}>Badge<input name="badge" defaultValue={r.badge ?? ''} className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>
          Displays under checklist item
          <ItemSelect name="checklistItemId" defaultValue={r.checklistItemId} />
        </label>
        <label className={`${lbl} sm:col-span-2`}>Image URL<input name="imageUrl" defaultValue={r.imageUrl ?? ''} className={field} /></label>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" name="disclosure" defaultChecked={r.disclosure} /> Affiliate disclosure
        </label>
        <div className="sm:col-span-2">
          <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </form>

      <form action={deleteChecklistProduct} className="mt-3">
        <input type="hidden" name="id" value={r.id} />
        <button className="text-xs font-semibold text-red-600 underline">Delete this pick</button>
      </form>
    </details>
  );
}

export default async function AdminChecklistPage() {
  await requireAdminSession('/admin/checklist');

  let rows: Row[] = [];
  let dbError = false;
  try {
    rows = (await db.checklistProduct.findMany({ orderBy: { sortOrder: 'asc' } })) as Row[];
  } catch {
    dbError = true;
  }

  // Organize picks by the category of the checklist line they display under,
  // in checklist order, with an "Unassigned" bucket for picks using their
  // built-in placement. Rows keep sortOrder within each group.
  const groupsByKey = new Map<string, { key: string; title: string; rows: Row[] }>();
  for (const c of categories) groupsByKey.set(c.id, { key: c.id, title: c.title, rows: [] });
  groupsByKey.set('__none__', { key: '__none__', title: 'Unassigned (default placement)', rows: [] });
  for (const r of rows) {
    const cat = r.checklistItemId ? itemCategory.get(r.checklistItemId) : undefined;
    const key = cat && groupsByKey.has(cat) ? cat : '__none__';
    groupsByKey.get(key)!.rows.push(r);
  }
  const orderedGroups = [...groupsByKey.values()].filter((g) => g.rows.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-2xl text-neutral-900">Checklist Products</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Taylor&rsquo;s Picks shown on the Baby Checklist tool. Edits go live within an hour (or on
        the next deploy).
      </p>

      {dbError && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The <code>ChecklistProduct</code> table isn&rsquo;t live yet. Deploy the migration, then run{' '}
          <code>npm run checklist:seed</code>.
        </div>
      )}

      {/* Create */}
      <details className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-neutral-800">+ Add a product</summary>
        <form action={createChecklistProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <ChecklistCatalogPicker />
        <ChecklistBlogProductPicker />
          <label className={lbl}>Brand *<input name="brand" required className={field} /></label>
          <label className={lbl}>Product *<input name="product" required className={field} /></label>
          <label className={`${lbl} sm:col-span-2`}>Editorial review<textarea name="review" rows={2} className={field} /></label>
          <label className={lbl}>Best for<input name="bestFor" className={field} /></label>
          <label className={lbl}>Standout<input name="standout" className={field} /></label>
          <p className="text-xs text-neutral-500 sm:col-span-2">
            Add at least one retailer link below — Babylist, Amazon, or another retailer. None is
            individually required; any one makes the pick live.
          </p>
          <label className={`${lbl} sm:col-span-2`}>Babylist link (optional)<input name="affiliateUrl" placeholder="https://babylist.pxf.io/…" className={field} /></label>
          <label className={`${lbl} sm:col-span-2`}>Amazon link (optional)<input name="amazonUrl" className={field} /></label>
          <label className={lbl}>Other retailer name (optional)<input name="secondaryRetailer" placeholder="Target, Pottery Barn Kids…" className={field} /></label>
          <label className={lbl}>Other retailer link (optional)<input name="secondaryUrl" placeholder="https://…" className={field} /></label>
          <label className={lbl}>Price<input name="price" placeholder="149" className={field} /></label>
          <label className={lbl}>Price source<input name="priceSource" placeholder="Babylist" className={field} /></label>
          <label className={lbl}>Retailer<input name="retailer" placeholder="Babylist" className={field} /></label>
          <label className={lbl}>Badge<input name="badge" placeholder="Taylor's Pick" className={field} /></label>
          <label className={`${lbl} sm:col-span-2`}>
            Displays under checklist item
            <ItemSelect name="checklistItemId" />
            <span className="text-[0.72rem] text-neutral-400">
              Which line of the checklist shows this pick. Leave on default to keep its built-in placement.
            </span>
          </label>
          <label className={`${lbl} sm:col-span-2`}>Image URL<input name="imageUrl" className={field} /></label>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="disclosure" /> Affiliate disclosure
          </label>
          <div className="sm:col-span-2">
            <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
              Add product
            </button>
          </div>
        </form>
      </details>

      {/* List / edit / delete */}
      <div className="mt-6 space-y-3">
        {orderedGroups.map((g) => (
          <section key={g.key} className="space-y-3">
            <h2 className="pt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {g.title} <span className="text-neutral-300">· {g.rows.length}</span>
            </h2>
            {g.rows.map((r) => (
              <ProductRow key={r.id} r={r} />
            ))}
          </section>
        ))}
        {rows.length === 0 && !dbError && (
          <p className="text-sm text-neutral-500">
            No products yet. Run <code>npm run checklist:seed</code> to import the current picks, or
            add one above.
          </p>
        )}
      </div>
    </div>
  );
}
