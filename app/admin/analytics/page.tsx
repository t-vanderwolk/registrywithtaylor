import prisma from '@/lib/prisma';

export default async function AdminAnalyticsPage() {
  const [totalPosts, viewsSum, totalAffiliateClicks, mostViewed] = await Promise.all([
    prisma.post.count(),
    prisma.post.aggregate({
      _sum: { views: true },
    }),
    prisma.postAnalytics.count({
      where: { event: 'AFFILIATE_CLICK' },
    }),
    prisma.post.findFirst({
      orderBy: { views: 'desc' },
      select: { id: true, title: true, views: true, slug: true },
    }),
  ]);

  const mostClickedGroup = await prisma.postAnalytics.groupBy({
    by: ['postId'],
    where: { event: 'AFFILIATE_CLICK' },
    _count: { _all: true },
    orderBy: { _count: { postId: 'desc' } },
    take: 1,
  });

  const mostClickedPostId = mostClickedGroup[0]?.postId;
  const mostClickedCount = mostClickedGroup[0]?._count._all ?? 0;
  const mostClickedPost = mostClickedPostId
    ? await prisma.post.findUnique({
        where: { id: mostClickedPostId },
        select: { id: true, title: true, slug: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Analytics</p>
        <h1>Blog performance</h1>
        <p className="body-copy">
          Monitor views, affiliate clicks, and the posts that are resonating most with families.
        </p>
      </header>

      <section
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
      >
        <article className="card">
          <h3>Total posts</h3>
          <p className="display">{totalPosts}</p>
        </article>
        <article className="card">
          <h3>Total views</h3>
          <p className="display">{(viewsSum._sum.views ?? 0).toLocaleString()}</p>
        </article>
        <article className="card">
          <h3>Total affiliate clicks</h3>
          <p className="display">{totalAffiliateClicks.toLocaleString()}</p>
        </article>
      </section>

      <section className="card">
        <h2>Top posts</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <p className="micro-text">Most viewed</p>
            <p>
              {mostViewed ? `${mostViewed.title} - ${mostViewed.views} views` : 'No posts yet'}
            </p>
          </div>
          <div>
            <p className="micro-text">Most clicked</p>
            <p>
              {mostClickedPost
                ? `${mostClickedPost.title} - ${mostClickedCount} affiliate clicks`
                : 'No posts yet'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
