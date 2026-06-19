import Link from 'next/link';

export type LessonCardData = {
  lessonNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  href: string | null; // null = coming soon
  badge: string;
  available: boolean;
};

type FreeLessonCardProps = {
  lesson: LessonCardData;
};

export default function FreeLessonCard({ lesson }: FreeLessonCardProps) {
  const { lessonNumber, title, description, estimatedMinutes, href, badge, available } = lesson;

  return (
    <article
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-[1.45rem] border bg-white p-6 shadow-[0_12px_32px_rgba(72,49,56,0.06)] transition-all duration-300 sm:p-7',
        available
          ? 'border-[rgba(215,161,175,0.28)] hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(72,49,56,0.1)]'
          : 'border-[rgba(0,0,0,0.06)] opacity-75',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
          Lesson {lessonNumber}
        </span>
        <span
          className={[
            'inline-flex items-center rounded-full px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.18em]',
            available
              ? 'bg-[rgba(232,154,174,0.14)] text-[var(--color-accent-dark)]'
              : 'bg-[rgba(0,0,0,0.05)] text-neutral-400',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-serif text-[1.5rem] leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-[1.7rem]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 flex-1 text-[0.96rem] leading-[1.75] text-neutral-600">{description}</p>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-5">
        <span className="flex items-center gap-1.5 text-[0.8rem] text-neutral-400">
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {estimatedMinutes} min
        </span>

        {available && href ? (
          <Link
            href={href}
            className="inline-flex min-h-[40px] items-center rounded-full bg-[var(--color-cta-pink)] px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(216,137,160,0.3)] transition-all duration-200 hover:bg-[var(--color-cta-pink-hover)] hover:shadow-[0_12px_26px_rgba(216,137,160,0.4)]"
          >
            Start Lesson
          </Link>
        ) : (
          <span className="inline-flex min-h-[40px] cursor-not-allowed items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.03)] px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-neutral-300">
            Coming Soon
          </span>
        )}
      </div>
    </article>
  );
}
