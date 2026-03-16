import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

function withAnchor(path: string, id: string) {
  return `${path}#${id}`;
}

const REGISTRY_PATHS = {
  essentials: '/guides/baby-registry-essentials',
  nursery: '/guides/nursery-registry-guide',
  feeding: '/guides/feeding-registry-guide',
  gear: '/guides/gear-registry-guide',
} as const;

const BLOG_PATHS = {
  registryTiming: '/blog/when-to-register-for-baby',
  registryBudget: '/blog/baby-registry-budget-guide',
  registryEtiquette: '/blog/baby-registry-etiquette',
} as const;

export type RegistryEditorialCallout = {
  matchTitle: string;
  text: string;
  icon: GuideHubIconKey;
};

export type RegistryDecisionStrip = {
  matchTitles: string[];
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
};

export type RegistryRealityCheckCard = {
  brand: string;
  productName: string;
  category: string;
  review: string;
  bestFor: string;
  standout: string;
  pros: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const REGISTRY_START_HERE_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I want a curated essentials-only registry',
    description: 'Start with essentials if you prefer a focused registry that covers must-haves without excess.',
    href: REGISTRY_PATHS.essentials,
    icon: 'bag',
  },
  {
    title: 'I need to plan my nursery setup',
    description: 'Focus on nursery items if creating a functional sleep and changing space is your priority.',
    href: REGISTRY_PATHS.nursery,
    icon: 'sleep',
  },
  {
    title: 'I want to compare feeding options',
    description: 'Explore feeding items if you want to understand bottles, pumps, and nursing accessories.',
    href: REGISTRY_PATHS.feeding,
    icon: 'layers',
  },
];

export const REGISTRY_NAVIGATOR_CARDS: GuideHubLink[] = [
  {
    title: 'Registry Essentials',
    description: 'Core items every baby needs in the first few months, focusing on safety and functionality.',
    href: REGISTRY_PATHS.essentials,
    icon: 'bag',
    imageSrc: '/assets/registry/essentials.png',
    imageAlt: 'Illustration representing baby registry essentials.',
  },
  {
    title: 'Nursery Setup',
    description: 'Sleep, changing, and storage solutions that create a functional nursery space.',
    href: REGISTRY_PATHS.nursery,
    icon: 'sleep',
    imageSrc: '/assets/registry/nursery.png',
    imageAlt: 'Illustration representing nursery registry items.',
  },
  {
    title: 'Feeding & Nursing',
    description: 'Bottles, pumps, nursing pillows, and accessories for feeding your baby.',
    href: REGISTRY_PATHS.feeding,
    icon: 'layers',
    imageSrc: '/assets/registry/feeding.png',
    imageAlt: 'Illustration representing feeding registry items.',
  },
  {
    title: 'Baby Gear',
    description: 'Strollers, car seats, and gear items that support your daily routine and outings.',
    href: REGISTRY_PATHS.gear,
    icon: 'stroller',
    imageSrc: '/assets/registry/gear.png',
    imageAlt: 'Illustration representing baby gear registry items.',
  },
];

