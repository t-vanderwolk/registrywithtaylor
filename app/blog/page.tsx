import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import Section from '@/components/Section';
import Hero from '@/components/ui/Hero';
import { Body, SectionTitle } from '@/components/Typography';
import prisma from '@/lib/prisma';

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const metadata = {
  title: 'Blog — Taylor-Made Baby Planning',
  description:
    'Notes on thoughtful registry planning, nursery design, and calm preparation from Taylor-Made Baby Planning.',
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
      createdAt: true,
    },
  });

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Hero
          eyebrow="From the Journal"
          title="Thoughtful notes on registry planning, nursery design, and calm preparation."
          subtitle="Stories, quick tips, and practical thinking to keep every moment intentional."
          image="/assets/hero/hero-04.jpg"
          primaryCta={{ label: 'Browse latest', href: '/blog' }}
        />

        <Section variant="neutral" aria-label="Blog posts">
          <div className="container">
            <SectionTitle className="section__title">Latest journal entries</SectionTitle>
            <div id="blog-posts" className="feature-grid" aria-live="polite">
              {posts.map((post) => (
                <article key={post.id} className="feature-card">
                  <Body className="feature-card__body body-copy--full">Journal</Body>
                  <Link
                    className="feature-card__title text-neutral-900 no-underline hover:underline underline-offset-4"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                  <Body className="feature-card__body body-copy--full">{post.excerpt}</Body>
                  <div className="hero__actions" style={{ justifyContent: 'space-between' }}>
                    <span className="hero__subtitle">
                      {formatDate(new Date(post.createdAt))}
                    </span>
                    <Link
                      className="primary-nav__link text-neutral-900 no-underline hover:underline underline-offset-4"
                      href={`/blog/${post.slug}`}
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
              {posts.length === 0 && (
                <p className="body-copy">No posts published yet.</p>
              )}
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
