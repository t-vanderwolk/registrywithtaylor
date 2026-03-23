import type { ReactNode } from 'react';
import GuideSlide, { type GuideSlideBackground } from '@/components/guides/GuideSlide';

export default function SlideSection({
  id,
  background = 'ivory',
  className = '',
  innerClassName = '',
  children,
}: {
  id?: string;
  background?: GuideSlideBackground;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <GuideSlide id={id} background={background} className={className} innerClassName={innerClassName}>
      {children}
    </GuideSlide>
  );
}
