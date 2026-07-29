import 'server-only';

/**
 * Stripe is loaded via a runtime dynamic import with a non-literal specifier.
 * That keeps type-checking/bundling from statically resolving it (so the app
 * builds even where the package isn't installed), while Node resolves the real
 * `stripe` package at runtime on the server. All Stripe access is funneled
 * through here so the untyped surface stays contained.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStripe = any;

let cached: AnyStripe | null = null;

async function loadStripeCtor(): Promise<AnyStripe> {
  const spec = 'stripe' as string; // non-literal on purpose — see file header
  const mod: AnyStripe = await import(spec);
  return mod?.default ?? mod;
}

export async function getStripe(): Promise<AnyStripe> {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  const StripeCtor = await loadStripeCtor();
  cached = new StripeCtor(key);
  return cached;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
  }
  return secret;
}
