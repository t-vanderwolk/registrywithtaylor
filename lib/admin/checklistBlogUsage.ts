import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

export type BlogProductPost = {
  title: string;
  slug: string;
  status: string;
};

export type BlogProductUsage = {
  brand: string;
  product: string;
  posts: BlogProductPost[];
};

type BlogPostSource = BlogProductPost & {
  content: string;
};

function normalizeProductText(value: string | null | undefined) {
  return (value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function checklistBlogProductKey(brand: string | null | undefined, product: string | null | undefined) {
  return `${normalizeProductText(brand)}|${normalizeProductText(product)}`;
}

export function buildChecklistBlogUsage(posts: BlogPostSource[]) {
  const byKey = new Map<string, BlogProductUsage>();

  for (const post of posts) {
    if (!post.content || !post.content.includes(':::catalog-product')) continue;

    for (const block of extractStyledBlocks(post.content)) {
      if (block.type !== 'catalog-product') continue;

      const brand = block.brand.trim();
      const product = block.productName.trim();
      if (!brand && !product) continue;

      const key = checklistBlogProductKey(brand, product);
      const row = byKey.get(key) ?? { brand, product, posts: [] };
      if (!row.posts.some((p) => p.slug === post.slug)) {
        row.posts.push({ title: post.title, slug: post.slug, status: post.status });
      }
      byKey.set(key, row);
    }
  }

  return byKey;
}
