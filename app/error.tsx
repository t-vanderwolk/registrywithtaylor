'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// A stale deploy leaves a client holding old chunk hashes; the next navigation or
// prefetch 404s and throws a ChunkLoadError. Detect it and hard-reload ONCE to
// pull the fresh build (guarded by sessionStorage so we never loop).
const CHUNK_ERROR_RE = /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|error loading dynamically imported module|Importing a module script failed/i;
const RELOAD_FLAG = 'tmbc:chunk-reload';

function isChunkLoadError(error?: Error & { name?: string }) {
  if (!error) return false;
  return error.name === 'ChunkLoadError' || CHUNK_ERROR_RE.test(`${error.name ?? ''} ${error.message ?? ''}`);
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (chunkError) {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1';
        if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, '1');
      } catch {
        // sessionStorage unavailable (private mode) — fall through to a single reload.
      }
      if (!alreadyReloaded) {
        window.location.reload();
        return;
      }
    } else {
      // A normal render succeeded before this error — clear the reload guard so a
      // future genuine stale-deploy can recover again.
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        // ignore
      }
    }
    console.error('[app/error]', error);
  }, [error, chunkError]);

  if (chunkError) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6 py-20"
        style={{ backgroundColor: 'var(--color-ivory)' }}
      >
        <div className="mx-auto max-w-md text-center">
          <p className="font-script text-[2rem] leading-none text-[var(--color-accent-dark)]">One sec</p>
          <h1 className="mt-3 font-serif text-[1.8rem] leading-tight tracking-[-0.03em] text-charcoal">
            Loading the latest version...
          </h1>
          <p className="mx-auto mt-4 max-w-[36ch] text-[0.95rem] leading-[1.8] text-[var(--color-muted)]">
            We just shipped an update. If this doesn&apos;t refresh on its own, tap below.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <button type="button" onClick={() => window.location.reload()} className="btn btn--primary">
              Refresh
            </button>
          </div>
        </div>
      </main>
    );
  }

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
