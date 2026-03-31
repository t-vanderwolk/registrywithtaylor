'use client';

import Link from 'next/link';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { BlogCategory } from '@/lib/blogCategories';
import type { BlogHeadingOutlineItem } from '@/lib/blog/seo';
import {
  getActiveGuideSectionFromScroll,
  getGuideViewportOffset,
  scrollToGuideSection,
} from '@/lib/guides/guideNav';

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

  const navigationItems = headings.map((heading) => ({
    id: heading.id,
    label: heading.text,
    shortLabel: heading.level === 3 ? 'Sub' : 'Sec',
  }));
  const [activeId, setActiveId] = useState(navigationItems[0]?.id ?? '');

  useEffect(() => {
    if (navigationItems.length === 0) {
      return undefined;
    }

    let animationFrame = 0;

    const updateActiveSection = () => {
      const nextActiveId = getActiveGuideSectionFromScroll({
        items: navigationItems,
        viewportOffset: getGuideViewportOffset(),
      });

      if (nextActiveId) {
        setActiveId(nextActiveId);
      }
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [headings]);

  useEffect(() => {
    if (navigationItems.length === 0 || typeof window === 'undefined') {
      return;
    }

    const hash = window.location.hash.replace(/^#/, '');
    if (!hash || !navigationItems.some((item) => item.id === hash)) {
      return;
    }

    setActiveId(hash);
  }, [headings]);

  const activeHeading =
    headings.find((heading) => heading.id === activeId) ??
    headings[0] ??
    null;

  const handleSectionJump = (id: string) => {
    scrollToGuideSection(id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
    }
    setActiveId(id);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    if (!nextId) {
      return;
    }

    handleSectionJump(nextId);
  };

  return (
    <>
      {headings.length > 0 ? (
        <div className="mb-6 lg:hidden">
          <div className="rounded-[1.6rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,252,250,0.98)_0%,rgba(255,247,245,0.98)_100%)] px-5 py-5 shadow-[0_18px_36px_rgba(47,36,48,0.05)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
              Inside This Guide
            </p>
            <div className="mt-4 rounded-[1.15rem] border border-black/6 bg-white/84 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-neutral-400">Current section</p>
              <p className="mt-2 text-sm font-medium leading-6 text-neutral-900">
                {activeHeading?.text ?? headings[0]?.text}
              </p>
            </div>
            <label htmlFor="blog-toc-select" className="mt-4 block text-[0.62rem] uppercase tracking-[0.2em] text-neutral-400">
              Jump to a section
            </label>
            <select
              id="blog-toc-select"
              value={activeId}
              onChange={handleSelectChange}
              className="mt-2 min-h-[48px] w-full rounded-[1rem] border border-black/8 bg-white/92 px-4 py-3 text-sm text-neutral-900 outline-none"
            >
              {headings.map((heading) => (
                <option key={heading.id} value={heading.id}>
                  {heading.level === 3 ? `- ${heading.text}` : heading.text}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <aside className="hidden lg:block lg:self-start">
        <div className="lg:sticky lg:top-28 space-y-4">
          {headings.length > 0 ? (
            <section className="rounded-[1.6rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,252,250,0.98)_0%,rgba(255,247,245,0.98)_100%)] px-5 py-5 shadow-[0_18px_36px_rgba(47,36,48,0.05)]">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                Inside This Guide
              </p>
              <div className="mt-4 rounded-[1.1rem] border border-black/6 bg-white/88 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-neutral-400">Current location</p>
                <p className="mt-2 text-sm font-medium leading-6 text-neutral-900">
                  {activeHeading?.text ?? headings[0]?.text}
                </p>
              </div>

              <nav aria-label="Inside this guide" className="mt-4 space-y-2">
                {headings.map((heading, index) => {
                  const isActive = heading.id === activeId;

                  return (
                    <button
                      key={heading.id}
                      type="button"
                      onClick={() => handleSectionJump(heading.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`flex w-full items-start gap-3 rounded-[1rem] border px-3 py-3 text-left transition duration-200 ${
                        isActive
                          ? 'border-[rgba(199,125,151,0.32)] bg-[linear-gradient(135deg,rgba(216,142,162,0.16)_0%,rgba(199,125,151,0.12)_100%)] shadow-[0_10px_24px_rgba(199,125,151,0.12)]'
                          : 'border-black/6 bg-white/86 hover:-translate-y-[1px] hover:border-black/10 hover:shadow-[0_10px_24px_rgba(47,36,48,0.05)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${
                          isActive
                            ? 'border-[rgba(199,125,151,0.32)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white'
                            : 'border-black/8 bg-white text-neutral-500'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`min-w-0 ${heading.level === 3 ? 'pt-0.5' : ''}`}>
                        <span className="block text-[0.58rem] uppercase tracking-[0.18em] text-neutral-400">
                          {heading.level === 3 ? 'Subsection' : 'Section'}
                        </span>
                        <span className={`mt-1 block text-sm leading-6 ${isActive ? 'text-neutral-900' : 'text-neutral-700'}`}>
                          {heading.text}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </section>
          ) : null}

          {relatedPosts.length > 0 ? (
            <section className="rounded-[1.45rem] border border-black/8 bg-white px-5 py-5 shadow-[0_18px_36px_rgba(47,36,48,0.05)]">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                Related Reading
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Keep the topic connected without opening twelve tabs and losing the plot.
              </p>

              <div className="mt-4 space-y-3">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block rounded-[1rem] border border-black/6 bg-[linear-gradient(180deg,rgba(252,247,244,0.92)_0%,rgba(255,252,250,0.94)_100%)] px-4 py-4 transition duration-200 hover:-translate-y-[1px] hover:border-black/10 hover:shadow-[0_10px_24px_rgba(47,36,48,0.05)]"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-400">{post.category}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-neutral-900">{post.title}</p>
                    {post.excerpt ? (
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{post.excerpt}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}
