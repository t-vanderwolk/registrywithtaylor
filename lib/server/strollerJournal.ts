import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { getPreferredStrollerBlogSlugs } from '@/lib/guides/strollerCluster';
import type { GuideHubLink } from '@/lib/guides/hubs';
import prisma from '@/lib/server/prisma';

const STROLLER_JOURNAL_CARD_LIBRARY: Record<
  string,
  Pick<GuideHubLink, 'title' | 'description' | 'icon'>
> = {
  'best-full-size-strollers-2026': {
    title: 'Best Full-Size Strollers',
    description: 'A recommendation-style shortlist for parents who already know the everyday stroller lane fits.',
    icon: 'stroller',
  },
  'best-compact-strollers': {
    title: 'Best Compact Strollers',
    description: 'A tighter shortlist for families prioritizing lighter lifting, easier folds, and smaller storage.',
    icon: 'compact',
  },
  'best-travel-strollers': {
    title: 'Best Travel Strollers',
    description: 'A roundup for families comparing fold size, carry feel, and how much comfort to keep in the travel lane.',
    icon: 'plane',
  },
  'best-jogging-strollers': {
    title: 'Best Jogging Strollers',
    description: 'A useful next read when you know terrain is the problem and want the models worth comparing.',
    icon: 'terrain',
  },
  'best-double-strollers': {
    title: 'Best Double Strollers',
    description: 'A roundup focused on sibling logistics, convertible systems, and the size tradeoffs that actually matter.',
    icon: 'double',
  },
  'stroller-comparisons': {
    title: 'Stroller Comparisons',
    description: 'Side-by-side editorial comparisons for the moments when two stroller categories still feel close.',
    icon: 'strategy',
  },
  'travel-system-questions-before-you-buy': {
    title: 'Travel System Questions Before You Buy',
    description: 'Helpful when the stroller choice is starting to overlap with infant car seat compatibility and early-stage planning.',
    icon: 'carseat',
  },
  'gear-decisions-without-guesswork': {
    title: 'Gear Decisions Without Guesswork',
    description: 'A calmer editorial filter for sorting stroller decisions when the category still feels louder than it should.',
    icon: 'book',
  },
};

export async function getPublishedStrollerJournalLinks(slug: string): Promise<GuideHubLink[]> {
  const preferredSlugs = getPreferredStrollerBlogSlugs(slug).filter(
    (preferredSlug) => preferredSlug in STROLLER_JOURNAL_CARD_LIBRARY,
  );

  if (preferredSlugs.length === 0) {
    return [];
  }

  const posts = await prisma.post.findMany({
    where: {
      ...getPublicPostWhere(),
      slug: {
        in: preferredSlugs,
      },
    },
    select: {
      slug: true,
      title: true,
      excerpt: true,
    },
  });

  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

  return preferredSlugs.flatMap((preferredSlug) => {
    const post = postsBySlug.get(preferredSlug);
    const defaults = STROLLER_JOURNAL_CARD_LIBRARY[preferredSlug];

    if (!post || !defaults) {
      return [];
    }

    return [
      {
        title: post.title?.trim() || defaults.title,
        description: post.excerpt?.trim() || defaults.description,
        href: `/blog/${post.slug}`,
        icon: defaults.icon,
      },
    ];
  });
}
