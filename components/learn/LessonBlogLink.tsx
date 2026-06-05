import Link from 'next/link';

type LessonBlogLinkProps = {
  href: string;
  title: string;
  description?: string;
};

export default function LessonBlogLink({ href, title, description }: LessonBlogLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-[1.1rem] border border-[rgba(196,156,94,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,248,242,0.95)_100%)] px-5 py-4 no-underline shadow-[0_4px_16px_rgba(72,49,56,0.04)] transition duration-200 hover:border-[rgba(196,156,94,0.38)] hover:shadow-[0_8px_24px_rgba(72,49,56,0.08)]"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-[var(--color-gold-soft)] transition duration-200 group-hover:translate-x-0.5"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9ZM8.75 5.25a.75.75 0 0 0-1.5 0v3.19L6.03 7.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V5.25Z" />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]">
          From the Journal
        </p>
        <p className="mt-0.5 text-[0.93rem] font-semibold leading-snug text-neutral-800 transition duration-200 group-hover:text-neutral-900">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-[0.83rem] leading-[1.65] text-neutral-500">{description}</p>
        )}
      </div>
      <span
        aria-hidden="true"
        className="ml-auto mt-0.5 shrink-0 text-neutral-300 transition duration-200 group-hover:translate-x-1 group-hover:text-[var(--color-gold-soft)]"
      >
        →
      </span>
    </Link>
  );
}
