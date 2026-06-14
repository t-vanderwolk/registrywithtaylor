import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

function withAnchor(path: string, id: string) {
  return `${path}#${id}`;
}

const NURSERY_PATHS = {
  cribs: '/guides/best-cribs-guide',
  dressers: '/learn/nursery/vision-and-lifestyle-storage-guide',
  changing: '/guides/changing-table-guide',
  sleep: '/guides/baby-sleep-setup-guide',
} as const;

const BLOG_PATHS = {
  nurseryLayout: '/blog/nursery-room-layout',
  smallSpaceNursery: '/blog/small-space-nursery-ideas',
  nurserySafety: '/blog/nursery-safety-checklist',
} as const;

export type NurseryEditorialCallout = {
  matchTitle: string;
  text: string;
  icon: GuideHubIconKey;
};

export type NurseryDecisionStrip = {
  matchTitles: string[];
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
};

export type NurseryRealityCheckCard = {
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

export const NURSERY_START_HERE_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I need to choose a crib and bassinet',
    description: 'Start with sleep foundations if creating a safe sleep space is your top priority.',
    href: NURSERY_PATHS.cribs,
    icon: 'sleep',
  },
  {
    title: 'I need storage and organization solutions',
    description: 'Focus on storage if maximizing space and keeping the nursery organized matters most.',
    href: NURSERY_PATHS.dressers,
    icon: 'storage',
  },
  {
    title: 'I want to plan my changing station',
    description: 'Explore changing solutions if diaper changes and daily maintenance are your focus.',
    href: NURSERY_PATHS.changing,
    icon: 'calendar',
  },
];

export const NURSERY_NAVIGATOR_CARDS: GuideHubLink[] = [
  {
    title: 'Cribs & Bassinets',
    description: 'Safe sleep foundations including cribs, bassinets, and co-sleepers for the first year.',
    href: NURSERY_PATHS.cribs,
    icon: 'sleep',
    imageSrc: '/assets/nursery/cribs.png',
    imageAlt: 'Illustration representing cribs and bassinets.',
  },
  {
    title: 'Storage Solutions',
    description: 'Dressers, organizers, and storage systems that maximize nursery space and functionality.',
    href: NURSERY_PATHS.dressers,
    icon: 'storage',
    imageSrc: '/assets/nursery/storage.png',
    imageAlt: 'Illustration representing nursery storage solutions.',
  },
  {
    title: 'Changing Stations',
    description: 'Changing tables, pads, and diaper organization systems for efficient diaper changes.',
    href: NURSERY_PATHS.changing,
    icon: 'calendar',
    imageSrc: '/assets/nursery/changing.png',
    imageAlt: 'Illustration representing changing stations.',
  },
  {
    title: 'Sleep Setup',
    description: 'Mattresses, bedding, and sleep accessories that support safe and comfortable sleep.',
    href: NURSERY_PATHS.sleep,
    icon: 'sleep',
    imageSrc: '/assets/nursery/sleep.png',
    imageAlt: 'Illustration representing sleep setup items.',
  },
];

