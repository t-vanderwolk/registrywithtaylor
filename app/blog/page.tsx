import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import { Body, SectionTitle } from '@/components/Typography';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackCover = '/assets/hero/hero-05.jpg';

export const metadata = {
  title: 'Blog — Taylor-Made Baby Planning',
  description:
    'Notes on thoughtful registry planning, nursery design, and calm preparation from Taylor-Made Baby Planning.',
};

const toExcerpt = (excerpt: string | null, content: string) => {
  if (excerpt?.trim()) {
    return excerpt;
  }

  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
    },
  });

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Hero
          eyebrow="From the Blog"
          title="Thoughtful notes on registry planning, nursery design, and calm preparation."
          subtitle="Stories, quick tips, and practical thinking to keep every moment intentional."
          image="/assets/hero/hero-04.jpg"
          imageAlt="Blog hero background for Taylor-Made Baby Planning"
        />

        <Section variant="neutral" aria-label="Blog posts">
          <div className="container">
            <SectionTitle className="section__title">Latest blog entries</SectionTitle>
            <div id="blog-posts" className="feature-grid" aria-live="polite">
              {posts.map((post) => (
                <article key={post.id} className="feature-card blog-card">
                  <img
                    src={fallbackCover}
                    alt={post.title}
                    className="blog-card__image"
                    loading="lazy"
                  />
                  <Body className="feature-card__body body-copy--full">Blog</Body>
                  <h2 className="feature-card__title">{post.title}</h2>
                  <Body className="feature-card__body body-copy--full">
                    {toExcerpt(post.excerpt, post.content)}
                  </Body>
                  <Link
                    className="btn btn--secondary blog-card__link"
                    href={`/blog/${post.slug}`}
                  >
                    Read More
                  </Link>
                </article>
              ))}
              {posts.length === 0 && <p className="body-copy">No posts published yet.</p>}
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
