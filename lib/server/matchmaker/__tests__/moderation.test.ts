import { describe, expect, it } from 'vitest';

import {
  MATCHMAKER_MODERATION_ACTIONS,
  moderationActionIdFor,
  recordModerationActionOnce,
} from '../moderation';
import { createInMemoryRepo, emptyState } from './inMemoryRepo';

const A = MATCHMAKER_MODERATION_ACTIONS.REVERSAL_REVIEW;
const B = MATCHMAKER_MODERATION_ACTIONS.BENEFIT_REVERSAL_REVIEW;

describe('deterministic moderation-action identity', () => {
  it('is stable for the same (profileId, giftEventId, action)', () => {
    const id1 = moderationActionIdFor({ profileId: 'p_1', giftEventId: 'g_1', action: A });
    const id2 = moderationActionIdFor({ profileId: 'p_1', giftEventId: 'g_1', action: A });
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^mma_[0-9a-f]{40}$/);
  });

  it('differs when any one component differs', () => {
    const base = { profileId: 'p_1', giftEventId: 'g_1', action: A };
    const ids = new Set([
      moderationActionIdFor(base),
      moderationActionIdFor({ ...base, profileId: 'p_2' }),
      moderationActionIdFor({ ...base, giftEventId: 'g_2' }),
      moderationActionIdFor({ ...base, action: B }),
      moderationActionIdFor({ ...base, giftEventId: null }),
    ]);
    expect(ids.size).toBe(5);
  });

  it('cannot be collided by concatenation ambiguity', () => {
    // Without a delimiter, ('ab','c') and ('a','bc') would hash identically.
    expect(moderationActionIdFor({ profileId: 'ab', giftEventId: 'c', action: A }))
      .not.toBe(moderationActionIdFor({ profileId: 'a', giftEventId: 'bc', action: A }));
  });

  it('carries no personal data — only the three identity fields', () => {
    const withPii = moderationActionIdFor({ profileId: 'p_1', giftEventId: 'g_1', action: A });
    for (const leak of ['p_1', 'g_1', A, '@', 'giver', 'email']) {
      expect(withPii.slice(4)).not.toContain(leak);
    }
  });
});

describe('recordModerationActionOnce — idempotent under repetition AND concurrency', () => {
  const input = {
    profileId: 'p_1',
    giftEventId: 'g_1',
    actorUserId: 'admin_1',
    action: A,
    note: 'synthetic',
  };

  it('creates once, then reports "already recorded"', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);

    expect(await recordModerationActionOnce(repo, input)).toBe(true);
    for (let i = 0; i < 5; i += 1) {
      expect(await recordModerationActionOnce(repo, input)).toBe(false);
    }
    expect(state.moderationActions).toHaveLength(1);
  });

  it('stores the deterministic id as the row primary key', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    await recordModerationActionOnce(repo, input);
    expect(state.moderationActions[0]?.id).toBe(
      moderationActionIdFor({ profileId: 'p_1', giftEventId: 'g_1', action: A }),
    );
  });

  it('the PRIMARY KEY holds even when the read guard is bypassed', async () => {
    // Models two simultaneous transactions: both observed "absent" before
    // either wrote, so both attempt the insert. The deterministic id makes the
    // second a benign primary-key collision rather than a duplicate row.
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    const id = moderationActionIdFor({ profileId: 'p_1', giftEventId: 'g_1', action: A });

    const first = await repo.createModerationAction({ ...input, id });
    const second = await repo.createModerationAction({ ...input, id });
    const third = await repo.createModerationAction({ ...input, id, note: 'different note' });

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(third).toBe(false);
    expect(state.moderationActions).toHaveLength(1);
  });

  it('interleaved concurrent-equivalent cascades still yield exactly one row', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    const results = await Promise.all(
      Array.from({ length: 8 }, () => recordModerationActionOnce(repo, input)),
    );
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(state.moderationActions).toHaveLength(1);
  });

  it('distinct actions on the same gift are separate rows', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    expect(await recordModerationActionOnce(repo, input)).toBe(true);
    expect(await recordModerationActionOnce(repo, { ...input, action: B })).toBe(true);
    expect(state.moderationActions).toHaveLength(2);
  });

  it('the same action for different profiles are separate rows', async () => {
    const state = emptyState();
    const repo = createInMemoryRepo(state);
    expect(await recordModerationActionOnce(repo, input)).toBe(true);
    expect(await recordModerationActionOnce(repo, { ...input, profileId: 'p_2' })).toBe(true);
    expect(state.moderationActions).toHaveLength(2);
  });
});
