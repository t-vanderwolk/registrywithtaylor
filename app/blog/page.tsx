import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import BlogIndexView from '@/components/blog/BlogIndexView';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { BLOG_GUIDES_TITLE, type BlogCategory } from '@/lib/blogCategories';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Baby Gear Journal — Taylor-Made Baby Co.',
  description:
    'Editorial baby gear guidance, registry strategy, nursery setup, and calmer preparation advice from Taylor-Made Baby Co.',
  keywords: [
    'baby gear journal',
    'baby registry planning',
    'stroller and car seat guidance',
    'nursery planning',
    'baby gear guidance',
    'Taylor-Made Baby Co.',
  ],
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string;
  readingTime: number | null;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featuredImage: {
    url: string;
  } | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
};

type BlogIndexPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  coverImage: string | null;
  dateLabel: string;
  dateTime: string;
  readingTime: number | null;
};

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toExcerpt = (excerpt: string | null, content: string, maxLength = 160) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

export default async function BlogPage() {
  const now = new Date();
  const posts = (await prisma.post.findMany({
    where: getPublicPostWhere(now),
    orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      readingTime: true,
      featuredImageUrl: true,
      coverImage: true,
      featuredImage: {
        select: {
          url: true,
        },
      },
      publishedAt: true,
      scheduledFor: true,
      createdAt: true,
    },
  })) as BlogPost[];

  const toViewPost = (post: BlogPost): BlogIndexPost => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: toExcerpt(post.excerpt, post.content, 170),
    coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage,
    dateLabel: formatDate(getPostDisplayDate(post)),
    dateTime: getPostDisplayDate(post).toISOString(),
    readingTime: post.readingTime,
  });

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <Hero
          className="homepage-hero"
          eyebrow="Journal"
          title="Baby Gear Journal"
          subtitle="Editorial guidance on baby gear, registry strategy, nursery setup, and the product decisions parents tend to second-guess most."
          image="/assets/hero/hero-04.jpg"
          imageAlt=""
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <BlogIndexView posts={posts.map(toViewPost)} />

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
