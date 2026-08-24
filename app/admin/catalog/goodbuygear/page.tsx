import Link from 'next/link';
import type { ReactNode } from 'react';
import prismaBase from '@/lib/server/prisma';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { requireAdminSession } from '@/lib/server/session';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { resolveBlogGoodBuyGearOffers } from '@/lib/server/blogGoodBuyGear';
import { getPublicStrollerCatalogBrands } from '@/lib/server/publicStrollerCatalog';
import { getPublicCarSeatBrands } from '@/lib/server/publicCarSeatCatalog';
import { listGbgBadgeOverrides } from '@/lib/server/gbgBadgeOverrides';
import { gbgBadgeKey, type GbgBadgeState } from '@/lib/catalog/gbgBadge';
import { setGbgBadgeOverride } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'GoodBuy Gear Badge Control · Admin',
  robots: { index: false, follow: false },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Surface = 'stroller' | 'carseat' | 'blog';

type AuditRow = {
  key: string;
  brand: string;
  name: string;
  surface: Surface;
  matched: boolean; // raw open-box match exists (ungated)
  price: number | null;
  url: string | null;
  state: GbgBadgeState; // admin override
  extra?: ReactNode; // e.g. blog posts that use the card
};

/** True if the badge is currently displayed on the live card. */
function isShown(row: AuditRow): boolean {
  if (row.state === 'off') return false;
  if (row.state === 'on') return true;
  return row.matched;
}

/** Three-way Auto / Show / Hide control, posting to the server action. */
function BadgeControl({ row }: { row: AuditRow }) {
  const btn = (state: GbgBadgeState, label: string, active: boolean, tone: string) => (
    <form action={setGbgBadgeOverride} className="inline">
      <input type="hidden" name="key" value={row.key} />
      <input type="hidden" name="brand" value={row.brand} />
      <input type="hidden" name="name" value={row.name} />
      <input type="hidden" name="surface" value={row.surface} />
      <button
        type="submit"
        name="state"
        value={state}
        disabled={active}
        className={`rounded-full px-2.5 py-0.5 text-xs ${
          active ? `${tone} cursor-default font-semibold` : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
        }`}
        title={active ? `Currently ${label}` : `Set to ${label}`}
      >
        {label}
      </button>
    </form>
  );
  return (
    <div className="flex flex-wrap items-center gap-1">
      {btn('auto', 'Auto', row.state === 'auto', 'bg-sky-100 text-sky-800')}
      {btn('on', 'Show', row.state === 'on', 'bg-emerald-100 text-emerald-800')}
      {btn('off', 'Hide', row.state === 'off', 'bg-rose-100 text-rose-800')}
    </div>
  );
}

function AuditTable({ rows }: { rows: AuditRow[] }) {
  return (
    <AdminTable
      density="compact"
      columns={[
        { key: 'badge', label: 'Badge' },
        { key: 'brand', label: 'Brand' },
        { key: 'product', label: 'Product' },
        { key: 'openbox', label: 'Open-box', align: 'right' },
        { key: 'control', label: 'Control' },
      ]}
      emptyState={<p className="admin-body p-6">Nothing to show here yet.</p>}
    >
      {rows.map((row) => {
        const shown = isShown(row);
        return (
          <tr key={row.key} className="admin-row">
            <td>
              {shown ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">shown</span>
              ) : row.matched ? (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-600">hidden</span>
              ) : (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">no match</span>
              )}
            </td>
            <td className="text-admin">{row.brand}</td>
            <td className="text-admin">
              {row.name}
              {row.extra ? <div className="admin-micro mt-0.5">{row.extra}</div> : null}
            </td>
            <td className="text-right text-admin">
              {row.matched ? (
                row.url ? (
                  <a href={row.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                    {row.price != null ? `$${Math.round(row.price)}` : 'view'}
                  </a>
                ) : row.price != null ? (
                  `$${Math.round(row.price)}`
                ) : (
                  '—'
                )
              ) : row.state === 'on' ? (
                <span className="admin-micro text-neutral-400">no offer</span>
              ) : (
                '—'
              )}
            </td>
            <td>
              <BadgeControl row={row} />
            </td>
          </tr>
        );
      })}
    </AdminTable>
  );
}

/**
 * One place to see and control the "Open Box … at GoodBuy Gear" badge across
 * every funnel tool and the blog. Strollers and car seats are read from the same
 * catalog the finder/quiz/travel-system tools use; blog rows are the
 * :::catalog-product cards. Auto = show when a match exists; Show/Hide force it.
 */
