import Image from 'next/image';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { resolveGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';

type ProductCardProps = {
  name: string;
  brand: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
  category: string;
  guide?: string;
  position: number | string;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

function normalizeText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function normalizePros(items: string[]) {
  return Array.from(
    new Set(
      items
        .map((item) => normalizeText(item))
        .filter(Boolean),
    ),
  ).slice(0, 3);
}

export default function ProductCard({
  name,
  brand,
  description,
  pros,
  affiliateUrl,
  category,
  guide,
  position,
  imageSrc,
  imageAlt,
}: ProductCardProps) {
  const productName = normalizeText(name) || 'Guided example';
  const brandLabel = normalizeText(brand);
  const cardDescription =
    normalizeText(description) || 'A useful example to make the decision feel more concrete in real life.';
  const visiblePros = normalizePros(pros);
  const resolvedAffiliateUrl = resolveGuideAffiliateUrl({
    affiliateUrl,
    brand: brandLabel,
    productName,
    name: productName,
  });
  const resolvedImage = resolveProductCardImage({
    brand: brandLabel,
    productName,
    imageUrl: imageSrc,
    imageAlt,
  });
  const shouldSkipImageOptimization = resolvedImage ? isRemoteImageUrl(resolvedImage.src) : false;

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)] shadow-[0_14px_34px_rgba(47,36,48,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,36,48,0.1)]">
      <div className="flex h-full flex-col">
        {resolvedImage ? (
          <div className="border-b border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(248,241,232,0.72)_100%)] p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-white/80">
              <Image
                src={resolvedImage.src}
                alt={resolvedImage.alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                className={`${resolvedImage.objectClassName} p-3 transition duration-300 group-hover:scale-[1.02]`}
                unoptimized={shouldSkipImageOptimization}
              />
            </div>
          </div>
        ) : null}

        <div className="flex h-full flex-col p-5 sm:p-6">
          <div className="space-y-3">
            {brandLabel ? (
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/72">
                {brandLabel}
              </p>
            ) : null}

            <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-charcoal sm:text-[1.6rem]">
              {productName}
            </h3>

            <p className="text-[0.98rem] leading-7 text-neutral-700">{cardDescription}</p>
          </div>

          {visiblePros.length > 0 ? (
            <ul className="mt-5 space-y-2.5 text-[0.95rem] leading-7 text-neutral-700">
              {visiblePros.map((item) => (
                <li key={`${productName}-${item}`} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]/58" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {resolvedAffiliateUrl ? (
            <div className="mt-auto pt-6">
              <TrackedAffiliateLink
                href={resolvedAffiliateUrl}
                ctaText="View option"
                ariaLabel={`View option for ${productName}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition duration-200 hover:translate-x-1 hover:text-neutral-900"
                meta={{
                  product: productName,
                  brand: brandLabel,
                  category,
                  guide,
                  position,
                }}
              >
                <span>View option</span>
                <span aria-hidden="true">&rarr;</span>
              </TrackedAffiliateLink>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
