import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import { requireAdminSession } from '@/lib/server/session';
import { resolveCompatibilityCarSeatImage, resolveProductCardImage } from '@/lib/blog/productCardImages';
import { deleteCompatibility, saveCompatibility, saveStrollerImage, saveCarSeatImage } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compatibility · Admin', robots: { index: false, follow: false } };

// New models land in the generated client on the Heroku build (`prisma generate`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const COMPATIBILITY_TYPES = ['DIRECT', 'ADAPTER', 'LIMITED', 'LOCKED', 'INCOMPATIBLE'] as const;
const CONFIDENCE_VALUES = ['HIGH', 'MEDIUM', 'LOW'] as const;

// Friendly labels + badge styling for each raw enum value.
const TYPE_META: Record<string, { label: string; badge: string }> = {
  DIRECT: { label: 'Direct fit', badge: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  ADAPTER: { label: 'Needs adapter', badge: 'border-[rgba(216,137,160,0.35)] bg-[rgba(216,137,160,0.14)] text-[var(--color-accent-dark)]' },
  LIMITED: { label: 'Limited fit', badge: 'border-amber-200 bg-amber-50 text-amber-700' },
  LOCKED: { label: 'Locked', badge: 'border-neutral-200 bg-neutral-100 text-neutral-600' },
  INCOMPATIBLE: { label: 'Not compatible', badge: 'border-rose-200 bg-rose-50 text-rose-700' },
};
function typeMeta(type: string) {
  return TYPE_META[type] ?? { label: type, badge: 'border-neutral-200 bg-neutral-100 text-neutral-600' };
}
const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  COMPATIBILITY_TYPES.map((t) => [t, TYPE_META[t]?.label ?? t]),
);
const CONFIDENCE_LABELS: Record<string, string> = { HIGH: 'High confidence', MEDIUM: 'Medium confidence', LOW: 'Low confidence' };

type SearchParams = Promise<{ q?: string; strollerId?: string; carSeatId?: string }> | undefined;

type StrollerOption = { id: string; brand: string; model: string; displayName: string | null; babylistImage?: string | null };
type CarSeatOption = { id: string; brand: string; model: string; displayName: string | null; babylistImage?: string | null };
type AdapterOption = { id: string; provider: string; brand: string | null; title: string; price: number | null; salePrice: number | null };

type CompatibilityRow = {
  id: string;
  strollerId: string;
  carSeatId: string;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  notes: string | null;
  confidence: string;
  adapterBabylistUrl: string | null;
  adapterPrice: number | null;
  adapterImage: string | null;
  adapterBabylistSku: string | null;
  stroller: StrollerOption;
  carSeat: CarSeatOption;
};

function productLabel(product: { brand: string | null; model?: string; displayName?: string | null; title?: string }) {
  const brand = product.brand?.trim();
  const name = (product.displayName ?? product.model ?? product.title ?? '').trim();
  return [brand, name].filter(Boolean).join(' ');
}

function providerLabel(provider: string) {
  if (provider === 'shopify_macrobaby') return 'MacroBaby';
  if (provider === 'babylist_impact') return 'Babylist';
  if (provider === 'awin_anbbaby') return 'ANB Baby';
  if (provider === 'impact_goodbuygear') return 'GoodBuy Gear';
  return provider;
}

function money(value: number | null | undefined) {
  return value == null ? null : `$${value.toFixed(2)}`;
}

function strollerThumb(row: StrollerOption): string | null {
  if (row.babylistImage) return row.babylistImage;
  const img = resolveProductCardImage({ brand: row.brand, productName: productLabel(row) });
  return img && !img.isFallback ? img.src : null;
}
function seatThumb(row: CarSeatOption): string | null {
  if (row.babylistImage) return row.babylistImage;
  return resolveCompatibilityCarSeatImage({ brand: row.brand, productName: productLabel(row) })?.src ?? null;
}

function Thumb({ src, label }: { src: string | null; label: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-11 w-11 shrink-0 rounded-lg border border-[rgba(0,0,0,0.06)] bg-white object-contain p-0.5" />
  ) : (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.06)] bg-neutral-50 text-[0.6rem] font-semibold uppercase text-neutral-400">
      {label.slice(0, 2)}
    </div>
  );
}

