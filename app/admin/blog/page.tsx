import Link from 'next/link';
import { getDrafts } from '@/lib/admin/blogStore';
import { formatDateShort } from '@/lib/formatDateShort';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminToolbar from '@/components/admin/patterns/AdminToolbar';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';

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

  const drafts = await getDrafts();
  const normalizedDrafts = drafts
    .map((draft) => ({
      ...draft,
      status: draft.status === 'published' ? 'published' : 'draft',
    }))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  const visibleDrafts =
    filter === 'all' ? normalizedDrafts : normalizedDrafts.filter((draft) => draft.status === filter);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title="Drafts"
        subtitle="Write in calm. Publish with intention."
        actions={
          <AdminButton asChild variant="primary">
            <Link href="/admin/blog/new">New Draft</Link>
          </AdminButton>
        }
      />

      <AdminSurface className="admin-stack" >
        <AdminToolbar
          left={
            <AdminTabs
              ariaLabel="Filter drafts"
              activeValue={filter}
              tabs={[
                { label: 'All', href: '/admin/blog', value: 'all' },
                { label: 'Draft', href: '/admin/blog?status=draft', value: 'draft' },
                { label: 'Published', href: '/admin/blog?status=published', value: 'published' },
              ]}
            />
          }
          right={
            <AdminButton asChild variant="secondary">
              <Link href="/admin/blog/new">Create draft</Link>
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
              title="No drafts found"
              hint="Start your first blog entry and shape it over time."
              action={
                <AdminButton asChild variant="primary" size="sm">
                  <Link href="/admin/blog/new">Create your first draft</Link>
                </AdminButton>
              }
            />
          }
        >
          {visibleDrafts.map((draft) => (
            <tr key={draft.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-[1.1rem] leading-tight text-admin">
                      {draft.title || 'Untitled draft'}
                    </p>
                    <span className={`admin-chip ${draft.status === 'published' ? 'admin-chip--published' : 'admin-chip--draft'}`}>
                      {draft.status}
                    </span>
                  </div>
                  <p className="admin-micro">{draft.excerpt || 'No excerpt yet.'}</p>
                </div>
              </td>
              <td>
                <span className="admin-table-code">{draft.slug || 'auto-generated-if-empty'}</span>
              </td>
              <td className="text-right admin-micro">{formatDateShort(draft.updatedAt)}</td>
              <td>
                <div className="flex justify-end">
                  <AdminButton asChild variant="secondary" size="sm">
                    <Link href={`/admin/blog/${draft.id}/edit`} aria-label={`Edit draft ${draft.title || 'untitled'}`}>
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
