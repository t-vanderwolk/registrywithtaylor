import type { ReactNode } from 'react';

type LuxuryIconFrameSize = 'micro' | 'inline' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'jumbo';

type LuxuryIconFrameProps = {
  children: ReactNode;
  size?: LuxuryIconFrameSize;
  className?: string;
  innerClassName?: string;
  interactive?: boolean;
  syncWithGroup?: boolean;
  glow?: boolean;
};

const sizeClassMap: Record<LuxuryIconFrameSize, string> = {
  micro: 'h-9 w-9 rounded-[1rem] p-2',
  inline: 'h-10 w-10 rounded-[1rem] p-2.5',
  sm: 'h-12 w-12 rounded-[1.125rem] p-3',
  md: 'h-14 w-14 rounded-[1.25rem] p-3.5',
  lg: 'h-16 w-16 rounded-[1.4rem] p-4',
  xl: 'h-[5.5rem] w-[5.5rem] rounded-[1.6rem] p-[1.05rem]',
  hero: 'h-[6.5rem] w-[6.5rem] rounded-[1.8rem] p-[1.2rem]',
  jumbo: 'h-[8.6rem] w-[8.6rem] rounded-[2rem] p-[1.45rem]',
};

export default function LuxuryIconFrame({
  children,
  size = 'md',
  className = '',
  innerClassName = '',
  interactive = true,
  syncWithGroup = false,
  glow = true,
}: LuxuryIconFrameProps) {
  return (
    <div
      className={[
        'luxury-icon-frame group',
        sizeClassMap[size],
        interactive ? 'luxury-icon-frame--interactive' : '',
        syncWithGroup ? 'luxury-icon-frame--group' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {glow ? <span className="luxury-icon-glow" aria-hidden="true" /> : null}
      <span className="luxury-icon-highlight" aria-hidden="true" />
      <span className="luxury-icon-shadow" aria-hidden="true" />
      <div className="luxury-icon-content">
        <div className={['luxury-icon-inner', innerClassName].filter(Boolean).join(' ')}>{children}</div>
      </div>
    </div>
  );
}
