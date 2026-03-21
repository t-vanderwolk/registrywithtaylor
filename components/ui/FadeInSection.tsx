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
  const disableGuideReveal = pathname?.startsWith('/guides');
  const isInView = useInView(sectionRef, {
    amount: threshold,
    margin: '-100px 0px',
    once,
  });
  const isVisible = prefersReducedMotion || disableGuideReveal || isInView;
  const hiddenY = prefersReducedMotion || disableGuideReveal ? 0 : yOffset;

  return (
    <motion.div
      ref={sectionRef}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: prefersReducedMotion || disableGuideReveal ? 1 : 0, y: hiddenY }}
      animate={
        isVisible
          ? {
              opacity: 1,
              y: 0,
              transition: {
                delay: prefersReducedMotion || disableGuideReveal ? 0 : delayMs / 1000,
                duration: prefersReducedMotion || disableGuideReveal ? 0.01 : duration,
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
