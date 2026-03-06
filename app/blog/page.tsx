import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import BlogIndexView from '@/components/blog/BlogIndexView';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import { Body } from '@/components/ui/MarketingHeading';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { BLOG_CATEGORIES, type BlogCategory } from '@/lib/blogCategories';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog — Taylor-Made Baby Co.',
  description:
    'Notes on thoughtful registry planning, nursery design, and calm preparation from Taylor-Made Baby Co.',
  keywords: [
    ...BLOG_CATEGORIES,
    'baby registry planning',
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
  featured: boolean;
  excerpt: string | null;
  content: string;
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
      featured: true,
      excerpt: true,
      content: true,
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

  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const curatedPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : [];
  const toViewPost = (post: BlogPost): BlogIndexPost => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: toExcerpt(post.excerpt, post.content, 170),
    coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage,
    dateLabel: formatDate(getPostDisplayDate(post)),
    dateTime: getPostDisplayDate(post).toISOString(),
  });

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main bg-white">
        <Hero
          image="/assets/hero/hero-04.jpg"
          imageAlt=""
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              The Journal
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Editorial notes on registry planning, nursery decisions, and preparing with clarity.
            </Body>
          </div>
        </Hero>

        <BlogIndexView
          featuredPost={featuredPost ? toViewPost(featuredPost) : null}
          posts={curatedPosts.map(toViewPost)}
        />

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
