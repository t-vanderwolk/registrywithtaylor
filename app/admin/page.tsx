import Link from 'next/link';
import { getDrafts } from '@/lib/admin/blogStore';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const drafts = await getDrafts();
  const draftCount = drafts.length;
  const publishedCount = drafts.filter((draft) => draft.status === 'published').length;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Admin Portal"
        title="Welcome back."
        subtitle="Manage drafts, cadence, and what ships next."
        actions={
          <AdminButton asChild variant="primary">
            <Link href="/admin/blog/new">New Draft</Link>
          </AdminButton>
        }
      />

      <section className="admin-kpi-grid" aria-label="Admin metrics">
        <AdminKpiCard label="Drafts" value={String(draftCount)} hint="Saved locally in JSON." />
        <AdminKpiCard label="Published" value={String(publishedCount)} hint="Local status toggle only." />
        <AdminKpiCard label="Cadence" value="Ivory / Blush / Neutral" hint="Marketing visuals remain frozen." />
      </section>

      <AdminSurface className="admin-stack" >
        <h2 className="admin-h2">Next up</h2>
        <ul className="admin-stack list-disc gap-2 pl-5 admin-body">
          <li>
            Continue drafting: <span className="text-admin">The Art of the Registry</span>.
          </li>
          <li>Publish-ready cover images (hero-safe, no baked-in text).</li>
          <li>Optional Prisma wiring when database mode is switched back on.</li>
        </ul>
      </AdminSurface>
    </AdminStack>
  );
}
