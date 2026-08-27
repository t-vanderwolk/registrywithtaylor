import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { PROFILE_STATUSES } from '@/lib/matchmaker/profileStatus';

import {
  canRevive,
  consentIsComplete,
  ENTRY_METHODS,
  materialPublicChange,
  normaliseApplicationDraft,
  recordConsent,
  saveApplicationDraft,
  submitApplication,
} from '../applicationService';
import { isMatchmakerServiceError, type MatchmakerServiceError } from '../errors';
import { createTestContext, emptyState, forceStatus, type InMemoryState } from './inMemoryRepo';

const USER = 'user_a';
const URL_MY = 'https://my.babylist.com/rivera';
const URL_LIST = 'https://www.babylist.com/list/rivera';
const URL_APEX = 'https://babylist.com/list/rivera';

const DRAFT = {
  displayFirstName: 'Ana',
  displayLastInitial: 'Rivera',
  city: 'Scottsdale',
  state: 'AZ',
  dueMonth: 11,
  dueYear: 2026,
  familyStage: 'First baby',
  shortStory: 'We are getting ready for our first baby.',
  priorityNeeds: ['Car seat', 'Bottles'],
};

/** Synthetic only. There is no published Matchmaker terms version yet. */
const TERMS_V1 = 'test-terms-v1';
const TERMS_V2 = 'test-terms-v2';

const CONSENT = {
  acceptTerms: true,
  termsVersion: TERMS_V1,
  consentToPublicProfile: true,
};

async function code(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); return 'NO_ERROR'; }
  catch (error) {
    return isMatchmakerServiceError(error) ? error.code : `UNEXPECTED:${String(error)}`;
  }
}

async function seedSubmittable(state: InMemoryState) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
  });
  await recordConsent(ctx, { userId: USER, profileId: profile.id, consent: CONSENT });
  return { ctx, profileId: profile.id };
}

describe('application service — one identity, no duplicates', () => {
  it('my.babylist.com and babylist.com/list cannot create two profiles', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);

    const a = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    const b = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_APEX, draft: DRAFT });
    const c = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_LIST, draft: DRAFT });

    expect(b.id).toBe(a.id);
    expect(c.id).toBe(a.id);
    expect(state.profiles).toHaveLength(1);
    expect(state.registries).toHaveLength(1);
  });

  it('tracking parameters do not create a second identity', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: `${URL_LIST}?utm_source=ig&gclid=1`, draft: DRAFT,
    });
    expect(state.profiles).toHaveLength(1);
  });

  it('a bad URL creates nothing', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: 'https://www.babylist.com/baby-rivera', draft: DRAFT,
    }))).toBe('REGISTRY_URL_INVALID');
    expect(state.profiles).toHaveLength(0);
    expect(state.registries).toHaveLength(0);
  });

  it('a new application starts in DRAFT', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    expect(p.status).toBe('DRAFT');
  });
});

describe('application service — reapplication revives, never duplicates', () => {
  it('revives an ARCHIVED profile in place, preserving its id and history', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const original = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    await recordConsent(ctx, { userId: USER, profileId: original.id, consent: CONSENT });
    forceStatus(state, original.id, 'ARCHIVED');

    const revived = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_LIST,
      draft: { ...DRAFT, shortStory: 'Updated story for this year.' },
    });

    expect(revived.id).toBe(original.id);
    expect(state.profiles).toHaveLength(1);
    expect(revived.shortStory).toBe('Updated story for this year.');
    expect(revived.publicSlug).toBe(original.publicSlug);

    // Terms acceptance survives revival; consent to the CHANGED public profile
    // does not, so the family re-approves what will actually be published.
    expect(revived.termsAcceptedAt).not.toBeNull();
    expect(revived.publicProfileConsentAt).toBeNull();
    expect(await code(() => submitApplication(ctx, {
      userId: USER, profileId: original.id, requiredTermsVersion: TERMS_V1,
    }))).toBe('PUBLIC_PROFILE_CONSENT_REQUIRED');

    await recordConsent(ctx, { userId: USER, profileId: original.id, consent: CONSENT });
    const resubmitted = await submitApplication(ctx, { userId: USER, profileId: original.id, requiredTermsVersion: TERMS_V1 });
    expect(resubmitted.status).toBe('SUBMITTED');
  });

  it('revivable statuses come from the Step 1 table, not a hard-coded list', () => {
    const revivable = PROFILE_STATUSES.filter(canRevive);
    expect([...revivable].sort()).toEqual(['ARCHIVED', 'DRAFT', 'NEEDS_INFO', 'REJECTED']);
    for (const s of ['LIVE', 'PAUSED', 'UNDER_REVIEW', 'APPROVED', 'REMOVED', 'SUBMITTED'] as const) {
      expect(canRevive(s)).toBe(false);
    }
  });

  it('a REMOVED profile cannot be self-revived', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    forceStatus(state, profileId, 'REMOVED');
    expect(await code(() => submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 })))
      .toBe('PROFILE_NOT_REVIVABLE');
    expect(state.profiles[0]?.status).toBe('REMOVED');
  });

  it('another account cannot submit someone else’s profile', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    expect(await code(() => submitApplication(ctx, { userId: 'intruder', profileId, requiredTermsVersion: TERMS_V1 })))
      .toBe('NOT_PROFILE_OWNER');
  });
});

