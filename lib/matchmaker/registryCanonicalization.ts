/**
 * Babylist registry URL canonicalization — pure.
 *
 * Frozen contract:
 *  - decision 11: Babylist is the commerce layer. We open the exact reviewed
 *                 URL; we never scrape, duplicate, or recreate checkout.
 *  - decision 23: `registryCanonicalKey` is the real duplicate-enrollment guard,
 *                 so two spellings of the same registry MUST produce one key.
 *  - decision 24: failures are clean domain errors, never thrown exceptions and
 *                 never raw Prisma unique-constraint violations.
 *  - §22:         Babylist-host validation.
 *
 * Nothing here throws. Every failure path returns a typed result.
 *
 * ACCEPTED FORMS — V1 (Taylor's C1/C2 rulings, 2026-08-26)
 * -------------------------------------------------------
 * Exactly three, all evidence-backed, all one identity:
 *
 *     https://my.babylist.com/<slug>          (current live format)
 *     https://www.babylist.com/list/<slug>    (this app's own form placeholder)
 *     https://babylist.com/list/<slug>
 *
 *   ->  key          babylist:list:<slug>
 *   ->  canonicalUrl https://www.babylist.com/list/<slug>
 *
 * The standard applied here: accept what Babylist is known to use; reject what
 * we merely guessed it might use. `/registry/<slug>` and `/baby-<slug>` were
 * inferred during Step 1 with no contract, repo, or Babylist evidence behind
 * them, so V1 rejects them rather than silently treating them as registries.
 *
 * On `my.babylist.com` the rule is STRUCTURAL, not a word list: exactly one
 * non-empty path segment. A guessed denylist of "reserved" words would
 * eventually refuse a real family whose slug happened to collide with it.
 * A second segment is refused — `/<slug>/password` identifies a
 * password-protected registry's gate page, and V1 asks families to submit the
 * registry root instead.
 */

import { domainErr, domainOk, type DomainResult } from './types';

/** Hosts whose `/list/<slug>` path is a registry. */
export const BABYLIST_REGISTRY_HOSTS: readonly string[] = [
  'babylist.com',
  'www.babylist.com',
  'my.babylist.com',
];

/** The only host whose ROOT namespace is the registry namespace. */
export const BABYLIST_ROOT_SLUG_HOSTS: readonly string[] = ['my.babylist.com'];

/** V1 recognises a single registry identity namespace. */
export type BabylistRegistryFamily = 'list';

export const BABYLIST_REGISTRY_FAMILY: BabylistRegistryFamily = 'list';

export type RegistryCanonicalizationErrorCode =
  | 'EMPTY_URL'
  | 'MALFORMED_URL'
  | 'UNSUPPORTED_SCHEME'
  | 'UNSUPPORTED_DOMAIN'
  | 'UNRECOGNISED_REGISTRY_PATH';

export type CanonicalRegistry = {
  /** Stable dedupe key persisted to `MatchmakerProfile.registryCanonicalKey`. */
  readonly canonicalKey: string;
  /** Normalised URL safe to link to. */
  readonly canonicalUrl: string;
  /** The registry's Babylist slug. */
  readonly slug: string;
  /** Which registry namespace the slug lives in. */
  readonly family: BabylistRegistryFamily;
};

export type RegistryCanonicalizationResult = DomainResult<
  CanonicalRegistry,
  RegistryCanonicalizationErrorCode
>;

/**
 * The one lexical constraint that remains, and it is evidence-backed on both
 * sides. Babylist's Help Center states that customized registry URLs use
 * lowercase letters and cannot contain special characters; live registries show
 * digits and internal hyphens do occur in practice.
 *
 * So: lowercase letters and digits, internal hyphens allowed, no leading or
 * trailing hyphen, and no periods, underscores, or percent-encoded segments.
 */
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/** `www.babylist.com/list/<slug>` and `babylist.com/list/<slug>`. */
const LIST_PATH_PATTERN = /^\/list\/([^/]+)$/;

function accept(slug: string): RegistryCanonicalizationResult {
  return domainOk({
    canonicalKey: `babylist:${BABYLIST_REGISTRY_FAMILY}:${slug}`,
    canonicalUrl: `https://www.babylist.com/list/${slug}`,
    slug,
    family: BABYLIST_REGISTRY_FAMILY,
  });
}

function unrecognised(): RegistryCanonicalizationResult {
  return domainErr(
    'UNRECOGNISED_REGISTRY_PATH',
    'That Babylist link does not look like a registry. Please paste the registry page URL.',
  );
}

export function canonicalizeBabylistRegistryUrl(
  input: string | null | undefined,
): RegistryCanonicalizationResult {
  const raw = typeof input === 'string' ? input.trim() : '';

  if (!raw) {
    return domainErr('EMPTY_URL', 'A Babylist registry URL is required.');
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return domainErr('MALFORMED_URL', 'That does not look like a valid web address.');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return domainErr('UNSUPPORTED_SCHEME', 'A registry URL must be an http or https address.');
  }

  const hostname = parsed.hostname.trim().toLowerCase();
  if (!BABYLIST_REGISTRY_HOSTS.includes(hostname)) {
    return domainErr('UNSUPPORTED_DOMAIN', 'Only Babylist registry links are accepted.');
  }

  // Drop query string and fragment entirely: this is where tracking parameters
  // (utm_*, srsltid, gclid, referral codes) live, and none of them identify the
  // registry.
  let pathname = parsed.pathname.toLowerCase();
  while (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  if (BABYLIST_ROOT_SLUG_HOSTS.includes(hostname)) {
    // Structural rule: exactly one non-empty segment.
    const segments = pathname.split('/').filter((segment) => segment.length > 0);
    if (segments.length !== 1) return unrecognised();

    const slug = segments[0] as string;
    return SLUG_PATTERN.test(slug) ? accept(slug) : unrecognised();
  }

  const match = LIST_PATH_PATTERN.exec(pathname);
  const slug = match?.[1];
  if (slug && SLUG_PATTERN.test(slug)) {
    return accept(slug);
  }

  return unrecognised();
}

/** Convenience: the key alone, or null when the URL is not a valid registry. */
export function babylistRegistryCanonicalKey(input: string | null | undefined): string | null {
  const result = canonicalizeBabylistRegistryUrl(input);
  return result.ok ? result.value.canonicalKey : null;
}

/** True when two registry URLs denote the same registry. */
export function isSameBabylistRegistry(a: string, b: string): boolean {
  const keyA = babylistRegistryCanonicalKey(a);
  const keyB = babylistRegistryCanonicalKey(b);
  return keyA !== null && keyA === keyB;
}
