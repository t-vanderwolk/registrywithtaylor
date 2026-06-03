import type { ReactNode } from 'react';

type LessonSectionProps = {
  stepNumber?: number;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function LessonSection({
  stepNumber,
  eyebrow,
  title,
  children,
  className = '',
}: LessonSectionProps) {
  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {(stepNumber || eyebrow) && (
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/72">
          {stepNumber ? `${stepNumber}. ` : ''}{eyebrow}
        </p>
      )}
      <h2 className="font-serif text-[1.6rem] leading-[1.04] tracking-[-0.035em] text-neutral-900 sm:text-[2rem]">
        {title}
      </h2>
      <div className="space-y-4 text-[1rem] leading-[1.85] text-neutral-600">{children}</div>
    </div>
  );
}
