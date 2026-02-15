import Link from 'next/link';
import { redirect } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

type Filter = 'all' | 'draft' | 'published';

type SearchParams = Promise<{ status?: string }> | { status?: string } | undefined;

const resolveFilter = (value?: string): Filter => {
  if (value === 'draft') {
    return 'draft';
  }

  if (value === 'published') {
    return 'published';
  }

  return 'all';
};

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

async function deletePost(formData: FormData) {
  'use server';
  const postId = formData.get('postId');

  if (!postId || typeof postId !== 'string') {
    throw new Error('Missing post ID');
  }

  await requireAdminSession();
  await prisma.post.delete({ where: { id: postId } });
  redirect('/admin/blog');
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();

  const { status } = (await Promise.resolve(searchParams)) ?? {};
  const filter = resolveFilter(status);
  const where =
    filter === 'all'
      ? undefined
      : {
          published: filter === 'published',
        };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      views: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <Hero
        eyebrow="Admin Blog"
        title="Publish and manage journal content"
        subtitle="Create, edit, and publish blog posts that appear instantly on the public journal."
        image="/assets/hero/hero-06.jpg"
        primaryCta={{ label: 'New Post', href: '/admin/blog/new' }}
      />

      <section className="card">
        <div className="admin-toolbar">
          <div className="admin-filter-group" role="tablist" aria-label="Filter posts">
            <Link
              href="/admin/blog"
              className={`btn btn--secondary ${filter === 'all' ? 'is-active' : ''}`}
            >
              All
            </Link>
            <Link
              href="/admin/blog?status=draft"
              className={`btn btn--secondary ${filter === 'draft' ? 'is-active' : ''}`}
            >
              Draft
            </Link>
            <Link
              href="/admin/blog?status=published"
              className={`btn btn--secondary ${filter === 'published' ? 'is-active' : ''}`}
            >
              Published
            </Link>
          </div>
          <Link className="btn btn--primary" href="/admin/blog/new">
            New Post
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Views</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    No posts found for this filter.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>
                    <code>{post.slug}</code>
                  </td>
                  <td>
                    <span className={`status-chip ${post.published ? 'is-published' : 'is-draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{post.views}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <Link className="btn btn--secondary" href={`/admin/blog/${post.id}/edit`}>
                        Edit
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button type="submit" className="btn btn--ghost">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