describe('application service — privacy flags', () => {
  it('default to false when unspecified', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    expect(p.showLastInitial).toBe(false);
    expect(p.showLocation).toBe(false);
    expect(p.showDueMonth).toBe(false);
    expect(p.showFamilyStage).toBe(false);
    expect(p.showPhoto).toBe(false);
  });

  it('only literal true enables a flag — truthy values do not', () => {
    const truthy = normaliseApplicationDraft({
      ...DRAFT,
      showLocation: 'yes' as unknown as boolean,
      showPhoto: 1 as unknown as boolean,
      showDueMonth: 'true' as unknown as boolean,
    });
    expect(truthy.showLocation).toBe(false);
    expect(truthy.showPhoto).toBe(false);
    expect(truthy.showDueMonth).toBe(false);
  });

  it('explicit true persists correctly', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY,
      draft: { ...DRAFT, showLastInitial: true, showLocation: true, showDueMonth: true, showFamilyStage: true },
    });
    expect(p.showLastInitial).toBe(true);
    expect(p.showLocation).toBe(true);
    expect(p.showDueMonth).toBe(true);
    expect(p.showFamilyStage).toBe(true);
    expect(p.displayLastInitial).toBe('R');
  });

  it('rejects a photo whose Media row does not exist', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY,
      draft: { ...DRAFT, showPhoto: true, photoMediaId: 'missing' },
    }))).toBe('PHOTO_MEDIA_NOT_FOUND');
  });

  it('the intake surface collects no sensitive field', () => {
    const normalised = normaliseApplicationDraft({
      ...DRAFT,
      income: 40000, phone: '555', address: '1 Main St', hospital: 'General',
      medicalNotes: 'x', employer: 'Acme', childName: 'Baby', hardship: 'essay',
    } as never);
    for (const banned of ['income', 'phone', 'address', 'hospital', 'medicalNotes', 'employer', 'childName', 'hardship']) {
      expect(Object.keys(normalised)).not.toContain(banned);
    }
  });
});

describe('application service — explicit, versioned consent', () => {
  it('incomplete consent blocks submission', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });

    expect(await code(() => submitApplication(ctx, { userId: USER, profileId: p.id, requiredTermsVersion: TERMS_V1 })))
      .toBe('TERMS_NOT_ACCEPTED');
    expect(state.profiles[0]?.status).toBe('DRAFT');
  });

  it('consent is never inferred from a completed form', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    expect(p.termsAcceptedAt).toBeNull();
    expect(p.termsVersion).toBeNull();
    expect(p.publicProfileConsentAt).toBeNull();
    expect(consentIsComplete(p)).toBe(false);
  });

  it('each missing consent element is refused individually', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    const attempt = (consent: Record<string, unknown>) =>
      code(() => recordConsent(ctx, { userId: USER, profileId: p.id, consent: consent as never }));

    expect(await attempt({ ...CONSENT, acceptTerms: false })).toBe('TERMS_NOT_ACCEPTED');
    expect(await attempt({ ...CONSENT, termsVersion: '' })).toBe('TERMS_VERSION_REQUIRED');
    expect(await attempt({ ...CONSENT, consentToPublicProfile: false }))
      .toBe('PUBLIC_PROFILE_CONSENT_REQUIRED');
    expect(state.profiles[0]?.termsAcceptedAt).toBeNull();
  });

  it('valid consent is versioned, timestamped, and snapshotted', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, { userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT });
    const consented = await recordConsent(ctx, { userId: USER, profileId: p.id, consent: CONSENT });

    expect(consented.termsVersion).toBe(TERMS_V1);
    expect(consented.termsAcceptedAt).toEqual(new Date('2026-08-26T12:00:00.000Z'));
    expect(consented.publicProfileConsentAt).toEqual(new Date('2026-08-26T12:00:00.000Z'));
    expect(consentIsComplete(consented)).toBe(true);

    const snapshot = state.profiles[0]?.consentSnapshot as Record<string, unknown>;
    expect(snapshot.termsVersion).toBe(TERMS_V1);
    expect(snapshot.storyIsPublicWhenListed).toBe(true);
    expect(snapshot.registryCanonicalKey).toBe('babylist:list:rivera');
  });

  it('a missing story blocks submission even with full consent', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: { ...DRAFT, shortStory: '   ' },
    });
    await recordConsent(ctx, { userId: USER, profileId: p.id, consent: CONSENT });
    expect(await code(() => submitApplication(ctx, { userId: USER, profileId: p.id, requiredTermsVersion: TERMS_V1 })))
      .toBe('SHORT_STORY_REQUIRED');
  });
});

