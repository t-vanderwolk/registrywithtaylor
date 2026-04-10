import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { resolveGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';

type BlogProductInsightLink = {
  label: string;
  url: string;
};

type BlogProductInsightDetail = {
  label: string;
  content: ReactNode;
};

function normalizeText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function hasRenderableContent(value: ReactNode): boolean {
  if (value === null || value === undefined || value === false) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasRenderableContent(item));
  }

  return true;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function resolveLinks({
  links,
  brand,
  productName,
}: {
  links: BlogProductInsightLink[];
  brand: string;
  productName: string;
}) {
  return links
    .map((link) => {
      const href = resolveGuideAffiliateUrl({
        affiliateUrl: normalizeText(link.url),
        brand,
        productName,
        name: productName,
      });

      if (!href) {
        return null;
      }

      return {
        href,
        label: normalizeText(link.label) || 'View option',
      };
    })
    .filter((link): link is { href: string; label: string } => Boolean(link))
    .filter((link, index, collection) => collection.findIndex((candidate) => candidate.href === link.href) === index)
    .slice(0, 3);
}

export default function BlogProductInsightCard({
  name,
  brand,
  description,
  details,
  links,
  category,
  guide,
  position,
  imageSrc,
  imageAlt,
}: {
  name: string;
  brand?: string | null;
  description?: ReactNode;
  details: BlogProductInsightDetail[];
  links: BlogProductInsightLink[];
  category: string;
  guide?: string;
  position: number | string;
  imageSrc?: string | null;
  imageAlt?: string | null;
}) {
  const productName = normalizeText(name) || 'Guided example';
  const brandLabel = normalizeText(brand);
  const resolvedImage = resolveProductCardImage({
    brand: brandLabel,
    productName,
    imageUrl: imageSrc,
    imageAlt,
  });
  const shouldSkipImageOptimization = resolvedImage ? isRemoteImageUrl(resolvedImage.src) : false;
  const resolvedLinks = resolveLinks({
    links,
    brand: brandLabel,
    productName,
  });
  const primaryLink = resolvedLinks[0] ?? null;
  const secondaryLinks = resolvedLinks.slice(1);
  const renderableDetails = details.filter((detail) => hasRenderableContent(detail.content)).slice(0, 3);

  const imagePanel = resolvedImage ? (
    <div className="border-b border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(248,241,232,0.72)_100%)] p-4">
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
  ) : null;

  const linkedImagePanel = imagePanel && primaryLink ? (
    isExternalHref(primaryLink.href) ? (
      <TrackedAffiliateLink
        href={primaryLink.href}
        ctaText={primaryLink.label}
        ariaLabel={primaryLink.label}
        className="block"
        meta={{
          product: productName,
          brand: brandLabel,
          category,
          guide,
          position,
          context: 'blog_product_example_image',
        }}
      >
        {imagePanel}
      </TrackedAffiliateLink>
    ) : (
      <Link href={primaryLink.href} aria-label={primaryLink.label} className="block">
        {imagePanel}
      </Link>
    )
  ) : (
    imagePanel
  );

  return (
    <article className="group h-full overflow-hidden rounded-[1.9rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)] shadow-[0_16px_38px_rgba(47,36,48,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(47,36,48,0.1)]">
      <div className="flex h-full flex-col">
        {linkedImagePanel}

        <div className="flex h-full flex-col p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {brandLabel ? (
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/72">
                  {brandLabel}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-charcoal sm:text-[1.6rem]">
                {productName}
              </h3>
              {hasRenderableContent(description) ? (
                <div className="text-[0.96rem] leading-7 text-neutral-700">{description}</div>
              ) : null}
            </div>

            {renderableDetails.length > 0 ? (
              <div className="space-y-4 rounded-[1.35rem] border border-[rgba(47,36,48,0.08)] bg-white/72 p-4">
                {renderableDetails.map((detail) => (
                  <div key={`${productName}-${detail.label}`}>
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/70">
                      {detail.label}
                    </p>
                    <div className="mt-2 text-[0.95rem] leading-7 text-neutral-700">{detail.content}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {primaryLink ? (
            <div className="mt-auto pt-6">
              {isExternalHref(primaryLink.href) ? (
                <TrackedAffiliateLink
                  href={primaryLink.href}
                  ctaText={primaryLink.label}
                  ariaLabel={primaryLink.label}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition duration-200 hover:translate-x-1 hover:text-neutral-900"
                  meta={{
                    product: productName,
                    brand: brandLabel,
                    category,
                    guide,
                    position,
                    context: 'blog_product_example_cta',
                  }}
                >
                  <span>{primaryLink.label}</span>
                  <span aria-hidden="true">&rarr;</span>
                </TrackedAffiliateLink>
              ) : (
                <Link
                  href={primaryLink.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition duration-200 hover:translate-x-1 hover:text-neutral-900"
                >
                  <span>{primaryLink.label}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}

              {secondaryLinks.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-4">
                  {secondaryLinks.map((link) =>
                    isExternalHref(link.href) ? (
                      <TrackedAffiliateLink
                        key={`${productName}-${link.label}-${link.href}`}
                        href={link.href}
                        ctaText={link.label}
                        ariaLabel={link.label}
                        className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/72 transition duration-200 hover:text-charcoal"
                        meta={{
                          product: productName,
                          brand: brandLabel,
                          category,
                          guide,
                          position,
                          context: 'blog_product_example_secondary_cta',
                        }}
                      >
                        {link.label}
                      </TrackedAffiliateLink>
                    ) : (
                      <Link
                        key={`${productName}-${link.label}-${link.href}`}
                        href={link.href}
                        className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/72 transition duration-200 hover:text-charcoal"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
