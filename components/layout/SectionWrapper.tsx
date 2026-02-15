import type { ReactNode } from 'react';

type Tone = 'ivory' | 'blush' | 'neutral';

type SectionWrapperProps = {
  children: ReactNode;
  tone?: Tone;
};

export default function SectionWrapper({ children, tone = 'ivory' }: SectionWrapperProps) {
  let className = 'section-base ';
  if (tone === 'blush') className += 'bg-[var(--color-soft-blush)]';
  else if (tone === 'neutral') className += 'bg-[var(--color-warm-neutral)]';
  else className += 'bg-[var(--color-ivory)]';

  return <section className={className}>{children}</section>;
}
