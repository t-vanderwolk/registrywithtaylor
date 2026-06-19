import prisma from '@/lib/server/prisma';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';
import BabylistSkuEditor from './BabylistSkuEditor';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Babylist SKUs · Admin',
  robots: { index: false, follow: false },
};

export default async function AdminBabylistPage() {
  await requireAdminSession('/admin/babylist');

  const strollers = await prisma.stroller.findMany({
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    select: {
      id: true,
      brand: true,
      model: true,
      displayName: true,
      babylistSku: true,
      babylistPrice: true,
      babylistUrl: true,
      babylistUpdatedAt: true,
    },
  });

  const rows = strollers.map((s) => ({
    id: s.id,
    brand: s.brand,
    model: s.model,
    name: s.displayName ?? `${s.brand} ${s.model}`,
    babylistSku: s.babylistSku,
    babylistPrice: s.babylistPrice,
    babylistUrl: s.babylistUrl,
    babylistUpdatedAt: s.babylistUpdatedAt ? s.babylistUpdatedAt.toISOString() : null,
  }));

  const synced = rows.filter((r) => r.babylistUrl).length;

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Babylist"
          title="Stroller Babylist SKUs"
          subtitle="Paste an Impact CatalogItemId to lock a stroller to an exact Babylist product. The next sync resolves it precisely — no fuzzy matching. Leave blank to let the sync fuzzy-match (or clear it)."
        />
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow={`${synced} of ${rows.length} have live data`}
            title="Strollers"
            subtitle="Find a product's CatalogItemId in your Impact catalog feed, paste it, and Save. Run the sync afterward to fetch its price, image, and link."
          />
          <BabylistSkuEditor strollers={rows} />
        </AdminSurface>
      </AdminContainer>
    </main>
  );
}
