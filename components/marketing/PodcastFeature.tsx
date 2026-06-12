/**
 * PodcastFeature — BabyQuip Tiny Travels podcast episode embed.
 * Reusable across home page and about page.
 */
export default function PodcastFeature() {
  return (
    <section className="bg-[linear-gradient(180deg,#fdfaf7_0%,#ffffff_100%)] py-14 md:py-20">
      <div className="mx-auto max-w-2xl px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-dark)]/65">
            As Heard On
          </p>

          {/* Spotify wordmark + episode label */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {/* Spotify icon */}
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: '#1DB954' }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </span>
            <div className="text-left">
              <p className="font-serif text-[1.05rem] leading-tight tracking-[-0.02em] text-neutral-900">
                BabyQuip: Tiny Travels
              </p>
              <p className="text-[0.75rem] text-neutral-400">Podcast Episode</p>
            </div>
          </div>

          <h2 className="mt-5 font-serif text-[1.65rem] leading-tight tracking-[-0.03em] text-neutral-900 sm:text-[1.9rem]">
            Taylor on Baby Gear, Registry Strategy&nbsp;&amp; Real-Life Fit
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.93rem] leading-[1.8] text-neutral-500">
            Taylor joins the BabyQuip team to talk through what actually matters when preparing for
            a baby — and how to stop letting the gear pile-up steal the joy from early parenthood.
          </p>
        </div>

        {/* Spotify embed */}
        <div className="overflow-hidden rounded-[1.35rem] border border-[rgba(215,161,175,0.2)] shadow-[0_14px_40px_rgba(72,49,56,0.08)]">
          <iframe
            title="BabyQuip Tiny Travels Podcast – Taylor-Made Baby Co. Episode"
            src="https://open.spotify.com/embed/episode/7e2c0icuRxEKotUPdB0aOS?utm_source=generator&theme=0"
            width="100%"
            height="152"
            style={{ display: 'block', borderRadius: '1.25rem' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>

        {/* External link */}
        <div className="mt-5 text-center">
          <a
            href="https://open.spotify.com/episode/7e2c0icuRxEKotUPdB0aOS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-[var(--color-accent-dark)] transition-opacity hover:opacity-70"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Open in Spotify
          </a>
        </div>

      </div>
    </section>
  );
}
