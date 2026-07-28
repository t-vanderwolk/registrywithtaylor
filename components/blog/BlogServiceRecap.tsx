'use client';

import BlogServiceCard from '@/components/blog/BlogServiceCard';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

type BlogServiceRecapProps = {
  content: string;
  heading?: string;
  subheading?: string;
  /** When false, render only the card grid (no section wrapper / heading) so it
   *  can be dropped inside another section. */
  showChrome?: boolean;
};

/**
 * End-of-post recap for non-product highlights: pulls every `:::service` block
 * out of the article (clubs, subscriptions, registry platforms, independent
 * stores, memberships) and re-renders them as a grid of the same cards used
 * inline — mirroring BlogCatalogProductRecap. Renders nothing when the post has
 * no service cards.
 */
export default function BlogServiceRecap({
  content,
  heading = 'Services & memberships in this guide',
  subheading = 'Everything above that isn’t a physical product, gathered in one place.',
  showChrome = true,
}: BlogServiceRecapProps) {
  // Dedupe by brand+name so a service repeated across sections shows once.
  const seen = new Set<string>();
  const serviceBlocks = extractStyledBlocks(content).filter((block) => {
    if (block.type !== 'service') return false;
    const key = `${(block.brand ?? '').trim().toLowerCase()}::${block.name.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (serviceBlocks.length === 0) return null;

  const grid = (
    <div className={`grid gap-6 lg:grid-cols-2${showChrome ? ' mt-8' : ''}`}>
      {serviceBlocks.map((block, index) =>
        block.type === 'service' ? (
          <BlogServiceCard
            key={`${block.brand ?? ''}-${block.name}-${index}`}
            category={block.category}
            brand={block.brand}
            name={block.name}
            tagline={block.tagline}
            price={block.price}
            bestFor={block.bestFor}
            includes={block.includes}
            links={block.links}
            badge={block.badge}
            imageUrl={block.imageUrl}
            position={index + 1}
          />
        ) : null,
      )}
    </div>
  );

  if (!showChrome) return grid;

  return (
    <section className="blog-section-soft mt-16 px-6">
      <div className="space-y-3">
        <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] leading-tight tracking-[-0.03em] text-neutral-900">
          {heading}
        </h2>
        <p className="text-charcoal/68">{subheading}</p>
      </div>
      {grid}
    </section>
  );
}
