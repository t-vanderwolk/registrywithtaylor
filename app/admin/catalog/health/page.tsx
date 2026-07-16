import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { requireAdminSession } from '@/lib/server/session';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { isCarSeatAdapter } from '@/lib/catalog/adapterModelMatching';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { GET as getCarSeatCatalog } from '@/app/api/catalog/carseats/route';
import { GET as getStrollerCatalog } from '@/app/api/catalog/strollers/route';
import { markReviewedFromHealth, hideFromHealth, unhideFromHealth, deleteFromHealth, setImageFromHealth } from './actions';

const ACTION_BTN = 'rounded-full border border-neutral-200 px-2.5 py-1 text-[0.66rem] font-semibold text-neutral-600 transition hover:border-neutral-300';
const ACTION_BTN_DANGER = 'rounded-full border border-red-200 px-2.5 py-1 text-[0.66rem] font-semibold text-red-600 transition hover:border-red-300';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Catalog Health · Admin', robots: { index: false, follow: false } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type PublicProduct = {
  area: 'stroller' | 'carseat';
  brand: string;
  category: string;
  label: string;
  name: string;
  model: string;
  source: string;
  image: string | null;
  affiliateUrl: string | null;
  retailers: Record<string, { url: string | null; price: number | null } | null>;
};

type AdapterProduct = {
  id: string;
  brand: string | null;
  title: string;
  provider: string;
  affiliateUrl: string | null;
  price: number | null;
};

type StrollerRow = { id: string; brand: string; model: string };
type SeatRow = { id: string; brand: string; model: string };
type CatalogQueueRow = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  imageUrl: string | null;
  enrichment: { reviewStatus: string; productType: string | null } | null;
};

// Friendly labels + colored badges shared with the compatibility manager style.
function providerLabel(provider: string) {
  if (provider === 'shopify_macrobaby') return 'MacroBaby';
  if (provider === 'babylist_impact') return 'Babylist';
  if (provider === 'awin_anbbaby') return 'ANB Baby';
  if (provider === 'impact_goodbuygear') return 'GoodBuy Gear';
  return provider;
}

const STATUS_META: Record<string, { label: string; badge: string }> = {
  AUTO_CATEGORIZED: { label: 'Auto-categorized', badge: 'border-neutral-200 bg-neutral-100 text-neutral-600' },
  NEEDS_REVIEW: { label: 'Needs review', badge: 'border-amber-200 bg-amber-50 text-amber-700' },
  REVIEWED: { label: 'Reviewed', badge: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  HIDDEN: { label: 'Hidden', badge: 'border-neutral-200 bg-neutral-100 text-neutral-500' },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, badge: 'border-neutral-200 bg-neutral-100 text-neutral-600' };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold ${meta.badge}`}>
      {meta.label}
    </span>
  );
}

function ListedBadge({ listed }: { listed: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold ${
        listed ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-neutral-100 text-neutral-500'
      }`}
    >
      {listed ? 'Listed' : 'Not public'}
    </span>
  );
}

function QueueThumb({ src, label }: { src: string | null; label: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-9 w-9 shrink-0 rounded-md border border-[rgba(0,0,0,0.06)] bg-white object-contain p-0.5" />
  ) : (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(0,0,0,0.06)] bg-neutral-50 text-[0.55rem] font-semibold uppercase text-neutral-400">
      {label.slice(0, 2)}
    </div>
  );
}

const PROVIDERS = ['babylist_impact', 'awin_anbbaby', 'shopify_macrobaby', 'impact_goodbuygear'];
const MACROBABY_PROVIDER = 'shopify_macrobaby';

const SEAT_BRAND_ALIASES: Array<{ brand: string; res: RegExp[] }> = [
  { brand: 'Maxi-Cosi', res: [/maxi[\s-]?cosi/i] },
  { brand: 'Nuna', res: [/\bnuna\b/i, /\bpipa\b/i] },
  { brand: 'Cybex', res: [/\bcybex\b/i, /\baton\b/i] },
  { brand: 'Clek', res: [/\bclek\b/i, /\bliing\b/i] },
  { brand: 'Britax', res: [/\bbritax\b/i, /\bb-?safe\b/i, /\bwillow\b/i] },
  { brand: 'Chicco', res: [/\bchicco\b/i, /keyfit/i, /fit2/i] },
  { brand: 'Graco', res: [/\bgraco\b/i, /snugride/i] },
  { brand: 'Peg Perego', res: [/peg[\s-]?perego/i, /primo\s?viaggio/i] },
  { brand: 'Joie', res: [/\bjoie\b/i] },
  { brand: 'UPPAbaby', res: [/\bmesa\b/i] },
  { brand: 'BeSafe', res: [/\bbe-?safe\b/i] },
  { brand: 'Bugaboo', res: [/\bturtle\b/i] },
  { brand: 'Doona', res: [/\bdoona\b/i] },
  { brand: 'Evenflo', res: [/\bevenflo\b/i] },
  { brand: 'Silver Cross', res: [/silver ?cross/i] },
];

