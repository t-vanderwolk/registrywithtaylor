import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

async function togglePublish(formData: FormData) {
  'use server';
  const postId = formData.get('postId');
  const publishTarget = formData.get('publish');

  if (!postId || typeof postId !== 'string') {
    throw new Error('Missing post ID');
  }

  await requireAdminSession();
  await prisma.post.update({
    where: { id: postId },
    data: {
      published: publishTarget === 'true',
    },
  });

  redirect('/admin/blog');
}

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

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      views: true,
      updatedAt: true,
    },
  });

  const postIds = posts.map((post) => post.id);
  const clickBreakdown = postIds.length
    ? await prisma.postAnalytics.groupBy({
        by: ['postId'],
        where: {
          postId: { in: postIds },
          event: 'AFFILIATE_CLICK',
        },
        _count: { _all: true },
      })
    : [];
  const clickMap = new Map(
    clickBreakdown.map((row) => [row.postId, row._count._all]),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Blog CMS</p>
        <h1>Journal posts</h1>
        <div className="hero__actions" style={{ justifyContent: 'flex-start' }}>
          <Link className="btn btn--primary" href="/admin/blog/new">
            Create new post
          </Link>
        </div>
      </header>

      <section className="card">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          <span>
            <strong>Title</strong>
          </span>
          <span>
            <strong>Status</strong>
          </span>
          <span>
            <strong>Views</strong>
          </span>
          <span>
            <strong>Affiliate Clicks</strong>
          </span>
          <span>
            <strong>Actions</strong>
          </span>
          {posts.map((post) => (
            <Fragment key={post.id}>
              <span>
                <Link href={`/admin/blog/${post.id}/edit`}>{post.title}</Link>
              </span>
              <span>{post.published ? 'Published' : 'Draft'}</span>
              <span>{post.views}</span>
              <span>{clickMap.get(post.id) ?? 0}</span>
              <span style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <form action={togglePublish}>
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="publish" value={(!post.published).toString()} />
                  <button type="submit" className="btn btn--secondary">
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                </form>
                <form action={deletePost}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button type="submit" className="btn btn--ghost">
                    Delete
                  </button>
                </form>
              </span>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
