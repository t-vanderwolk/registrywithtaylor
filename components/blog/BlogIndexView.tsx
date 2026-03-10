'use client';

import { startTransition, useState } from 'react';
import JournalCard from '@/components/blog/JournalCard';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { Body } from '@/components/ui/MarketingHeading';
import { BLOG_CATEGORIES, BLOG_GUIDES_TITLE, getBlogCategoryLabel, type BlogCategory } from '@/lib/blogCategories';

type BlogIndexPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  dateLabel: string;
  dateTime: string;
  readingTime: number | null;
  category: BlogCategory;
};

type BlogIndexViewProps = {
  posts: BlogIndexPost[];
};

export default function BlogIndexView({
  posts,
}: BlogIndexViewProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);

  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  const setCategory = (category: BlogCategory | null) => {
    startTransition(() => {
      setActiveCategory((currentCategory) => (currentCategory === category ? null : category));
    });
  };

  return (
    <>
      <section className="section-base bg-white">
        <div className="max-w-5xl mx-auto px-6">
          {posts.length > 0 && (
            <div className="mt-8 md:mt-12">
              <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  aria-pressed={activeCategory === null}
                  className={`shrink-0 whitespace-nowrap text-sm tracking-wide transition-colors duration-200 ${
                    activeCategory === null
                      ? 'text-[var(--tmbc-blog-rose)] underline decoration-[var(--tmbc-blog-blush)] underline-offset-8'
                      : 'text-[var(--tmbc-blog-soft-text)] hover:text-[var(--tmbc-blog-charcoal)]'
                  }`}
                >
                  All Guides
                </button>
                {BLOG_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`shrink-0 whitespace-nowrap text-sm tracking-wide transition-colors duration-200 ${
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
        <div className="max-w-5xl mx-auto px-6">
          {filteredPosts.length > 0 ? (
            <RevealOnScroll>
              <div className="blog-section-soft grid gap-8 px-6 py-8 md:grid-cols-2 md:gap-10 md:px-8">
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
            </RevealOnScroll>
          ) : (
            <MarketingSurface className="text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-charcoal/55">
                {activeCategory ? getBlogCategoryLabel(activeCategory) : BLOG_GUIDES_TITLE}
              </p>
              <Body className="mt-4 text-charcoal/72">
                No guides are published in this focus yet.
              </Body>
            </MarketingSurface>
          )}
        </div>
      </section>
    </>
  );
}
