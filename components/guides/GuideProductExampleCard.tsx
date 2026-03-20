import type { ReactNode } from 'react';
import ProductExampleCard from '@/components/guides/ProductExampleCard';
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
  standout,
  watchout,
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
  standout?: ReactNode;
  watchout?: ReactNode;
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

  const standoutContent =
    standout ??
    (specGroups.length > 0
      ? specGroups
          .flatMap((group) => group.items)
          .find(Boolean) ?? null
      : typeLabel ?? null);
  const watchoutContent = watchout ?? notes[0] ?? null;

  return (
    <ProductExampleCard
      name={name}
      brand={brand}
      image={resolvedImage}
      description={whyItMatters ?? typeLabel ?? null}
      bestFor={bestForContent}
      standout={standoutContent}
      watchout={watchoutContent}
    />
  );
}
