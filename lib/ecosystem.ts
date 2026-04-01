import { getGuidePath } from '@/lib/guides/routing';

export type EcosystemStep = {
  step: string;
  label: string;
  title: string;
  description: string;
  href: string;
};

export const TMBC_ECOSYSTEM_STEPS: EcosystemStep[] = [
  {
    step: '01',
    label: 'START',
    title: 'Build Your Registry',
    description: 'Organize what you need and create a clear plan before adding everything at once.',
    href: getGuidePath({ slug: 'minimalist-baby-registry' }),
  },
  {
    step: '02',
    label: 'ROUTINE',
    title: 'Set Up Daily Life',
    description: "Focus on feeding, diapering, and the routines you'll use every day.",
    href: '/guides/feeding',
  },
  {
    step: '03',
    label: 'ORGANIZE',
    title: 'Build Your Nursery',
    description: 'Start with the pieces that define your space and take the longest to arrive.',
    href: getGuidePath({ slug: 'nursery-setup-guide' }),
  },
  {
    step: '04',
    label: 'LEARN',
    title: 'Understand Your Options',
    description: 'Explore categories and understand what matters before making decisions.',
    href: '/guides',
  },
  {
    step: '05',
    label: 'SAVE',
    title: 'Plan Your Purchases',
    description: 'Use timing, rewards, and strategy to make smarter buying decisions.',
    href: '/guides/registry/perks',
  },
  {
    step: '06',
    label: 'CHOOSE',
    title: 'Select Core Gear',
    description: 'Choose your most important items once your lifestyle is clear.',
    href: getGuidePath({ slug: 'best-strollers' }),
  },
  {
    step: '07',
    label: 'FINALIZE',
    title: 'Finalize With Confidence',
    description: 'Make final adjustments with clarity, not pressure.',
    href: '/guides/postpartum',
  },
] as const;

const STROLLER_SLUGS = new Set([
  'best-strollers',
  'full-size-modular-strollers',
  'compact-lightweight-strollers',
  'travel-strollers',
  'convertible-strollers',
  'double-strollers',
  'jogging-all-terrain-strollers',
]);

const CAR_SEAT_SLUGS = new Set([
  'best-infant-car-seats',
  'infant-car-seats',
  'convertible-car-seats',
  'all-in-one-car-seats',
  'booster-seats',
  'rotating-car-seats',
  'travel-lightweight-car-seats',
]);

export function getGuideEcosystemCurrentStep({
  slug,
  path,
  category,
}: {
  slug?: string | null;
  path?: string | null;
  category?: string | null;
}) {
  const normalizedSlug = slug?.trim().toLowerCase() ?? '';
  const normalizedPath = path?.trim().toLowerCase() ?? '';
  const normalizedCategory = category?.trim().toLowerCase() ?? '';

  if (normalizedPath === '/guides' || normalizedSlug === 'guides-hub') {
    return 1;
  }

  if (normalizedSlug === 'nursery-setup-guide' || normalizedPath === '/guides/nursery' || normalizedCategory === 'nursery') {
    return 3;
  }

  if (normalizedSlug === 'feeding' || normalizedPath === '/guides/feeding' || normalizedCategory === 'feeding') {
    return 2;
  }

  if (
    normalizedSlug === 'perks' ||
    normalizedPath.endsWith('/registry/perks') ||
    normalizedPath.includes('/perks') ||
    normalizedPath.includes('/rewards')
  ) {
    return 5;
  }

  if (
    normalizedSlug === 'minimalist-baby-registry' ||
    normalizedPath === '/guides/registry' ||
    normalizedPath.startsWith('/guides/registry/') ||
    normalizedCategory === 'registry'
  ) {
    return 1;
  }

  if (STROLLER_SLUGS.has(normalizedSlug) || normalizedPath === '/guides/strollers' || normalizedPath.startsWith('/guides/strollers/')) {
    return 6;
  }

  if (CAR_SEAT_SLUGS.has(normalizedSlug) || normalizedPath === '/guides/car-seats' || normalizedPath.startsWith('/guides/car-seats/')) {
    return 6;
  }

  if (normalizedSlug === 'travel-with-baby' || normalizedPath.includes('/travel')) {
    return 6;
  }

  if (normalizedSlug === 'essentials' || normalizedPath === '/guides/essentials') {
    return 2;
  }

  if (normalizedSlug === 'postpartum' || normalizedPath === '/guides/postpartum') {
    return 7;
  }

  return 4;
}
