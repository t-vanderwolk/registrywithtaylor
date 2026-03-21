'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type MotionCtaContentProps = {
  children: ReactNode;
  className?: string;
  align?: 'center' | 'start';
  underline?: boolean;
  showArrow?: boolean;
  arrowClassName?: string;
};

export default function MotionCtaContent({
  children,
  className = '',
  align = 'center',
  underline = false,
  showArrow = false,
  arrowClassName = '',
}: MotionCtaContentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      whileHover={prefersReducedMotion ? undefined : { x: 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={[
        'inline-flex h-full w-full items-center gap-2',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={underline ? 'link-underline' : ''}>{children}</span>
      {showArrow ? (
        <span aria-hidden="true" className={arrowClassName}>
          →
        </span>
      ) : null}
    </motion.span>
  );
}
