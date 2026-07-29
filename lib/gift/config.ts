import { SITE_URL } from '@/lib/marketing/metadata';

/** The Registry Consult price in cents. Gifts are the same $75 as self-booking. */
export const GIFT_AMOUNT_CENTS = 7500;
export const GIFT_CURRENCY = 'usd';
export const GIFT_PRODUCT_NAME = 'Registry Consult — Gift';
export const GIFT_PRODUCT_DESCRIPTION =
  'A prepaid 1-hour virtual Registry Consult with Taylor-Made Baby Co., gifted to someone special.';

/** Absolute site origin (no trailing slash) for building Stripe redirect + links. */
export const GIFT_SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, '');

/**
 * The Calendly event the recipient books after redeeming — a NO-PAYMENT
 * "Prepaid Registry Consult" event. Only revealed after a valid code, so it
 * stays effectively unlisted. Falls back to the paid event if unset (so the
 * flow never dead-ends), but set NEXT_PUBLIC_CALENDLY_PREPAID_URL in prod.
 */
export const CALENDLY_PREPAID_URL =
  process.env.NEXT_PUBLIC_CALENDLY_PREPAID_URL ||
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/registrywithtaylor/30min';

export const giftAmountLabel = () => `$${(GIFT_AMOUNT_CENTS / 100).toFixed(0)}`;
