import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import ChecklistCatalogPicker from '@/components/admin/checklist/ChecklistCatalogPicker';
import ChecklistBlogProductPicker from '@/components/admin/checklist/ChecklistBlogProductPicker';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { getChecklistStructure } from '@/lib/checklist/getChecklistStructure';
import { Fragment } from 'react';
import { parseRetailerLinks } from '@/lib/checklist/productLinks';
import {
  buildChecklistBlogUsage,
  checklistBlogProductKey,
  type BlogProductUsage,
} from '@/lib/admin/checklistBlogUsage';
import {
  createChecklistProduct,
  updateChecklistProduct,
  deleteChecklistProduct,
} from '../actions';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Checklist Product Hub · Admin',
  robots: { index: false, follow: false },
};

// ChecklistProduct lands in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const field = 'w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';
const lbl = 'flex flex-col gap-1 text-[0.78rem] text-neutral-500';

type CatGroup = { id: string; title: string; items: { id: string; title: string }[] };

/** Read the retailerLinks JSON column into the three editable field pairs. */
function extraLinks(value: unknown): { retailer: string; url: string }[] {
  return parseRetailerLinks(value) ?? [];
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
  retailerLinks: unknown;
  checklistItemId: string | null;
  price: number | null;
  priceSource: string | null;
  retailer: string | null;
  imageUrl: string | null;
  badge: string | null;
  disclosure: boolean;
  sortOrder: number;
};

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

function isLivePick(r: Row) {
  return Boolean(
    (r.affiliateUrl && r.affiliateUrl !== 'AFFILIATE_LINK_NEEDED') || r.amazonUrl || r.secondaryUrl,
  );
}

function BlogUsageBadge({ usage }: { usage: BlogProductUsage | undefined }) {
  if (!usage) return null;
  const label = usage.posts.length === 1 ? 'Blog post' : `${usage.posts.length} blog posts`;

  return (
    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-violet-700">
      {label}
    </span>
  );
}

function BlogUsageLinks({ usage }: { usage: BlogProductUsage | undefined }) {
  if (!usage) return null;

  return (
    <div className="admin-stack gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900 sm:col-span-2">
      <p className="font-semibold uppercase tracking-[0.12em]">Also used in blog</p>
      <p>
        {usage.posts.map((post, index) => (
          <span key={post.slug}>
            {index > 0 ? ', ' : ''}
            <Link href={`/blog/${post.slug}`} target="_blank" className="underline underline-offset-2">
              {post.title}
            </Link>
            {post.status !== 'PUBLISHED' ? ` (${post.status.toLowerCase()})` : ''}
          </span>
        ))}
      </p>
    </div>
  );
}

function ProductRow({
  r,
  groups,
  itemLabel,
  usage,
}: {
  r: Row;
  groups: CatGroup[];
  itemLabel: Map<string, string>;
  usage: BlogProductUsage | undefined;
}) {
  const live = isLivePick(r);
  const placement = r.checklistItemId ? itemLabel.get(r.checklistItemId) : null;

  return (
    <details className="rounded-lg border border-neutral-200 bg-white p-4">
      <summary className="flex cursor-pointer items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          {r.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded bg-neutral-50 object-contain" />
          ) : (
            <span className="h-12 w-12 shrink-0 rounded bg-neutral-100" aria-hidden="true" />
          )}
          <span className="min-w-0">
            <span className="block truncate font-semibold text-neutral-800">
              {r.brand} {r.product}
            </span>
            <span className="admin-micro">
              {placement ?? 'Default placement'}
              {typeof r.price === 'number' ? ` · $${r.price}` : ''}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 flex-wrap items-center justify-end gap-2 text-xs text-neutral-400">
          {r.badge ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">{r.badge}</span>
          ) : null}
          <BlogUsageBadge usage={usage} />
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
        <BlogUsageLinks usage={usage} />
        <label className={lbl}>Brand<input name="brand" defaultValue={r.brand} className={field} /></label>
        <label className={lbl}>Product<input name="product" defaultValue={r.product} className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Review<textarea name="review" rows={2} defaultValue={r.review} className={field} /></label>
        <label className={lbl}>Best for<input name="bestFor" defaultValue={r.bestFor} className={field} /></label>
        <label className={lbl}>Standout<input name="standout" defaultValue={r.standout} className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Babylist link (optional)<input name="affiliateUrl" defaultValue={r.affiliateUrl === 'AFFILIATE_LINK_NEEDED' ? '' : r.affiliateUrl} placeholder="https://babylist.pxf.io/…" className={field} /></label>
        <label className={`${lbl} sm:col-span-2`}>Amazon link (optional)<input name="amazonUrl" defaultValue={r.amazonUrl ?? ''} className={field} /></label>
        <label className={lbl}>Other retailer name<input name="secondaryRetailer" defaultValue={r.secondaryRetailer ?? ''} placeholder="Target, Pottery Barn Kids…" className={field} /></label>
        <label className={lbl}>Other retailer link<input name="secondaryUrl" defaultValue={r.secondaryUrl ?? ''} placeholder="https://…" className={field} /></label>
        {[0, 1, 2].map((i) => {
          const extra = extraLinks(r.retailerLinks)[i];
          return (
            <Fragment key={`extra-${r.id}-${i}`}>
              <label className={lbl}>Retailer {i + 3} name<input name={`extraRetailer${i + 1}`} defaultValue={extra?.retailer ?? ''} placeholder="Nordstrom, Bloomingdale's…" className={field} /></label>
              <label className={lbl}>Retailer {i + 3} link<input name={`extraUrl${i + 1}`} defaultValue={extra?.url ?? ''} placeholder="https://…" className={field} /></label>
            </Fragment>
          );
        })}
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

