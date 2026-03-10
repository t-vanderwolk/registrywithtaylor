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
        'group rounded-2xl border border-[rgba(232,154,174,0.18)] bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[rgba(232,154,174,0.34)] hover:shadow-lg sm:p-8 md:p-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
