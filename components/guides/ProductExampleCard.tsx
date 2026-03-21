import type { ReactNode } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type ProductExampleImage = {
  src: string;
  alt: string;
  objectClassName?: string;
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function DetailBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/6 bg-[#FCFAFB] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">{label}</p>
      <div className="mt-2 text-sm leading-7 text-neutral-700 md:text-base">{children}</div>
    </div>
  );
}

export default function ProductExampleCard({
  name,
  brand,
  image,
  description,
  bestFor,
  standout,
  watchout,
  imageHref,
  imageLinkLabel,
  cta,
  actionSlot,
}: {
  name: string;
  brand?: string | null;
  image?: ProductExampleImage | null;
  description?: ReactNode;
  bestFor?: ReactNode;
  standout?: ReactNode;
  watchout?: ReactNode;
  imageHref?: string | null;
  imageLinkLabel?: string | null;
  cta?: {
    href: string;
    label: string;
  } | null;
  actionSlot?: ReactNode;
}) {
  const imagePanel = (
    <div className="overflow-hidden rounded-xl border border-stone-200/70 bg-[#F7F3F0]">
      <div className="relative aspect-[4/3]">
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${image.objectClassName ?? 'object-contain'} object-center p-4`}
          />
        ) : (
          <div className="flex h-full items-end p-5">
            <p className="font-serif text-xl text-charcoal">{name}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <RevealOnScroll>
      <article className="h-full rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md md:p-6">
        {imageHref ? (
          isExternalHref(imageHref) ? (
            <a
              href={imageHref}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              aria-label={imageLinkLabel?.trim() || `Shop ${name}`}
              className="block rounded-xl transition duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              {imagePanel}
            </a>
          ) : (
            <Link
              href={imageHref}
              aria-label={imageLinkLabel?.trim() || `Open ${name}`}
              className="block rounded-xl transition duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              {imagePanel}
            </Link>
          )
        ) : (
          imagePanel
        )}

        <div className="mt-5 space-y-3">
          {brand ? (
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{brand}</p>
          ) : null}

          <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-tight text-charcoal">{name}</h3>

          {description ? (
            <div className="max-w-2xl text-base leading-relaxed text-neutral-700">{description}</div>
          ) : null}
        </div>

        {(bestFor || standout || watchout) ? (
          <div className="mt-5 grid gap-3">
            {bestFor ? <DetailBlock label="Best for">{bestFor}</DetailBlock> : null}
            {standout ? <DetailBlock label="Standout">{standout}</DetailBlock> : null}
            {watchout ? <DetailBlock label="Watchout">{watchout}</DetailBlock> : null}
          </div>
        ) : null}

        {actionSlot ? (
          <div className="mt-5">{actionSlot}</div>
        ) : cta ? (
          <div className="mt-5">
            <Link
              href={cta.href}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.36)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <span>{cta.label}</span>
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
          </div>
        ) : null}
      </article>
    </RevealOnScroll>
  );
}
