import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import PlannerBoard from '@/components/admin/blog/PlannerBoard';
import { listPlannerPosts } from '@/lib/server/adminBlog';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPlannerPage() {
  const posts = await listPlannerPosts();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="Content planner"
        subtitle="Move posts through idea, outline, draft, ready, published, and archived stages."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/blog">Back to posts</Link>
            </AdminButton>
            <AdminButton asChild variant="primary">
              <Link href="/admin/blog/new">New Post</Link>
            </AdminButton>
          </>
        }
      />

      <PlannerBoard posts={posts} />
    </AdminStack>
  );
}
