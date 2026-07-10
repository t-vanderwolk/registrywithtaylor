'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Taylor's "xoxo -T" sign-off. When it scrolls into view it reveals itself with
 * a left-to-right clip sweep — "xoxo" writes first, then "-T" — so it reads like
 * Taylor is signing the post by hand. Falls back to fully drawn when there's no
 * IntersectionObserver, and respects prefers-reduced-motion (handled in CSS).
 */
export default function GuideSignoffMark({ className }: { className?: string }) {
  const handwrittenPrintFontFamily = '"Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';

  const ref = useRef<SVGSVGElement | null>(null);
  const [phase, setPhase] = useState<'idle' | 'armed' | 'writing'>('idle');

  // Unique clip ids so multiple sign-offs on a page never collide. useId keeps
  // the server and client markup in sync; strip colons so it's a safe id.
  const uid = useId().replace(/:/g, '');
  const clipX = `sig-xoxo-${uid}`;
  const clipT = `sig-tee-${uid}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setPhase('writing');
      return;
    }
    // Arm (hide) immediately — the sign-off sits at the very bottom of the post,
    // so it's off-screen at load and there's nothing to flash.
    setPhase('armed');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase('writing');
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.45, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stateClass = phase === 'armed' ? 'is-armed' : phase === 'writing' ? 'is-writing' : '';

  return (
    <svg
      ref={ref}
      viewBox="0 0 760 470"
      aria-hidden="true"
      className={[className, stateClass].filter(Boolean).join(' ')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipX} clipPathUnits="userSpaceOnUse">
          <rect className="guide-signoff__reveal guide-signoff__reveal--xoxo" x="0" y="0" width="760" height="300" />
        </clipPath>
        <clipPath id={clipT} clipPathUnits="userSpaceOnUse">
          <rect className="guide-signoff__reveal guide-signoff__reveal--tee" x="180" y="250" width="440" height="220" />
        </clipPath>
      </defs>
      <g fill="currentColor">
        <g clipPath={`url(#${clipX})`}>
          <text
            x="80"
            y="212"
            transform="rotate(-5 380 170)"
            style={{ fontFamily: handwrittenPrintFontFamily, fontWeight: 600, fontSize: '214px', fontStyle: 'normal', letterSpacing: '8px' }}
          >
            xoxo
          </text>
        </g>
        <g clipPath={`url(#${clipT})`}>
          <text
            x="230"
            y="408"
            style={{ fontFamily: handwrittenPrintFontFamily, fontWeight: 600, fontSize: '178px', fontStyle: 'normal', letterSpacing: '2px' }}
          >
            -T
          </text>
        </g>
      </g>
    </svg>
  );
}
