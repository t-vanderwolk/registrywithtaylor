'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-20"
      style={{ backgroundColor: 'var(--color-ivory)' }}
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="font-script text-[2.4rem] leading-none text-[var(--color-accent-dark)]">
          Well, that&apos;s unexpected
        </p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-tight tracking-[-0.03em] text-charcoal sm:text-[2.8rem]">
          Something went wrong.
        </h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-[1rem] leading-[1.8] text-[var(--color-muted)]">
          The page hit an unexpected error. You can try again, or head back home.
        </p>
        {error?.digest ? (
          <p className="mt-3 text-[0.75rem] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn btn--primary">
            Try again
          </button>
          <Link href="/" className="btn btn--secondary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
