import { notFound } from 'next/navigation';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import PostContent from '@/components/blog/PostContent';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackCover = '/assets/hero/hero-04.jpg';

type BlogPostParams = {
  params: Promise<{ slug: string }> | { slug: string };
};

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await Promise.resolve(params);

  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      views: true,
      createdAt: true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Section variant="highlight" aria-label="Blog post">
          <div className="container">
            <article className="card blog-detail-card">
              <p className="eyebrow">Blog entry</p>
              <h1>{post.title}</h1>
              <p className="micro-text">
                {post.author.email} • {formatDate(post.createdAt)} • {post.views} views
              </p>
              <img
                src={fallbackCover}
                alt={post.title}
                className="blog-detail__cover"
              />
              <PostContent postId={post.id} content={post.content} />
            </article>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
