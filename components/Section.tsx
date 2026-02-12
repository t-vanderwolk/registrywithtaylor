import type { ReactNode } from 'react';

type SectionVariant = 'base' | 'warm' | 'highlight' | 'neutral';

type SectionProps = {
  variant?: SectionVariant;
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const variantClass: Record<SectionVariant, string> = {
  base: 'section-bg-base',
  warm: 'section-bg-warm',
  highlight: 'section-bg-highlight',
  neutral: 'section-bg-neutral',
};

export default function Section({
  variant = 'base',
  children,
  className = '',
  ...rest
}: SectionProps) {
  return (
    <section className={`section ${variantClass[variant]} px-6 ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}
