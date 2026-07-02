'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  yOffset?: number;
  id?: string;
  style?: CSSProperties;
};

export default function FadeInSection({
  children,
  className = '',
  delayMs = 0,
  duration = 0.35,
  once = true,
  threshold = 0.2,
  yOffset = 30,
  id,
  style,
}: FadeInSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const disableAnimatedReveal =
    pathname?.startsWith('/learn') ||
    pathname?.startsWith('/academy') ||
    pathname?.startsWith('/blog');
  // `amount` here is a fraction of the ELEMENT that must be visible. On a phone,
  // a tall single-column section can be several viewports high, so any fraction
  // (even 0.2) may never fit on screen — the reveal never fires and the section
  // stays at opacity 0, leaving a big empty gap. `'some'` fires as soon as any
  // part scrolls in, so it's safe regardless of how tall the section reflows to.
  const isInView = useInView(sectionRef, {
    amount: threshold >= 1 ? 'all' : 'some',
    margin: '-100px 0px',
    once,
  });
  const isVisible = prefersReducedMotion || disableAnimatedReveal || isInView;
  const hiddenY = prefersReducedMotion || disableAnimatedReveal ? 0 : yOffset;

  return (
    <motion.div
      ref={sectionRef}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: prefersReducedMotion || disableAnimatedReveal ? 1 : 0, y: hiddenY }}
      animate={
        isVisible
          ? {
              opacity: 1,
              y: 0,
              transition: {
                delay: prefersReducedMotion || disableAnimatedReveal ? 0 : delayMs / 1000,
                duration: prefersReducedMotion || disableAnimatedReveal ? 0.01 : duration,
                ease: 'easeOut',
              },
            }
          : {
              opacity: 0,
              y: hiddenY,
            }
      }
    >
      {children}
    </motion.div>
  );
}
