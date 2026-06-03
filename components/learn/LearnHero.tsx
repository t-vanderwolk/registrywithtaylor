import Image from 'next/image';
import Link from 'next/link';

const trustPoints = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Expert guidance from Taylor',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Prepare with confidence',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M4 10h12M4 6h8M4 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: 'Save time, money, and overwhelm',
  },
];

export default function LearnHero() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(160deg,#fffdfb_0%,#fdf5f0_45%,#fef2f5_100%)] py-20 md:py-28"
      aria-labelledby="learn-hero-title"
    >
      {/* ambient glow top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-6rem] top-[-4rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_70%)] blur-3xl"
      />
      {/* ambient glow bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-4rem] right-[-4rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.12)_0%,rgba(196,156,94,0)_72%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center lg:gap-16 xl:gap-20">
          {/* Copy */}
          <div className="max-w-[36rem] lg:max-w-none">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
              Taylor-Made Baby Academy
            </p>

            <h1
              id="learn-hero-title"
              className="mt-4 font-serif text-[2.6rem] leading-[0.96] tracking-[-0.04em] text-neutral-900 sm:text-[3.4rem] lg:text-[3.8rem]"
            >
              Your go-to baby{' '}
              <span className="italic text-[var(--color-accent-dark)]">preparation</span>{' '}
              academy.
            </h1>

            <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-[1.8] text-neutral-600 sm:text-[1.12rem]">
              Expert-led lessons, planning tools, and checklists to help you prepare with
              confidence and make thoughtful decisions for your baby and your family.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/learn/art-of-the-registry"
                className="btn btn--primary w-full sm:w-auto"
              >
                Start Free Lesson
              </Link>
              <a
                href="#preview-lessons"
                className="btn btn--secondary w-full sm:w-auto"
              >
                See What&apos;s Inside
              </a>
            </div>

            {/* Trust points */}
            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              {trustPoints.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-2.5 text-[0.875rem] text-neutral-600"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(232,154,174,0.14)] text-[var(--color-accent-dark)]">
                    {point.icon}
                  </span>
                  {point.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(253,245,241,0.96)_100%)] p-4 shadow-[0_28px_72px_rgba(72,49,56,0.1)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem]">
                <Image
                  src="/assets/editorial/registry.jpg"
                  alt="Baby planning notes and registry tools on a soft linen surface"
                  fill
                  priority
                  sizes="(min-width: 1280px) 540px, 44vw"
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 rounded-[1.15rem] border border-[rgba(215,161,175,0.24)] bg-white px-4 py-3 shadow-[0_16px_38px_rgba(72,49,56,0.1)]">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/80">
                  Free to start
                </p>
                <p className="mt-0.5 font-serif text-[1.05rem] leading-tight text-neutral-900">
                  No account needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
