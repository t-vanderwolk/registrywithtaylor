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
import { deleteCompatibility, saveCompatibility } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compatibility · Admin', robots: { index: false, follow: false } };

// New models land in the generated client on the Heroku build (`prisma generate`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const COMPATIBILITY_TYPES = ['DIRECT', 'ADAPTER', 'LIMITED', 'LOCKED', 'INCOMPATIBLE'] as const;
const CONFIDENCE_VALUES = ['HIGH', 'MEDIUM', 'LOW'] as const;

type SearchParams = Promise<{ q?: string; strollerId?: string; carSeatId?: string }> | undefined;

type StrollerOption = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
};

type CarSeatOption = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
};

type AdapterOption = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  price: number | null;
  salePrice: number | null;
};

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

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Catalog"
          title="Compatibility Manager"
          subtitle="Create and edit stroller-to-infant-seat matches, including adapter-required rows sourced from the catalog."
          actions={
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog/health">Catalog health</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/admin/catalog">Open catalog</Link>
              </AdminButton>
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
                <p className="admin-eyebrow">Adapter products</p>
                <p className="admin-h2">{data.adapters.length.toLocaleString()}</p>
              </AdminSurface>
            </section>

            <AdminSurface className="admin-stack">
              <div>
                <p className="admin-eyebrow">Create</p>
                <h2 className="admin-h2">New compatibility match</h2>
                <p className="admin-body mt-2">
                  Select one stroller and one or more infant car seats. If an adapter product is selected, its catalog URL,
                  image, price, and SKU will be used unless you fill the manual fields.
                </p>
              </div>
              <CompatibilityForm
                mode="create"
                strollers={data.strollers}
                carSeats={data.carSeats}
                adapters={data.adapters}
              />
            </AdminSurface>

            <AdminSurface className="admin-stack">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="admin-eyebrow">Read / update / delete</p>
                  <h2 className="admin-h2">Existing compatibility rows</h2>
                  <p className="admin-body mt-2">{data.totalMatches.toLocaleString()} rows match the current filters.</p>
                </div>
                <AdminButton asChild variant="ghost">
                  <Link href="/admin/catalog/compatibility">Clear filters</Link>
                </AdminButton>
              </div>

              <form method="get" className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                <AdminField label="Search">
                  <AdminInput name="q" defaultValue={q} placeholder="Brand, model, adapter, notes" />
                </AdminField>
                <AdminField label="Stroller">
                  <AdminSelect name="strollerId" defaultValue={strollerId}>
                    <option value="">All strollers</option>
                    {data.strollers.map((stroller) => (
                      <option key={stroller.id} value={stroller.id}>
                        {productLabel(stroller)}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
                <AdminField label="Car seat">
                  <AdminSelect name="carSeatId" defaultValue={carSeatId}>
                    <option value="">All infant seats</option>
                    {data.carSeats.map((seat) => (
                      <option key={seat.id} value={seat.id}>
                        {productLabel(seat)}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
                <AdminButton type="submit" variant="primary">Filter</AdminButton>
              </form>

              <div className="admin-stack gap-3">
                {data.matches.length === 0 ? (
                  <p className="admin-body">No compatibility rows match these filters.</p>
                ) : (
                  data.matches.map((row) => (
                    <CompatibilityEditor
                      key={row.id}
                      row={row}
                      strollers={data.strollers}
                      carSeats={data.carSeats}
                      adapters={data.adapters}
                    />
                  ))
                )}
              </div>
            </AdminSurface>
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

  const [strollers, carSeats, adapters, matches, totalMatches] = await Promise.all([
    db.stroller.findMany({
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    }),
    db.carSeat.findMany({
      where: { seatType: 'INFANT' },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    }),
    db.affiliateCatalogProduct.findMany({
      where: {
        isActiveInFeed: true,
        OR: [
          { title: { contains: 'adapter', mode: 'insensitive' } },
          { title: { contains: 'adaptor', mode: 'insensitive' } },
          { enrichment: { is: { productType: { in: ['stroller adapter', 'infant car seat adapter'] } } } },
        ],
      },
      select: {
        id: true,
        provider: true,
        brand: true,
        title: true,
        price: true,
        salePrice: true,
      },
      orderBy: [{ provider: 'asc' }, { title: 'asc' }],
      take: 300,
    }),
    db.compatibility.findMany({
      where,
      include: {
        stroller: { select: { id: true, brand: true, model: true, displayName: true } },
        carSeat: { select: { id: true, brand: true, model: true, displayName: true } },
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 150,
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
  return (
    <form action={saveCompatibility} className="grid gap-3 lg:grid-cols-2">
      {row ? (
        <>
          <input type="hidden" name="compatibilityId" value={row.id} />
          <input type="hidden" name="strollerId" value={row.strollerId} />
          <input type="hidden" name="carSeatId" value={row.carSeatId} />
        </>
      ) : null}

      {mode === 'create' ? (
        <>
          <AdminField label="Stroller" help="Choose the exact stroller model, not just the brand.">
            <AdminSelect name="strollerId" required defaultValue="">
              <option value="">Select stroller</option>
              {strollers.map((stroller) => (
                <option key={stroller.id} value={stroller.id}>
                  {productLabel(stroller)}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="Infant car seats" help="Hold Command or Shift to select more than one.">
            <AdminSelect name="carSeatIds" multiple required size={8} defaultValue={[]}>
              {carSeats.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {productLabel(seat)}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </>
      ) : null}

      <AdminField label="Compatibility type">
        <AdminSelect name="compatibilityType" defaultValue={row?.compatibilityType ?? 'ADAPTER'}>
          {COMPATIBILITY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Confidence">
        <AdminSelect name="confidence" defaultValue={row?.confidence ?? 'HIGH'}>
          {CONFIDENCE_VALUES.map((confidence) => (
            <option key={confidence} value={confidence}>{confidence}</option>
          ))}
        </AdminSelect>
      </AdminField>

      <label className="admin-toggle lg:col-span-2">
        <input type="checkbox" name="adapterRequired" defaultChecked={row?.adapterRequired ?? false} />
        <span>Adapter required</span>
      </label>

      <AdminField label="Adapter from catalog" help="Optional. Selecting one fills adapter fields on save.">
        <AdminSelect name="adapterCatalogProductId" defaultValue="">
          <option value="">No catalog adapter selected</option>
          {adapters.map((adapter) => (
            <option key={adapter.id} value={adapter.id}>
              {providerLabel(adapter.provider)} - {productLabel(adapter)}{money(adapter.salePrice ?? adapter.price) ? ` - ${money(adapter.salePrice ?? adapter.price)}` : ''}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Adapter display name">
        <AdminInput name="adapterType" defaultValue={row?.adapterType ?? ''} placeholder="Vista car seat adapter for Mesa" />
      </AdminField>

      <AdminField label="Adapter URL">
        <AdminInput name="adapterBabylistUrl" defaultValue={row?.adapterBabylistUrl ?? ''} placeholder="https://..." />
      </AdminField>

      <AdminField label="Adapter price">
        <AdminInput name="adapterPrice" defaultValue={row?.adapterPrice != null ? row.adapterPrice.toFixed(2) : ''} inputMode="decimal" placeholder="49.99" />
      </AdminField>

      <AdminField label="Adapter image URL">
        <AdminInput name="adapterImage" defaultValue={row?.adapterImage ?? ''} placeholder="https://..." />
      </AdminField>

      <AdminField label="Adapter SKU">
        <AdminInput name="adapterBabylistSku" defaultValue={row?.adapterBabylistSku ?? ''} />
      </AdminField>

      <AdminField label="Notes">
        <AdminTextarea name="notes" defaultValue={row?.notes ?? ''} rows={4} />
      </AdminField>

      <div className="flex items-center justify-end gap-2 lg:col-span-2">
        <AdminButton type="submit" variant="primary">
          {mode === 'create' ? 'Create match' : 'Save match'}
        </AdminButton>
      </div>
    </form>
  );
}

function CompatibilityEditor({
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
    <details className="rounded-[20px] border border-[var(--admin-color-border)] bg-white p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="admin-stack gap-1">
            <p className="font-semibold text-admin">{productLabel(row.stroller)} {'->'} {productLabel(row.carSeat)}</p>
            <p className="admin-micro">
              {row.compatibilityType} | {row.confidence} | {row.adapterRequired ? 'Adapter required' : 'Direct or no adapter'}
              {row.adapterType ? ` | ${row.adapterType}` : ''}
            </p>
            {row.adapterBabylistUrl ? (
              <a
                href={row.adapterBabylistUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="admin-micro underline"
              >
                Open adapter link
              </a>
            ) : null}
          </div>
          <span className="admin-chip">Edit</span>
        </div>
      </summary>

      <div className="admin-divider my-4" />
      <CompatibilityForm
        mode="edit"
        row={row}
        strollers={strollers}
        carSeats={carSeats}
        adapters={adapters}
      />
      <form action={deleteCompatibility} className="mt-3 flex justify-end">
        <input type="hidden" name="compatibilityId" value={row.id} />
        <AdminButton type="submit" variant="danger">
          Delete match
        </AdminButton>
      </form>
    </details>
  );
}
