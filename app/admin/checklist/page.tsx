import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import ChecklistCatalogPicker from '@/components/admin/checklist/ChecklistCatalogPicker';
import ChecklistBlogProductPicker from '@/components/admin/checklist/ChecklistBlogProductPicker';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { getChecklistStructure } from '@/lib/checklist/getChecklistStructure';
import {
  CHECKLIST_TAKE_LABELS,
  CHECKLIST_TIMING_LABELS,
  type ChecklistTake,
  type ChecklistTiming,
  type ChecklistType,
} from '@/lib/checklist/data';
import {
  createChecklistProduct,
  updateChecklistProduct,
  deleteChecklistProduct,
  saveChecklistCategory,
  deleteChecklistCategory,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from './actions';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Checklist Products · Admin',
  robots: { index: false, follow: false },
};

// ChecklistProduct / ChecklistCategory / ChecklistItem land in the generated
// client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const field = 'w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';
const lbl = 'flex flex-col gap-1 text-[0.78rem] text-neutral-500';

const VERSIONS: { id: ChecklistType; label: string }[] = [
  { id: 'girl', label: 'Girl' },
  { id: 'boy', label: 'Boy' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'twins', label: 'Twins' },
];
const TIMINGS: ChecklistTiming[] = [
  'before-baby',
  'first-8-weeks',
  '3-6-months',
  '6-12-months',
  'later',
];
const TAKES: ChecklistTake[] = [
  'essential',
  'try-first',
  'register-early',
  'nice-to-have',
  'lifestyle-dependent',
  'wait',
];

type CatGroup = { id: string; title: string; items: { id: string; title: string }[] };

