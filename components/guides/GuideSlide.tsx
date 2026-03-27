import type { ReactNode } from 'react';
import GuideNextStep from '@/components/guides/GuideNextStep';

const backgroundClasses = {
  ivory: 'bg-[linear-gradient(180deg,#FBF7F1_0%,#FFFDFC_100%)]',
  blush: 'bg-[linear-gradient(180deg,#FBF2F5_0%,#FFF9FB_100%)]',
  white: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFCFB_100%)]',
} as const;

export type GuideSlideBackground = keyof typeof backgroundClasses;

export default function GuideSlide({
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
    <section
      id={id}
      data-slide-section
      data-guide-slide
      className={[
        backgroundClasses[background],
        'scroll-mt-[calc(var(--guide-sticky-nav-height,76px)+1rem)] transition-colors duration-500 lg:flex-none lg:self-start lg:max-h-[85vh] lg:max-w-[91%] lg:min-h-[85vh] lg:min-w-[91%] lg:overflow-hidden lg:snap-start xl:max-w-[89%] xl:min-w-[89%]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'mx-auto flex w-full max-w-[1520px] flex-col px-4 py-4 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:max-h-[85vh] lg:overflow-y-auto lg:pr-4 xl:px-12 xl:py-10',
          innerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}

        <GuideNextStep mode="carousel" layout="footer" className="self-start sm:self-auto" />
      </div>
    </section>
  );
}
