import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  isSelectableCandidate,
  matchesFilters,
  MATCHING_FORBIDDEN_SIGNALS,
  seededShuffle,
  selectMatchCandidates,
  type MatchCandidate,
} from '../matching';
import { PROFILE_STATUSES } from '../profileStatus';

function candidate(overrides: Partial<MatchCandidate> = {}): MatchCandidate {
  return {
    publicSlug: 'family',
    status: 'LIVE',
    registryReviewed: true,
    ownershipReviewed: true,
    needsAdminReview: false,
    showLocation: false,
    state: 'AZ',
    showFamilyStage: false,
    familyStage: 'First baby',
    priorityNeeds: ['Car seat'],
    confirmedGiftsReceived: 0,
    ...overrides,
  };
}

describe('matching — only eligible, reviewed, LIVE families are candidates', () => {
  it('accepts a LIVE, both-reviewed, unflagged family', () => {
    expect(isSelectableCandidate(candidate())).toBe(true);
  });

  it('rejects every status other than LIVE', () => {
    for (const status of PROFILE_STATUSES) {
      expect(isSelectableCandidate(candidate({ status }))).toBe(status === 'LIVE');
    }
  });

  it('rejects a family whose registry or ownership is unreviewed', () => {
    expect(isSelectableCandidate(candidate({ registryReviewed: false }))).toBe(false);
    expect(isSelectableCandidate(candidate({ ownershipReviewed: false }))).toBe(false);
  });

  it('excludes needsAdminReview families', () => {
    expect(isSelectableCandidate(candidate({ needsAdminReview: true }))).toBe(false);
    const selected = selectMatchCandidates({
      candidates: [
        candidate({ publicSlug: 'ok' }),
        candidate({ publicSlug: 'flagged', needsAdminReview: true }),
      ],
      rotationSeed: 'seed',
    });
    expect(selected.map((c) => c.publicSlug)).toEqual(['ok']);
  });

  it('returns an empty list when nothing is listable', () => {
    expect(selectMatchCandidates({
      candidates: [candidate({ status: 'PAUSED' }), candidate({ needsAdminReview: true })],
      rotationSeed: 'seed',
    })).toEqual([]);
  });
});

describe('matching — no ranking signal participates', () => {
  it('the module source contains none of the forbidden signals', () => {
    const source = readFileSync(fileURLToPath(new URL('../matching.ts', import.meta.url)), 'utf8');
    // Strip the documentation block that names the forbidden signals on purpose.
    const code = source.slice(source.indexOf('export type MatchCandidate'));
    for (const signal of MATCHING_FORBIDDEN_SIGNALS) {
      expect(code.toLowerCase()).not.toContain(signal.toLowerCase());
    }
    for (const token of ['score', 'weight', 'rank', 'story']) {
      expect(code.toLowerCase()).not.toContain(token.toLowerCase());
    }
  });

  it('extra fields such as amountCents on the input change nothing', () => {
    const base = [
      candidate({ publicSlug: 'a', confirmedGiftsReceived: 0 }),
      candidate({ publicSlug: 'b', confirmedGiftsReceived: 0 }),
      candidate({ publicSlug: 'c', confirmedGiftsReceived: 0 }),
    ];
    const dirty = base.map((c, i) => ({
      ...c,
      amountCents: (i + 1) * 100_000,
      hardshipScore: 99 - i,
      sentiment: -1,
    })) as MatchCandidate[];

    const plain = selectMatchCandidates({ candidates: base, rotationSeed: 's' });
    const withNoise = selectMatchCandidates({ candidates: dirty, rotationSeed: 's' });
    expect(withNoise.map((c) => c.publicSlug)).toEqual(plain.map((c) => c.publicSlug));
  });

  it('the candidate projection carries no story, note, or monetary field', () => {
    const keys = Object.keys(candidate());
    for (const banned of ['shortStory', 'story', 'amountCents', 'moderationNotes', 'email']) {
      expect(keys).not.toContain(banned);
    }
  });
});

