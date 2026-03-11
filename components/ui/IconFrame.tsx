import type { ReactNode } from 'react';

type IconFrameSize = 'micro' | 'inline' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'jumbo';

type IconFrameProps = {
  children: ReactNode;
  size?: IconFrameSize;
  className?: string;
  innerClassName?: string;
  interactive?: boolean;
  syncWithGroup?: boolean;
};

const sizeClassMap: Record<IconFrameSize, string> = {
  micro: 'h-9 w-9 rounded-[1rem] p-2',
  inline: 'h-11 w-11 rounded-[1rem] p-2.5',
  sm: 'h-12 w-12 rounded-[1.05rem] p-3',
  md: 'h-14 w-14 rounded-[1.15rem] p-3.5',
  lg: 'h-16 w-16 rounded-[1.25rem] p-4',
  xl: 'h-[5.25rem] w-[5.25rem] rounded-[1.4rem] p-[1.05rem]',
  hero: 'h-[6.25rem] w-[6.25rem] rounded-[1.55rem] p-[1.15rem]',
  jumbo: 'h-[8rem] w-[8rem] rounded-[1.8rem] p-[1.3rem]',
};

export default function IconFrame({
  children,
  size = 'md',
  className = '',
  innerClassName = '',
  interactive = true,
  syncWithGroup = false,
}: IconFrameProps) {
  return (
    <div
      className={[
        'group relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-rose-100 bg-gradient-to-b from-white to-rose-50 shadow-sm transition duration-300 ease-out',
        sizeClassMap[size],
        interactive ? 'hover:-translate-y-0.5 hover:shadow-md' : '',
        syncWithGroup ? 'group-hover:-translate-y-0.5 group-hover:shadow-md' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18%] rounded-full bg-rose-200/45 blur-xl opacity-60 transition duration-300 ease-out group-hover:opacity-90"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[inherit] bg-gradient-to-b from-white/80 via-white/35 to-transparent"
      />
      <div
        className={[
          'relative z-[1] flex h-full w-full items-center justify-center transition duration-300 ease-out',
          interactive || syncWithGroup ? 'group-hover:scale-105' : '',
          innerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
