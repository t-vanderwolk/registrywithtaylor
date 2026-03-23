export const NURSERY_GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library: Nursery';
export const NURSERY_GUIDE_PARENT_SLUG = 'nursery-setup-guide';

export const NURSERY_SUBGUIDE_DEFINITIONS = [
  {
    key: 'sleepSetup',
    slug: 'nursery-sleep-setup',
    routeSegment: 'sleep-setup',
    path: '/guides/nursery/sleep-setup',
    title: 'Nursery Sleep Setup',
    cardTitle: 'Sleep Setup',
    description:
      'For crib size, sleep flow, room-sharing crossover, and the setup that actually supports the first stretch of nights.',
    icon: 'sleep',
    fileName: 'taylor-made-nursery-sleep-setup-guide.md',
    targetKeyword: 'nursery sleep setup',
    secondaryKeywords: ['nursery sleep setup', 'crib vs mini crib', 'nursery sleep space', 'safe nursery sleep'],
    heroImageAlt: 'Nursery sleep setup editorial image for Taylor-Made Baby Co.',
    relatedSlugs: ['nursery-setup-guide', 'nursery-changing-station', 'nursery-furniture', 'nursery-storage'],
  },
  {
    key: 'changingStation',
    slug: 'nursery-changing-station',
    routeSegment: 'changing-station',
    path: '/guides/nursery/changing-station',
    title: 'Changing Station Guide',
    cardTitle: 'Changing Station',
    description:
      'For dresser-top setups, restocking logic, and a diapering route that still makes sense when you are tired.',
    icon: 'checklist',
    fileName: 'taylor-made-changing-station-guide.md',
    targetKeyword: 'changing station guide',
    secondaryKeywords: ['changing station setup', 'dresser changing station', 'nursery diaper station', 'changing table vs dresser'],
    heroImageAlt: 'Changing station editorial image for Taylor-Made Baby Co.',
    relatedSlugs: ['nursery-setup-guide', 'nursery-sleep-setup', 'nursery-furniture', 'nursery-storage'],
  },
  {
    key: 'furniture',
    slug: 'nursery-furniture',
    routeSegment: 'furniture',
    path: '/guides/nursery/furniture',
    title: 'Nursery Furniture Guide',
    cardTitle: 'Nursery Furniture',
    description:
      'For cribs, dressers, chairs, and the pieces that need to earn their floor space instead of just looking composed.',
    icon: 'home',
    fileName: 'taylor-made-nursery-furniture-guide.md',
    targetKeyword: 'nursery furniture guide',
    secondaryKeywords: ['nursery furniture', 'crib dresser chair nursery', 'nursery furniture checklist', 'nursery furniture for small rooms'],
    heroImageAlt: 'Nursery furniture editorial image for Taylor-Made Baby Co.',
    relatedSlugs: ['nursery-setup-guide', 'nursery-sleep-setup', 'nursery-changing-station', 'nursery-storage'],
  },
  {
    key: 'storage',
    slug: 'nursery-storage',
    routeSegment: 'storage',
    path: '/guides/nursery/storage',
    title: 'Nursery Storage Guide',
    cardTitle: 'Storage',
    description:
      'For drawers, baskets, backup supplies, and storage systems that shorten the route instead of adding more optimism bins.',
    icon: 'storage',
    fileName: 'taylor-made-nursery-storage-guide.md',
    targetKeyword: 'nursery storage guide',
    secondaryKeywords: ['nursery storage', 'nursery organization', 'baby room storage ideas', 'nursery dresser organization'],
    heroImageAlt: 'Nursery storage editorial image for Taylor-Made Baby Co.',
    relatedSlugs: ['nursery-setup-guide', 'nursery-sleep-setup', 'nursery-changing-station', 'nursery-furniture'],
  },
] as const;

export type NurserySubGuideDefinition = (typeof NURSERY_SUBGUIDE_DEFINITIONS)[number];
export type NurserySubGuideSlug = NurserySubGuideDefinition['slug'];

export const NURSERY_SUBGUIDE_PATHS = {
  sleepSetup: NURSERY_SUBGUIDE_DEFINITIONS[0].path,
  changingStation: NURSERY_SUBGUIDE_DEFINITIONS[1].path,
  furniture: NURSERY_SUBGUIDE_DEFINITIONS[2].path,
  storage: NURSERY_SUBGUIDE_DEFINITIONS[3].path,
} as const;

export function getNurserySubGuideBySlug(slug: string) {
  return NURSERY_SUBGUIDE_DEFINITIONS.find((guide) => guide.slug === slug) ?? null;
}

export function isNurserySubGuideSlug(slug: string): slug is NurserySubGuideSlug {
  return Boolean(getNurserySubGuideBySlug(slug));
}
