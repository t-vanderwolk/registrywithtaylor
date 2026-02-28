'use client';

import Link from 'next/link';
import { startTransition, useState } from 'react';
import JournalCard from '@/components/blog/JournalCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
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
  featuredPost: BlogIndexPost | null;
  posts: BlogIndexPost[];
  authorName: string;
};

export default function BlogIndexView({
  featuredPost,
  posts,
  authorName,
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
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          {featuredPost && (
            <RevealOnScroll>
              <article className="rounded-2xl border border-black/5 bg-[#FBF8F4] p-10 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-12">
                <div
                  className={
                    featuredPost.coverImage
                      ? 'grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:items-start'
                      : 'space-y-6'
                  }
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-charcoal/55">
                        Featured Article
                      </p>
                      <span className="block text-xs uppercase tracking-[0.2em] text-charcoal/50">
                        {featuredPost.category}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight text-neutral-900">
                        {featuredPost.title}
                      </h2>

                      {featuredPost.excerpt && (
                        <p className="text-lg leading-relaxed text-charcoal/80">
                          {featuredPost.excerpt}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-charcoal/55">
                      {authorName} · <time dateTime={featuredPost.dateTime}>{featuredPost.dateLabel}</time>
                    </p>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-sm uppercase tracking-[0.14em] text-neutral-800 underline decoration-black/10 underline-offset-4 transition-colors duration-200 hover:text-neutral-900 hover:decoration-black/30"
                    >
                      Read Article <span aria-hidden className="ml-1">→</span>
                    </Link>
                  </div>

                  {featuredPost.coverImage && (
                    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                      <img
                        src={featuredPost.coverImage}
                        alt=""
                        aria-hidden="true"
                        className="w-full aspect-[4/5] object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          )}

          {(posts.length > 0 || featuredPost) && (
            <div className="mt-20">
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

      <section className="bg-white pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2">
              {filteredPosts.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 90}>
                  <JournalCard
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    dateLabel={post.dateLabel}
                    dateTime={post.dateTime}
                    category={post.category}
                  />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-[#FBF8F4] px-8 py-12 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.22em] text-charcoal/55">
                {activeCategory ?? 'The Journal'}
              </p>
              <p className="mt-4 leading-relaxed text-charcoal/72">
                {activeCategory && featuredPost?.category === activeCategory
                  ? 'No additional articles are published in this focus yet.'
                  : 'No articles are published in this focus yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
