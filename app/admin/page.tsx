import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminPage() {
  const [totalPosts, latestPosts, totalViews, totalAffiliateClicks] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, published: true, views: true },
    }),
    prisma.post.aggregate({
      _sum: { views: true },
    }),
    prisma.postAnalytics.count({
      where: { event: 'AFFILIATE_CLICK' },
    }),
  ]);

  const postIds = latestPosts.map((post) => post.id);
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
        <p className="eyebrow">Admin Dashboard</p>
        <h1>Manage blog, affiliates & analytics</h1>
        <p className="body-copy">
          Access the journal CMS, affiliate creative storage, and the metrics that keep Taylor-Made Baby Planning running smoothly.
        </p>
        <div className="hero__actions" style={{ justifyContent: 'left' }}>
          <Link className="btn btn--primary" href="/admin/blog">
            Manage Blog
          </Link>
          <Link className="btn btn--secondary" href="/admin/affiliates">
            Partnerships
          </Link>
          <Link className="btn btn--secondary" href="/admin/analytics">
            View Analytics
          </Link>
        </div>
      </header>

      <section
        className="grid"
        style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        <article className="card">
          <h3>Total posts</h3>
          <p className="display">{totalPosts}</p>
        </article>
        <article className="card">
          <h3>Total views</h3>
          <p className="display">{(totalViews._sum.views ?? 0).toLocaleString()}</p>
        </article>
        <article className="card">
          <h3>Total affiliate clicks</h3>
          <p className="display">{totalAffiliateClicks.toLocaleString()}</p>
        </article>
      </section>

      <section className="card">
        <h2>Recently updated posts</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: '1rem',
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          {latestPosts.map((post) => (
            <li
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <strong>{post.title}</strong>
              <span>{post.published ? 'Published' : 'Draft'}</span>
              <span>{post.views} views</span>
              <span>{clickMap.get(post.id) ?? 0} affiliate clicks</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
