import 'server-only';

/**
 * Stripe is loaded through Node's native `require` at runtime (via `eval` so the
 * bundler never sees the specifier and leaves it entirely alone). The real
 * `stripe` package — a normal dependency in package.json — is resolved from
 * node_modules on the server dyno. This is deliberately opaque to Next's build
 * tracer: a statically-analysable import would get bundled and can fail to
 * resolve in the compiled server output, and it also lets the app type-check
 * where the package isn't installed. All Stripe access funnels through here so
 * the untyped surface stays contained.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStripe = any;

let cached: AnyStripe | null = null;

function loadStripeCtor(): AnyStripe {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
  const nodeRequire = eval('require') as (id: string) => AnyStripe;
  const mod: AnyStripe = nodeRequire('stripe');
  return mod?.default ?? mod;
}

export async function getStripe(): Promise<AnyStripe> {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  const StripeCtor = loadStripeCtor();
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
