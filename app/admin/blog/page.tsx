import Link from 'next/link';
import { formatDateShort } from '@/lib/formatDateShort';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminToolbar from '@/components/admin/patterns/AdminToolbar';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';
import prisma from '@/lib/server/prisma';

type Filter = 'all' | 'draft' | 'published';

type SearchParams = Promise<{ status?: string }> | undefined;

function resolveFilter(value?: string): Filter {
  if (value === 'draft') return 'draft';
  if (value === 'published') return 'published';
  return 'all';
}

export const dynamic = 'force-dynamic';

export default async function AdminBlogIndex({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const { status } = params ?? {};
  const filter = resolveFilter(status);

  const visiblePosts = await prisma.post.findMany({
    where:
      filter === 'all'
        ? undefined
        : {
            published: filter === 'published',
          },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      published: true,
      updatedAt: true,
    },
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title="Posts"
        subtitle="Write in calm. Publish with intention."
        actions={
          <AdminButton asChild variant="primary">
            <Link href="/admin/blog/new">New Post</Link>
          </AdminButton>
        }
      />

      <AdminSurface className="admin-stack">
        <AdminToolbar
          left={
            <AdminTabs
              ariaLabel="Filter posts"
              activeValue={filter}
              tabs={[
                { label: 'All', href: '/admin/blog', value: 'all' },
                { label: 'Drafts', href: '/admin/blog?status=draft', value: 'draft' },
                { label: 'Published', href: '/admin/blog?status=published', value: 'published' },
              ]}
            />
          }
          right={
            <AdminButton asChild variant="secondary">
              <Link href="/admin/blog/new">Create post</Link>
            </AdminButton>
          }
        />

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'updated', label: 'Updated', align: 'right' },
            { key: 'actions', label: 'Actions', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No posts found"
              hint="Create a post draft and publish when ready."
              action={
                <AdminButton asChild variant="primary" size="sm">
                  <Link href="/admin/blog/new">Create your first post</Link>
                </AdminButton>
              }
            />
          }
        >
          {visiblePosts.map((post) => (
            <tr key={post.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-[1.1rem] leading-tight text-admin">
                      {post.title || 'Untitled post'}
                    </p>
                    <span className={`admin-chip ${post.published ? 'admin-chip--published' : 'admin-chip--draft'}`}>
                      {post.published ? 'published' : 'draft'}
                    </span>
                  </div>
                  <p className="admin-micro">{post.excerpt || 'No excerpt yet.'}</p>
                </div>
              </td>
              <td>
                <span className="admin-table-code">{post.slug || 'auto-generated-if-empty'}</span>
              </td>
              <td className="text-right admin-micro">{formatDateShort(post.updatedAt.getTime())}</td>
              <td>
                <div className="flex justify-end">
                  <AdminButton asChild variant="secondary" size="sm">
                    <Link href={`/admin/blog/${post.id}/edit`} aria-label={`Edit post ${post.title || 'untitled'}`}>
                      Edit
                    </Link>
                  </AdminButton>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