describe('application service — submission can never publish', () => {
  it('a successful submission lands in SUBMITTED and nothing else', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    const submitted = await submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 });
    expect(submitted.status).toBe('SUBMITTED');
  });

  it('submission cannot auto-approve', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    await submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 });
    expect(state.profiles[0]?.status).not.toBe('APPROVED');
  });

  it('submission cannot auto-publish', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    await submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 });
    expect(state.profiles[0]?.status).not.toBe('LIVE');
    expect(state.profiles[0]?.publishedAt).toBeNull();
  });

  it('DRAFT -> LIVE remains impossible through the service layer', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    forceStatus(state, profileId, 'DRAFT');
    await submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 });
    expect(state.profiles[0]?.status).toBe('SUBMITTED');

    // ...and from EVERY starting status, the only status this service can
    // produce is SUBMITTED. It either transitions there or leaves the profile
    // exactly where it was — it never moves one toward APPROVED or LIVE.
    for (const status of PROFILE_STATUSES) {
      forceStatus(state, profileId, status);
      await code(() => submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 }));
      const after = state.profiles[0]?.status;
      expect([status, 'SUBMITTED']).toContain(after);
      if (status !== 'LIVE') expect(after).not.toBe('LIVE');
      if (status !== 'APPROVED') expect(after).not.toBe('APPROVED');
    }
  });

  it('no service module contains a write to LIVE or APPROVED', () => {
    for (const file of ['applicationService.ts', 'registryIntake.ts', 'review.ts', 'publicRead.ts']) {
      const source = readFileSync(fileURLToPath(new URL(`../${file}`, import.meta.url)), 'utf8');
      const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      expect(code).not.toContain("'LIVE'");
      expect(code).not.toContain("'APPROVED'");
    }
  });

  it('the submission target constant is SUBMITTED and is the only one used', async () => {
    const source = readFileSync(
      fileURLToPath(new URL('../applicationService.ts', import.meta.url)), 'utf8',
    );
    expect(source).toContain("SUBMISSION_TARGET_STATUS: MatchmakerProfileStatus = 'SUBMITTED'");
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    const result = await submitApplication(ctx, { userId: USER, profileId, requiredTermsVersion: TERMS_V1 });
    expect(result.status).toBe('SUBMITTED');
  });
});

/* ================================================================== *
 * Hardening requirement 2 — stale public-profile consent
 * ================================================================== */

