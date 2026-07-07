'use client';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useState } from 'react';
import JournalCard from '@/components/blog/JournalCard';
import CategoryTag from '@/components/blog/CategoryTag';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { Body } from '@/components/ui/MarketingHeading';
import { getBlogCategoryLabel, type BlogCategory } from '@/lib/blogCategories';
import { isRemoteImageUrl, resolveBlogCoverImage } from '@/lib/blog/images';

type BlogIndexPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  dateLabel: string;
  dateTime: string;
  readingTime: number | null;
  featured: boolean;
  category: BlogCategory;
};

type BlogIndexViewProps = {
  posts: BlogIndexPost[];
};

function FeaturedJournalCard({ post }: { post: BlogIndexPost }) {
  const coverImageSrc = resolveBlogCoverImage(post.coverImage, post.category);
  const shouldSkipOptimization = isRemoteImageUrl(coverImageSrc);
  const categoryLabel = getBlogCategoryLabel(post.category);

  return (
    <article className="mb-8 overflow-hidden rounded-[1.5rem] border border-[rgba(47,36,48,0.08)] bg-white shadow-[0_16px_48px_rgba(47,36,48,0.06)] md:mb-12">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,246,242,0.98)_100%)] p-4">
          <Image
            src={coverImageSrc}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            priority
            unoptimized={shouldSkipOptimization}
          />
        </div>
      </Link>

      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--tmbc-blog-soft-text)]">
          <CategoryTag label={categoryLabel} />
          {post.readingTime ? (
            <>
              <span aria-hidden className="text-black/25">·</span>
              <span>{post.readingTime} min read</span>
            </>
          ) : null}
          <span aria-hidden className="text-black/25">·</span>
          <span>{post.dateTime ? <time dateTime={post.dateTime}>{post.dateLabel}</time> : post.dateLabel}</span>
        </div>

        <h2 className="mt-3 font-serif text-[1.55rem] leading-[1.06] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)] sm:text-[1.85rem]">
          <Link href={`/blog/${post.slug}`} className="transition-opacity duration-200 hover:opacity-80">
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--tmbc-blog-soft-text)]">{post.excerpt}</p>
        ) : null}

        <div className="mt-5">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex min-h-[44px] items-center text-sm uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)] transition-colors duration-200 hover:text-[var(--tmbc-blog-charcoal)]"
          >
            <span className="link-underline">Read Article</span>
            <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogIndexView({ posts }: BlogIndexViewProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);

  const featuredPost = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const remainingPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  const filteredPosts = activeCategory
    ? remainingPosts.filter((post) => post.category === activeCategory)
    : remainingPosts;
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  const setCategory = (category: BlogCategory | null) => {
    startTransition(() => {
      setActiveCategory((currentCategory) => (currentCategory === category ? null : category));
    });
  };

  return (
    <>
      <section className="section-base bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          {posts.length > 0 && (
            <div className="mt-8 md:mt-12">
              <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  aria-pressed={activeCategory === null}
                  className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap text-sm tracking-wide transition-colors duration-200 ${
                    activeCategory === null
                      ? 'text-[var(--tmbc-blog-rose)] underline decoration-[var(--tmbc-blog-blush)] underline-offset-8'
                      : 'text-[var(--tmbc-blog-soft-text)] hover:text-[var(--tmbc-blog-charcoal)]'
                  }`}
                >
                  All Journal Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap text-sm tracking-wide transition-colors duration-200 ${
                      activeCategory === category
                        ? 'text-[var(--tmbc-blog-rose)] underline decoration-[var(--tmbc-blog-blush)] underline-offset-8'
                        : 'text-[var(--tmbc-blog-soft-text)] hover:text-[var(--tmbc-blog-charcoal)]'
                    }`}
                  >
                    {getBlogCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 md:pb-28" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          {featuredPost && !activeCategory ? (
            <div className="blog-section-soft mt-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
              <FeaturedJournalCard post={featuredPost} />

              {filteredPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                  {filteredPosts.map((post) => (
                    <JournalCard
                      key={post.id}
                      title={post.title}
                      slug={post.slug}
                      coverImage={post.coverImage}
                      excerpt={post.excerpt}
                      dateLabel={post.dateLabel}
                      dateTime={post.dateTime}
                      readingTime={post.readingTime}
                      category={post.category}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="blog-section-soft grid gap-6 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-2 md:gap-10 md:px-8">
              {filteredPosts.map((post) => (
                <JournalCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  coverImage={post.coverImage}
                  excerpt={post.excerpt}
                  dateLabel={post.dateLabel}
                  dateTime={post.dateTime}
                  readingTime={post.readingTime}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            <MarketingSurface className="text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-charcoal/55">
                {activeCategory ? getBlogCategoryLabel(activeCategory) : 'Baby Gear Journal'}
              </p>
              <Body className="mt-4 text-charcoal/72">
                No journal posts are published in this focus yet.
              </Body>
            </MarketingSurface>
          )}
        </div>
      </section>
    </>
  );
}