export default async function GoodBuyGearAuditPage() {
  await requireAdminSession('/admin/catalog/goodbuygear');

  const overrides = await listGbgBadgeOverrides();
  const ovMap = new Map<string, GbgBadgeState>(overrides.map((o) => [o.key, o.state]));

  // ── Strollers ──────────────────────────────────────────────────────────────
  const strollerBrands = await getPublicStrollerCatalogBrands().catch(() => []);
  const strollerMap = new Map<string, AuditRow>();
  for (const brand of strollerBrands) {
    for (const type of brand.types) {
      for (const p of type.products) {
        const key = gbgBadgeKey(brand.brand, p.model);
        const raw = p.gbgMatch ?? null;
        const state = ovMap.get(key) ?? 'auto';
        if (!raw && state === 'auto') continue; // only badge-relevant rows
        strollerMap.set(key, {
          key,
          brand: brand.brand,
          name: p.model,
          surface: 'stroller',
          matched: !!raw,
          price: raw?.price ?? null,
          url: raw?.url ?? null,
          state,
        });
      }
    }
  }
  const strollerRows = [...strollerMap.values()].sort(sortRows);

  // ── Car seats ────────────────────────────────────────────────────────────
  const carSeatBrands = await getPublicCarSeatBrands().catch(() => []);
  const carSeatMap = new Map<string, AuditRow>();
  for (const brand of carSeatBrands) {
    for (const type of brand.types) {
      for (const p of type.products) {
        const key = gbgBadgeKey(brand.brand, p.model);
        const raw = p.gbgMatch ?? null;
        const state = ovMap.get(key) ?? 'auto';
        if (!raw && state === 'auto') continue;
        carSeatMap.set(key, {
          key,
          brand: brand.brand,
          name: p.model,
          surface: 'carseat',
          matched: !!raw,
          price: raw?.price ?? null,
          url: raw?.url ?? null,
          state,
        });
      }
    }
  }
  const carSeatRows = [...carSeatMap.values()].sort(sortRows);

  // ── Blog :::catalog-product cards ────────────────────────────────────────────
  let posts: Array<{ title: string; slug: string; status: string; content: string }> = [];
  try {
    posts = await db.post.findMany({ select: { title: true, slug: true, status: true, content: true } });
  } catch {
    posts = [];
  }
  const blogByKey = new Map<
    string,
    { brand: string; product: string; posts: { title: string; slug: string; status: string }[] }
  >();
  for (const post of posts) {
    if (!post.content || !post.content.includes(':::catalog-product')) continue;
    for (const block of extractStyledBlocks(post.content)) {
      if (block.type !== 'catalog-product') continue;
      const brand = (block.brand ?? '').trim();
      const product = (block.productName ?? '').trim();
      if (!brand && !product) continue;
      const bk = blogProductKey(brand, product);
      const row = blogByKey.get(bk) ?? { brand, product, posts: [] };
      if (!row.posts.some((pp) => pp.slug === post.slug)) {
        row.posts.push({ title: post.title, slug: post.slug, status: post.status });
      }
      blogByKey.set(bk, row);
    }
  }
  const blogEntries = [...blogByKey.values()];
  const blogOffers = await resolveBlogGoodBuyGearOffers(
    blogEntries.map((e) => ({ brand: e.brand, productName: e.product })),
    { ignoreOverrides: true },
  );
  const blogRows: AuditRow[] = blogEntries.map((e) => {
    const key = gbgBadgeKey(e.brand, e.product);
    const offer = blogOffers[blogProductKey(e.brand, e.product)];
    const matched = !!(offer && (offer.url || offer.price != null));
    return {
      key,
      brand: e.brand,
      name: e.product,
      surface: 'blog',
      matched,
      price: offer?.price ?? null,
      url: offer?.url ?? null,
      state: ovMap.get(key) ?? 'auto',
      extra: (
        <>
          {e.posts.map((p, i) => (
            <span key={p.slug}>
              {i > 0 ? ', ' : ''}
              <Link href={`/blog/${p.slug}`} target="_blank" className="underline underline-offset-2">
                {p.title}
              </Link>
              {p.status !== 'PUBLISHED' ? ` (${p.status.toLowerCase()})` : ''}
            </span>
          ))}
        </>
      ),
    };
  });
  blogRows.sort(sortRows);

  const allRows = [...strollerRows, ...carSeatRows, ...blogRows];
  const shownCount = allRows.filter(isShown).length;
  const hiddenCount = allRows.filter((r) => r.state === 'off').length;
  const forcedOnCount = allRows.filter((r) => r.state === 'on').length;

  return (
    <AdminContainer>
      <AdminHeader
        eyebrow="Catalog"
        title="GoodBuy Gear badge control"
        subtitle="Every product that shows (or could show) the open-box GoodBuy Gear badge on a funnel tool or blog card. Auto = badge appears when an open-box match exists; Show forces it on; Hide suppresses it. Changes go live on the tools within moments."
      />

      <section className="admin-kpi-grid" aria-label="GoodBuy Gear badge metrics">
        <AdminKpiCard label="Badges shown" value={String(shownCount)} />
        <AdminKpiCard label="Forced on" value={String(forcedOnCount)} />
        <AdminKpiCard label="Hidden" value={String(hiddenCount)} />
        <AdminKpiCard label="Products listed" value={String(allRows.length)} />
      </section>

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2 px-1 pt-1">Strollers · {strollerRows.length}</h2>
        <AuditTable rows={strollerRows} />
      </AdminSurface>

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2 px-1 pt-1">Car seats · {carSeatRows.length}</h2>
        <AuditTable rows={carSeatRows} />
      </AdminSurface>

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2 px-1 pt-1">Blog product cards · {blogRows.length}</h2>
        <AuditTable rows={blogRows} />
      </AdminSurface>
    </AdminContainer>
  );
}

function sortRows(a: AuditRow, b: AuditRow) {
  return (
    Number(isShown(b)) - Number(isShown(a)) ||
    a.brand.localeCompare(b.brand) ||
    a.name.localeCompare(b.name)
  );
}