describe('consent invalidation — a changed public profile is a new consent', () => {
  async function consented(state: InMemoryState) {
    state.media.push('media_1', 'media_2');
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    await recordConsent(ctx, { userId: USER, profileId: p.id, consent: CONSENT });
    return { ctx, profileId: p.id };
  }

  const resave = (ctx: ReturnType<typeof createTestContext>, draft: Record<string, unknown>) =>
    saveApplicationDraft(ctx, {
      userId: USER, submittedRegistryUrl: URL_LIST, draft: draft as never,
    });

  it('changing the story blocks submission until re-consent', async () => {
    const state = emptyState();
    const { ctx, profileId } = await consented(state);

    const after = await resave(ctx, { ...DRAFT, shortStory: 'A different story now.' });
    expect(after.publicProfileConsentAt).toBeNull();
    expect(state.profiles[0]?.consentSnapshot).toBeNull();

    expect(await code(() => submitApplication(ctx, {
      userId: USER, profileId, requiredTermsVersion: TERMS_V1,
    }))).toBe('PUBLIC_PROFILE_CONSENT_REQUIRED');

    await recordConsent(ctx, { userId: USER, profileId, consent: CONSENT });
    expect((await submitApplication(ctx, {
      userId: USER, profileId, requiredTermsVersion: TERMS_V1,
    })).status).toBe('SUBMITTED');
  });

  it('enabling a visibility flag blocks submission until re-consent', async () => {
    const state = emptyState();
    const { ctx, profileId } = await consented(state);
    const after = await resave(ctx, { ...DRAFT, showLocation: true });
    expect(after.publicProfileConsentAt).toBeNull();
    expect(await code(() => submitApplication(ctx, {
      userId: USER, profileId, requiredTermsVersion: TERMS_V1,
    }))).toBe('PUBLIC_PROFILE_CONSENT_REQUIRED');
  });

  it('changing the photo blocks submission until re-consent', async () => {
    const state = emptyState();
    const { ctx, profileId } = await consented(state);
    await resave(ctx, { ...DRAFT, showPhoto: true, photoMediaId: 'media_1' });
    await recordConsent(ctx, { userId: USER, profileId, consent: CONSENT });

    const swapped = await resave(ctx, { ...DRAFT, showPhoto: true, photoMediaId: 'media_2' });
    expect(swapped.publicProfileConsentAt).toBeNull();
    expect(await code(() => submitApplication(ctx, {
      userId: USER, profileId, requiredTermsVersion: TERMS_V1,
    }))).toBe('PUBLIC_PROFILE_CONSENT_REQUIRED');
  });

  it('saving identical values keeps consent valid', async () => {
    const state = emptyState();
    const { ctx, profileId } = await consented(state);
    const before = state.profiles[0]?.publicProfileConsentAt;

    const after = await resave(ctx, { ...DRAFT });
    expect(after.publicProfileConsentAt).toEqual(before);
    expect(state.profiles[0]?.consentSnapshot).not.toBeNull();
    expect((await submitApplication(ctx, {
      userId: USER, profileId, requiredTermsVersion: TERMS_V1,
    })).status).toBe('SUBMITTED');
  });

  it('terms acceptance is NOT cleared by a content change', async () => {
    const state = emptyState();
    const { ctx } = await consented(state);
    const after = await resave(ctx, { ...DRAFT, shortStory: 'Changed.' });
    expect(after.publicProfileConsentAt).toBeNull();
    expect(after.termsAcceptedAt).not.toBeNull();
    expect(after.termsVersion).toBe(TERMS_V1);
  });

  it('every material public field is watched', () => {
    const base = normaliseApplicationDraft({ ...DRAFT, photoMediaId: 'media_1' });
    const stored = { ...base } as never;
    expect(materialPublicChange(stored, base)).toBe(false);

    const changes: Array<Partial<Record<string, unknown>>> = [
      { displayFirstName: 'Bea' }, { displayLastInitial: 'Q' }, { city: 'Mesa' },
      { state: 'CA' }, { dueMonth: 3 }, { dueYear: 2027 }, { familyStage: 'Second baby' },
      { shortStory: 'Other' }, { priorityNeeds: ['Diapers'] }, { showLastInitial: true },
      { showLocation: true }, { showDueMonth: true }, { showFamilyStage: true },
      { showPhoto: true }, { photoMediaId: 'media_2' },
    ];
    expect(changes).toHaveLength(15);
    for (const change of changes) {
      expect(materialPublicChange(stored, { ...base, ...change } as never)).toBe(true);
    }
  });

  it('an un-consented draft is not disturbed by editing', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    const edited = await resave(ctx, { ...DRAFT, shortStory: 'Edit before consent.' });
    expect(edited.publicProfileConsentAt).toBeNull();
    expect(edited.termsAcceptedAt).toBeNull();
  });
});

/* ================================================================== *
 * Hardening requirement 3 — no invented terms version
 * ================================================================== */

