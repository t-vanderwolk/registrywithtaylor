import Link from 'next/link';

export type LessonNavLesson = {
  number: number;
  title: string;
  href: string | null; // null = coming soon / disabled
};

type LessonNavStripProps = {
  current: number; // 1-indexed position
  total: number;
  lessons: LessonNavLesson[];
};

export default function LessonNavStrip({ current, total, lessons }: LessonNavStripProps) {
  const prevLesson = lessons.find((l) => l.number === current - 1) ?? null;
  const nextLesson = lessons.find((l) => l.number === current + 1) ?? null;

  return (
    <div className="border-b border-[rgba(0,0,0,0.05)] bg-white px-5 py-3 sm:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        {/* Previous */}
        {prevLesson?.href ? (
          <Link
            href={prevLesson.href}
            className="flex min-w-0 items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.16em] text-neutral-400 transition-colors duration-200 hover:text-[var(--color-accent-dark)]"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <path
                d="M10 4L6 8l4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate">Lesson {prevLesson.number}</span>
          </Link>
        ) : (
          <span className="w-20 shrink-0" aria-hidden="true" />
        )}

        {/* Current position */}
        <span className="shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
          Lesson {current} of {total}
        </span>

        {/* Next */}
        {nextLesson ? (
          nextLesson.href ? (
            <Link
              href={nextLesson.href}
              className="flex min-w-0 items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.16em] text-neutral-400 transition-colors duration-200 hover:text-[var(--color-accent-dark)]"
            >
              <span className="truncate">Lesson {nextLesson.number}</span>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span className="flex min-w-0 items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.16em] text-neutral-300">
              <span className="truncate">Lesson {nextLesson.number}</span>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )
        ) : (
          <span className="w-20 shrink-0" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
