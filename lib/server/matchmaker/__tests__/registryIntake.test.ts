import { describe, expect, it } from 'vitest';

import {
  classifyUniqueTarget,
  isMatchmakerServiceError,
  MatchmakerServiceError,
  translatePrismaError,
} from '../errors';
import { requireCanonicalRegistry, resolveRegistryIdentity } from '../registryIntake';
import { createInMemoryRepo, emptyState, prismaUniqueViolation } from './inMemoryRepo';

const USER = 'user_a';
const OTHER = 'user_b';

async function code(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
    return 'NO_ERROR';
  } catch (error) {
    return isMatchmakerServiceError(error) ? error.code : `UNEXPECTED:${String(error)}`;
  }
}

describe('registry intake — equivalent URLs resolve to one identity', () => {
  it('all three accepted forms produce the same canonical key', () => {
    const keys = [
      'https://my.babylist.com/rivera',
      'https://www.babylist.com/list/rivera',
      'https://babylist.com/list/rivera',
    ].map((u) => requireCanonicalRegistry(u).canonicalKey);
    expect(new Set(keys)).toEqual(new Set(['babylist:list:rivera']));
  });

  it('reuses one Registry row across equivalent spellings', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);

    const first = await resolveRegistryIdentity(repo, {
      userId: USER, submittedUrl: 'https://my.babylist.com/rivera',
    });
    const second = await resolveRegistryIdentity(repo, {
      userId: USER, submittedUrl: 'https://www.babylist.com/list/rivera?utm_source=x',
    });

    expect(second.registry.id).toBe(first.registry.id);
    expect(state.registries).toHaveLength(1);
    expect(state.registries[0]?.url).toBe('https://www.babylist.com/list/rivera');
  });

  it('normalises the stored Registry url onto the canonical form', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    const identity = await resolveRegistryIdentity(repo, {
      userId: USER, submittedUrl: 'http://MY.BABYLIST.COM/rivera/?gclid=abc',
    });
    expect(identity.registry.url).toBe('https://www.babylist.com/list/rivera');
    expect(identity.canonical.canonicalKey).toBe('babylist:list:rivera');
  });

  it('different registries get different Registry rows', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    await resolveRegistryIdentity(repo, { userId: USER, submittedUrl: 'https://my.babylist.com/rivera' });
    await resolveRegistryIdentity(repo, { userId: USER, submittedUrl: 'https://my.babylist.com/okafor' });
    expect(state.registries).toHaveLength(2);
  });
});

describe('registry intake — bad URLs fail BEFORE persistence', () => {
  it('malformed URLs never touch the store', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    for (const url of ['not a url', '', '   ', 'https://', '%%%', null, undefined]) {
      const result = await code(() =>
        resolveRegistryIdentity(repo, { userId: USER, submittedUrl: url }),
      );
      expect(['REGISTRY_URL_REQUIRED', 'REGISTRY_URL_INVALID']).toContain(result);
    }
    expect(state.registries).toHaveLength(0);
    expect(state.profiles).toHaveLength(0);
  });

  it('unsupported registry URLs never touch the store', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    for (const url of [
      'https://www.amazon.com/list/rivera',
      'https://www.babylist.com/rivera',
      'https://www.babylist.com/registry/rivera',
      'https://www.babylist.com/baby-rivera',
      'https://my.babylist.com/rivera/password',
      'https://www.babylist.com/store/strollers',
      'https://shop.babylist.com/list/rivera',
    ]) {
      expect(await code(() =>
        resolveRegistryIdentity(repo, { userId: USER, submittedUrl: url }),
      )).toBe('REGISTRY_URL_INVALID');
    }
    expect(state.registries).toHaveLength(0);
    expect(state.profiles).toHaveLength(0);
  });

  it('carries the canonicalizer code as detail for logs', () => {
    try {
      requireCanonicalRegistry('https://www.amazon.com/x');
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(MatchmakerServiceError);
      expect((error as MatchmakerServiceError).detail).toBe('UNSUPPORTED_DOMAIN');
    }
  });
});

describe('registry intake — another account already enrolled it', () => {
  it('returns REGISTRY_ALREADY_ENROLLED rather than attempting a second profile', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);

    const mine = await resolveRegistryIdentity(repo, {
      userId: OTHER, submittedUrl: 'https://my.babylist.com/rivera',
    });
    await repo.createProfile({
      userId: OTHER, registryId: mine.registry.id,
      registryCanonicalKey: mine.canonical.canonicalKey,
      publicSlug: 'rivera-1', status: 'DRAFT', entryMethod: 'GIFTED_FIRST',
      displayFirstName: 'Rae', displayLastInitial: null, city: null, state: null,
      dueMonth: null, dueYear: null, familyStage: null, shortStory: 'story',
      priorityNeeds: [], showLastInitial: false, showLocation: false,
      showDueMonth: false, showFamilyStage: false, showPhoto: false, photoMediaId: null,
    });

    expect(await code(() =>
      resolveRegistryIdentity(repo, { userId: USER, submittedUrl: 'https://www.babylist.com/list/rivera' }),
    )).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(state.profiles).toHaveLength(1);
  });
});

