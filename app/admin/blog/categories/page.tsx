import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { listAdminPosts, parseAdminBlogListParams } from '@/lib/server/adminBlog';

export const dynamic = 'force-dynamic';

export default async function AdminBlogCategoriesPage() {
  const result = await listAdminPosts(parseAdminBlogListParams());

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="Categories"
        subtitle="A lightweight view of editorial category coverage. Full category management can expand in Phase 3."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/blog">Back to posts</Link>
          </AdminButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.categoryCounts.map((entry) => (
          <AdminSurface key={entry.category} className="admin-stack gap-2">
            <p className="admin-eyebrow">Category</p>
            <h2 className="admin-h2">{entry.category}</h2>
            <p className="admin-body">{entry.count} posts</p>
          </AdminSurface>
        ))}
      </div>
    </AdminStack>
  );
}
