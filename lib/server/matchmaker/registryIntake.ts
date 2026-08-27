/**
 * Registry intake and identity resolution — the trusted server side of
 * "which registry is this, and is it already enrolled?".
 *
 * Frozen contract:
 *  - decision 11: Babylist is the commerce layer; we keep the exact reviewed URL.
 *  - decision 23: a re-application whose registry canonicalizes to an existing
 *                 `registryCanonicalKey` REVIVES that profile; a second profile
 *                 for the same canonical registry is never inserted.
 *  - decision 24: duplicate-registry conflicts are clean domain errors.
 *
 * Canonicalization is delegated wholly to the Step 1 pure canonicalizer, so the
 * approved forms are exactly `my.babylist.com/<slug>`, `babylist.com/list/<slug>`
 * and `www.babylist.com/list/<slug>`. Nothing here re-implements URL parsing.
 */

import {
  babylistRegistryCanonicalKey,
  canonicalizeBabylistRegistryUrl,
  type CanonicalRegistry,
} from '@/lib/matchmaker/registryCanonicalization';

import { matchmakerError } from './errors';
import type { MatchmakerRepo, StoredProfile, StoredRegistry } from './ports';

/** Canonicalize a submitted URL, or fail before any persistence happens. */
export function requireCanonicalRegistry(submittedUrl: unknown): CanonicalRegistry {
  if (typeof submittedUrl !== 'string' || submittedUrl.trim().length === 0) {
    throw matchmakerError('REGISTRY_URL_REQUIRED');
  }

  const result = canonicalizeBabylistRegistryUrl(submittedUrl);
  if (!result.ok) {
    // The canonicalizer's own code travels as `detail` for logs and admin view.
    throw matchmakerError(
      result.code === 'EMPTY_URL' ? 'REGISTRY_URL_REQUIRED' : 'REGISTRY_URL_INVALID',
      result.code,
    );
  }

  return result.value;
}

export type RegistryIdentity = {
  readonly canonical: CanonicalRegistry;
  readonly registry: StoredRegistry;
  /** The profile already enrolled on this canonical registry, if any. */
  readonly existingProfile: StoredProfile | null;
};

function ownsProfile(profile: StoredProfile, userId: string): boolean {
  return profile.userId === userId || profile.registryUserId === userId;
}

/**
 * Resolves the submitted URL to (a) its canonical identity, (b) the user's
 * `Registry` row — reusing one whose URL canonicalizes to the same key rather
 * than creating a near-duplicate — and (c) any profile already enrolled on it.
 *
 * Throws REGISTRY_ALREADY_ENROLLED when the canonical registry belongs to a
 * different account, so a second profile can never be attempted.
 */
export async function resolveRegistryIdentity(
  repo: MatchmakerRepo,
  input: { readonly userId: string; readonly submittedUrl: unknown; readonly registryName?: string | null },
): Promise<RegistryIdentity> {
  const canonical = requireCanonicalRegistry(input.submittedUrl);

  const existingProfile = await repo.findProfileByCanonicalKey(canonical.canonicalKey);
  if (existingProfile && !ownsProfile(existingProfile, input.userId)) {
    throw matchmakerError('REGISTRY_ALREADY_ENROLLED', canonical.canonicalKey);
  }

  if (existingProfile) {
    const registry = await repo.findRegistryById(existingProfile.registryId);
    if (!registry) throw matchmakerError('PROFILE_NOT_FOUND', 'registry-missing');

    // Keep the stored URL on the canonical form without disturbing anything else.
    const registryOnCanonicalUrl =
      registry.url === canonical.canonicalUrl
        ? registry
        : await repo.updateRegistryUrl(registry.id, canonical.canonicalUrl);

    return { canonical, registry: registryOnCanonicalUrl, existingProfile };
  }

  const owned = await repo.listRegistriesForUser(input.userId);
  const alreadyOwned = owned.find(
    (r) => babylistRegistryCanonicalKey(r.url) === canonical.canonicalKey,
  );

  if (alreadyOwned) {
    const registry =
      alreadyOwned.url === canonical.canonicalUrl
        ? alreadyOwned
        : await repo.updateRegistryUrl(alreadyOwned.id, canonical.canonicalUrl);
    return { canonical, registry, existingProfile: null };
  }

  const registry = await repo.createRegistry({
    userId: input.userId,
    url: canonical.canonicalUrl,
    name: typeof input.registryName === 'string' && input.registryName.trim()
      ? input.registryName.trim()
      : null,
  });

  return { canonical, registry, existingProfile: null };
}
