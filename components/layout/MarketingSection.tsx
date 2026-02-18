import type { ReactNode } from 'react';

type MarketingSectionTone = 'white' | 'ivory' | 'ivoryWarm' | 'neutral' | 'blush';
type MarketingSectionContainer = 'default' | 'narrow' | 'wide';
type MarketingSectionSpacing = 'default' | 'tight' | 'spacious';

type MarketingSectionProps = {
  tone?: MarketingSectionTone;
  container?: MarketingSectionContainer;
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
  narrow: 'mx-auto w-full max-w-3xl px-[var(--space-md)]',
  wide: 'mx-auto w-full max-w-[1280px] px-[var(--space-md)]',
};

const spacingClassMap: Record<MarketingSectionSpacing, string> = {
  // Matches current homepage default rhythm via .section-base.
  default: 'section-base',
  tight: '!pt-5 !pb-[clamp(4.5rem,7vw,6.5rem)]',
  spacious: 'section-spacing',
};

export default function MarketingSection({
  tone = 'ivory',
  container = 'default',
  spacing = 'default',
  className = '',
  id,
  children,
}: MarketingSectionProps) {
  const sectionClassName = [spacingClassMap[spacing], toneClassMap[tone], className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={sectionClassName}>
      <div className={containerClassMap[container]}>{children}</div>
    </section>
  );
}
