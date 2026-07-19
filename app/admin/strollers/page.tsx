import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';
import StrollerRowEditor, { type StrollerRow } from './StrollerRowEditor';
import { createStroller } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Strollers · Admin', robots: { index: false, follow: false } };

// New columns (amazonUrl) land in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PAGE_SIZE = 40;
const field = 'rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800';

type SearchParams = Promise<{ q?: string; page?: string }> | undefined;

export default async function AdminStrollersPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession('/admin/strollers');
  const sp = (searchParams ? await searchParams : {}) ?? {};
  const q = (sp.q ?? '').trim();
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { brand: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { displayName: { contains: q, mode: 'insensitive' } },
    ];
  }

  let strollers: StrollerRow[] = [];
  let total = 0;
  let dbError = false;
  try {
    const [rows, count] = await Promise.all([
      db.stroller.findMany({
        where,
        include: { spec: true, _count: { select: { compatibilities: true } } },
        orderBy: [{ brand: 'asc' }, { model: 'asc' }],
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      db.stroller.count({ where }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    strollers = (rows as any[]).map((r) => ({
      id: r.id,
      brand: r.brand,
      model: r.model,
      displayName: r.displayName,
      summary: r.summary,
      amazonUrl: r.amazonUrl ?? null,
      babylistUrl: r.babylistUrl ?? null,
      babylistImage: r.babylistImage ?? null,
      babylistPrice: r.babylistPrice ?? null,
      compatibilityCount: r._count?.compatibilities ?? 0,
      spec: r.spec
        ? {
            priceRange: r.spec.priceRange,
            lifestyle: r.spec.lifestyle ?? [],
            foldType: r.spec.foldType,
            isExpandable: r.spec.isExpandable,
            maxWeightLbs: r.spec.maxWeightLbs,
            ownWeightLbs: r.spec.ownWeightLbs,
            suitableFromBirth: r.spec.suitableFromBirth,
            suitableForJogging: r.spec.suitableForJogging,
            budgetMin: r.spec.budgetMin,
            budgetMax: r.spec.budgetMax,
            modular: r.spec.modular ?? null,
            fitsOverheadBin: r.spec.fitsOverheadBin ?? null,
            basketCapacityLbs: r.spec.basketCapacityLbs ?? null,
          }
        : null,
    }));
    total = count;
  } catch {
    dbError = true;
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('page', String(p));
    return `/admin/strollers?${params.toString()}`;
  };

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Databases"
          title="Strollers"
          subtitle="The stroller database behind the finder, checker, and quiz. Add new strollers, edit summaries and quiz specs, set Amazon affiliate links, or remove records."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog/recategorize">Recategorize types</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/admin/car-seats">Car seats →</Link>
              </AdminButton>
            </div>
          }
        />

        {dbError ? (
          <AdminSurface>
            <p className="admin-body">
              The <code>amazonUrl</code> column isn’t live yet. Deploy the migration
              (<code>affiliate_manual_amazon_links</code>) and reload.
            </p>
          </AdminSurface>
        ) : (
          <>
            <AdminSurface className="admin-stack gap-3">
              <p className="admin-eyebrow">Add a stroller</p>
              <form action={createStroller} className="grid gap-3 sm:grid-cols-2">
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Brand *
                  <input name="brand" required placeholder="UPPAbaby" className={field} />
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Model *
                  <input name="model" required placeholder="Vista V2" className={field} />
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Display name
                  <input name="displayName" placeholder="UPPAbaby Vista V2" className={field} />
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Amazon affiliate link
                  <input name="amazonUrl" placeholder="https://www.amazon.com/dp/…?tag=taylormadebab-20" className={field} />
                </label>
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500 sm:col-span-2">
                  Summary
                  <textarea name="summary" rows={2} className={field} />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-5 py-2 text-[0.78rem] font-semibold text-white">
                    Add stroller
                  </button>
                </div>
              </form>
            </AdminSurface>

            <AdminSurface className="admin-stack gap-3">
              <p className="admin-body">{total.toLocaleString()} strollers</p>
              <form method="get" className="flex flex-wrap items-end gap-3">
                <label className="admin-stack gap-1 text-[0.78rem] text-neutral-500">
                  Search
                  <input name="q" defaultValue={q} placeholder="Brand or model" className={field} />
                </label>
                <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white">
                  Filter
                </button>
              </form>
            </AdminSurface>

            <div className="admin-stack gap-3">
              {strollers.length === 0 ? (
                <AdminSurface><p className="admin-body">No strollers match.</p></AdminSurface>
              ) : (
                strollers.map((s) => <StrollerRowEditor key={s.id} stroller={s} />)
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
