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
        'group relative overflow-hidden rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:rounded-2xl sm:p-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
