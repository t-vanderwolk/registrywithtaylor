import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';
import { hasResolvedGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';

type GuideProductBlock = Extract<ParsedStyledBlock, { type: 'product' }>;

export function isRenderableGuideProductBlock(product: GuideProductBlock) {
  return hasResolvedGuideAffiliateUrl({
    affiliateUrl: product.affiliateLinks[0]?.url ?? null,
    brand: product.brand,
    productName: product.productName,
    name: product.productName,
  });
}

export function filterRenderableGuideProductBlocks<T extends GuideProductBlock>(products: T[]) {
  return products.filter((product) => isRenderableGuideProductBlock(product));
}

export function isRenderableGuideProductExampleData(example: GuideProductExampleData) {
  return hasResolvedGuideAffiliateUrl({
    affiliateUrl: example.affiliateUrl ?? null,
    brand: example.brand ?? null,
    productName: example.productName ?? example.name,
    name: example.name,
  });
}

export function filterRenderableGuideProductExampleData<T extends GuideProductExampleData>(examples: T[]) {
  return examples.filter((example) => isRenderableGuideProductExampleData(example));
}
