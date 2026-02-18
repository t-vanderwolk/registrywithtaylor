import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';

export default async function AdminAnalyticsPage() {
  await requireAdminSession();

  const [totalPosts, publishedPosts, viewsSum, mostViewedPost, postsByViews] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findFirst({
      orderBy: { views: 'desc' },
      select: { id: true, title: true, slug: true, views: true },
    }),
    prisma.post.findMany({
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        published: true,
      },
    }),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Analytics"
        title="Blog performance overview"
        subtitle="Track output volume, publication state, and post-level readership at a glance."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/blog">Manage blog</Link>
          </AdminButton>
        }
      />

      <section className="admin-kpi-grid" aria-label="Analytics metrics">
        <AdminKpiCard label="Total posts" value={String(totalPosts)} />
        <AdminKpiCard label="Published" value={String(publishedPosts)} />
        <AdminKpiCard label="Total views" value={(viewsSum._sum.views ?? 0).toLocaleString()} />
      </section>

      <AdminSurface variant="muted" className="admin-stack" >
        <p className="admin-eyebrow">Top performer</p>
        <p className="admin-body">
          {mostViewedPost ? `${mostViewedPost.title} (${mostViewedPost.views} views)` : 'No post data yet.'}
        </p>
      </AdminSurface>

      <AdminSurface className="admin-stack" >
        <h2 className="admin-h2">Post view counts</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'status', label: 'Status' },
            { key: 'views', label: 'Views', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No post data yet.</p>}
        >
          {postsByViews.map((post) => (
            <tr key={post.id} className="admin-row">
              <td className="text-admin">{post.title}</td>
              <td>
                <span className="admin-table-code">{post.slug}</span>
              </td>
              <td>
                <span className={`admin-chip ${post.published ? 'admin-chip--published' : 'admin-chip--draft'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="text-right text-admin">{post.views}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
