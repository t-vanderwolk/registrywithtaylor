import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';
import { TMBC_CATEGORIES, PRODUCT_TYPES } from '@/lib/catalog/taxonomy';
import { type CatalogProduct } from './CatalogRowEditor';
import CatalogBulkList from './CatalogBulkList';
import { createCatalogProduct } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Catalog · Admin', robots: { index: false, follow: false } };

// New models land in the generated client on the Heroku build (`prisma generate`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PAGE_SIZE = 50;

type SearchParams = Promise<{ q?: string; category?: string; status?: string; page?: string }> | undefined;

export default async function AdminCatalogPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession('/admin/catalog');
  const sp = (searchParams ? await searchParams : {}) ?? {};
  const q = (sp.q ?? '').trim();
  const category = (sp.category ?? '').trim();
  const status = (sp.status ?? '').trim();
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
    ];
  }
  const enrichmentWhere: Record<string, unknown> = {};
  if (category) enrichmentWhere.tmbcCategory = category;
  if (status === 'needs-review') enrichmentWhere.needsReview = true;
  else if (status) enrichmentWhere.reviewStatus = status;
  if (Object.keys(enrichmentWhere).length) where.enrichment = { is: enrichmentWhere };

  let products: CatalogProduct[] = [];
  let total = 0;
  let needsReviewTotal = 0;
  let dbError = false;
  try {
    const [rows, count, needCount] = await Promise.all([
      db.affiliateCatalogProduct.findMany({
        where,
        include: { enrichment: true },
        orderBy: { lastSyncedAt: 'desc' },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      db.affiliateCatalogProduct.count({ where }),
      db.productEnrichment.count({ where: { needsReview: true } }),
    ]);
    products = rows as CatalogProduct[];
    total = count;
    needsReviewTotal = needCount;
  } catch {
    dbError = true; // tables not migrated yet (pre-deploy)
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    params.set('page', String(p));
    return `/admin/catalog?${params.toString()}`;
  };

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Catalog"
          title="Affiliate Catalog"
          subtitle="The full Babylist catalog, auto-categorized into the TMBC taxonomy. Search, review, tag, feature, or hide products. Edits are human-owned — the sync will not overwrite them."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog/compatibility">Compatibility manager</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog/health">Catalog health</Link>
              </AdminButton>
            </div>
          }
        />

        {dbError ? (
          <AdminSurface className="admin-stack">
            <p className="admin-body">
              The catalog tables aren’t available yet. Deploy the migration, then run the import:
            </p>
            <p className="admin-body">
              <code>npx tsx scripts/importAffiliateCatalog.ts --file=&quot;…Babylist-Product-Feed_GOOGLE_TXT.txt&quot;</code>
            </p>
          </AdminSurface>
        ) : (
          <>
            <AdminSurface className="admin-stack gap-3">
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-accent-dark)]">
                  + Add a product manually
                </summary>
                <form action={createCatalogProduct} className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
                    Title *
                    <input name="title" required className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" placeholder="UPPAbaby Vista V2 Stroller" />
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                    Brand
                    <input name="brand" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" placeholder="UPPAbaby" />
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                    Price ($)
                    <input name="price" type="number" step="0.01" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" />
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                    Category
                    <select name="tmbcCategory" defaultValue="" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
                      <option value="">—</option>
                      {TMBC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                    Product type
                    <select name="productType" defaultValue="" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
                      <option value="">—</option>
                      {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
                    Image URL
                    <input name="imageUrl" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" placeholder="https://..." />
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
                    Affiliate URL
                    <input name="affiliateUrl" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" placeholder="https://..." />
                  </label>
                  <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
                    Amazon affiliate link
                    <input name="manualAmazonUrl" className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm" placeholder="https://www.amazon.com/dp/…?tag=taylormadebab-20" />
                  </label>
                  <div className="sm:col-span-2">
                    <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-5 py-2 text-[0.78rem] font-semibold text-white">
                      Add product
                    </button>
                  </div>
                </form>
              </details>
              <p className="admin-body">
                {total.toLocaleString()} products match · {needsReviewTotal.toLocaleString()} need review
              </p>
              <form method="get" className="flex flex-wrap items-end gap-3">
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Search
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Title or brand"
                    className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800"
                  />
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Category
                  <select name="category" defaultValue={category} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
                    <option value="">All</option>
                    {TMBC_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Status
                  <select name="status" defaultValue={status} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
                    <option value="">All</option>
                    <option value="needs-review">Needs review</option>
                    <option value="AUTO_CATEGORIZED">Auto-categorized</option>
                    <option value="NEEDS_REVIEW">Flagged</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  Filter
                </button>
              </form>
            </AdminSurface>

            <div className="admin-stack gap-3">
              {products.length === 0 ? (
                <AdminSurface><p className="admin-body">No products match these filters.</p></AdminSurface>
              ) : (
                <CatalogBulkList products={products} categories={[...TMBC_CATEGORIES]} />
              )}
            </div>

            <div className="flex items-center justify-between">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="admin-body underline">← Prev</Link>
              ) : (
                <span className="admin-body opacity-30">← Prev</span>
              )}
              <span className="admin-body">Page {page} of {pageCount}</span>
              {page < pageCount ? (
                <Link href={pageHref(page + 1)} className="admin-body underline">Next →</Link>
              ) : (
                <span className="admin-body opacity-30">Next →</span>
              )}
            </div>
          </>
        )}
      </AdminContainer>
    </main>
  );
}
