'use client';

import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';
import { type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import { enrichProductBlockWithCatalog } from '@/lib/blog/enrichCatalogProduct';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

type BlogCatalogProductRecapProps = {
  content: string;
  productCatalogMap?: Record<string, BlogCatalogMatch>;
  heading?: string;
  subheading?: string;
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
  heading = 'Shop every stroller in this guide',
  subheading = 'All of the picks above, gathered in one place.',
}: BlogCatalogProductRecapProps) {
  const productBlocks = extractStyledBlocks(content).flatMap((block) =>
    block.type === 'catalog-product'
      ? [enrichProductBlockWithCatalog(block, productCatalogMap)]
      : [],
  );

  if (productBlocks.length === 0) return null;

  return (
    <section className="blog-section-soft mt-16 px-6">
      <div className="space-y-3">
        <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] leading-tight tracking-[-0.03em] text-neutral-900">
          {heading}
        </h2>
        <p className="text-charcoal/68">{subheading}</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              position={index + 1}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}
