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
};

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
  },
};
