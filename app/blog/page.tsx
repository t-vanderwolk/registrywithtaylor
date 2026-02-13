import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Display, Eyebrow, Lead, SectionTitle } from '@/components/Typography';

const posts = [
  {
    title: 'Building a Registry Without Overbuying',
    date: 'March 4, 2026',
    tag: 'Registry',
    excerpt:
      'Pair intentional research with curated picks so every product earns a place in your home without inflating the list.',
  },
  {
    title: 'Nursery Layout: What Actually Matters',
    date: 'February 18, 2026',
    tag: 'Design',
    excerpt:
      'Prioritize sight-lines, storage, and lighting before buying trendy accents so functionality supports calm sleep routines.',
  },
  {
    title: 'Traveling With a Newborn — Gear That Helps',
    date: 'February 2, 2026',
    tag: 'Travel',
    excerpt:
      'Long flights and weekends away stay manageable when you pair compact gear with layered packing lists from our editors.',
  },
  {
    title: 'How to Choose a Stroller for Your Lifestyle',
    date: 'January 21, 2026',
    tag: 'Gear',
    excerpt:
      'City sidewalks, trail runs, or suburban errands? Match the stroller frame to your daily path to avoid returns.',
  },
  {
    title: 'Convertible Car Seats Explained',
    date: 'January 9, 2026',
    tag: 'Safety',
    excerpt:
      'Transition timelines, harness positioning, and real-world fit checks keep this safety upgrade sensible and stress-free.',
  },
  {
    title: 'Minimalist Baby Prep: Where to Start',
    date: 'December 30, 2025',
    tag: 'Planning',
    excerpt:
      'Focus on three core routines—feeding, sleeping, and cleaning—then fold in extras only when they genuinely elevate your flow.',
  },
];

export const metadata = {
  title: 'Blog — Taylor-Made Baby Planning',
  description:
    'Notes on thoughtful registry planning, nursery design, and calm preparation from Taylor-Made Baby Planning.',
};

export default function BlogPage() {
  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Section variant="base" className="hero" aria-labelledby="blog-hero">
          <div className="container hero__content">
            <Eyebrow className="hero__eyebrow">From the Journal</Eyebrow>
            <Display id="blog-hero" className="hero__title">
              Thoughtful notes on registry planning, nursery design, and calm preparation.
            </Display>
            <Lead className="hero__subtitle">
              Stories, quick tips, and practical thinking to keep every moment intentional.
            </Lead>
          </div>
        </Section>

        <Section variant="neutral" aria-label="Blog posts">
          <div className="container">
            <SectionTitle className="section__title">Latest journal entries</SectionTitle>
            <div id="blog-posts" className="feature-grid" aria-live="polite">
              {posts.map((post) => (
                <article key={post.title} className="feature-card">
                  <Body className="feature-card__body body-copy--full" aria-label={post.tag}>
                    {post.tag}
                  </Body>
                  <Link
                    className="feature-card__title text-neutral-900 no-underline hover:underline underline-offset-4"
                    href="/blog"
                  >
                    {post.title}
                  </Link>
                  <Body className="feature-card__body body-copy--full">{post.excerpt}</Body>
                  <div className="hero__actions">
                    <span className="hero__subtitle">{post.date}</span>
                    <Link
                      className="primary-nav__link text-neutral-900 no-underline hover:underline underline-offset-4"
                      href="/blog"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
