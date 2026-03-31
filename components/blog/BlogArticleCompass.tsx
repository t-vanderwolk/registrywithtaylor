'use client';

import Link from 'next/link';
import type { BlogCategory } from '@/lib/blogCategories';
import type { BlogHeadingOutlineItem } from '@/lib/blog/seo';

type RelatedReadingItem = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string | null;
};

type BlogArticleCompassProps = {
  headings: BlogHeadingOutlineItem[];
  relatedPosts: RelatedReadingItem[];
};

export default function BlogArticleCompass({
  headings,
  relatedPosts,
}: BlogArticleCompassProps) {
  if (headings.length === 0 && relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      {headings.length > 0 ? (
        <div className="rounded-[1.6rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,252,250,0.98)_0%,rgba(255,247,245,0.98)_100%)] px-6 py-6 shadow-[0_18px_36px_rgba(47,36,48,0.05)]">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
            Inside This Guide
          </p>
          <h2 className="mt-3 font-serif text-[1.8rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">
            A quick way to navigate the article
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Start with the section that sounds most like the question already taking up space in your head.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className="rounded-[1.1rem] border border-black/6 bg-white/88 px-4 py-4 text-left transition duration-200 hover:-translate-y-[1px] hover:border-black/10 hover:shadow-[0_10px_24px_rgba(47,36,48,0.05)]"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-neutral-400">
                  {heading.level === 2 ? 'Section' : 'Subsection'}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-neutral-900">{heading.text}</p>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {relatedPosts.length > 0 ? (
        <div className="rounded-[1.6rem] border border-black/8 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(47,36,48,0.05)]">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
            Related Reading
          </p>
          <h2 className="mt-3 font-serif text-[1.8rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">
            Keep the topic connected
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            These are the next reads that make the guidance feel like a system instead of one isolated answer.
          </p>

          <div className="mt-6 space-y-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-[1.15rem] border border-black/6 bg-[linear-gradient(180deg,rgba(252,247,244,0.92)_0%,rgba(255,252,250,0.94)_100%)] px-4 py-4 transition duration-200 hover:-translate-y-[1px] hover:border-black/10 hover:shadow-[0_10px_24px_rgba(47,36,48,0.05)]"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-neutral-400">{post.category}</p>
                <p className="mt-2 text-base font-medium leading-6 text-neutral-900">{post.title}</p>
                {post.excerpt ? (
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{post.excerpt}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
