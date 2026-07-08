'use client';

import { useEffect } from 'react';

/**
 * Hand-written easter-egg notes tucked into the right margin — Taylor's little
 * asides. Pure enhancement: only on wide screens (where the margin exists),
 * appended after render, stable per post (seeded by slug), and removed on cleanup.
 */
const NOTES = [
  'read this part twice',
  'this is the one I’d pick',
  'trust me here ♡',
  'future you says thanks',
  'little detail, big difference',
  'psst — my personal fave',
  'take your time with this one',
  'the fold matters, promise',
  'okay this part is important',
  'worth it, imo',
  'been there, felt that',
  'your registry will thank you',
];

function hashSeed(input: string): number {
  let h = 7;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h || 1;
}

/** Deterministic shuffle-pick so each post gets a stable, varied set. */
function pickNotes(seed: number, count: number): string[] {
  const out: string[] = [];
  const used = new Set<number>();
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  while (out.length < count && used.size < NOTES.length) {
    s = (s * 16807) % 2147483647;
    const idx = s % NOTES.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(NOTES[idx]);
    }
  }
  return out;
}

export default function BlogMarginNotes({
  selector = '.tmbc-blog-post-content',
  seed = 'tmbc',
}: {
  selector?: string;
  seed?: string;
}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(selector);
    if (!root) return;

    const seedNum = hashSeed(seed);
    let notes: HTMLElement[] = [];
    let observer: IntersectionObserver | null = null;

    const clear = () => {
      observer?.disconnect();
      observer = null;
      notes.forEach((n) => n.remove());
      notes = [];
    };

    const build = () => {
      clear();
      if (window.innerWidth < 1400) return;

      const headings = Array.from(root.querySelectorAll<HTMLElement>(':scope > h2'));
      if (headings.length === 0) return;

      // Spread up to 3 notes across the article, skipping the very first heading.
      const targets: HTMLElement[] = [];
      const step = Math.max(1, Math.floor(headings.length / 3));
      for (let i = 1; i < headings.length && targets.length < 3; i += step) targets.push(headings[i]);
      if (targets.length === 0) targets.push(headings[0]);

      const texts = pickNotes(seedNum, targets.length);
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      observer =
        !reduce && 'IntersectionObserver' in window
          ? new IntersectionObserver(
              (entries) => {
                for (const e of entries) {
                  if (e.isIntersecting) {
                    e.target.classList.add('is-revealed');
                    observer?.unobserve(e.target);
                  }
                }
              },
              { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
            )
          : null;

      targets.forEach((target, i) => {
        const note = document.createElement('span');
        note.className = 'tmbc-margin-note';
        note.setAttribute('aria-hidden', 'true');
        note.textContent = texts[i] ?? NOTES[i % NOTES.length];
        note.style.top = `${target.offsetTop + 4}px`;
        note.style.setProperty('--note-rot', i % 2 === 0 ? '-3deg' : '2.5deg');
        root.appendChild(note);
        notes.push(note);
        if (observer) observer.observe(note);
        else note.classList.add('is-revealed');
      });
    };

    build();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      clear();
    };
  }, [selector, seed]);

  return null;
}