describe('matching — optional preferences filter but never rank', () => {
  it('filters by state only when the family shares their location', () => {
    expect(matchesFilters(candidate({ showLocation: true, state: 'AZ' }), { state: 'AZ' })).toBe(true);
    expect(matchesFilters(candidate({ showLocation: false, state: 'AZ' }), { state: 'AZ' })).toBe(false);
    expect(matchesFilters(candidate({ showLocation: true, state: 'AZ' }), { state: 'CA' })).toBe(false);
  });

  it('filters by family stage only when the family shares it', () => {
    expect(matchesFilters(candidate({ showFamilyStage: true }), { familyStage: 'First baby' })).toBe(true);
    expect(matchesFilters(candidate({ showFamilyStage: false }), { familyStage: 'First baby' })).toBe(false);
  });

  it('filters by priority need, case-insensitively', () => {
    expect(matchesFilters(candidate({ priorityNeeds: ['Car seat'] }), { priorityNeed: 'car SEAT' })).toBe(true);
    expect(matchesFilters(candidate({ priorityNeeds: ['Bottles'] }), { priorityNeed: 'Car seat' })).toBe(false);
  });

  it('a filter removes families but never reorders the survivors', () => {
    const candidates = [
      candidate({ publicSlug: 'a', showLocation: true, state: 'AZ' }),
      candidate({ publicSlug: 'b', showLocation: true, state: 'CA' }),
      candidate({ publicSlug: 'c', showLocation: true, state: 'AZ' }),
    ];
    const all = selectMatchCandidates({ candidates, rotationSeed: 's' }).map((c) => c.publicSlug);
    const az = selectMatchCandidates({ candidates, rotationSeed: 's', filters: { state: 'AZ' } })
      .map((c) => c.publicSlug);
    expect(az).toEqual(all.filter((slug) => slug !== 'b'));
  });

  it('no filters means everyone listable is a candidate', () => {
    const candidates = [candidate({ publicSlug: 'a' }), candidate({ publicSlug: 'b' })];
    expect(selectMatchCandidates({ candidates, rotationSeed: 's' })).toHaveLength(2);
  });
});

describe('matching — less-exposed families favoured only by neutral rotation', () => {
  it('orders by fewest confirmed gifts received, ascending', () => {
    const selected = selectMatchCandidates({
      candidates: [
        candidate({ publicSlug: 'many', confirmedGiftsReceived: 5 }),
        candidate({ publicSlug: 'none', confirmedGiftsReceived: 0 }),
        candidate({ publicSlug: 'some', confirmedGiftsReceived: 2 }),
      ],
      rotationSeed: 'seed',
    });
    expect(selected.map((c) => c.publicSlug)).toEqual(['none', 'some', 'many']);
  });

  it('rotates within a tier as the seed changes, but never across tiers', () => {
    const candidates = [
      candidate({ publicSlug: 'a', confirmedGiftsReceived: 0 }),
      candidate({ publicSlug: 'b', confirmedGiftsReceived: 0 }),
      candidate({ publicSlug: 'c', confirmedGiftsReceived: 0 }),
      candidate({ publicSlug: 'z', confirmedGiftsReceived: 9 }),
    ];
    const orders = new Set(
      ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((seed) =>
        selectMatchCandidates({ candidates, rotationSeed: seed }).map((c) => c.publicSlug).join(','),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
    for (const order of orders) {
      expect(order.endsWith(',z')).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    const candidates = [
      candidate({ publicSlug: 'a' }), candidate({ publicSlug: 'b' }),
      candidate({ publicSlug: 'c' }), candidate({ publicSlug: 'd' }),
    ];
    const first = selectMatchCandidates({ candidates, rotationSeed: 'x' }).map((c) => c.publicSlug);
    const second = selectMatchCandidates({ candidates, rotationSeed: 'x' }).map((c) => c.publicSlug);
    expect(second).toEqual(first);
  });

  it('seededShuffle is a permutation and does not mutate its input', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const snapshot = [...input];
    const shuffled = seededShuffle(input, 'seed');
    expect(input).toEqual(snapshot);
    expect([...shuffled].sort()).toEqual([...input].sort());
  });

  it('honours a limit without changing the order', () => {
    const candidates = Array.from({ length: 10 }, (_, i) =>
      candidate({ publicSlug: `f${i}`, confirmedGiftsReceived: i }),
    );
    const full = selectMatchCandidates({ candidates, rotationSeed: 's' }).map((c) => c.publicSlug);
    const limited = selectMatchCandidates({ candidates, rotationSeed: 's', limit: 3 }).map((c) => c.publicSlug);
    expect(limited).toEqual(full.slice(0, 3));
  });
});
