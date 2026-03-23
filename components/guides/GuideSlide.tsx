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
        'scroll-mt-[calc(var(--guide-sticky-nav-height,76px)+1rem)] transition-colors duration-500 lg:h-auto lg:flex-none lg:self-start lg:max-w-[91%] lg:min-w-[91%] lg:snap-start xl:max-w-[89%] xl:min-w-[89%]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'mx-auto flex w-full max-w-[1520px] flex-col px-4 py-6 sm:px-6 sm:py-9 md:px-10 md:py-12 xl:px-12',
          innerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}

        <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(161,91,114,0.12)] pt-3.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <p className="text-sm leading-6 text-[#6A5660]">Continue -&gt;</p>
          <GuideNextStep mode="carousel" className="self-start sm:self-auto" />
        </div>
      </div>
    </section>
  );
}
