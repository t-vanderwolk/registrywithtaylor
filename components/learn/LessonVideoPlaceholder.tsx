export default function LessonVideoPlaceholder() {
  return (
    <div>
      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/72">
        Watch + Learn
      </p>
      <div className="flex aspect-video w-full items-center justify-center rounded-[1.35rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,rgba(255,248,249,0.96)_0%,rgba(253,244,240,0.94)_100%)]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(215,161,175,0.28)] bg-white shadow-[0_8px_20px_rgba(72,49,56,0.06)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-[var(--color-accent-dark)]"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10 8.5l5 3.5-5 3.5V8.5Z" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-4 text-[0.82rem] font-medium text-neutral-500">
            Video lesson coming soon
          </p>
          <p className="mt-1 text-[0.78rem] text-neutral-400">
            Continue with the written lesson below
          </p>
        </div>
      </div>
    </div>
  );
}
