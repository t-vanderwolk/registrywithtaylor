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
        'group relative overflow-hidden rounded-[1.75rem] border border-[rgba(232,154,174,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,249,250,0.96)_100%)] p-6 shadow-[0_20px_52px_rgba(43,38,40,0.08)] transition-[transform,border-color,box-shadow,background] duration-300 hover:-translate-y-1 hover:border-[rgba(232,154,174,0.34)] hover:shadow-[0_30px_64px_rgba(184,116,138,0.16)] sm:p-8 md:p-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
