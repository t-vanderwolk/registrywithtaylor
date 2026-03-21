'use client';

import type { ReactNode } from 'react';
import FadeInSection from '@/components/ui/FadeInSection';

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
  return (
    <FadeInSection className={className} delayMs={delayMs} once={once} threshold={threshold}>
      {children}
    </FadeInSection>
  );
}
