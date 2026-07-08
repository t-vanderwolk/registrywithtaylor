'use client';

import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';
import { blogProductKey, type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import { enrichProductBlockWithCatalog } from '@/lib/blog/enrichCatalogProduct';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

type BlogCatalogProductRecapProps = {
  content: string;
  productCatalogMap?: Record<string, BlogCatalogMatch>;
  strollerCompatHrefs?: Record<string, string>;
  goodBuyGearOffers?: Record<string, { url: string | null; price: number | null }>;
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
  goodBuyGearOffers = {},
  heading = 'Shop every stroller in this guide',
  subheading = 'All of the picks above, gathered in one place.',
  showChrome = true,
}: BlogCatalogProductRecapProps) {
  // A single-product review repeats the same card in every section, so dedupe by
  // brand+product and keep the first occurrence — the recap shows each pick once.
  const seen = new Set<string>();
  const productBlocks = extractStyledBlocks(content)
    .flatMap((block) =>
      block.type === 'catalog-product'
        ? [enrichProductBlockWithCatalog(block, productCatalogMap)]
        : [],
    )
    .filter((block) => {
      if (block.type !== 'catalog-product') return false;
      const key = blogProductKey(block.brand, block.productName);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

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
              shop2Url={block.shop2Url}
              shop2Retailer={block.shop2Retailer}
              amazonUrl={block.amazonUrl}
              primaryRetailer={block.primaryRetailer}
              comingSoon={block.comingSoon}
              compatHref={strollerCompatHrefs[blogProductKey(block.brand, block.productName)] ?? null}
              openBoxUrl={goodBuyGearOffers[blogProductKey(block.brand, block.productName)]?.url ?? null}
              openBoxPrice={goodBuyGearOffers[blogProductKey(block.brand, block.productName)]?.price ?? null}
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
