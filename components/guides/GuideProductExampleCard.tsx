import type { ReactNode } from 'react';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';
import type { GuideProductSpecGroup } from '@/lib/guides/productExamples';

export default function GuideProductExampleCard({
  name,
  imageSrc,
  imageAlt,
  brand,
  productName,
  typeLabel,
  whyItMatters,
  bestFor,
  whoItFits,
  specGroups = [],
  notes = [],
}: {
  name: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  brand?: string;
  productName?: string;
  typeLabel?: string | null;
  whyItMatters?: ReactNode;
  bestFor?: ReactNode;
  whoItFits?: ReactNode;
  specGroups?: GuideProductSpecGroup[];
  notes?: string[];
}) {
  const bestForContent = bestFor ?? whoItFits;
  const resolvedImage =
    imageSrc?.trim()
      ? {
          src: imageSrc.trim(),
          alt: imageAlt?.trim() || name,
          objectClassName: 'object-contain',
        }
      : brand && productName
        ? (() => {
            const image = resolveProductCardImage({
              brand,
              productName,
              imageUrl: null,
              imageAlt,
            });

            return image
              ? {
                  src: image.src,
                  alt: image.alt,
                  objectClassName: image.objectClassName,
                }
              : null;
          })()
        : null;

  return (
    <article className="rounded-[1.25rem] border border-stone-200/70 bg-white/90 p-3 shadow-[0_10px_24px_rgba(0,0,0,0.03)] sm:rounded-[1.5rem] sm:p-4">
      <div className="rounded-[1rem] border border-stone-200/70 bg-[#f8f3ed] p-2.5 sm:rounded-[1.2rem] sm:p-3">
        <div className="relative h-20 sm:h-28 md:h-32">
          {resolvedImage ? (
            <img
              src={resolvedImage.src}
              alt={resolvedImage.alt}
              className={`h-full w-full ${resolvedImage.objectClassName} object-center`}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-end p-3">
              <p className="font-serif text-[1.05rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{name}</p>
            </div>
          )}
        </div>
      </div>

      {brand ? (
        <p className="mt-3 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{brand}</p>
      ) : null}

      <p className="mt-2 font-serif text-[0.98rem] leading-[1.1] tracking-[-0.02em] text-neutral-900 sm:text-[1.15rem]">
        {name}
      </p>

      {typeLabel ? (
        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.15em] text-[var(--color-accent-dark)]/82">{typeLabel}</p>
      ) : null}

      {whyItMatters || bestForContent || specGroups.length > 0 || notes.length > 0 ? (
        <div className="mt-3 space-y-3">
          {whyItMatters ? (
            <div className="rounded-[1rem] border border-stone-200/70 bg-[#fcfaf7] p-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Why it matters</p>
              <div className="mt-2 text-sm leading-6 text-neutral-700">{whyItMatters}</div>
            </div>
          ) : null}

          {bestForContent ? (
            <div className="rounded-[1rem] border border-stone-200/70 bg-[#fcfaf7] p-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Best for</p>
              <div className="mt-2 text-sm leading-6 text-neutral-700">{bestForContent}</div>
            </div>
          ) : null}

          {specGroups.length > 0 ? (
            <div className="rounded-[1rem] border border-stone-200/70 bg-[#fcfaf7] p-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Quick specs</p>
              <div className="mt-2 space-y-2.5 text-sm leading-6 text-neutral-700">
                {specGroups.map((group) => (
                  <div key={`${name}-${group.label}`}>
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-neutral-500">{group.label}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      {group.items.map((item) => (
                        <li key={`${name}-${group.label}-${item}`} className="leading-6">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {notes.length > 0 ? (
            <div className="rounded-[1rem] border border-stone-200/70 bg-[#fcfaf7] p-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">Notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-6 text-neutral-700">
                {notes.map((note) => (
                  <li key={`${name}-${note}`}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
