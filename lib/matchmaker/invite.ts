/**
 * Matchmaker invite helpers — pure.
 *
 * Frozen contract:
 *  - decision 7:  invites are hashed, single-use, and expiring.
 *  - decision 16: no fully untraceable submissions.
 *
 * Only the raw token ever reaches the invitee; only its hash is persisted, so a
 * database read can never reconstruct a usable link. Hashing is deterministic,
 * which keeps this module pure and testable. Token GENERATION is intentionally
 * absent — it needs entropy, so it belongs to the service layer in a later step.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

import { domainErr, domainOk, type DomainResult } from './types';

/** SHA-256 hex. Deterministic: the same token always yields the same hash. */
export function hashInviteToken(rawToken: string): string {
  return createHash('sha256').update(rawToken, 'utf8').digest('hex');
}

/** Constant-time comparison so a stored hash cannot be probed byte by byte. */
export function inviteTokenMatches(rawToken: string, storedHash: string): boolean {
  const computed = hashInviteToken(rawToken);
  if (computed.length !== storedHash.length) return false;
  try {
    return timingSafeEqual(Buffer.from(computed, 'utf8'), Buffer.from(storedHash, 'utf8'));
  } catch {
    return false;
  }
}

export const DEFAULT_INVITE_TTL_HOURS = 14 * 24;

/** `now` is passed in rather than read, so expiry maths stays reproducible. */
export function computeInviteExpiry(issuedAt: Date, ttlHours = DEFAULT_INVITE_TTL_HOURS): Date {
  return new Date(issuedAt.getTime() + ttlHours * 60 * 60 * 1000);
}

export type InviteState = {
  readonly expiresAt: Date;
  readonly usedAt: Date | null;
  readonly revokedAt: Date | null;
};

export type InviteRejectionCode = 'INVITE_REVOKED' | 'INVITE_ALREADY_USED' | 'INVITE_EXPIRED';

/**
 * Order matters: revocation is checked before use, and use before expiry, so
 * the reason surfaced to a person is the most specific one that applies.
 */
export function checkInviteUsable(
  invite: InviteState,
  now: Date,
): DomainResult<true, InviteRejectionCode> {
  if (invite.revokedAt !== null) {
    return domainErr('INVITE_REVOKED', 'This Matchmaker invitation has been revoked.');
  }
  if (invite.usedAt !== null) {
    return domainErr('INVITE_ALREADY_USED', 'This Matchmaker invitation has already been used.');
  }
  if (invite.expiresAt.getTime() <= now.getTime()) {
    return domainErr('INVITE_EXPIRED', 'This Matchmaker invitation has expired.');
  }
  return domainOk(true);
}

export function isInviteUsable(invite: InviteState, now: Date): boolean {
  return checkInviteUsable(invite, now).ok;
}

/** Normalises an invited email for comparison. Never used for display. */
export function normaliseInviteEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function inviteEmailMatches(invitedEmail: string, presentedEmail: string): boolean {
  return normaliseInviteEmail(invitedEmail) === normaliseInviteEmail(presentedEmail);
}
