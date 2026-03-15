import type { ReactNode } from 'react';

export default function PullQuote({
  quote,
  attribution,
}: {
  quote: ReactNode;
  attribution?: ReactNode;
}) {
  return (
    <figure className="tmbc-pullquote content-widget my-12 pl-6 sm:pl-8">
      <blockquote className="tmbc-pullquote__text font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] italic leading-[1.28] tracking-[-0.03em]">
        {quote}
      </blockquote>
      {attribution ? (
        <figcaption className="tmbc-pullquote__attribution mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
