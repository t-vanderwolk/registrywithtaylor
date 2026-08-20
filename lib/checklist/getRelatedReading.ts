import 'server-only';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import { getPostDisplayDate } from '@/lib/blog/postStatus';
import { categoryRelatedPosts, type RelatedReadingCard } from '@/lib/checklist/data';

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Mirror of the homepage journal preview's excerpt logic so the checklist cards
// read identically to the "Baby gear guidance" section.
const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toExcerpt = (excerpt: string | null, content: string, maxLength = 120) => {
  if (excerpt?.trim()) return excerpt.trim();
  const clean = stripMarkdown(content ?? '');
  if (!clean) return '';
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
};

/**
 * Resolves the checklist's per-category related-post slugs (from data.ts) into
 * full JournalCard data using live published posts. Slugs with no matching
 * published post are silently skipped, so the strip never renders a dead card.
 * Returns a map keyed by CategoryId; empty categories are omitted.
 */
export async function getChecklistRelatedReading(): Promise<Record<string, RelatedReadingCard[]>> {
  let posts: Awaited<ReturnType<typeof getPublicBlogIndexPosts>>;
  try {
    posts = await getPublicBlogIndexPosts(new Date());
  } catch {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySlug = new Map(posts.map((p) => [p.slug, p as any]));
  const out: Record<string, RelatedReadingCard[]> = {};

  for (const [categoryId, list] of Object.entries(categoryRelatedPosts)) {
    if (!list) continue;
    const cards: RelatedReadingCard[] = [];
    for (const { label, slug } of list) {
      const post = bySlug.get(slug);
      if (post) {
        const displayDate = getPostDisplayDate(post);
        cards.push({
          title: post.title,
          slug: post.slug,
          category: post.category,
          coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage ?? null,
          excerpt: toExcerpt(post.excerpt ?? null, post.content ?? '', 120),
          dateLabel: formatDate(displayDate),
          dateTime: displayDate.toISOString(),
          readingTime: post.readingTime ?? null,
        });
      } else {
        // The post isn't in this environment's DB (e.g. a partial local copy).
        // Fall back to the curated label + placeholder so the strip still renders
        // and links to the (live, prod-verified) post URL rather than vanishing.
        cards.push({
          title: label,
          slug,
          category: '',
          coverImage: null,
          excerpt: '',
          dateLabel: '',
          dateTime: '',
          readingTime: null,
        });
      }
    }
    if (cards.length) out[categoryId] = cards;
  }

  return out;
}
