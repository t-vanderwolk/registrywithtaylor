import type { ChecklistType } from './data';

/**
 * Path-based SEO variants of the Baby Registry Checklist.
 *
 * The tool is one interactive page, but Girl / Boy / Twins each have distinct
 * search demand ("baby girl registry checklist", "twins registry checklist",
 * "what do I need for twins"). Serving them at their own path with a
 * self-referencing canonical, unique title/description/H1, and variant-specific
 * server-rendered copy lets each one be indexed independently instead of
 * collapsing into the neutral base page.
 *
 * Neutral stays at the base path (/resources/baby-checklist); only girl/boy/twins
 * get their own /resources/baby-checklist/<slug> route.
 */
export type VariantSlug = 'girl' | 'boy' | 'twins';

export const VARIANT_SLUGS: VariantSlug[] = ['girl', 'boy', 'twins'];

export const isVariantSlug = (value: string): value is VariantSlug =>
  (VARIANT_SLUGS as string[]).includes(value);

/** Canonical path for a given checklist version (neutral → base path). */
export const pathForType = (type: ChecklistType): string =>
  type === 'neutral' ? '/resources/baby-checklist' : `/resources/baby-checklist/${type}`;

export type VariantMeta = {
  type: ChecklistType;
  slug: VariantSlug;
  /** <title> */
  title: string;
  /** Meta description */
  description: string;
  /** Visible H1 (server-rendered) */
  h1: string;
  /** Short bolded tagline under the H1 */
  tagline: string;
  /** Longer intro paragraph — variant-specific to avoid thin/duplicate content */
  intro: string;
  eyebrow: string;
  keywords: string[];
  imageAlt: string;
  /** Breadcrumb label for this variant (visual + BreadcrumbList schema). */
  breadcrumbLabel: string;
  /** Visible, on-page FAQ — also emitted as FAQPage schema for AI/PAA. */
  faqs: { q: string; a: string }[];
};

/** Shared FAQ entries that appear on the girl and boy variants. */
const generalFaqs = (versionLabel: string): { q: string; a: string }[] => [
  {
    q: `Is the ${versionLabel} checklist different from the neutral one?`,
    a: 'The core gear is identical across every version. The difference is in styling suggestions, like nursery palette and clothing tone notes, tailored to a girl, boy, neutral, or twins theme.',
  },
  {
    q: 'What should I register for differently for a baby girl vs. a baby boy?',
    a: 'Almost nothing on the essentials list changes by gender. The real differences are aesthetic, like clothing colors and nursery palette, which is why this checklist keeps the same gear list but adjusts the style notes per version.',
  },
  {
    q: 'Can I switch between the girl, boy, and twins checklist after I start?',
    a: 'Yes. Your checked-off progress is tied to your session, and you can switch between Girl, Boy, Neutral, and Twins versions at any point while planning.',
  },
  {
    q: 'Is this checklist tool free for all versions (girl, boy, neutral, twins)?',
    a: 'Yes. All four versions are completely free to use, save progress on, and print or save as a PDF.',
  },
];

