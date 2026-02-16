import type { ReactNode } from 'react';

type Tone = 'ivory' | 'ivoryWarm' | 'blush' | 'neutral';

type SectionWrapperProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export default function SectionWrapper({ children, tone = 'ivory', className = '' }: SectionWrapperProps) {
  let toneClass = 'section-base ';
  if (tone === 'blush') toneClass += 'bg-[var(--color-soft-blush)]';
  else if (tone === 'neutral') toneClass += 'bg-[var(--color-warm-neutral)]';
  else if (tone === 'ivoryWarm') toneClass += 'bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] border-t border-[#efe3d6]';
  else toneClass += 'bg-[var(--color-ivory)]';

  return <section className={`${toneClass} ${className}`.trim()}>{children}</section>;
}
