import Hero from '@/components/ui/Hero';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

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
    <div className="space-y-6">
      <Hero
        eyebrow="Analytics"
        title="Blog performance overview"
        subtitle="Track output volume, publication state, and post-level readership at a glance."
        image="/assets/hero/hero-03.jpg"
      />

      <section className="admin-metric-grid">
        <article className="card">
          <h3>Total posts</h3>
          <p className="display">{totalPosts}</p>
        </article>
        <article className="card">
          <h3>Published posts</h3>
          <p className="display">{publishedPosts}</p>
        </article>
        <article className="card">
          <h3>Total views</h3>
          <p className="display">{(viewsSum._sum.views ?? 0).toLocaleString()}</p>
        </article>
        <article className="card">
          <h3>Most viewed post</h3>
          <p className="body-copy">
            {mostViewedPost ? `${mostViewedPost.title} (${mostViewedPost.views} views)` : 'No posts yet'}
          </p>
        </article>
      </section>

      <section className="card">
        <h2>Post view counts</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {postsByViews.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-table__empty">
                    No post data yet.
                  </td>
                </tr>
              )}
              {postsByViews.map((post) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
