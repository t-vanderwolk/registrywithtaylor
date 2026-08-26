import { describe, expect, it } from 'vitest';

import {
  checkInviteUsable,
  computeInviteExpiry,
  DEFAULT_INVITE_TTL_HOURS,
  hashInviteToken,
  inviteEmailMatches,
  inviteTokenMatches,
  isInviteUsable,
  normaliseInviteEmail,
} from '../invite';

const NOW = new Date('2026-08-26T12:00:00.000Z');

describe('invite — token hashing', () => {
  it('is deterministic and never returns the raw token', () => {
    const token = 'mm_invite_abc123';
    const hash = hashInviteToken(token);
    expect(hash).toBe(hashInviteToken(token));
    expect(hash).not.toBe(token);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('different tokens hash differently', () => {
    expect(hashInviteToken('a')).not.toBe(hashInviteToken('b'));
  });

  it('matches a token against its stored hash', () => {
    const token = 'mm_invite_xyz';
    expect(inviteTokenMatches(token, hashInviteToken(token))).toBe(true);
    expect(inviteTokenMatches('wrong', hashInviteToken(token))).toBe(false);
  });

  it('rejects malformed stored hashes without throwing', () => {
    expect(() => inviteTokenMatches('t', '')).not.toThrow();
    expect(inviteTokenMatches('t', '')).toBe(false);
    expect(inviteTokenMatches('t', 'short')).toBe(false);
  });
});

describe('invite — expiry maths is reproducible', () => {
  it('adds the TTL to the issue time', () => {
    expect(computeInviteExpiry(NOW, 24).toISOString()).toBe('2026-08-27T12:00:00.000Z');
    expect(computeInviteExpiry(NOW).toISOString()).toBe(
      new Date(NOW.getTime() + DEFAULT_INVITE_TTL_HOURS * 3_600_000).toISOString(),
    );
  });

  it('does not read the clock', () => {
    expect(computeInviteExpiry(NOW, 1).getTime()).toBe(NOW.getTime() + 3_600_000);
  });
});

describe('invite — usability, single-use, expiring (decision 7)', () => {
  const usable = { expiresAt: new Date('2026-08-27T12:00:00.000Z'), usedAt: null, revokedAt: null };

  it('accepts a fresh, unused, unrevoked invite', () => {
    expect(isInviteUsable(usable, NOW)).toBe(true);
  });

  it('rejects an expired invite', () => {
    expect(checkInviteUsable({ ...usable, expiresAt: new Date('2026-08-25T12:00:00.000Z') }, NOW))
      .toMatchObject({ ok: false, code: 'INVITE_EXPIRED' });
  });

  it('treats the exact expiry instant as expired', () => {
    expect(isInviteUsable({ ...usable, expiresAt: NOW }, NOW)).toBe(false);
  });

  it('rejects a used invite — single use', () => {
    expect(checkInviteUsable({ ...usable, usedAt: new Date('2026-08-20') }, NOW))
      .toMatchObject({ ok: false, code: 'INVITE_ALREADY_USED' });
  });

  it('rejects a revoked invite, and revocation outranks other reasons', () => {
    expect(checkInviteUsable({
      expiresAt: new Date('2026-08-01'),
      usedAt: new Date('2026-08-02'),
      revokedAt: new Date('2026-08-03'),
    }, NOW)).toMatchObject({ ok: false, code: 'INVITE_REVOKED' });
  });

  it('every rejection carries a human-readable message', () => {
    const result = checkInviteUsable({ ...usable, usedAt: new Date('2026-08-20') }, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message.length).toBeGreaterThan(0);
  });
});

describe('invite — email comparison', () => {
  it('normalises case and surrounding whitespace', () => {
    expect(normaliseInviteEmail('  Taylor@Example.COM ')).toBe('taylor@example.com');
    expect(inviteEmailMatches('Taylor@Example.com', ' taylor@example.com ')).toBe(true);
  });

  it('does not treat different addresses as equal', () => {
    expect(inviteEmailMatches('a@example.com', 'b@example.com')).toBe(false);
  });
});
