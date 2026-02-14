import { notFound } from 'next/navigation';
import SiteShell from '@/components/SiteShell';
import Section from '@/components/Section';
import PostContent from '@/components/blog/PostContent';
import prisma from '@/lib/prisma';

type BlogPostParams = {
  params: {
    slug: string;
  };
};

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default async function BlogPostPage({ params }: BlogPostParams) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: { email: true },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  const affiliateClicks = await prisma.postAnalytics.count({
    where: { postId: post.id, event: 'AFFILIATE_CLICK' },
  });

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Section variant="highlight" aria-label="Blog post">
          <div className="container">
            <div className="card" style={{ padding: '3rem' }}>
              <p className="eyebrow">Journal entry</p>
              <h1>{post.title}</h1>
              <p className="micro-text">
                {post.author.email} - {formatDate(post.createdAt)}
              </p>
              <div className="hero__actions" style={{ gap: '1rem', marginTop: '1rem' }}>
                <span className="micro-text">{post.views} views</span>
                <span className="micro-text">{affiliateClicks} affiliate clicks</span>
              </div>
              <PostContent postId={post.id} content={post.content} />
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
