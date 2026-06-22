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
  const hasStep = typeof stepNumber === 'number';

  return (
    <div className={['space-y-5', className].filter(Boolean).join(' ')}>
      {/* Step badge row */}
      {(hasStep || eyebrow) && (
        <div className="flex items-center gap-3">
          {hasStep && (
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(232,154,174,0.35)] bg-[rgba(232,154,174,0.1)] font-sans text-[0.78rem] font-bold text-[var(--color-accent-dark)]"
            >
              {stepNumber}
            </span>
          )}
          {eyebrow && (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/72">
              {eyebrow}
            </p>
          )}
        </div>
      )}

      {/* Title — blog h2 styling: Playfair, charcoal, rose underline bar */}
      <h2
        className={[
          'lesson-heading',
          hasStep
            ? 'text-[1.7rem] sm:text-[2.05rem]'
            : 'text-[1.95rem] sm:text-[2.45rem]',
        ].join(' ')}
      >
        {title}
      </h2>

      {/* Body — blog prose: Inter, charcoal, 1.08rem / 1.88 line-height */}
      <div
        className={[
          'lesson-prose space-y-6',
          hasStep ? 'pl-0 sm:pl-11' : '',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
