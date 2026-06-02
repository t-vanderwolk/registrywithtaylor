import Link from 'next/link';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminKpiStrip from '@/components/admin/blog/AdminKpiStrip';
import BlogWorkspace from '@/components/admin/blog/BlogWorkspace';
import { listAdminPosts, parseAdminBlogListParams } from '@/lib/server/adminBlog';
import { requireAdminViewSession } from '@/lib/server/session';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

export const dynamic = 'force-dynamic';

export default async function AdminBlogIndex({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await requireAdminViewSession();
  const readOnly = session.user.role === 'REVIEWER';
  const params = parseAdminBlogListParams(searchParams ? await searchParams : undefined);
  const result = await listAdminPosts(params);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="Blog command center"
        subtitle={
          readOnly
            ? 'Review the editorial library, status mix, and content strategy without changing production records.'
            : 'Manage the library, move posts through the pipeline, and ship updates without leaving the workspace.'
        }
        actions={
          <>
            {!readOnly ? (
              <>
                <AdminButton asChild variant="secondary">
                  <Link href="/admin/blog/planner">Planner</Link>
                </AdminButton>
                <AdminButton asChild variant="primary">
                  <Link href="/admin/blog/new">New Post</Link>
                </AdminButton>
              </>
            ) : null}
          </>
        }
      />

      <AdminKpiStrip
        items={[
          { label: 'Total posts', value: result.kpis.totalPosts },
          { label: 'Draft count', value: result.kpis.draftCount, hint: 'Idea, outline, and draft stages' },
          { label: 'Ready count', value: result.kpis.readyCount, hint: 'Ready for editorial review or scheduling' },
          { label: 'Published count', value: result.kpis.publishedCount },
        ]}
      />

      <AdminSurface className="admin-stack gap-5">
        <BlogWorkspace
          posts={result.posts}
          filters={{
            search: params.search,
            status: params.status,
            stage: params.stage,
            category: params.category,
            featured: params.featured,
            sort: params.sort,
            page: params.page,
          }}
          pagination={{
            page: result.pagination.page,
            totalPages: result.pagination.totalPages,
            totalCount: result.pagination.totalCount,
          }}
          categoryOptions={result.categoryOptions}
          readOnly={readOnly}
        />
      </AdminSurface>
    </AdminStack>
  );
}