export const VARIANTS: Record<VariantSlug, VariantMeta> = {
  girl: {
    type: 'girl',
    slug: 'girl',
    title: 'Baby Girl Registry Checklist 2026 | Interactive Tool by a Registry Expert',
    description:
      "Free interactive baby girl registry checklist — check off items, save your progress, and get Taylor's expert picks with girl-specific nursery and styling guidance.",
    h1: 'Free Baby Girl Registry Checklist: Build Yours in Minutes',
    tagline: 'Check it off, save your progress, make it yours.',
    intro:
      'A calm, editorial baby girl registry checklist you can personalize and save — organized by how you actually plan. The core gear is the same essentials every newborn needs; the girl version adds nursery-palette and clothing-tone notes so the styling suggestions fit a baby girl, without padding the list with things you do not need.',
    eyebrow: 'Free Planning Tool',
    keywords: [
      'baby girl registry checklist',
      'baby girl checklist essentials',
      'girl nursery registry ideas',
      'newborn essentials checklist',
    ],
    imageAlt: 'Taylor-Made Baby Co. baby girl registry checklist',
    breadcrumbLabel: 'Baby Girl Checklist',
    faqs: generalFaqs('baby girl'),
  },
  boy: {
    type: 'boy',
    slug: 'boy',
    title: 'Baby Boy Registry Checklist 2026 | Interactive Tool by a Registry Expert',
    description:
      "Free interactive baby boy registry checklist — check off items, save your progress, and get Taylor's expert picks with boy-specific nursery and styling guidance.",
    h1: 'Free Baby Boy Registry Checklist: Build Yours in Minutes',
    tagline: 'Check it off, save your progress, make it yours.',
    intro:
      'A calm, editorial baby boy registry checklist you can personalize and save — organized by how you actually plan. The core gear is the same essentials every newborn needs; the boy version adds nursery-palette and clothing-tone notes so the styling suggestions fit a baby boy, without padding the list with things you do not need.',
    eyebrow: 'Free Planning Tool',
    keywords: [
      'baby boy registry checklist',
      'baby boy checklist essentials',
      'boy nursery registry ideas',
      'newborn essentials checklist',
    ],
    imageAlt: 'Taylor-Made Baby Co. baby boy registry checklist',
    breadcrumbLabel: 'Baby Boy Checklist',
    faqs: generalFaqs('baby boy'),
  },
  twins: {
    type: 'twins',
    slug: 'twins',
    title: 'Twins Registry Checklist 2026 | Interactive Tool by a Registry Expert',
    description:
      "Free interactive twins registry checklist — built for two from the start, with quantity guidance, twin-specific gear picks, and Taylor's expert take on what you really need double of.",
    h1: 'Free Twins Registry Checklist: Built for Two From the Start',
    tagline: 'Built for two — with clear guidance on what actually doubles.',
    intro:
      'A twins registry checklist built for two from day one — with quantity guidance so you know what really needs to double (sleep, feeding, car seats) and what stays shared (nursery setup, play mat, changing table). Twin pregnancies more often arrive early and more items are essential immediately, so starting in the early second trimester gives you real buffer.',
    eyebrow: 'Free Planning Tool',
    keywords: [
      'twins registry checklist',
      'twin baby registry essentials',
      'what do I need for twins',
      'how to register for twins',
      'double stroller for twins registry',
    ],
    imageAlt: 'Taylor-Made Baby Co. twins registry checklist',
    breadcrumbLabel: 'Twins Checklist',
    faqs: [
      {
        q: 'What do twins need two of on a baby registry?',
        a: 'Twins typically need two of every core sleep and feeding item, including two cribs or bassinets, two car seats, and doubled bottles and burp cloths. A double stroller is usually the one exception, replacing two single strollers rather than adding to the list.',
      },
      {
        q: 'Do twins need a double stroller or two single strollers?',
        a: "Most families with twins find a double stroller more practical day-to-day, though the right choice depends on your vehicle's trunk size, your home's doorways, and whether your twins will be on different schedules early on.",
      },
      {
        q: 'How much more expensive is a twins registry than a single-baby registry?',
        a: 'Not everything doubles. Big shared items like a nursery setup or a play mat can stay the same, while sleep, feeding, and car-seat items typically need to be doubled. Planning by category rather than assuming a flat 2x increase on the whole registry keeps costs more predictable.',
      },
      {
        q: 'When should I start a twins registry compared to a single-baby registry?',
        a: 'Earlier is better with twins, since more items are essential from day one and twin pregnancies more often arrive ahead of the due date. Starting in the early second trimester gives more buffer than the general recommendation for a single baby.',
      },
      {
        q: 'Can I switch between the girl, boy, and twins checklist after I start?',
        a: 'Yes. Your checked-off progress is tied to your session, and you can switch between Girl, Boy, Neutral, and Twins versions at any point while planning.',
      },
      {
        q: 'Is this checklist tool free for all versions (girl, boy, neutral, twins)?',
        a: 'Yes. All four versions are completely free to use, save progress on, and print or save as a PDF.',
      },
    ],
  },
};

/**
 * Twins-only "what actually doubles" guidance — a genuinely unique, extractable
 * block (the strongest AI-Overview opportunity of the three variants). Rendered
 * only on the twins page.
 */
export const TWINS_QUANTITY_GUIDANCE: {
  heading: string;
  intro: string;
  columns: { title: string; note: string; items: string[] }[];
} = {
  heading: 'What Twins Actually Need Two Of (and What Stays Shared)',
  intro:
    'The biggest twins-registry mistake is assuming everything doubles. It does not. Plan by category: the items each baby uses at the same time need their own, while anything used one-at-a-time or set up once in the room can stay shared.',
  columns: [
    {
      title: 'Buy two',
      note: 'Used by both babies at the same time.',
      items: [
        'Car seats (one per baby — the non-negotiable)',
        'Sleep space (two bassinets or cribs)',
        'Bottles and bottle parts',
        'Swaddles, sleep sacks, and burp cloths',
      ],
    },
    {
      title: 'Keep shared',
      note: 'Used one at a time or set up once.',
      items: [
        'Changing table and dresser',
        'Play mat and activity gym',
        'Bathtub and grooming kit',
        'Nursery furniture and décor',
      ],
    },
    {
      title: "Taylor's take",
      note: 'The judgment calls twins parents ask about most.',
      items: [
        'One double stroller replaces two singles for most families',
        'A twin-feeding pillow is worth it if you plan to tandem-feed',
        'Two of the same monitor camera, one base',
        'Start early — twins arrive sooner and need more from day one',
      ],
    },
  ],
};
