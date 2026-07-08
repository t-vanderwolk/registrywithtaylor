'use client';

import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';
import { blogProductKey, type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import { enrichProductBlockWithCatalog } from '@/lib/blog/enrichCatalogProduct';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

type BlogCatalogProductRecapProps = {
  content: string;
  productCatalogMap?: Record<string, BlogCatalogMatch>;
  strollerCompatHrefs?: Record<string, string>;
  heading?: string;
  subheading?: string;
  /** When false, render only the card grid (no section wrapper / heading) so it
   *  can be dropped inside another section such as Gear Picks / Brand Partners. */
  showChrome?: boolean;
};

/**
 * End-of-post recap: pulls every `:::catalog-product` block out of the article
 * and re-renders them as a grid of the same shop-style cards used inline, so the
 * reader gets a single "shop everything covered" block near the Gear Picks /
 * Brand Partners section. Renders nothing when the post has no product cards.
 */
export default function BlogCatalogProductRecap({
  content,
  productCatalogMap = {},
  strollerCompatHrefs = {},
  heading = 'Shop every stroller in this guide',
  subheading = 'All of the picks above, gathered in one place.',
  showChrome = true,
}: BlogCatalogProductRecapProps) {
  const productBlocks = extractStyledBlocks(content).flatMap((block) =>
    block.type === 'catalog-product'
      ? [enrichProductBlockWithCatalog(block, productCatalogMap)]
      : [],
  );

  if (productBlocks.length === 0) return null;

  const grid = (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3${showChrome ? ' mt-8' : ''}`}>
      {productBlocks.map((block, index) =>
          block.type === 'catalog-product' ? (
            <BlogCatalogProductCard
              key={`${block.brand}-${block.productName}-${index}`}
              brand={block.brand}
              productName={block.productName}
              note={block.note}
              imageUrl={block.imageUrl}
              price={block.price}
              priceSource={block.priceSource}
              babylistUrl={block.babylistUrl}
              macrobabyUrl={block.macrobabyUrl}
              shopUrl={block.shopUrl}
              shopRetailer={block.shopRetailer}
              amazonUrl={block.amazonUrl}
              primaryRetailer={block.primaryRetailer}
              comingSoon={block.comingSoon}
              compatHref={strollerCompatHrefs[blogProductKey(block.brand, block.productName)] ?? null}
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
