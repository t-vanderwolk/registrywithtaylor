'use client';

import { startTransition, useState } from 'react';
import JournalCard from '@/components/blog/JournalCard';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { Body } from '@/components/ui/MarketingHeading';
import { BLOG_CATEGORIES, type BlogCategory } from '@/lib/blogCategories';

type BlogIndexPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  dateLabel: string;
  dateTime: string;
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
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  aria-pressed={activeCategory === null}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    activeCategory === null
                      ? 'text-charcoal underline decoration-black/20 underline-offset-8'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  All Articles
                </button>
                {BLOG_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`text-sm tracking-wide transition-colors duration-200 ${
                      activeCategory === category
                        ? 'text-charcoal underline decoration-black/20 underline-offset-8'
                        : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2">
              {filteredPosts.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 90}>
                  <JournalCard
                    title={post.title}
                    slug={post.slug}
                    coverImage={post.coverImage}
                    excerpt={post.excerpt}
                    dateLabel={post.dateLabel}
                    dateTime={post.dateTime}
                    category={post.category}
                  />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <MarketingSurface className="text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-charcoal/55">
                {activeCategory ?? 'The Journal'}
              </p>
              <Body className="mt-4 text-charcoal/72">
                No articles are published in this focus yet.
              </Body>
            </MarketingSurface>
          )}
        </div>
      </section>
    </>
  );
}
