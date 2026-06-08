import Link from 'next/link';

export default function AuthorBio() {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,247,244,0.93)_100%)] px-6 py-7 shadow-[0_14px_34px_rgba(72,49,56,0.05)] sm:px-8 sm:py-8">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">About the author</p>
        <p className="mt-3 font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-neutral-900">
          Taylor Vanderwolk
        </p>
        <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
          Taylor Vanderwolk is a Baby Gear Expert and registry consultant. She works as a Tot Squad advisor, Target
          Baby Concierge, and independent consultant at Taylor-Made Baby Co.
        </p>
        <div className="mt-5">
          <Link
            href="/about"
            className="inline-flex min-h-[40px] items-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75"
          >
            Meet Taylor
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
