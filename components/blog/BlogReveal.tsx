'use client';

import { useEffect } from 'react';

/**
 * Progressive scroll-reveal for article "furniture" — headings, images,
 * pull-quotes, lists, and content blocks fade + rise as they enter the viewport.
 *
 * Renders nothing. Self-scopes to the post body via `selector`, and is a pure
 * enhancement: content is fully visible without JS, elements already on screen
 * are never hidden, and the whole effect is skipped under prefers-reduced-motion.
 */
export default function BlogReveal({ selector = '.tmbc-blog-post-content' }: { selector?: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const root = document.querySelector(selector);
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll(
        ':scope > h2, :scope > h3, :scope > figure, :scope > ul, :scope > ol, :scope > blockquote, :scope > div:not(.blog-product-card)',
      ),
    ) as HTMLElement[];
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const viewportHeight = window.innerHeight || 800;
    for (const el of targets) {
      // Only hide + observe elements that start below the fold, so above-the-fold
      // content never flashes out and back in.
      if (el.getBoundingClientRect().top > viewportHeight * 0.85) {
        el.classList.add('tmbc-reveal');
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [selector]);

  return null;
}
