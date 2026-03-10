import type { ReactNode } from 'react';

type MarketingSectionTone = 'white' | 'ivory' | 'ivoryWarm' | 'neutral' | 'blush';
type MarketingSectionContainer = 'default' | 'narrow' | 'wide';
type MarketingSectionSpacing = 'default' | 'tight' | 'spacious';

type MarketingSectionProps = {
  tone?: MarketingSectionTone;
  container?: MarketingSectionContainer;
  variant?: MarketingSectionContainer;
  spacing?: MarketingSectionSpacing;
  className?: string;
  id?: string;
  children: ReactNode;
};

const toneClassMap: Record<MarketingSectionTone, string> = {
  white: 'section-white',
  ivory: 'section-ivory',
  ivoryWarm: 'bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] border-t border-[#efe3d6]',
  neutral: 'bg-warm-neutral',
  blush: 'bg-soft-blush',
};

const containerClassMap: Record<MarketingSectionContainer, string> = {
  default: 'container',
  narrow: 'mx-auto w-full max-w-3xl px-6 md:px-10',
  wide: 'mx-auto w-full max-w-[1280px] px-6 md:px-10',
};

const spacingClassMap: Record<MarketingSectionSpacing, string> = {
  default: 'section-base',
  tight: 'section-tight',
  spacious: 'section-spacious',
};

export default function MarketingSection({
  tone = 'ivory',
  container = 'default',
  variant,
  spacing = 'default',
  className = '',
  id,
  children,
}: MarketingSectionProps) {
  const resolvedContainer = variant ?? container;
  const sectionClassName = [spacingClassMap[spacing], toneClassMap[tone], className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={sectionClassName}>
      <div className={containerClassMap[resolvedContainer]}>{children}</div>
    </section>
  );
}
