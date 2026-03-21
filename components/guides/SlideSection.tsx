import type { ReactNode } from 'react';

const backgroundClasses = {
  ivory: 'bg-[linear-gradient(180deg,#FBF7F1_0%,#FFFDFC_100%)]',
  blush: 'bg-[linear-gradient(180deg,#FBF2F5_0%,#FFF9FB_100%)]',
  white: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFCFB_100%)]',
} as const;

export default function SlideSection({
  id,
  background = 'ivory',
  className = '',
  innerClassName = '',
  children,
}: {
  id?: string;
  background?: keyof typeof backgroundClasses;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-slide-section
      className={[
        backgroundClasses[background],
        'snap-start min-h-[80vh] scroll-mt-24 flex w-full flex-col justify-center transition-colors duration-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['mx-auto w-full max-w-[1520px] px-5 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 xl:px-12', innerClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </section>
  );
}
