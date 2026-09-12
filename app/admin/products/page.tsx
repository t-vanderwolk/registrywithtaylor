import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import prismaBase from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Products · Admin',
  robots: { index: false, follow: false },
};

// Several catalog models are deploy-gated in this app, so keep this hub tolerant
// when a local database is behind production.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const workspaces = [
  {
    title: 'Core databases',
    description: 'Canonical stroller and infant car-seat records used by the tools.',
    links: [
      { label: 'Strollers', href: '/admin/strollers', primary: true },
      { label: 'Car Seats', href: '/admin/car-seats' },
    ],
  },
  {
    title: 'Travel-system matching',
    description: 'Compatibility rows, adapter notes, confidence, and public checker output.',
    links: [
      { label: 'Compatibility Manager', href: '/admin/catalog/compatibility', primary: true },
      { label: 'Travel-System Tool', href: '/tools/travel-system' },
    ],
  },
  {
    title: 'Affiliate catalog',
    description: 'Retailer feed rows, images, categories, visibility, and manual product fixes.',
    links: [
      { label: 'Affiliate Catalog', href: '/admin/catalog', primary: true },
      { label: 'Catalog Health', href: '/admin/catalog/health' },
      { label: 'Recategorize', href: '/admin/catalog/recategorize' },
    ],
  },
  {
    title: 'Retailer maintenance',
    description: 'Babylist SKU matching and GoodBuy Gear badges kept out of the main sidebar.',
    links: [
      { label: 'Babylist SKUs', href: '/admin/babylist', primary: true },
      { label: 'GoodBuy Gear Badges', href: '/admin/catalog/goodbuygear' },
    ],
  },
  {
    title: 'Public QA',
    description: 'Open the customer-facing tools that depend on this catalog data.',
    links: [
      { label: 'Stroller Finder', href: '/tools/stroller-finder', primary: true },
      { label: 'Stroller Quiz', href: '/tools/stroller-quiz' },
      { label: 'Compare Tool', href: '/tools/compare' },
    ],
  },
];

async function safeCount(label: string, count: () => Promise<number>) {
  try {
    return { label, value: await count() };
  } catch {
    return { label, value: null };
  }
}

export default async function AdminProductsPage() {
  await requireAdminSession('/admin/products');

  const [strollers, carSeats, compatibility, catalogRows] = await Promise.all([
    safeCount('Strollers', () => db.stroller.count()),
    safeCount('Infant car seats', () => db.carSeat.count({ where: { seatType: 'INFANT' } })),
    safeCount('Compatibility rows', () => db.compatibility.count()),
    safeCount('Catalog rows', () => db.affiliateCatalogProduct.count()),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Products & Compatibility"
        title="Product command center"
        subtitle="The working hub for stroller data, infant car seats, affiliate catalog records, images, and travel-system matching."
        actions={
          <AdminButton asChild variant="primary">
            <Link href="/admin/catalog/health">Run health check</Link>
          </AdminButton>
        }
      />

      <section className="admin-kpi-grid" aria-label="Product catalog totals">
        {[strollers, carSeats, compatibility, catalogRows].map((item) => (
          <AdminKpiCard
            key={item.label}
            label={item.label}
            value={item.value == null ? 'N/A' : item.value.toLocaleString()}
          />
        ))}
      </section>

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Workspaces</p>
          <p className="admin-body">Start with the job you need to do. Detailed maintenance pages stay available from here without crowding the sidebar.</p>
        </div>

        <div className="admin-hub-grid">
          {workspaces.map((workspace) => (
            <section key={workspace.title} className="admin-hub-group" aria-label={workspace.title}>
              <div className="admin-stack gap-1">
                <h2 className="admin-hub-title">{workspace.title}</h2>
                <p className="admin-micro">{workspace.description}</p>
              </div>
              <div className="admin-hub-links">
                {workspace.links.map((link) => (
                  <AdminButton
                    key={link.href}
                    asChild
                    variant={link.primary ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </AdminButton>
                ))}
              </div>
            </section>
          ))}
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-3">
        <p className="admin-eyebrow">Dormant concept area</p>
        <h2 className="admin-h2">Academy and Learn remain hidden</h2>
        <p className="admin-body">
          Academy, Guides, Academy analytics, and member enrollment tools are preserved in the codebase, but they are intentionally absent from this active admin workflow until the concept is ready.
        </p>
      </AdminSurface>
    </AdminStack>
  );
}
