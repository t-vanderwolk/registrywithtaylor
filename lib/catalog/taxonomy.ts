/**
 * Durable TMBC catalog taxonomy — how parents actually shop, not how the feed
 * labels things. Stored as strings on ProductEnrichment (flexible, no migration
 * churn when the taxonomy evolves); these constants are the canonical source.
 */

export const TMBC_CATEGORIES = [
  'Strollers',
  'Car Seats',
  'Travel Systems & Adapters',
  'Nursery',
  'Sleep',
  'Feeding',
  'Bath & Diapering',
  'Babywearing',
  'Travel',
  'Safety',
  'Postpartum',
  'Toys & Development',
  'Clothing & Soft Goods',
  'Gifts & Keepsakes',
  'Parent Gear',
  'Uncategorized / Needs Review',
] as const;
export type TmbcCategory = (typeof TMBC_CATEGORIES)[number];

export const UNCATEGORIZED: TmbcCategory = 'Uncategorized / Needs Review';

export const PARENT_JOURNEYS = [
  'Sleep',
  'Feeding',
  'Bath Time',
  'Getting Around',
  'Everyday Living',
  'Support',
  'Postpartum',
  'Travel',
  'Safety',
] as const;
export type ParentJourney = (typeof PARENT_JOURNEYS)[number];

export const PRODUCT_TYPES = [
  'full-size stroller',
  'compact stroller',
  'travel stroller',
  'jogging stroller',
  'single-to-double stroller',
  'double stroller',
  'wagon',
  'stroller accessory',
  'infant car seat',
  'convertible car seat',
  'rotating car seat',
  'all-in-one car seat',
  'booster seat',
  'car seat base',
  'infant car seat adapter',
  'stroller adapter',
  'second seat',
  'travel system',
  'bassinet',
  'travel crib',
  'playard',
  'crib',
  'mini crib',
  'crib mattress',
  'glider',
  'dresser',
  'changing pad',
  'baby monitor',
  'sound machine',
  'swaddle',
  'sleep sack',
  'bottle',
  'pacifier',
  'breast pump',
  'sterilizer',
  'bottle warmer',
  'high chair',
  'baby carrier',
  'wrap',
  'sling',
  'bath tub',
  'diaper pail',
  'diaper bag',
  'baby gate',
  'health/safety item',
  'toy',
  'book',
  'clothing',
  'blanket',
  'postpartum recovery item',
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

/** Default journey for a top-level category (a categorizer rule may override). */
export const CATEGORY_TO_JOURNEY: Record<string, ParentJourney> = {
  Strollers: 'Getting Around',
  'Car Seats': 'Getting Around',
  'Travel Systems & Adapters': 'Getting Around',
  Babywearing: 'Getting Around',
  Sleep: 'Sleep',
  Feeding: 'Feeding',
  'Bath & Diapering': 'Bath Time',
  Nursery: 'Everyday Living',
  Travel: 'Travel',
  Safety: 'Safety',
  Postpartum: 'Postpartum',
  'Toys & Development': 'Everyday Living',
  'Clothing & Soft Goods': 'Everyday Living',
  'Gifts & Keepsakes': 'Support',
  'Parent Gear': 'Everyday Living',
};
