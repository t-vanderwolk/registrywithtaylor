import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href: string | null;
};

type LessonHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  lessonLabel: string;
  estimatedMinutes: number;
  progressLabel: string;
};

export default function LessonHeader({
  breadcrumbs,
  title,
  lessonLabel,
  estimatedMinutes,
  progressLabel,
}: LessonHeaderProps) {
  return (
    <header className="border-b border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fffdfb_0%,#fdf8f5_100%)] px-5 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-neutral-400">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden className="text-neutral-300">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-200 hover:text-[var(--color-accent-dark)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--color-accent-dark)]" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-[rgba(232,154,174,0.14)] px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
            {lessonLabel}
          </span>
          <span className="flex items-center gap-1.5 text-[0.8rem] text-neutral-400">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {estimatedMinutes} min
          </span>
          <span className="text-[0.8rem] text-neutral-400">{progressLabel}</span>
        </div>

        {/* Title */}
        <h1 className="mt-5 font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.8rem] lg:text-[3.2rem]">
          {title}
        </h1>
      </div>
    </header>
  );
}
