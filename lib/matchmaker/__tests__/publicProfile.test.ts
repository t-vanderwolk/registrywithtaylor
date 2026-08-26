import { describe, expect, it } from 'vitest';

import { findForbiddenPublicFields, PUBLIC_PROFILE_ALLOWLIST } from '../privacy';
import {
  canPublishPhoto,
  toPublicMatchmakerProfile,
  toPublicMatchmakerProfiles,
  type PublicProfileSource,
} from '../publicProfile';
import { PROFILE_STATUSES } from '../profileStatus';

function source(overrides: Partial<PublicProfileSource> = {}): PublicProfileSource {
  return {
    status: 'LIVE',
    publicSlug: 'the-rivera-family',
    displayFirstName: 'Ana',
    displayLastInitial: 'R',
    city: 'Scottsdale',
    state: 'AZ',
    dueMonth: 11,
    dueYear: 2026,
    familyStage: 'First baby',
    shortStory: 'We are getting ready for our first baby and every bit helps.',
    priorityNeeds: ['Car seat', 'Bottles'],
    showLastInitial: false,
    showLocation: false,
    showDueMonth: false,
    showFamilyStage: false,
    showPhoto: false,
    photoMedia: null,
    photoApprovedAt: null,
    registryReviewed: true,
    ownershipReviewed: true,
    registryUrl: 'https://www.babylist.com/list/rivera',
    ...overrides,
  };
}

describe('serializer — only permitted public fields are emitted', () => {
  it('emits nothing outside the allowlist', () => {
    const profile = toPublicMatchmakerProfile(
      source({
        showLastInitial: true, showLocation: true, showDueMonth: true, showFamilyStage: true,
        showPhoto: true, photoMedia: { url: 'https://cdn.example/p.jpg' },
        photoApprovedAt: new Date('2026-08-01'),
      }),
    );
    expect(profile).not.toBeNull();
    for (const key of Object.keys(profile as object)) {
      expect(PUBLIC_PROFILE_ALLOWLIST).toContain(key);
    }
  });

  it('carries no forbidden field anywhere in the payload', () => {
    const profile = toPublicMatchmakerProfile(source());
    expect(findForbiddenPublicFields(profile)).toEqual([]);
  });

  it('returns null for every status that is not LIVE', () => {
    for (const status of PROFILE_STATUSES) {
      const result = toPublicMatchmakerProfile(source({ status }));
      if (status === 'LIVE') expect(result).not.toBeNull();
      else expect(result).toBeNull();
    }
  });

  it('drops non-LIVE profiles from a list', () => {
    const list = toPublicMatchmakerProfiles([
      source({ status: 'LIVE', publicSlug: 'a' }),
      source({ status: 'PAUSED', publicSlug: 'b' }),
      source({ status: 'UNDER_REVIEW', publicSlug: 'c' }),
    ]);
    expect(list.map((p) => p.publicSlug)).toEqual(['a']);
  });
});

describe('serializer — private fields are ABSENT, not undefined', () => {
  it('omits every opt-out key rather than setting it undefined', () => {
    const profile = toPublicMatchmakerProfile(source()) as Record<string, unknown>;
    for (const key of ['displayLastInitial', 'city', 'state', 'dueMonth', 'dueYear', 'familyStage', 'photoUrl']) {
      expect(key in profile).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(profile, key)).toBe(false);
    }
  });

  it('survives a JSON round trip without reintroducing empty slots', () => {
    const profile = toPublicMatchmakerProfile(source());
    const parsed = JSON.parse(JSON.stringify(profile)) as Record<string, unknown>;
    expect(Object.keys(parsed).sort()).toEqual([
      'displayFirstName', 'ownershipReviewed', 'priorityNeeds', 'publicSlug',
      'registryReviewed', 'registryUrl', 'shortStory',
    ]);
  });

  it('never forwards a private column even when one is present on the input object', () => {
    const dirty = { ...source(), moderationNotes: 'internal', consentSnapshot: { ip: '1.2.3.4' } };
    const profile = toPublicMatchmakerProfile(dirty as PublicProfileSource) as Record<string, unknown>;
    expect('moderationNotes' in profile).toBe(false);
    expect('consentSnapshot' in profile).toBe(false);
    expect(findForbiddenPublicFields(profile)).toEqual([]);
  });
});

describe('serializer — the story is mandatory public content (decision 20)', () => {
  it('publishes the story for an eligible LIVE profile', () => {
    const profile = toPublicMatchmakerProfile(source());
    expect(profile?.shortStory).toBe('We are getting ready for our first baby and every bit helps.');
  });

  it('has no showStory flag to turn it off', () => {
    expect('showStory' in source()).toBe(false);
    const profile = toPublicMatchmakerProfile(source({ showLocation: true })) as Record<string, unknown>;
    expect('shortStory' in profile).toBe(true);
  });
});

describe('serializer — optional fields respect their own show* flag', () => {
  it('last initial', () => {
    expect('displayLastInitial' in (toPublicMatchmakerProfile(source({ showLastInitial: false })) as object)).toBe(false);
    expect(toPublicMatchmakerProfile(source({ showLastInitial: true }))?.displayLastInitial).toBe('R');
  });

  it('location', () => {
    const off = toPublicMatchmakerProfile(source({ showLocation: false })) as Record<string, unknown>;
    expect('city' in off).toBe(false);
    expect('state' in off).toBe(false);
    const on = toPublicMatchmakerProfile(source({ showLocation: true }));
    expect(on?.city).toBe('Scottsdale');
    expect(on?.state).toBe('AZ');
  });

  it('due month', () => {
    expect('dueMonth' in (toPublicMatchmakerProfile(source({ showDueMonth: false })) as object)).toBe(false);
    const on = toPublicMatchmakerProfile(source({ showDueMonth: true }));
    expect(on?.dueMonth).toBe(11);
    expect(on?.dueYear).toBe(2026);
  });

  it('family stage', () => {
    expect('familyStage' in (toPublicMatchmakerProfile(source({ showFamilyStage: false })) as object)).toBe(false);
    expect(toPublicMatchmakerProfile(source({ showFamilyStage: true }))?.familyStage).toBe('First baby');
  });
});

describe('serializer — photo requires ALL THREE conditions (decision 25)', () => {
  const url = 'https://cdn.example/photo.jpg';
  const approved = new Date('2026-08-01');

  it('publishes only when showPhoto AND the Media relation resolves AND photoApprovedAt', () => {
    const profile = toPublicMatchmakerProfile(
      source({ showPhoto: true, photoMedia: { url }, photoApprovedAt: approved }),
    );
    expect(profile?.photoUrl).toBe(url);
  });

  it('is withheld when any single condition fails', () => {
    const cases: Array<Partial<PublicProfileSource>> = [
      { showPhoto: false, photoMedia: { url }, photoApprovedAt: approved },
      { showPhoto: true, photoMedia: null, photoApprovedAt: approved },
      { showPhoto: true, photoMedia: { url }, photoApprovedAt: null },
    ];
    for (const overrides of cases) {
      const profile = toPublicMatchmakerProfile(source(overrides)) as Record<string, unknown>;
      expect('photoUrl' in profile).toBe(false);
    }
  });

  it('a stale approval timestamp cannot publish a deleted photo on its own', () => {
    expect(canPublishPhoto({ showPhoto: true, photoMedia: null, photoApprovedAt: approved })).toBe(false);
  });

  it('an empty media url is not a photo', () => {
    expect(canPublishPhoto({ showPhoto: true, photoMedia: { url: '' }, photoApprovedAt: approved })).toBe(false);
  });
});
