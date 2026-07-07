import Link from 'next/link';
import JournalCard from '@/components/blog/JournalCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { getPostDisplayDate } from '@/lib/blog/postStatus';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

const toExcerpt = (excerpt: string | null, content: string, maxLength = 150) => {
  if (excerpt?.trim()) return excerpt.trim();
  const clean = stripMarkdown(content ?? '');
  if (!clean) return '';
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
};

/**
 * Homepage "From the Journal" preview — the three most recent published posts,
 * rendered with the same JournalCard used on /blog. Async server component;
 * runs inside the homepage's ISR (revalidate = 3600), so it stays static.
 */
export default async function HomeJournalPreview() {
  const all = await getPublicBlogIndexPosts(new Date());
  // Lead with posts flagged "Featured on homepage" (newest first), then fill the
  // rest of the three slots with the most recent posts. So the editor toggle now
  // actually controls what surfaces here.
  const featured = all.filter((post) => post.featured);
  const rest = all.filter((post) => !post.featured);
  const posts = [...featured, ...rest].slice(0, 3);
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">From the Journal</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.0] tracking-[-0.04em] text-neutral-900 sm:text-[2.5rem]">
                Baby gear guidance, straight from Taylor.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75"
            >
              Read the Journal
              <span aria-hidden className="ml-2">→</span>
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">
          {posts.map((post) => {
            const displayDate = getPostDisplayDate(post);
            return (
              <JournalCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                category={post.category}
                coverImage={post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage}
                excerpt={toExcerpt(post.excerpt, post.content, 150)}
                dateLabel={formatDate(displayDate)}
                dateTime={displayDate.toISOString()}
                readingTime={post.readingTime}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
