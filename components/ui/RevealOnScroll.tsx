'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  threshold?: number;
};

export default function RevealOnScroll({
  children,
  className = '',
  delayMs = 0,
  once = true,
  threshold = 0.2,
}: RevealOnScrollProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) {
      setHydrated(true);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      setHydrated(true);
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = node.getBoundingClientRect();
    const nodeHeight = rect.height || node.offsetHeight || 0;
    const effectiveThreshold = nodeHeight > viewportHeight ? Math.min(threshold, 0.01) : threshold;
    const initiallyVisible = rect.top < viewportHeight * 0.92 && rect.bottom > 0;
    setIsVisible(initiallyVisible);
    setHydrated(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: effectiveThreshold,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  const revealClassName = [hydrated ? 'motion-reveal' : '', hydrated && isVisible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');

  const revealStyle: CSSProperties & Record<'--reveal-delay', string> = {
    '--reveal-delay': `${delayMs}ms`,
  };

  return (
    <div ref={wrapperRef} className={revealClassName} style={revealStyle}>
      {children}
    </div>
  );
}