describe('registry intake — Prisma conflicts become stable service errors', () => {
  it('maps P2002 on registryCanonicalKey', () => {
    try {
      translatePrismaError(prismaUniqueViolation('MatchmakerProfile_registryCanonicalKey_key'));
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(isMatchmakerServiceError(error)).toBe(true);
      expect((error as MatchmakerServiceError).code).toBe('REGISTRY_ALREADY_ENROLLED');
    }
  });

  it('maps P2002 on registryId and publicSlug', () => {
    const grab = (t: string) => {
      try { translatePrismaError(prismaUniqueViolation(t)); return 'NO_ERROR'; }
      catch (e) { return (e as MatchmakerServiceError).code; }
    };
    expect(grab('MatchmakerProfile_registryId_key')).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(grab('MatchmakerProfile_publicSlug_key')).toBe('PUBLIC_SLUG_UNAVAILABLE');
    expect(grab('registryCanonicalKey')).toBe('REGISTRY_ALREADY_ENROLLED');
  });

  it('never lets a raw Prisma error escape as a user-facing message', () => {
    try {
      translatePrismaError(prismaUniqueViolation('MatchmakerProfile_registryCanonicalKey_key'));
    } catch (error) {
      const message = (error as Error).message;
      expect(message).not.toContain('Unique constraint');
      expect(message).not.toContain('P2002');
      expect(message).not.toContain('Prisma');
    }
  });

  it('rethrows unrecognised infrastructure faults unchanged', () => {
    const boom = new Error('connection reset');
    expect(() => translatePrismaError(boom)).toThrow(boom);
  });

  it('maps P2025 to a stable concurrency error', () => {
    const err = new Error('record not found');
    err.name = 'PrismaClientKnownRequestError';
    Object.assign(err, { code: 'P2025' });
    try { translatePrismaError(err); }
    catch (e) { expect((e as MatchmakerServiceError).code).toBe('CONCURRENT_MODIFICATION'); }
  });
});

/* ================================================================== *
 * Hardening requirement 5 — constraint-aware P2002 translation
 * ================================================================== */

describe('unique-conflict translation is field-aware', () => {
  const grab = (target: string) => {
    try { translatePrismaError(prismaUniqueViolation(target)); return 'NO_ERROR'; }
    catch (e) { return (e as MatchmakerServiceError).code; }
  };

  it('registryCanonicalKey conflicts mean the registry is already enrolled', () => {
    expect(grab('MatchmakerProfile_registryCanonicalKey_key')).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(grab('registryCanonicalKey')).toBe('REGISTRY_ALREADY_ENROLLED');
  });

  it('registryId conflicts mean the registry is already enrolled', () => {
    expect(grab('MatchmakerProfile_registryId_key')).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(grab('registryId')).toBe('REGISTRY_ALREADY_ENROLLED');
  });

  it('a publicSlug conflict is NOT an already-enrolled registry', () => {
    expect(grab('MatchmakerProfile_publicSlug_key')).not.toBe('REGISTRY_ALREADY_ENROLLED');
    expect(grab('MatchmakerProfile_publicSlug_key')).toBe('PUBLIC_SLUG_UNAVAILABLE');
    expect(grab('publicSlug')).toBe('PUBLIC_SLUG_UNAVAILABLE');
  });

  it('an unknown unique target becomes a generic persistence conflict', () => {
    for (const target of ['SomeOtherTable_someField_key', 'admissionInviteId', 'unheard_of']) {
      const result = grab(target);
      expect(result).toBe('PERSISTENCE_CONFLICT');
      expect(result).not.toBe('REGISTRY_ALREADY_ENROLLED');
    }
  });

  it('classification is explicit and ordered, not a catch-all', () => {
    expect(classifyUniqueTarget(['MatchmakerProfile_publicSlug_key'])).toBe('PUBLIC_SLUG_UNAVAILABLE');
    expect(classifyUniqueTarget(['registryCanonicalKey'])).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(classifyUniqueTarget(['registryId'])).toBe('REGISTRY_ALREADY_ENROLLED');
    expect(classifyUniqueTarget(['nothing_recognised'])).toBeNull();
    expect(classifyUniqueTarget([])).toBeNull();
  });

  it('no raw Prisma text, code, or index name escapes in any branch', () => {
    for (const target of [
      'MatchmakerProfile_registryCanonicalKey_key',
      'MatchmakerProfile_registryId_key',
      'MatchmakerProfile_publicSlug_key',
      'SomeOtherTable_someField_key',
    ]) {
      try { translatePrismaError(prismaUniqueViolation(target)); }
      catch (e) {
        const message = (e as Error).message;
        expect(message).not.toContain('Unique constraint');
        expect(message).not.toContain('P2002');
        expect(message).not.toContain('Prisma');
        expect(message).not.toContain(target);
      }
    }
  });
});