/** Grouped <select> of every checklist line, so a pick can be slotted anywhere. */
function ItemSelect({
  name,
  groups,
  defaultValue,
}: {
  name: string;
  groups: CatGroup[];
  defaultValue?: string | null;
}) {
  return (
    <select name={name} defaultValue={defaultValue ?? ''} className={field}>
      <option value="">— Use default placement —</option>
      {groups.map((g) => (
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

/** Flat <select> of every category (static + admin), for filing a line item. */
function CategorySelect({
  name,
  categories,
  defaultValue,
}: {
  name: string;
  categories: { id: string; title: string; hidden?: boolean }[];
  defaultValue?: string | null;
}) {
  return (
    <select name={name} defaultValue={defaultValue ?? ''} className={field} required>
      <option value="" disabled>
        — Choose a category —
      </option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.title}
          {c.hidden ? ' (hidden)' : ''}
        </option>
      ))}
    </select>
  );
}

function TimingSelect({ defaultValue }: { defaultValue?: string | null }) {
  return (
    <select name="timing" defaultValue={defaultValue ?? ''} className={field}>
      <option value="">— No timing label —</option>
      {TIMINGS.map((timing) => (
        <option key={timing} value={timing}>
          {CHECKLIST_TIMING_LABELS[timing]}
        </option>
      ))}
    </select>
  );
}

function TakeSelect({ defaultValue }: { defaultValue?: string | null }) {
  return (
    <select name="take" defaultValue={defaultValue ?? ''} className={field}>
      <option value="">— No Taylor&apos;s Take —</option>
      {TAKES.map((take) => (
        <option key={take} value={take}>
          {CHECKLIST_TAKE_LABELS[take]}
        </option>
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
function ProductRow({
  r,
  groups,
  itemLabel,
}: {
  r: Row;
  groups: CatGroup[];
  itemLabel: Map<string, string>;
}) {
  // A pick is "live" once it has ANY retailer link — Babylist, Amazon, or other.
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
          <ItemSelect name="checklistItemId" groups={groups} defaultValue={r.checklistItemId} />
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

  // Merged editable structure (static baseline + DB overrides/manual rows).
  const structure = await getChecklistStructure({ includeHidden: true });
  const groups: CatGroup[] = structure.categories.map((c) => ({
    id: c.id,
    title: c.hidden ? `${c.title} (hidden)` : c.title,
    items: structure.items
      .filter((it) => it.category === c.id)
      .map((it) => ({ id: it.id, title: it.hidden ? `${it.title} (hidden)` : it.title })),
  }));
  const itemLabel = new Map(structure.items.map((it) => [it.id, it.title]));
  const itemCategory = new Map(structure.items.map((it) => [it.id, it.category]));
  const categoryTitle = new Map(structure.categories.map((c) => [c.id, c.title]));

  // Organize picks by the category of the checklist line they display under.
  const groupsByKey = new Map<string, { key: string; title: string; rows: Row[] }>();
  for (const c of structure.categories) groupsByKey.set(c.id, { key: c.id, title: c.title, rows: [] });
  groupsByKey.set('__none__', { key: '__none__', title: 'Unassigned (default placement)', rows: [] });
  for (const r of rows) {
    const cat = r.checklistItemId ? itemCategory.get(r.checklistItemId) : undefined;
    const key = cat && groupsByKey.has(cat) ? cat : '__none__';
    groupsByKey.get(key)!.rows.push(r);
  }
  const orderedGroups = [...groupsByKey.values()].filter((g) => g.rows.length > 0);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Checklist"
        title="Baby Checklist"
        subtitle="Manage the public checklist structure and the Taylor's Picks shown inside each checklist section."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/resources/baby-checklist">View public checklist</Link>
          </AdminButton>
        }
      />

      {dbError && (
        <AdminSurface variant="muted">
          <p className="admin-body text-admin-warning">
            The <code>ChecklistProduct</code> table isn&rsquo;t live yet. Deploy the migration, then run{' '}
            <code>npm run checklist:seed</code>.
          </p>
        </AdminSurface>
      )}

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Workspace sections</p>
          <p className="admin-body">
            Use the structure section for checklist rows and visibility. Use Taylor&rsquo;s Picks for products, links, images, and badges.
          </p>
        </div>
        <div className="admin-hub-links">
          <AdminButton asChild variant="primary" size="sm">
            <a href="#checklist-structure">Structure · {structure.categories.length} categories</a>
          </AdminButton>
          <AdminButton asChild variant="secondary" size="sm">
            <a href="#checklist-items">{structure.items.length} line items</a>
          </AdminButton>
          <AdminButton asChild variant="secondary" size="sm">
            <a href="#checklist-picks">{rows.length} Taylor&rsquo;s Picks</a>
          </AdminButton>
        </div>
      </AdminSurface>

      {/* ── Structure: categories + line items ─────────────────────────────── */}
      <AdminSurface as="section" id="checklist-structure" className="admin-stack gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Structure</p>
            <h2 className="admin-h2">Categories &amp; line items</h2>
            <p className="admin-body">
              Every category and line item is editable here, including the original checklist defaults.
              Saving a default row creates a database override; hiding a row keeps product picks and
              affiliate links intact.
            </p>
          </div>
          <span className="admin-chip">{structure.categories.length} categories</span>
        </div>

        {/* Add a category */}
        <details className="rounded-lg border border-neutral-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-neutral-800">+ Add a category</summary>
          <form action={saveChecklistCategory} className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className={lbl}>Title *<input name="title" required placeholder="Keepsakes" className={field} /></label>
            <label className={lbl}>Order<input name="sortOrder" placeholder="100" className={field} /><span className="text-[0.7rem] text-neutral-400">Defaults run 0, 10, 20…; higher = later.</span></label>
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input type="checkbox" name="visible" defaultChecked /> Visible on checklist
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">Add category</button>
            </div>
          </form>
        </details>

        {/* Existing categories, including original defaults */}
        {structure.categories.length > 0 && (
          <div className="mt-3 space-y-2">
            {structure.categories.map((c) => (
              <details key={c.id} className="rounded-lg border border-neutral-200 bg-white p-3">
                <summary className="flex cursor-pointer items-center justify-between text-sm text-neutral-800">
                  <span className="flex items-center gap-2 font-semibold">
                    {c.title}
                    {c.hidden ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">
                        hidden
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {c.source ?? 'static'} · order {c.sortOrder}
                  </span>
                </summary>
                <form action={saveChecklistCategory} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={c.id} />
                  <label className={lbl}>Title<input name="title" defaultValue={c.title} className={field} /></label>
                  <label className={lbl}>Order<input name="sortOrder" defaultValue={c.sortOrder} className={field} /></label>
                  <label className="flex items-center gap-2 text-sm text-neutral-600">
                    <input type="checkbox" name="visible" defaultChecked={!c.hidden} /> Visible on checklist
                  </label>
                  <div className="sm:col-span-2">
                    <button className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white">Save</button>
                  </div>
                </form>
                <form action={deleteChecklistCategory} className="mt-2">
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs font-semibold text-red-600 underline">Hide category</button>
                </form>
              </details>
            ))}
          </div>
        )}

        {/* Add a line item */}
        <details id="checklist-items" className="rounded-lg border border-neutral-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-neutral-800">+ Add a line item</summary>
          <form action={createChecklistItem} className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className={lbl}>Title *<input name="title" required placeholder="Warm-water dispenser" className={field} /></label>
            <label className={lbl}>Category *<CategorySelect name="categoryId" categories={structure.categories} /></label>
            <label className={`${lbl} sm:col-span-2`}>Note<input name="note" placeholder="Short one-liner shown under the title." className={field} /></label>
            <label className={lbl}>Badge<input name="badge" placeholder="NICE TO HAVE" className={field} /></label>
            <label className={lbl}>Order<input name="sortOrder" placeholder="100" className={field} /></label>
            <label className={lbl}>Timing<TimingSelect /></label>
            <label className={lbl}>Taylor&apos;s Take<TakeSelect /></label>
            <label className={`${lbl} sm:col-span-2`}>Taylor&rsquo;s take<textarea name="taylorsTake" rows={2} className={field} /></label>
            <fieldset className="sm:col-span-2">
              <legend className="text-[0.78rem] text-neutral-500">Show on versions (none = all)</legend>
              <div className="mt-1 flex flex-wrap gap-3">
                {VERSIONS.map((v) => (
                  <label key={v.id} className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <input type="checkbox" name="includeVersions" value={v.id} /> {v.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input type="checkbox" name="visible" defaultChecked /> Visible on checklist
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">Add line item</button>
            </div>
          </form>
        </details>

        {/* Existing line items, including original defaults */}
        {structure.items.length > 0 && (
          <div className="mt-3 space-y-2">
            {structure.items.map((it) => (
              <details key={it.id} className="rounded-lg border border-neutral-200 bg-white p-3">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm text-neutral-800">
                  <span className="flex items-center gap-2 font-semibold">
                    {it.title}
                    {it.hidden ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">
                        hidden
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {it.source ?? 'static'} · {categoryTitle.get(it.category) ?? it.category}
                  </span>
                </summary>
                <form action={updateChecklistItem} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={it.id} />
                  <label className={lbl}>Title<input name="title" defaultValue={it.title} className={field} /></label>
                  <label className={lbl}>Category<CategorySelect name="categoryId" categories={structure.categories} defaultValue={it.category} /></label>
                  <label className={`${lbl} sm:col-span-2`}>Note<input name="note" defaultValue={it.note ?? ''} className={field} /></label>
                  <label className={lbl}>Badge<input name="badge" defaultValue={it.badge ?? ''} className={field} /></label>
                  <label className={lbl}>Order<input name="sortOrder" defaultValue={it.sortOrder} className={field} /></label>
                  <label className={lbl}>Timing<TimingSelect defaultValue={it.timing} /></label>
                  <label className={lbl}>Taylor&apos;s Take<TakeSelect defaultValue={it.take} /></label>
                  <label className={`${lbl} sm:col-span-2`}>Taylor&rsquo;s take<textarea name="taylorsTake" rows={2} defaultValue={it.taylorsTake ?? ''} className={field} /></label>
                  <fieldset className="sm:col-span-2">
                    <legend className="text-[0.78rem] text-neutral-500">Show on versions (none = all)</legend>
                    <div className="mt-1 flex flex-wrap gap-3">
                      {VERSIONS.map((v) => (
                        <label key={v.id} className="flex items-center gap-1.5 text-sm text-neutral-600">
                          <input type="checkbox" name="includeVersions" value={v.id} defaultChecked={it.include?.includes(v.id)} /> {v.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="flex items-center gap-2 text-sm text-neutral-600">
                    <input type="checkbox" name="visible" defaultChecked={!it.hidden} /> Visible on checklist
                  </label>
                  <div className="sm:col-span-2">
                    <button className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white">Save</button>
                  </div>
                </form>
                <form action={deleteChecklistItem} className="mt-2">
                  <input type="hidden" name="id" value={it.id} />
                  <button className="text-xs font-semibold text-red-600 underline">Hide line item</button>
                </form>
              </details>
            ))}
          </div>
        )}
      </AdminSurface>

      {/* ── Products / picks ───────────────────────────────────────────────── */}
      <AdminSurface as="section" id="checklist-picks" className="admin-stack gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Products</p>
            <h2 className="admin-h2">Taylor&rsquo;s Picks</h2>
            <p className="admin-body">
              Edit product copy, badges, images, and retailer links shown inside the public checklist.
            </p>
          </div>
          <span className="admin-chip">{rows.length} picks</span>
        </div>

        {/* Create */}
        <details className="rounded-lg border border-neutral-200 bg-white p-4">
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
              <ItemSelect name="checklistItemId" groups={groups} />
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
              <h3 className="pt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {g.title} <span className="text-neutral-300">· {g.rows.length}</span>
              </h3>
              {g.rows.map((r) => (
                <ProductRow key={r.id} r={r} groups={groups} itemLabel={itemLabel} />
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
      </AdminSurface>
    </AdminStack>
  );
}
