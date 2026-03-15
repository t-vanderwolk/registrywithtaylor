import type { ReactNode } from 'react';

export default function PullQuote({
  quote,
  attribution,
}: {
  quote: ReactNode;
  attribution?: ReactNode;
}) {
  return (
    <figure className="content-widget my-12 border-l-4 border-l-[var(--tmbc-blog-blush)] pl-6 sm:pl-8">
      <blockquote className="font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] italic leading-[1.28] tracking-[-0.03em] text-[var(--tmbc-blog-rose)]">
        {quote}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
