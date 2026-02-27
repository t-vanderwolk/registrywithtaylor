import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog — Taylor-Made Baby Co.',
  description:
    'Notes on thoughtful registry planning, nursery design, and calm preparation from Taylor-Made Baby Co.',
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  createdAt: Date;
};

type MaybeTagged = {
  tags?: string[] | null;
};

const FEATURED_POST_TITLE = 'The Art of the Registry';

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

const getPrimaryTag = (post: MaybeTagged): string | null => {
  if (!Array.isArray(post.tags) || post.tags.length === 0) {
    return null;
  }
  return post.tags[0] || null;
};

export default async function BlogPage() {
  const posts = (await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      createdAt: true,
    },
  })) as BlogPost[];

  const featuredPost = posts.find((post) => post.title === FEATURED_POST_TITLE) ?? posts[0];
  const curatedPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : [];

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <Hero
          showRibbon
          ribbonClassName="translate-y-1 md:translate-y-2"
          className="hero-home-radial hero-bottom-fade pb-20 md:pb-24 z-20"
          contentClassName="max-w-2xl"
          contentStyle={{
            borderRadius: '32px',
            padding: '3.5rem 3rem',
          }}
          image="/assets/hero/hero-04.jpg"
          imageAlt="Soft editorial baby essentials for journal guidance"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              The Journal
            </h1>
            <p className="hero-load-reveal hero-load-reveal--1 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              Thoughtful guidance for modern parents preparing with intention.
            </p>
          </div>
        </Hero>

        {featuredPost && (
          <MarketingSection tone="white" spacing="default" container="default">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto px-6 py-16">
                <article className="group rounded-2xl border border-neutral-100 p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  {featuredPost.coverImage && (
                    <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {getPrimaryTag(featuredPost as MaybeTagged) && (
                    <p className="inline-flex rounded-full border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-600">
                      {getPrimaryTag(featuredPost as MaybeTagged)}
                    </p>
                  )}
                  <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                    Featured Article
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-neutral-900 leading-tight">
                    {featuredPost.title}
                  </h2>
                  {toExcerpt(featuredPost.excerpt, featuredPost.content, 180) && (
                    <p className="text-lg text-neutral-700 leading-relaxed">
                      {toExcerpt(featuredPost.excerpt, featuredPost.content, 180)}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500">
                    By Taylor Vanderwolk · {formatDate(featuredPost.createdAt)}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-sm uppercase tracking-[0.14em] text-neutral-800 hover:opacity-75 transition"
                  >
                    Read Article -&gt;
                  </Link>
                </article>
              </div>
            </RevealOnScroll>
          </MarketingSection>
        )}

        <MarketingSection tone="white" spacing="spacious" container="default" className="!py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {curatedPosts.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 90}>
                  <article className="group rounded-2xl border border-neutral-100 p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    {post.coverImage && (
                      <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <p className="text-sm text-neutral-400 mb-4">
                      {formatDate(post.createdAt)}
                    </p>

                    <h3 className="font-serif text-2xl text-neutral-900 mb-3 leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:opacity-80 transition">
                        {post.title}
                      </Link>
                    </h3>

                    {toExcerpt(post.excerpt, post.content, 170) && (
                      <p className="text-neutral-600 leading-relaxed mb-5">
                        {toExcerpt(post.excerpt, post.content, 170)}
                      </p>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-xs uppercase tracking-[0.14em] text-neutral-800 hover:opacity-75 transition"
                    >
                      Read -&gt;
                    </Link>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
            {posts.length === 0 && (
              <p className="py-10 text-center text-neutral-600">
                No articles published yet.
              </p>
            )}
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
