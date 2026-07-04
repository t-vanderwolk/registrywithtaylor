import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';
import { STROLLER_PRODUCT_TYPES } from '@/lib/catalog/taxonomy';
import { setStrollerCategory } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Recategorize strollers · Admin', robots: { index: false, follow: false } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const FINDER_PROVIDERS = ['babylist_impact', 'shopify_macrobaby', 'bombi_direct', 'manual_tmbc'];

// Colored badge per type family so the current type reads at a glance.
const TYPE_BADGE: Record<string, string> = {
  'full-size stroller': 'border-blue-200 bg-blue-50 text-blue-700',
  'compact stroller': 'border-teal-200 bg-teal-50 text-teal-700',
  'travel stroller': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'single-to-double stroller': 'border-purple-200 bg-purple-50 text-purple-700',
  'double stroller': 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  'jogging stroller': 'border-amber-200 bg-amber-50 text-amber-700',
  'double jogging stroller': 'border-orange-200 bg-orange-50 text-orange-700',
  wagon: 'border-lime-200 bg-lime-50 text-lime-700',
  'umbrella stroller': 'border-rose-200 bg-rose-50 text-rose-700',
};
function typeBadge(t: string | null) {
  return t && TYPE_BADGE[t] ? TYPE_BADGE[t] : 'border-neutral-200 bg-neutral-100 text-neutral-600';
}

type Row = {
  id: string;
  brand: string | null;
  title: string;
  imageUrl: string | null;
  enrichment: { productType: string | null; canonicalBrand: string | null; canonicalName: string | null } | null;
};

function label(row: Row) {
  return (row.enrichment?.canonicalName || row.title).trim();
}
function brandOf(row: Row) {
  return (row.enrichment?.canonicalBrand || row.brand || 'Unknown').trim();
}

export default async function RecategorizeStrollersPage() {
  await requireAdminSession('/admin/catalog/recategorize');

  let rows: Row[] = [];
  let dbError = false;
  try {
    rows = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: { in: FINDER_PROVIDERS },
        isActiveInFeed: true,
        enrichment: { is: { tmbcCategory: 'Strollers', reviewStatus: { not: 'HIDDEN' } } },
      },
      select: {
        id: true,
        brand: true,
        title: true,
        imageUrl: true,
        enrichment: { select: { productType: true, canonicalBrand: true, canonicalName: true } },
      },
      orderBy: { title: 'asc' },
      take: 1000,
    });
  } catch {
    dbError = true;
  }

  // Group by brand, sorted; each brand's strollers sorted by label.
  const groups = Object.values(
    rows.reduce<Record<string, { brand: string; items: Row[] }>>((acc, r) => {
      const b = brandOf(r);
      (acc[b] ??= { brand: b, items: [] }).items.push(r);
      return acc;
    }, {}),
  ).sort((a, b) => a.brand.localeCompare(b.brand));
  groups.forEach((g) => g.items.sort((a, b) => label(a).localeCompare(label(b))));

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Databases"
          title="Recategorize strollers"
          subtitle="Set the type for each stroller in the finder, brand by brand. Change a stroller's type and it moves to the matching category everywhere (finder, quiz, checker) on save."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary"><Link href="/admin/catalog">Catalog</Link></AdminButton>
              <AdminButton asChild variant="secondary"><Link href="/tools/stroller-finder">Public finder</Link></AdminButton>
            </div>
          }
        />

        {dbError ? (
          <AdminSurface><p className="admin-body">Could not load strollers. Check the catalog tables.</p></AdminSurface>
        ) : groups.length === 0 ? (
          <AdminSurface><p className="admin-body">No strollers found in the finder catalog.</p></AdminSurface>
        ) : (
          <>
            <AdminSurface>
              <p className="admin-body">
                {rows.length} strollers across {groups.length} brands. Tip: the automated pass
                (<code>npm run catalog:recategorize-types</code>) proposes moves from model naming — use this page for the
                judgment calls it can’t make.
              </p>
            </AdminSurface>

            {groups.map((g) => (
              <AdminSurface key={g.brand} className="admin-stack gap-2">
                <p className="admin-eyebrow border-b border-[rgba(0,0,0,0.06)] pb-2">
                  {g.brand} · {g.items.length}
                </p>
                {g.items.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-2">
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-md bg-white object-contain p-0.5" />
                    ) : (
                      <div className="h-11 w-11 shrink-0 rounded-md bg-neutral-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">{label(r)}</p>
                      <span className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold ${typeBadge(r.enrichment?.productType ?? null)}`}>
                        {r.enrichment?.productType ?? 'uncategorized'}
                      </span>
                    </div>
                    <form action={setStrollerCategory} className="flex shrink-0 items-center gap-2">
                      <input type="hidden" name="rawProductId" value={r.id} />
                      <select
                        name="productType"
                        defaultValue={r.enrichment?.productType ?? ''}
                        className="rounded-md border border-neutral-200 px-2 py-1.5 text-[0.78rem] text-neutral-800"
                      >
                        <option value="" disabled>Set type…</option>
                        {STROLLER_PRODUCT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="submit" className="rounded-full bg-[var(--color-cta-pink)] px-3 py-1.5 text-[0.72rem] font-semibold text-white">
                        Save
                      </button>
                    </form>
                  </div>
                ))}
              </AdminSurface>
            ))}
          </>
        )}
      </AdminContainer>
    </main>
  );
}
