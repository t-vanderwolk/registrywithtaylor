import type { ReactNode } from 'react';

type SectionTone = 'ivory' | 'blush' | 'beige';

type SectionProps = {
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
};

export default function Section({ children, tone = 'ivory', className = '' }: SectionProps) {
  const bgClass =
    tone === 'blush'
      ? 'bg-soft-blush'
      : tone === 'beige'
      ? 'bg-warm-neutral'
      : 'bg-ivory';

  return (
    <section className={`section ${bgClass} ${className}`.trim()}>
      <div className="mx-auto max-w-6xl px-6 md:px-16">{children}</div>
    </section>
  );
}