export default async function CatalogHealthPage() {
  await requireAdminSession('/admin/catalog/health');

  let health: Awaited<ReturnType<typeof loadCatalogHealth>> | null = null;
  let dbError = false;
  try {
    health = await loadCatalogHealth();
  } catch (error) {
    dbError = true;
    console.error('[catalog-health] failed to load', error);
  }

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Catalog"
          title="Catalog Health"
          subtitle="A read-only control room for public catalog quality: duplicate risk, review queues, adapter coverage, CTA source mix, images, and affiliate tracking."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog/compatibility">Compatibility manager</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog">Open catalog</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/tools/stroller-finder">Public finder</Link>
              </AdminButton>
            </div>
          }
        />

        {dbError || !health ? (
          <AdminSurface className="admin-stack">
            <p className="admin-body">Catalog health could not load. Check the catalog tables and Prisma client.</p>
          </AdminSurface>
        ) : (
          <>
            <section className="admin-kpi-grid" aria-label="Catalog health metrics">
              <AdminKpiCard label="Public Products" value={health.publicProducts.length.toLocaleString()} hint="Strollers + infant car seats" />
              <AdminKpiCard label="Duplicate Risks" value={health.duplicateRisks.length.toLocaleString()} hint="Public brand/model groups" />
              <AdminKpiCard label="Needs Review" value={health.needsReviewCount.toLocaleString()} hint="Affiliate catalog rows" />
              <AdminKpiCard label="Adapter Candidates" value={health.adapterCandidateCount.toLocaleString()} hint="Unapplied model-specific rows" />
              <AdminKpiCard label="Orphan Strollers" value={health.orphanStrollers.length.toLocaleString()} hint="Canonical strollers with no compatibility" />
              <AdminKpiCard label="Bad MacroBaby URLs" value={health.badMacroBabyUrls.length.toLocaleString()} hint="Missing _j tracking" />
            </section>

            <AdminSurface className="admin-stack">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="admin-eyebrow">Public CTA Source Mix</p>
                  <h2 className="admin-h2">Primary public retailer source</h2>
                </div>
                <span className="admin-chip">{health.publicProducts.length.toLocaleString()} public products</span>
              </div>
              <div className="grid gap-3 md:grid-cols-5">
                {Object.entries(health.sourceMix).map(([source, count]) => (
                  <div key={source} className="rounded-[18px] border border-[var(--admin-color-border)] bg-white p-4">
                    <p className="admin-eyebrow">{source}</p>
                    <p className="admin-h2 mt-1">{count.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </AdminSurface>

            <AdminSurface className="admin-stack">
              <SectionTitle title="Duplicate Risk" count={health.duplicateRisks.length} />
              <AdminTable
                density="compact"
                columns={[
                  { key: 'key', label: 'Group' },
                  { key: 'count', label: 'Count', align: 'right' },
                  { key: 'products', label: 'Products' },
                ]}
                emptyState={<p className="admin-body p-4">No public duplicate risks found.</p>}
              >
                {health.duplicateRisks.slice(0, 12).map((group) => (
                  <tr key={group.key} className="admin-row">
                    <td className="admin-table-code">{group.key}</td>
                    <td className="text-right text-admin">{group.count}</td>
                    <td className="admin-micro">{group.products.join(' · ')}</td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>

            <div className="grid gap-4 lg:grid-cols-2">
              <AdminSurface className="admin-stack">
                <SectionTitle title="Manual Review Queue" count={health.reviewRows.length} />
                <AdminTable
                  density="compact"
                  columns={[
                    { key: 'title', label: 'Product' },
                    { key: 'status', label: 'Status' },
                    { key: 'actions', label: 'Actions', align: 'right' },
                  ]}
                  emptyState={<p className="admin-body p-4">No rows currently need review.</p>}
                >
                  {health.reviewRows.slice(0, 12).map((row: CatalogQueueRow) => (
                    <tr key={row.id} className="admin-row">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <QueueThumb src={row.imageUrl} label={row.brand ?? row.title} />
                          <div className="admin-stack gap-0.5">
                            <span className="text-admin">{row.title}</span>
                            <span className="admin-micro">{row.brand ?? 'Unknown brand'} · {providerLabel(row.provider)}</span>
                          </div>
                        </div>
                        {!row.imageUrl ? (
                          <form action={setImageFromHealth} className="mt-2 flex items-center gap-1.5">
                            <input type="hidden" name="id" value={row.id} />
                            <input
                              type="url"
                              name="imageUrl"
                              required
                              placeholder="Paste image URL…"
                              className="w-full max-w-[16rem] rounded-full border border-neutral-200 px-2.5 py-1 text-[0.7rem]"
                            />
                            <button type="submit" className={ACTION_BTN}>Add image</button>
                          </form>
                        ) : null}
                      </td>
                      <td><StatusBadge status={row.enrichment?.reviewStatus ?? 'UNKNOWN'} /></td>
                      <td>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <form action={markReviewedFromHealth}>
                            <input type="hidden" name="id" value={row.id} />
                            <button type="submit" className={ACTION_BTN}>Approve</button>
                          </form>
                          <form action={hideFromHealth}>
                            <input type="hidden" name="id" value={row.id} />
                            <button type="submit" className={ACTION_BTN}>Hide</button>
                          </form>
                          <Link href={`/admin/catalog?q=${encodeURIComponent(row.title)}`} className={ACTION_BTN}>Edit</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminSurface>

              <AdminSurface className="admin-stack">
                <SectionTitle title="Hidden Products" count={health.hiddenRows.length} />
                <AdminTable
                  density="compact"
                  columns={[
                    { key: 'title', label: 'Product' },
                    { key: 'type', label: 'Type' },
                    { key: 'actions', label: 'Actions', align: 'right' },
                  ]}
                  emptyState={<p className="admin-body p-4">No hidden products found.</p>}
                >
                  {health.hiddenRows.slice(0, 12).map((row: CatalogQueueRow) => (
                    <tr key={row.id} className="admin-row">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <QueueThumb src={row.imageUrl} label={row.brand ?? row.title} />
                          <div className="admin-stack gap-0.5">
                            <span className="text-admin">{row.title}</span>
                            <span className="admin-micro">{row.brand ?? 'Unknown brand'} · {providerLabel(row.provider)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="admin-micro">{row.enrichment?.productType ?? '—'}</td>
                      <td>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <form action={unhideFromHealth}>
                            <input type="hidden" name="id" value={row.id} />
                            <button type="submit" className={ACTION_BTN}>Unhide</button>
                          </form>
                          <form action={deleteFromHealth}>
                            <input type="hidden" name="id" value={row.id} />
                            <ConfirmButton message={`Delete "${row.title}"? This removes it from the catalog entirely.`} className={ACTION_BTN_DANGER}>
                              Delete
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminSurface>
            </div>

            <AdminSurface className="admin-stack">
              <SectionTitle title="Adapter Health" count={health.adapterProducts.length} />
              <div className="grid gap-3 md:grid-cols-4">
                <MiniMetric label="Adapter products" value={health.adapterProducts.length} />
                <MiniMetric label="Unapplied candidates" value={health.adapterCandidateCount} />
                <MiniMetric label="Ambiguous products" value={health.ambiguousAdapters.length} />
                <MiniMetric label="Catalog-written rows" value={health.catalogWrittenAdapterRows} />
              </div>
              <AdminTable
                density="compact"
                columns={[
                  { key: 'title', label: 'Ambiguous Adapter' },
                  { key: 'reason', label: 'Reason' },
                  { key: 'provider', label: 'Provider' },
                ]}
                emptyState={<p className="admin-body p-4">No ambiguous adapter products found.</p>}
              >
                {health.ambiguousAdapters.slice(0, 12).map((row) => (
                  <tr key={row.id} className="admin-row">
                    <td className="text-admin">{row.title}</td>
                    <td className="admin-micro">{row.reason}</td>
                    <td className="admin-micro">{providerLabel(row.provider)}</td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>

            <div className="grid gap-4 lg:grid-cols-2">
              <AdminSurface className="admin-stack">
                <SectionTitle title="Image Gaps" count={health.missingImages.length} />
                <AdminTable
                  density="compact"
                  columns={[
                    { key: 'product', label: 'Public Product' },
                    { key: 'source', label: 'Source' },
                  ]}
                  emptyState={<p className="admin-body p-4">No public image gaps found.</p>}
                >
                  {health.missingImages.slice(0, 12).map((row) => (
                    <tr key={`${row.area}-${row.brand}-${row.model}`} className="admin-row">
                      <td className="text-admin">{row.brand} {row.model}</td>
                      <td className="admin-micro">{row.source}</td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminSurface>

              <AdminSurface className="admin-stack">
                <SectionTitle title="Orphan Strollers" count={health.orphanStrollers.length} />
                <AdminTable
                  density="compact"
                  columns={[
                    { key: 'stroller', label: 'Canonical Stroller' },
                    { key: 'source', label: 'Public?' },
                  ]}
                  emptyState={<p className="admin-body p-4">Every canonical stroller has compatibility rows.</p>}
                >
                  {health.orphanStrollers.slice(0, 12).map((row) => (
                    <tr key={row.id} className="admin-row">
                      <td className="text-admin">{row.brand} {row.model}</td>
                      <td><ListedBadge listed={row.publiclyListed} /></td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminSurface>
            </div>
          </>
        )}
      </AdminContainer>
    </main>
  );
}

async function loadCatalogHealth() {
  const [strollerCatalog, carSeatCatalog] = await Promise.all([
    getStrollerCatalog().then((res) => res.json()),
    getCarSeatCatalog().then((res) => res.json()),
  ]);
  const publicProducts = [...flattenCatalog('stroller', strollerCatalog), ...flattenCatalog('carseat', carSeatCatalog)];

  const [
    needsReviewCount,
    reviewRows,
    hiddenRows,
    badMacroBabyUrls,
    adapterProducts,
    strollers,
    seats,
    compatRows,
    catalogWrittenAdapterRows,
  ] = await Promise.all([
    db.productEnrichment.count({ where: { needsReview: true } }),
    db.affiliateCatalogProduct.findMany({
      where: { enrichment: { is: { needsReview: true } } },
      select: {
        id: true,
        provider: true,
        brand: true,
        title: true,
        imageUrl: true,
        enrichment: { select: { reviewStatus: true, productType: true } },
      },
      orderBy: { lastSyncedAt: 'desc' },
      take: 25,
    }),
    db.affiliateCatalogProduct.findMany({
      where: { enrichment: { is: { reviewStatus: 'HIDDEN' } } },
      select: {
        id: true,
        provider: true,
        brand: true,
        title: true,
        imageUrl: true,
        enrichment: { select: { reviewStatus: true, productType: true } },
      },
      orderBy: { lastSyncedAt: 'desc' },
      take: 25,
    }),
    db.affiliateCatalogProduct.findMany({
      where: {
        provider: MACROBABY_PROVIDER,
        isActiveInFeed: true,
        OR: [
          { affiliateUrl: null },
          { NOT: { affiliateUrl: { contains: '_j=taylormadebabyco.com' } } },
        ],
      },
      select: { id: true, brand: true, title: true, affiliateUrl: true },
      take: 25,
    }),
    db.affiliateCatalogProduct.findMany({
      where: {
        provider: { in: PROVIDERS },
        isActiveInFeed: true,
        title: { contains: 'adapter', mode: 'insensitive' },
        enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
      },
      select: { id: true, brand: true, title: true, provider: true, affiliateUrl: true, price: true },
    }) as Promise<AdapterProduct[]>,
    db.stroller.findMany({ select: { id: true, brand: true, model: true } }) as Promise<StrollerRow[]>,
    db.carSeat.findMany({
      where: { seatType: 'INFANT' },
      select: { id: true, brand: true, model: true },
    }) as Promise<SeatRow[]>,
    db.compatibility.findMany({ select: { strollerId: true, carSeatId: true } }),
    db.compatibility.count({
      where: {
        notes: { contains: 'Inferred from the catalog adapter', mode: 'insensitive' },
      },
    }),
  ]);

  const { adapterCandidateCount, ambiguousAdapters } = getAdapterHealth(adapterProducts, strollers, seats, compatRows);
  const publicKeys = new Set(publicProducts.map((p) => `${p.area}|${p.brand.toLowerCase()}|${normalizePublicModel(p.model)}`));
  const compatStrollerIds = new Set(compatRows.map((row: { strollerId: string }) => row.strollerId));

  return {
    publicProducts,
    sourceMix: countBy(publicProducts, (p) => p.source),
    duplicateRisks: getDuplicateRisks(publicProducts),
    missingImages: publicProducts.filter((p) => !p.image),
    needsReviewCount,
    reviewRows,
    hiddenRows,
    badMacroBabyUrls,
    adapterProducts,
    adapterCandidateCount,
    ambiguousAdapters,
    catalogWrittenAdapterRows,
    orphanStrollers: strollers
      .filter((st) => !compatStrollerIds.has(st.id))
      .map((st) => ({
        ...st,
        publiclyListed: publicKeys.has(`stroller|${st.brand.toLowerCase()}|${normalizePublicModel(st.model)}`),
      }))
      .sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)),
  };
}

function flattenCatalog(area: 'stroller' | 'carseat', payload: { brands?: Array<{ brand: string; types?: Array<{ category: string; label: string; products?: PublicProduct[] }> }> }) {
  const products: PublicProduct[] = [];
  for (const brandRow of payload.brands ?? []) {
    for (const typeRow of brandRow.types ?? []) {
      for (const product of typeRow.products ?? []) {
        products.push({ ...product, area, brand: brandRow.brand, category: typeRow.category, label: typeRow.label });
      }
    }
  }
  return products;
}

function countBy<T>(items: T[], keyFn: (item: T) => string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function getDuplicateRisks(products: PublicProduct[]) {
  const groups = new Map<string, PublicProduct[]>();
  for (const product of products) {
    const key = `${product.area}|${product.brand.toLowerCase()}|${normalizePublicModel(product.model || product.name)}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(product);
  }
  return [...groups.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([key, rows]) => ({
      key,
      count: rows.length,
      products: rows.map((row) => `${row.brand} ${row.model} (${row.source})`),
    }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function normalizePublicModel(value: string) {
  return (value || '')
    .toLowerCase()
    // NB: keep "single/double" and trim words like "gold" — they distinguish
    // genuinely separate products (City Tour 2 Single vs Double, Gold Shyft vs
    // Shyft), so stripping them created false duplicate-risk groups.
    .replace(/\b(stroller|infant|car seat|lightweight|luxury|travel system|system)\b/g, ' ')
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\b(black|grey|gray|beige|blue|green|brown|pink|taupe|stone|graphite|caviar|onyx|rose|silver|matte|frame|seat)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAdapterHealth(
  adapters: AdapterProduct[],
  strollers: StrollerRow[],
  seats: SeatRow[],
  compatRows: Array<{ strollerId: string; carSeatId: string }>,
) {
  const seatsByBrand = new Map<string, SeatRow[]>();
  for (const seat of seats) {
    const key = canonicalBrand(seat.brand).toLowerCase();
    (seatsByBrand.get(key) ?? seatsByBrand.set(key, []).get(key)!).push(seat);
  }
  const existingSet = new Set(compatRows.map((row) => `${row.strollerId}:::${row.carSeatId}`));
  const candidatePairs = new Set<string>();
  const ambiguousAdapters: Array<AdapterProduct & { reason: string }> = [];

  for (const adapter of adapters) {
    const title = adapter.title || '';
    // Non-car-seat "adapter" products (bassinet / stand / tray / board / second
    // seat) never make a compatibility row, so they aren't ambiguous — skip them.
    if (!isCarSeatAdapter(title)) continue;
    const adapterBrand = canonicalBrand(adapter.brand).toLowerCase();
    const normalizedTitle = normalizeAdapterText(title);
    const strollerMatches = strollers.filter((stroller) => {
      if (canonicalBrand(stroller.brand).toLowerCase() !== adapterBrand) return false;
      return modelVariants(stroller.model).some((model) => model.length >= 2 && normalizedTitle.includes(model));
    });
    const seatBrands = seatBrandsInTitle(title);
    if (!strollerMatches.length || !seatBrands.length) {
      ambiguousAdapters.push({
        ...adapter,
        reason: !strollerMatches.length && !seatBrands.length
          ? 'No matched stroller model or infant seat brand'
          : !strollerMatches.length
            ? 'No matched stroller model'
            : 'No infant seat brand',
      });
      continue;
    }
    for (const stroller of strollerMatches) {
      for (const seatBrand of seatBrands) {
        for (const seat of seatsByBrand.get(canonicalBrand(seatBrand).toLowerCase()) ?? []) {
          const key = `${stroller.id}:::${seat.id}`;
          if (!existingSet.has(key)) candidatePairs.add(key);
        }
      }
    }
  }

  return { adapterCandidateCount: candidatePairs.size, ambiguousAdapters };
}

function seatBrandsInTitle(title: string): string[] {
  const found = new Set<string>();
  for (const { brand, res } of SEAT_BRAND_ALIASES) {
    if (res.some((re) => re.test(title))) found.add(brand);
  }
  return [...found];
}

function normalizeAdapterText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function modelVariants(model: string): string[] {
  const full = normalizeAdapterText(model);
  const core = full
    .replace(/\b(all terrain|stroller|complete|seat)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return core && core !== full ? [full, core] : [full];
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="admin-h2">{title}</h2>
      <span className="admin-chip">{count.toLocaleString()}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-[var(--admin-color-border)] bg-white p-4">
      <p className="admin-eyebrow">{label}</p>
      <p className="admin-h2 mt-1">{value.toLocaleString()}</p>
    </div>
  );
}