export default async function AdminChecklistProductsPage() {
  await requireAdminSession('/admin/checklist/products');

  let rows: Row[] = [];
  let posts: Array<{ title: string; slug: string; status: string; content: string }> = [];
  let dbError = false;

  try {
    [rows, posts] = await Promise.all([
      db.checklistProduct.findMany({ orderBy: [{ sortOrder: 'asc' }, { brand: 'asc' }, { product: 'asc' }] }),
      db.post.findMany({
        where: { content: { contains: ':::catalog-product' } },
        select: { title: true, slug: true, status: true, content: true },
      }),
    ]);
  } catch {
    dbError = true;
  }

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
  const blogUsage = buildChecklistBlogUsage(posts);
  const rowsWithBlogUsage = rows.filter((r) => blogUsage.has(checklistBlogProductKey(r.brand, r.product)));
  const liveRows = rows.filter(isLivePick);

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
        title="Checklist Product Hub"
        subtitle="A dedicated workspace for every Taylor's Pick shown in the public baby checklist, including links, images, badges, and blog reuse."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/checklist">Checklist structure</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/resources/baby-checklist">View public checklist</Link>
            </AdminButton>
          </div>
        }
      />

      {dbError ? (
        <AdminSurface variant="muted">
          <p className="admin-body text-admin-warning">
            The <code>ChecklistProduct</code> table isn&rsquo;t live yet. Deploy the migration, then run{' '}
            <code>npm run checklist:seed</code>.
          </p>
        </AdminSurface>
      ) : null}

      <section className="admin-kpi-grid" aria-label="Checklist product totals">
        <AdminKpiCard label="Checklist products" value={rows.length.toLocaleString()} />
        <AdminKpiCard label="Live links" value={liveRows.length.toLocaleString()} />
        <AdminKpiCard label="Need links" value={(rows.length - liveRows.length).toLocaleString()} />
        <AdminKpiCard label="Also in blog" value={rowsWithBlogUsage.length.toLocaleString()} />
      </section>

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Hub shortcuts</p>
          <p className="admin-body">
            Products with a matching catalog product card in a blog post show a Blog post badge.
          </p>
        </div>
        <div className="admin-hub-links">
          <AdminButton asChild variant="primary" size="sm">
            <a href="#add-checklist-product">Add product</a>
          </AdminButton>
          <AdminButton asChild variant="secondary" size="sm">
            <a href="#checklist-product-list">All products</a>
          </AdminButton>
          <AdminButton asChild variant="secondary" size="sm">
            <Link href="/admin/blog">Blog hub</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      <AdminSurface as="section" id="add-checklist-product" className="admin-stack gap-4">
        <details>
          <summary className="cursor-pointer font-semibold text-neutral-800">+ Add a checklist product</summary>
          <form action={createChecklistProduct} className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
            <ChecklistCatalogPicker />
            <ChecklistBlogProductPicker />
            <label className={lbl}>Brand *<input name="brand" required className={field} /></label>
            <label className={lbl}>Product *<input name="product" required className={field} /></label>
            <label className={`${lbl} sm:col-span-2`}>Editorial review<textarea name="review" rows={2} className={field} /></label>
            <label className={lbl}>Best for<input name="bestFor" className={field} /></label>
            <label className={lbl}>Standout<input name="standout" className={field} /></label>
            <p className="text-xs text-neutral-500 sm:col-span-2">
              Add at least one retailer link below: Babylist, Amazon, or another retailer. Any one link makes the pick live.
            </p>
            <label className={`${lbl} sm:col-span-2`}>Babylist link (optional)<input name="affiliateUrl" placeholder="https://babylist.pxf.io/…" className={field} /></label>
            <label className={`${lbl} sm:col-span-2`}>Amazon link (optional)<input name="amazonUrl" className={field} /></label>
            <label className={lbl}>Other retailer name (optional)<input name="secondaryRetailer" placeholder="Target, Pottery Barn Kids…" className={field} /></label>
            <label className={lbl}>Other retailer link (optional)<input name="secondaryUrl" placeholder="https://…" className={field} /></label>
            {[0, 1, 2].map((i) => (
              <Fragment key={`new-extra-${i}`}>
                <label className={lbl}>Retailer {i + 3} name (optional)<input name={`extraRetailer${i + 1}`} placeholder="Nordstrom, Bloomingdale's…" className={field} /></label>
                <label className={lbl}>Retailer {i + 3} link (optional)<input name={`extraUrl${i + 1}`} placeholder="https://…" className={field} /></label>
              </Fragment>
            ))}
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
      </AdminSurface>

      <AdminSurface as="section" id="checklist-product-list" className="admin-stack gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Products</p>
            <h2 className="admin-h2">All checklist products</h2>
            <p className="admin-body">
              Blog badges are based on matching brand and product names inside blog catalog-product cards.
            </p>
          </div>
          <span className="admin-chip">{rows.length} products</span>
        </div>

        <div className="space-y-3">
          {orderedGroups.map((g) => (
            <section key={g.key} className="space-y-3">
              <h3 className="pt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {g.title} <span className="text-neutral-300">· {g.rows.length}</span>
              </h3>
              {g.rows.map((r) => (
                <ProductRow
                  key={r.id}
                  r={r}
                  groups={groups}
                  itemLabel={itemLabel}
                  usage={blogUsage.get(checklistBlogProductKey(r.brand, r.product))}
                />
              ))}
            </section>
          ))}
          {rows.length === 0 && !dbError ? (
            <p className="admin-body">
              No products yet. Run <code>npm run checklist:seed</code> to import the current picks, or add one above.
            </p>
          ) : null}
        </div>
      </AdminSurface>
    </AdminStack>
  );
}
