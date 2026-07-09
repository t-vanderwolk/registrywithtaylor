'use client';

import { useEffect } from 'react';

/**
 * Draw-on-scroll for the (( circle )) + [[ underline ]] body annotations on the
 * marketing pages (the blog uses BlogReveal for the same effect). Renders nothing.
 *
 * Pure enhancement: annotations are fully visible without JS; only ones that start
 * below the fold are "armed" (collapsed) then revealed as they scroll in, so
 * above-the-fold marks never flash. Skipped under prefers-reduced-motion.
 */
export default function AnnotationReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const marks = Array.from(document.querySelectorAll('.tmbc-circle, .tmbc-underline')) as HTMLElement[];
    if (marks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.5 },
    );

    const viewportHeight = window.innerHeight || 800;
    for (const mark of marks) {
      if (mark.getBoundingClientRect().top > viewportHeight * 0.85) {
        mark.classList.add('tmbc-armed');
        observer.observe(mark);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