describe('terms version — supplied by the caller, verified at submission', () => {
  it('the service exports no production terms-version constant', () => {
    const source = readFileSync(
      fileURLToPath(new URL('../applicationService.ts', import.meta.url)), 'utf8',
    );
    expect(source).not.toContain('MATCHMAKER_TERMS_VERSION');
    expect(source).not.toMatch(/2026-08-26\.1/);
    // No exported string constant that looks like a legal version.
    expect(source).not.toMatch(/export const \w*TERMS\w*\s*=\s*'/);
  });

  it('an outdated accepted version blocks submission', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    await recordConsent(ctx, {
      userId: USER, profileId: p.id,
      consent: { acceptTerms: true, termsVersion: TERMS_V1, consentToPublicProfile: true },
    });

    expect(await code(() => submitApplication(ctx, {
      userId: USER, profileId: p.id, requiredTermsVersion: TERMS_V2,
    }))).toBe('TERMS_VERSION_OUTDATED');
    expect(state.profiles[0]?.status).toBe('DRAFT');
  });

  it('re-accepting the current version unblocks submission', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const p = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    await recordConsent(ctx, {
      userId: USER, profileId: p.id,
      consent: { acceptTerms: true, termsVersion: TERMS_V1, consentToPublicProfile: true },
    });
    await recordConsent(ctx, {
      userId: USER, profileId: p.id,
      consent: { acceptTerms: true, termsVersion: TERMS_V2, consentToPublicProfile: true },
    });
    expect((await submitApplication(ctx, {
      userId: USER, profileId: p.id, requiredTermsVersion: TERMS_V2,
    })).status).toBe('SUBMITTED');
  });

  it('a blank required version is refused rather than skipped', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedSubmittable(state);
    for (const required of ['', '   ']) {
      expect(await code(() => submitApplication(ctx, {
        userId: USER, profileId, requiredTermsVersion: required,
      }))).toBe('TERMS_VERSION_REQUIRED');
    }
    expect(state.profiles[0]?.status).toBe('DRAFT');
  });
});

/* ================================================================== *
 * Hardening requirement 4 — entryMethod is provenance
 * ================================================================== */

describe('entry method — stated, never guessed', () => {
  it('missing entryMethod cannot silently create a profile', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    for (const entryMethod of [undefined, null, '']) {
      expect(await code(() => saveApplicationDraft(ctx, {
        userId: USER, submittedRegistryUrl: URL_MY, draft: DRAFT,
        entryMethod: entryMethod as never,
      }))).toBe('ENTRY_METHOD_REQUIRED');
    }
    expect(state.profiles).toHaveLength(0);
  });

  it('an unrecognised entryMethod is refused', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => saveApplicationDraft(ctx, {
      userId: USER, submittedRegistryUrl: URL_MY, draft: DRAFT,
      entryMethod: 'SELF_SIGNUP' as never,
    }))).toBe('ENTRY_METHOD_INVALID');
    expect(state.profiles).toHaveLength(0);
  });

  it('accepts every deployed enum member and nothing else', () => {
    expect([...ENTRY_METHODS].sort()).toEqual([
      'ADMIN_OVERRIDE', 'GIFTED_FIRST', 'RECEIVED_THROUGH_MATCHMAKER', 'TMBC_NOMINATED',
    ]);
  });

  it('TMBC_NOMINATED remains TMBC_NOMINATED after reapplication', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const created = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'TMBC_NOMINATED', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    expect(created.entryMethod).toBe('TMBC_NOMINATED');

    const revived = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_LIST,
      draft: { ...DRAFT, shortStory: 'New year, new story.' },
    });
    expect(revived.entryMethod).toBe('TMBC_NOMINATED');
    expect(state.profiles).toHaveLength(1);
  });

  it('GIFTED_FIRST remains GIFTED_FIRST after reapplication', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    const created = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: DRAFT,
    });
    forceStatus(state, created.id, 'ARCHIVED');
    const revived = await saveApplicationDraft(ctx, {
      userId: USER, entryMethod: 'ADMIN_OVERRIDE', submittedRegistryUrl: URL_APEX, draft: DRAFT,
    });
    expect(revived.entryMethod).toBe('GIFTED_FIRST');
  });

  it('the service source contains no entryMethod fallback', () => {
    const source = readFileSync(
      fileURLToPath(new URL('../applicationService.ts', import.meta.url)), 'utf8',
    );
    expect(source).not.toContain("entryMethod ?? ");
    expect(source).not.toContain("entryMethod || ");
  });
});
