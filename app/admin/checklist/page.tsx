import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
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

export default async function AdminChecklistPage() {
  await requireAdminSession('/admin/checklist');

  let productCount = 0;
  let dbError = false;
  try {
    productCount = await db.checklistProduct.count();
  } catch {
    dbError = true;
  }

  // Merged editable structure (static baseline + DB overrides/manual rows).
  const structure = await getChecklistStructure({ includeHidden: true });
  const categoryTitle = new Map(structure.categories.map((c) => [c.id, c.title]));

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Checklist"
        title="Baby Checklist"
        subtitle="Manage the public checklist categories, line items, timing, visibility, and Taylor's Take labels."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/checklist/products">Product hub</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/resources/baby-checklist">View public checklist</Link>
            </AdminButton>
          </div>
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
            Use this page for checklist rows and visibility. Product picks, links, images, and badges now live in the product hub.
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
            <Link href="/admin/checklist/products">{productCount} product picks</Link>
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

      <AdminSurface className="admin-stack gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Products</p>
            <h2 className="admin-h2">Checklist Product Hub</h2>
            <p className="admin-body">
              Taylor&rsquo;s Picks, affiliate links, product images, badges, and blog-post reuse are managed in a dedicated product workspace.
            </p>
          </div>
          <span className="admin-chip">{productCount} picks</span>
        </div>
        <div>
          <AdminButton asChild variant="primary">
            <Link href="/admin/checklist/products">Open checklist product hub</Link>
          </AdminButton>
        </div>
      </AdminSurface>
    </AdminStack>
  );
}
