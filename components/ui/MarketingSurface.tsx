import { ReactNode } from 'react';

interface MarketingSurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function MarketingSurface({
  children,
  className = '',
}: MarketingSurfaceProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 md:p-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
