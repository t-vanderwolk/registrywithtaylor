import { getStrollerGuideSuggestionsForBlogPost } from '@/lib/guides/strollerCluster';
import type { GuideCardItem } from '@/lib/guides/presentation';
import { toGuideCardItemFromPillar } from '@/lib/guides/presentation';
import { getGuidePillar } from '@/lib/marketing/siteContent';

function getBaseGuideLinksForBlogCategory(category: string): GuideCardItem[] {
  switch (category) {
    case 'Gear & Safety':
      return [
        getGuidePillar('best-strollers'),
        getGuidePillar('best-infant-car-seats'),
        getGuidePillar('travel-with-baby'),
      ]
        .filter((entry): entry is NonNullable<ReturnType<typeof getGuidePillar>> => Boolean(entry))
        .map((entry) => toGuideCardItemFromPillar(entry));
    case 'Nursery & Home':
      return [
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('best-infant-car-seats'),
      ]
        .filter((entry): entry is NonNullable<ReturnType<typeof getGuidePillar>> => Boolean(entry))
        .map((entry) => toGuideCardItemFromPillar(entry));
    case 'Transitions & Family':
      return [
        getGuidePillar('travel-with-baby'),
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('minimalist-baby-registry'),
      ]
        .filter((entry): entry is NonNullable<ReturnType<typeof getGuidePillar>> => Boolean(entry))
        .map((entry) => toGuideCardItemFromPillar(entry));
    case 'Planning & Events':
      return [
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('travel-with-baby'),
      ]
        .filter((entry): entry is NonNullable<ReturnType<typeof getGuidePillar>> => Boolean(entry))
        .map((entry) => toGuideCardItemFromPillar(entry));
    case 'Registry Strategy':
    default:
      return [
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('best-strollers'),
        getGuidePillar('best-infant-car-seats'),
      ]
        .filter((entry): entry is NonNullable<ReturnType<typeof getGuidePillar>> => Boolean(entry))
        .map((entry) => toGuideCardItemFromPillar(entry));
  }
}

export function getGuideLinksForBlogPost({
  category,
  slug,
  title,
  content,
}: {
  category: string;
  slug: string;
  title: string;
  content: string;
}) {
  const strollerSuggestions = getStrollerGuideSuggestionsForBlogPost({ slug, title, content });
  const baseLinks = getBaseGuideLinksForBlogCategory(category);

  return [...strollerSuggestions, ...baseLinks]
    .filter(
      (entry, index, collection) =>
        collection.findIndex((candidate) => candidate.slug === entry.slug) === index,
    )
    .slice(0, 3);
}