export const NURSERY_REALITY_CHECK_CARDS: NurseryRealityCheckCard[] = [
  {
    brand: 'DaVinci',
    productName: 'Emily 4-in-1 Convertible Crib',
    category: 'Cribs',
    review: 'At $300, the Emily convertible crib offers four different configurations from crib to bed. The sturdy construction and versatility make it an excellent value for parents planning for long-term use.',
    bestFor: 'Parents seeking a convertible crib that grows with their child and offers excellent value.',
    standout: '4-in-1 versatility at $300',
    pros: ['Four configurations', 'Sturdy construction', 'Excellent value', 'Grows with child'],
    imageUrl: '/assets/nursery/cribs.png',
    imageAlt: 'DaVinci Emily 4-in-1 Convertible Crib.',
  },
  {
    brand: 'South Shore',
    productName: 'Step One Platform Bed',
    category: 'Storage',
    review: 'At $250, this platform bed offers substantial under-bed storage while maintaining a clean, modern look. The combination of sleep and storage makes it perfect for maximizing small nursery spaces.',
    bestFor: 'Parents who need both sleep and storage solutions in limited nursery space.',
    standout: 'Dual function at $250',
    pros: ['Under-bed storage', 'Modern design', 'Space efficient', 'Sturdy construction'],
    imageUrl: '/assets/nursery/storage.png',
    imageAlt: 'South Shore Step One Platform Bed.',
  },
  {
    brand: 'Keekaroo',
    productName: 'Height Adjustable Changing Table',
    category: 'Changing',
    review: 'At $200, this height-adjustable changer offers safety features and convenient storage. The ability to adjust height as your child grows makes it a practical choice for long-term nursery use.',
    bestFor: 'Parents who want a changing solution that adapts to their growing child and changing needs.',
    standout: 'Height adjustable at $200',
    pros: ['Height adjustable', 'Safety features', 'Convenient storage', 'Grows with child'],
    imageUrl: '/assets/nursery/changing.png',
    imageAlt: 'Keekaroo Height Adjustable Changing Table.',
  },
];

const NURSERY_VISIBLE_TOC_MATCHES = [
  { match: 'Introduction', label: 'Introduction', level: 2 as const },
  { match: 'Nursery Planning', label: 'Nursery Planning', level: 2 as const },
  { match: 'Room Layout', label: 'Room Layout', level: 3 as const },
  { match: 'Safety Considerations', label: 'Safety', level: 2 as const },
  { match: 'FAQ', label: 'FAQ', level: 2 as const, id: 'guide-faq' },
  { match: 'Final Thoughts', label: 'Final Thoughts', level: 2 as const },
];

const NURSERY_REALITY_CHECKS: NurseryEditorialCallout[] = [
  {
    matchTitle: 'Why Nurseries Feel Overwhelming',
    text: 'Most parents do not create bad nurseries because they buy the wrong items. They create overwhelming nurseries because they prioritize appearance over the functional flow of feeding, changing, and sleep.',
    icon: 'strategy',
  },
  {
    matchTitle: 'Nursery Planning',
    text: 'Most families discover that room flow matters more than individual items. A well-planned nursery supports your routine rather than fighting against it.',
    icon: 'layers',
  },
  {
    matchTitle: 'Safety Considerations',
    text: 'A nursery can look beautiful and still contain safety hazards. The real test is whether it supports safe sleep, changing, and daily maintenance.',
    icon: 'shield',
  },
];

const NURSERY_EDITORIAL_IMAGES: any[] = [
  {
    matchTitle: 'Nursery Planning',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/nursery-planning.jpg',
    alt: 'Editorial placeholder image for nursery planning.',
    caption: 'Nursery planning becomes clearer once you understand how the room supports your daily routine.',
  },
];

export const NURSERY_DECISION_STRIPS: NurseryDecisionStrip[] = [
  {
    matchTitles: ['Cribs and bassinets', 'Cribs & Bassinets'],
    title: 'Best fit if you:',
    bullets: ['prioritize safe sleep', 'want long-term versatility', 'need multiple sleep options'],
    href: NURSERY_PATHS.cribs,
    ctaLabel: 'Explore cribs',
    icon: 'sleep',
  },
  {
    matchTitles: ['Storage solutions', 'Storage Solutions'],
    title: 'Best fit if you:',
    bullets: ['have limited space', 'want organization', 'need multi-functional furniture'],
    href: NURSERY_PATHS.dressers,
    ctaLabel: 'Explore storage',
    icon: 'storage',
  },
  {
    matchTitles: ['Changing stations', 'Changing Stations'],
    title: 'Best fit if you:',
    bullets: ['want efficient diaper changes', 'need storage for supplies', 'value safety features'],
    href: NURSERY_PATHS.changing,
    ctaLabel: 'Explore changing',
    icon: 'calendar',
  },
];