function Badge({ type }: { type: string }) {
  const meta = typeMeta(type);
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${meta.badge}`}>
      {meta.label}
    </span>
  );
}

const IMG_ROW_BTN =
  'shrink-0 rounded-full border border-neutral-200 px-2.5 py-1 text-[0.66rem] font-semibold text-neutral-600 transition hover:border-neutral-300';

// Lets an admin paste a product image URL for any stroller / infant seat that has
// none yet — those otherwise fall back to a generic image in the public tools.
function MissingImagesSection({
  strollers,
  carSeats,
}: {
  strollers: StrollerOption[];
  carSeats: CarSeatOption[];
}) {
  if (strollers.length === 0 && carSeats.length === 0) return null;

  const row = (
    kind: 'stroller' | 'carSeat',
    item: StrollerOption | CarSeatOption,
  ) => (
    <form
      key={`${kind}-${item.id}`}
      action={kind === 'stroller' ? saveStrollerImage : saveCarSeatImage}
      className="flex items-center gap-2 rounded-[12px] border border-[var(--admin-color-border)] bg-white px-3 py-2"
    >
      <input type="hidden" name={kind === 'stroller' ? 'strollerId' : 'carSeatId'} value={item.id} />
      <span className="min-w-0 flex-1 truncate text-admin">{productLabel(item)}</span>
      <input
        type="url"
        name="imageUrl"
        required
        placeholder="Paste image URL…"
        className="w-[15rem] max-w-[42vw] rounded-full border border-neutral-200 px-2.5 py-1 text-[0.7rem]"
      />
      <button type="submit" className={IMG_ROW_BTN}>Save</button>
    </form>
  );

  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1">
        <p className="admin-eyebrow">Product images</p>
        <h2 className="admin-h2">Add missing product images</h2>
        <p className="admin-body">
          These strollers and infant seats have no product image yet, so the public tools fall back to a generic
          picture. Paste a direct image URL to fix each one.
        </p>
      </div>

      {strollers.length > 0 ? (
        <div className="admin-stack gap-2">
          <p className="admin-eyebrow">Strollers ({strollers.length})</p>
          {strollers.map((item) => row('stroller', item))}
        </div>
      ) : null}

      {carSeats.length > 0 ? (
        <div className="admin-stack gap-2">
          <p className="admin-eyebrow">Infant car seats ({carSeats.length})</p>
          {carSeats.map((item) => row('carSeat', item))}
        </div>
      ) : null}
    </AdminSurface>
  );
}

export default async function AdminCatalogCompatibilityPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession('/admin/catalog/compatibility');

  const sp = (searchParams ? await searchParams : {}) ?? {};
  const q = (sp.q ?? '').trim();
  const strollerId = (sp.strollerId ?? '').trim();
  const carSeatId = (sp.carSeatId ?? '').trim();

  let data: Awaited<ReturnType<typeof loadCompatibilityAdminData>> | null = null;
  let dbError = false;
  try {
    data = await loadCompatibilityAdminData({ q, strollerId, carSeatId });
  } catch (error) {
    dbError = true;
    console.error('[catalog-compatibility] failed to load', error);
  }

  const hasFilters = Boolean(q || strollerId || carSeatId);

  // Group the visible matches by stroller so every seat that fits a stroller sits
  // together under one heading — far easier to scan than a flat list.
  const groups = data
    ? Object.values(
        data.matches.reduce<Record<string, { stroller: StrollerOption; rows: CompatibilityRow[] }>>((acc, row) => {
          (acc[row.strollerId] ??= { stroller: row.stroller, rows: [] }).rows.push(row);
          return acc;
        }, {}),
      ).sort((a, b) => productLabel(a.stroller).localeCompare(productLabel(b.stroller)))
    : [];

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Databases"
          title="Compatibility manager"
          subtitle="Set which infant car seats fit each stroller, whether they click in directly or need an adapter, and the adapter to buy. These matches power the travel-system checker."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary"><Link href="/admin/strollers">Strollers</Link></AdminButton>
              <AdminButton asChild variant="secondary"><Link href="/admin/car-seats">Car seats</Link></AdminButton>
            </div>
          }
        />

        {dbError || !data ? (
          <AdminSurface>
            <p className="admin-body">Compatibility data could not load. Check the catalog tables and Prisma client.</p>
          </AdminSurface>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3" aria-label="Compatibility summary">
              <AdminSurface className="admin-stack gap-1">
                <p className="admin-eyebrow">Strollers</p>
                <p className="admin-h2">{data.strollers.length.toLocaleString()}</p>
              </AdminSurface>
              <AdminSurface className="admin-stack gap-1">
                <p className="admin-eyebrow">Infant seats</p>
                <p className="admin-h2">{data.carSeats.length.toLocaleString()}</p>
              </AdminSurface>
              <AdminSurface className="admin-stack gap-1">
                <p className="admin-eyebrow">Matches</p>
                <p className="admin-h2">{data.totalMatches.toLocaleString()}</p>
              </AdminSurface>
            </section>

            {/* ── Create ─────────────────────────────────────────────── */}
            <AdminSurface className="admin-stack gap-4">
              <div className="admin-stack gap-1">
                <p className="admin-eyebrow">Add matches</p>
                <h2 className="admin-h2">Match seats to a stroller</h2>
                <p className="admin-body">
                  Pick one stroller and every infant seat that fits it, choose how they fit, and (if needed) attach the
                  adapter. You can select several seats at once — they’ll all get the same settings.
                </p>
              </div>
              <CompatibilityForm mode="create" strollers={data.strollers} carSeats={data.carSeats} adapters={data.adapters} />
            </AdminSurface>

            {/* ── Missing product images ─────────────────────────────── */}
            <MissingImagesSection
              strollers={data.strollers.filter((s) => !s.babylistImage)}
              carSeats={data.carSeats.filter((s) => !s.babylistImage)}
            />

            {/* ── Filter ─────────────────────────────────────────────── */}
            <AdminSurface className="admin-stack gap-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="admin-stack gap-1">
                  <p className="admin-eyebrow">Existing matches</p>
                  <p className="admin-body">
                    {hasFilters
                      ? `${data.totalMatches.toLocaleString()} match${data.totalMatches === 1 ? '' : 'es'} in this filter`
                      : `${data.totalMatches.toLocaleString()} matches total`}
                    {data.matches.length < data.totalMatches ? ` · showing the first ${data.matches.length}` : ''}
                  </p>
                </div>
                {hasFilters ? (
                  <AdminButton asChild variant="ghost"><Link href="/admin/catalog/compatibility">Clear filters</Link></AdminButton>
                ) : null}
              </div>

              <form method="get" className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                <AdminField label="Search">
                  <AdminInput name="q" defaultValue={q} placeholder="Brand, model, adapter, notes" />
                </AdminField>
                <AdminField label="Filter by stroller">
                  <AdminSelect name="strollerId" defaultValue={strollerId}>
                    <option value="">All strollers</option>
                    {data.strollers.map((s) => <option key={s.id} value={s.id}>{productLabel(s)}</option>)}
                  </AdminSelect>
                </AdminField>
                <AdminField label="Filter by seat">
                  <AdminSelect name="carSeatId" defaultValue={carSeatId}>
                    <option value="">All infant seats</option>
                    {data.carSeats.map((s) => <option key={s.id} value={s.id}>{productLabel(s)}</option>)}
                  </AdminSelect>
                </AdminField>
                <AdminButton type="submit" variant="primary">Filter</AdminButton>
              </form>
            </AdminSurface>

            {/* ── Existing matches, grouped by stroller ──────────────── */}
            {groups.length === 0 ? (
              <AdminSurface><p className="admin-body">No matches yet. Add some above.</p></AdminSurface>
            ) : (
              <div className="admin-stack gap-4">
                {groups.map(({ stroller, rows }) => (
                  <AdminSurface key={stroller.id} className="admin-stack gap-3">
                    <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)] pb-3">
                      <Thumb src={strollerThumb(stroller)} label={stroller.brand} />
                      <div className="min-w-0">
                        <p className="font-semibold text-admin">{productLabel(stroller)}</p>
                        <p className="admin-micro">
                          {rows.length} seat{rows.length === 1 ? '' : 's'} matched ·{' '}
                          {rows.filter((r) => r.compatibilityType === 'DIRECT').length} direct ·{' '}
                          {rows.filter((r) => r.adapterRequired || r.compatibilityType === 'ADAPTER').length} adapter
                        </p>
                      </div>
                      <Link
                        href={`/admin/catalog/compatibility?strollerId=${stroller.id}`}
                        className="ml-auto shrink-0 text-[0.78rem] font-semibold text-[var(--color-accent-dark)] underline"
                      >
                        Only this stroller →
                      </Link>
                    </div>

                    <div className="admin-stack gap-2">
                      {rows
                        .slice()
                        .sort((a, b) => productLabel(a.carSeat).localeCompare(productLabel(b.carSeat)))
                        .map((row) => (
                          <CompatibilityRowLine key={row.id} row={row} strollers={data.strollers} carSeats={data.carSeats} adapters={data.adapters} />
                        ))}
                    </div>
                  </AdminSurface>
                ))}
              </div>
            )}
          </>
        )}
      </AdminContainer>
    </main>
  );
}

async function loadCompatibilityAdminData(filters: { q: string; strollerId: string; carSeatId: string }) {
  const where: Record<string, unknown> = {};
  if (filters.strollerId) where.strollerId = filters.strollerId;
  if (filters.carSeatId) where.carSeatId = filters.carSeatId;
  if (filters.q) {
    where.OR = [
      { adapterType: { contains: filters.q, mode: 'insensitive' } },
      { notes: { contains: filters.q, mode: 'insensitive' } },
      { stroller: { brand: { contains: filters.q, mode: 'insensitive' } } },
      { stroller: { model: { contains: filters.q, mode: 'insensitive' } } },
      { stroller: { displayName: { contains: filters.q, mode: 'insensitive' } } },
      { carSeat: { brand: { contains: filters.q, mode: 'insensitive' } } },
      { carSeat: { model: { contains: filters.q, mode: 'insensitive' } } },
      { carSeat: { displayName: { contains: filters.q, mode: 'insensitive' } } },
    ];
  }

  const seatSelect = { id: true, brand: true, model: true, displayName: true, babylistImage: true };

  const [strollers, carSeats, adapters, matches, totalMatches] = await Promise.all([
    db.stroller.findMany({ select: seatSelect, orderBy: [{ brand: 'asc' }, { model: 'asc' }] }),
    db.carSeat.findMany({ where: { seatType: 'INFANT' }, select: seatSelect, orderBy: [{ brand: 'asc' }, { model: 'asc' }] }),
    db.affiliateCatalogProduct.findMany({
      where: {
        isActiveInFeed: true,
        OR: [
          { title: { contains: 'adapter', mode: 'insensitive' } },
          { title: { contains: 'adaptor', mode: 'insensitive' } },
          { enrichment: { is: { productType: { in: ['stroller adapter', 'infant car seat adapter', 'car seat adapter'] } } } },
        ],
      },
      select: { id: true, provider: true, brand: true, title: true, price: true, salePrice: true },
      orderBy: [{ provider: 'asc' }, { title: 'asc' }],
      take: 300,
    }),
    db.compatibility.findMany({
      where,
      include: {
        stroller: { select: seatSelect },
        carSeat: { select: seatSelect },
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 300,
    }),
    db.compatibility.count({ where }),
  ]);

  return {
    strollers: strollers as StrollerOption[],
    carSeats: carSeats as CarSeatOption[],
    adapters: adapters as AdapterOption[],
    matches: matches as CompatibilityRow[],
    totalMatches,
  };
}

function CompatibilityForm({
  mode,
  row,
  strollers,
  carSeats,
  adapters,
}: {
  mode: 'create' | 'edit';
  row?: CompatibilityRow;
  strollers: StrollerOption[];
  carSeats: CarSeatOption[];
  adapters: AdapterOption[];
}) {
  const currentType = row?.compatibilityType ?? 'ADAPTER';
  const hasAdapterDetails = Boolean(
    row && (row.adapterType || row.adapterBabylistUrl || row.adapterPrice != null || row.adapterImage || row.adapterBabylistSku),
  );

  return (
    <form action={saveCompatibility} className="admin-stack gap-4">
      {row ? (
        <>
          <input type="hidden" name="compatibilityId" value={row.id} />
          <input type="hidden" name="strollerId" value={row.strollerId} />
          <input type="hidden" name="carSeatId" value={row.carSeatId} />
        </>
      ) : null}

      {mode === 'create' ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <AdminField label="1. Stroller" help="The exact stroller model, not just the brand.">
            <AdminSelect name="strollerId" required defaultValue="">
              <option value="">Select stroller</option>
              {strollers.map((s) => <option key={s.id} value={s.id}>{productLabel(s)}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label="2. Infant car seats" help="Ctrl-click (⌘-click on Mac) to select several at once.">
            <AdminSelect name="carSeatIds" multiple required size={8} defaultValue={[]}>
              {carSeats.map((s) => <option key={s.id} value={s.id}>{productLabel(s)}</option>)}
            </AdminSelect>
          </AdminField>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <AdminField label={mode === 'create' ? '3. How do they fit?' : 'How do they fit?'}>
          <AdminSelect name="compatibilityType" defaultValue={currentType}>
            {COMPATIBILITY_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label="How sure are you?">
          <AdminSelect name="confidence" defaultValue={row?.confidence ?? 'HIGH'}>
            {CONFIDENCE_VALUES.map((c) => <option key={c} value={c}>{CONFIDENCE_LABELS[c]}</option>)}
          </AdminSelect>
        </AdminField>
      </div>

      <details className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#fcfaf7] p-4" open={hasAdapterDetails}>
        <summary className="cursor-pointer text-sm font-semibold text-admin">
          Adapter details <span className="admin-micro font-normal">(only if a seat needs an adapter)</span>
        </summary>
        <div className="admin-stack gap-3 pt-4">
          <label className="admin-toggle">
            <input type="checkbox" name="adapterRequired" defaultChecked={row?.adapterRequired ?? false} />
            <span>Adapter required to attach this seat</span>
          </label>

          <AdminField label="Pick the adapter from the catalog" help="Selecting one auto-fills its link, image, price, and SKU on save.">
            <AdminSelect name="adapterCatalogProductId" defaultValue="">
              <option value="">No catalog adapter selected</option>
              {adapters.map((a) => (
                <option key={a.id} value={a.id}>
                  {providerLabel(a.provider)} · {productLabel(a)}{money(a.salePrice ?? a.price) ? ` · ${money(a.salePrice ?? a.price)}` : ''}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <div className="grid gap-3 lg:grid-cols-2">
            <AdminField label="Adapter name (shown to shoppers)">
              <AdminInput name="adapterType" defaultValue={row?.adapterType ?? ''} placeholder="Vista car seat adapter for Mesa" />
            </AdminField>
            <AdminField label="Adapter price">
              <AdminInput name="adapterPrice" defaultValue={row?.adapterPrice != null ? row.adapterPrice.toFixed(2) : ''} inputMode="decimal" placeholder="49.99" />
            </AdminField>
            <AdminField label="Adapter buy link">
              <AdminInput name="adapterBabylistUrl" defaultValue={row?.adapterBabylistUrl ?? ''} placeholder="https://..." />
            </AdminField>
            <AdminField label="Adapter image URL">
              <AdminInput name="adapterImage" defaultValue={row?.adapterImage ?? ''} placeholder="https://..." />
            </AdminField>
            <AdminField label="Adapter SKU">
              <AdminInput name="adapterBabylistSku" defaultValue={row?.adapterBabylistSku ?? ''} />
            </AdminField>
          </div>
        </div>
      </details>

      <AdminField label="Notes (optional)">
        <AdminTextarea name="notes" defaultValue={row?.notes ?? ''} rows={3} placeholder="Anything a parent should know — model-year caveats, install tips, etc." />
      </AdminField>

      <div className="flex items-center justify-end">
        <AdminButton type="submit" variant="primary">{mode === 'create' ? 'Save matches' : 'Save changes'}</AdminButton>
      </div>
    </form>
  );
}

function CompatibilityRowLine({
  row,
  strollers,
  carSeats,
  adapters,
}: {
  row: CompatibilityRow;
  strollers: StrollerOption[];
  carSeats: CarSeatOption[];
  adapters: AdapterOption[];
}) {
  return (
    <details className="rounded-[14px] border border-[rgba(0,0,0,0.07)] bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
        <Thumb src={seatThumb(row.carSeat)} label={row.carSeat.brand} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900">{productLabel(row.carSeat)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge type={row.compatibilityType} />
            <span className="admin-micro">{CONFIDENCE_LABELS[row.confidence] ?? row.confidence}</span>
            {row.adapterType ? <span className="admin-micro">· {row.adapterType}</span> : null}
          </div>
        </div>
        {row.adapterBabylistUrl ? (
          <a
            href={row.adapterBabylistUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="shrink-0 text-[0.72rem] font-semibold text-[var(--color-accent-dark)] underline"
          >
            Adapter link
          </a>
        ) : null}
        <span className="admin-chip shrink-0">Edit</span>
      </summary>

      <div className="border-t border-[rgba(0,0,0,0.06)] p-4">
        <CompatibilityForm mode="edit" row={row} strollers={strollers} carSeats={carSeats} adapters={adapters} />
        <form action={deleteCompatibility} className="mt-3 flex justify-end border-t border-[rgba(0,0,0,0.06)] pt-3">
          <input type="hidden" name="compatibilityId" value={row.id} />
          <AdminButton type="submit" variant="danger">Delete this match</AdminButton>
        </form>
      </div>
    </details>
  );
}