export const REGISTRY_REALITY_CHECK_CARDS: RegistryRealityCheckCard[] = [
  {
    brand: 'Aden + Anais',
    productName: 'Classic Muslin Swaddle Blankets',
    category: 'Essentials',
    review: 'At $50 for 4-pack, these 100% cotton muslin swaddles offer incredible versatility for swaddling, nursing covers, and burp cloths. The quality and multi-use nature make them a registry essential that grows with your needs.',
    bestFor: 'Parents seeking versatile, high-quality basics that serve multiple purposes throughout infancy.',
    standout: 'Incredibly versatile at $50 for 4-pack',
    pros: ['100% cotton muslin', 'Multiple uses (swaddle, nursing, burp)', 'High quality construction', 'Grows with baby'],
    imageUrl: '/assets/registry/essentials.png',
    imageAlt: 'Aden + Anais Classic Muslin Swaddle Blankets.',
  },
  {
    brand: 'Halo',
    productName: 'SleepSack Wearable Blanket',
    category: 'Nursery',
    review: 'At $40, the SleepSack provides safe sleepwear that eliminates loose blankets while offering multiple size options. The innovative design and safety focus make it a worthwhile investment for peace of mind during sleep.',
    bestFor: 'Safety-conscious parents who want to eliminate loose bedding risks while maintaining comfort.',
    standout: 'Safety innovation at $40',
    pros: ['Eliminates loose blanket risks', 'Multiple size options', 'Easy to use', 'Peace of mind for parents'],
    imageUrl: '/assets/registry/nursery.png',
    imageAlt: 'Halo SleepSack Wearable Blanket.',
  },
  {
    brand: 'Dr. Brown\'s',
    productName: 'Options+ Anti-Colic Bottle',
    category: 'Feeding',
    review: 'At $25 for 4-pack, these bottles feature an internal vent system that reduces colic and gas. The quality construction and positive reviews make them a reliable choice for parents wanting to minimize feeding discomfort.',
    bestFor: 'Parents concerned about colic, gas, and feeding difficulties who want proven solutions.',
    standout: 'Proven colic reduction at $25 for 4-pack',
    pros: ['Internal vent system', 'Reduces colic and gas', 'Quality construction', 'Positive parent reviews'],
    imageUrl: '/assets/registry/feeding.png',
    imageAlt: 'Dr. Brown\'s Options+ Anti-Colic Bottle.',
  },
];

const REGISTRY_VISIBLE_TOC_MATCHES = [
  { match: 'Introduction', label: 'Introduction', level: 2 as const },
  { match: 'Registry Categories', label: 'Registry Categories', level: 2 as const },
  { match: 'Budget Planning', label: 'Budget Planning', level: 3 as const },
  { match: 'What to Skip', label: 'What to Skip', level: 2 as const },
  { match: 'FAQ', label: 'FAQ', level: 2 as const, id: 'guide-faq' },
  { match: 'Final Thoughts', label: 'Final Thoughts', level: 2 as const },
];

const REGISTRY_REALITY_CHECKS: RegistryEditorialCallout[] = [
  {
    matchTitle: 'Why Registries Feel Overwhelming',
    text: 'Most parents do not create bad registries because they missed important items. They create overwhelming registries because they include everything without considering space, budget, and actual daily needs.',
    icon: 'strategy',
  },
  {
    matchTitle: 'Registry Categories',
    text: 'Most families discover that 20-30 well-chosen items serve them better than 100 generic suggestions. Quality over quantity becomes the real theme.',
    icon: 'layers',
  },
  {
    matchTitle: 'What to Skip',
    text: 'A registry item can look essential online and still gather dust in your home. The real test is whether it serves your specific routine and space.',
    icon: 'shield',
  },
];

const REGISTRY_EDITORIAL_IMAGES: any[] = [
  {
    matchTitle: 'Registry Categories',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/registry-categories.jpg',
    alt: 'Editorial placeholder image for registry categories.',
    caption: 'Registry categories become clearer once you understand how they fit into your home and daily routine.',
  },
];

export const REGISTRY_DECISION_STRIPS: RegistryDecisionStrip[] = [
  {
    matchTitles: ['Registry essentials', 'Registry Essentials'],
    title: 'Best fit if you:',
    bullets: ['want a focused registry', 'prefer quality over quantity', 'have limited space or budget'],
    href: REGISTRY_PATHS.essentials,
    ctaLabel: 'Explore essentials',
    icon: 'bag',
  },
  {
    matchTitles: ['Nursery setup', 'Nursery Setup'],
    title: 'Best fit if you:',
    bullets: ['prioritize sleep and changing', 'want functional room flow', 'need storage solutions'],
    href: REGISTRY_PATHS.nursery,
    ctaLabel: 'Explore nursery',
    icon: 'sleep',
  },
  {
    matchTitles: ['Feeding items', 'Feeding & Nursing'],
    title: 'Best fit if you:',
    bullets: ['want to compare feeding options', 'need bottles and accessories', 'value comfort during feeding'],
    href: REGISTRY_PATHS.feeding,
    ctaLabel: 'Explore feeding',
    icon: 'layers',
  },
];