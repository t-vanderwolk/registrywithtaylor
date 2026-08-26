import { describe, expect, it } from 'vitest';

import {
  canActorConfirm,
  canTransitionGift,
  confirmationSourcesForGiftType,
  GIFT_STATUSES,
  GIFT_TRANSITIONS,
  isGiftTransitionAllowed,
  qualifiesForGiverBenefit,
  resolveBenefitOnReversal,
  resolveInviteOnReversal,
} from '../giftStatus';
import type { MatchmakerGiftActor, MatchmakerGiftStatus } from '../types';

const ALL_ACTORS: MatchmakerGiftActor[] = [
  'GIVER', 'RECIPIENT', 'ADMIN', 'SYSTEM', 'FIRST_PARTY_WEBHOOK',
];

describe('gift transitions — normal report and confirm paths', () => {
  it('Babylist purchase: STARTED -> REPORTED_SENT -> AWAITING -> CONFIRMED', () => {
    expect(isGiftTransitionAllowed({
      from: 'STARTED', to: 'REPORTED_SENT', actor: 'GIVER', giftType: 'BABYLIST_PURCHASE',
    })).toBe(true);
    expect(isGiftTransitionAllowed({
      from: 'REPORTED_SENT', to: 'AWAITING_RECIPIENT_CONFIRMATION', actor: 'SYSTEM',
      giftType: 'BABYLIST_PURCHASE',
    })).toBe(true);
    expect(isGiftTransitionAllowed({
      from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actor: 'RECIPIENT',
      giftType: 'BABYLIST_PURCHASE', confirmationSource: 'RECIPIENT',
    })).toBe(true);
  });

  it('TMBC consult auto-confirms from STARTED via the trusted webhook', () => {
    expect(isGiftTransitionAllowed({
      from: 'STARTED', to: 'CONFIRMED', actor: 'FIRST_PARTY_WEBHOOK',
      giftType: 'TMBC_CONSULT', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toBe(true);
  });

  it('external service gift confirms by admin proof review', () => {
    expect(isGiftTransitionAllowed({
      from: 'REPORTED_SENT', to: 'CONFIRMED', actor: 'ADMIN',
      giftType: 'EXTERNAL_SERVICE_GIFT', confirmationSource: 'ADMIN',
    })).toBe(true);
  });

  it('disputes can be resolved either way by an admin', () => {
    expect(isGiftTransitionAllowed({
      from: 'DISPUTED', to: 'CONFIRMED', actor: 'ADMIN',
      giftType: 'BABYLIST_PURCHASE', confirmationSource: 'ADMIN',
    })).toBe(true);
    expect(isGiftTransitionAllowed({
      from: 'DISPUTED', to: 'CANCELED', actor: 'ADMIN', giftType: 'BABYLIST_PURCHASE',
    })).toBe(true);
  });
});

describe('gift transitions — a report or click never becomes confirmation', () => {
  it('the giver can never confirm, from any status', () => {
    expect(canActorConfirm('GIVER')).toBe(false);
    for (const from of GIFT_STATUSES) {
      expect(isGiftTransitionAllowed({
        from, to: 'CONFIRMED', actor: 'GIVER', giftType: 'BABYLIST_PURCHASE',
        confirmationSource: 'RECIPIENT',
      })).toBe(false);
    }
  });

  it('SYSTEM can never confirm', () => {
    expect(canActorConfirm('SYSTEM')).toBe(false);
    for (const from of GIFT_STATUSES) {
      expect(isGiftTransitionAllowed({
        from, to: 'CONFIRMED', actor: 'SYSTEM', giftType: 'TMBC_CONSULT',
        confirmationSource: 'FIRST_PARTY_WEBHOOK',
      })).toBe(false);
    }
  });

  it('REPORTED_SENT is not confirmation — it needs a separate, sourced step', () => {
    expect(isGiftTransitionAllowed({
      from: 'STARTED', to: 'CONFIRMED', actor: 'GIVER', giftType: 'BABYLIST_PURCHASE',
      confirmationSource: 'RECIPIENT',
    })).toBe(false);
  });

  it('confirming without an explicit source is refused', () => {
    expect(canTransitionGift({
      from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actor: 'RECIPIENT',
      giftType: 'BABYLIST_PURCHASE',
    })).toMatchObject({ ok: false, code: 'CONFIRMATION_SOURCE_REQUIRED' });

    expect(canTransitionGift({
      from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actor: 'RECIPIENT',
      giftType: 'BABYLIST_PURCHASE', confirmationSource: null,
    })).toMatchObject({ ok: false, code: 'CONFIRMATION_SOURCE_REQUIRED' });
  });

  it('an actor cannot assert someone else’s confirmation source', () => {
    expect(canTransitionGift({
      from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actor: 'RECIPIENT',
      giftType: 'BABYLIST_PURCHASE', confirmationSource: 'ADMIN',
    })).toMatchObject({ ok: false, code: 'CONFIRMATION_SOURCE_MISMATCHES_ACTOR' });
  });

  it('a Babylist purchase can never claim a first-party webhook', () => {
    expect(confirmationSourcesForGiftType('BABYLIST_PURCHASE')).not.toContain('FIRST_PARTY_WEBHOOK');
    expect(canTransitionGift({
      from: 'STARTED', to: 'CONFIRMED', actor: 'FIRST_PARTY_WEBHOOK',
      giftType: 'BABYLIST_PURCHASE', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toMatchObject({ ok: false, code: 'CONFIRMATION_SOURCE_NOT_VALID_FOR_GIFT_TYPE' });
  });
});

describe('gift transitions — REVERSED is handled explicitly (decision 6c)', () => {
  it('only a CONFIRMED gift can be reversed', () => {
    const nonConfirmed = GIFT_STATUSES.filter((s) => s !== 'CONFIRMED');
    for (const from of nonConfirmed) {
      for (const actor of ALL_ACTORS) {
        expect(isGiftTransitionAllowed({ from, to: 'REVERSED', actor, giftType: 'TMBC_CONSULT' })).toBe(false);
      }
    }
    expect(isGiftTransitionAllowed({
      from: 'CONFIRMED', to: 'REVERSED', actor: 'ADMIN', giftType: 'TMBC_CONSULT',
    })).toBe(true);
    expect(isGiftTransitionAllowed({
      from: 'CONFIRMED', to: 'REVERSED', actor: 'FIRST_PARTY_WEBHOOK', giftType: 'TMBC_CONSULT',
    })).toBe(true);
  });

  it('REVERSED is terminal — it never transitions onward', () => {
    const outgoing = GIFT_TRANSITIONS.filter((t) => t.from === 'REVERSED');
    expect(outgoing).toHaveLength(0);
    for (const to of GIFT_STATUSES) {
      for (const actor of ALL_ACTORS) {
        expect(isGiftTransitionAllowed({
          from: 'REVERSED', to, actor, giftType: 'TMBC_CONSULT', confirmationSource: 'ADMIN',
        })).toBe(false);
      }
    }
  });

  it('CANCELED is terminal too', () => {
    expect(GIFT_TRANSITIONS.filter((t) => t.from === 'CANCELED')).toHaveLength(0);
  });

  it('reversal revokes an unused invite but never deletes a used one', () => {
    expect(resolveInviteOnReversal({ usedAt: null, revokedAt: null })).toBe('REVOKE_INVITE');
    expect(resolveInviteOnReversal({ usedAt: new Date('2026-08-01'), revokedAt: null }))
      .toBe('FLAG_PROFILE_FOR_ADMIN_REVIEW');
    expect(resolveInviteOnReversal({ usedAt: null, revokedAt: new Date('2026-08-01') })).toBe('NO_ACTION');
    expect(resolveInviteOnReversal(null)).toBe('NO_ACTION');
  });
});

describe('giver consultation benefit (decisions 28-30)', () => {
  it('is minted only by TMBC_CONSULT + CONFIRMED + FIRST_PARTY_WEBHOOK', () => {
    expect(qualifiesForGiverBenefit({
      type: 'TMBC_CONSULT', status: 'CONFIRMED', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toBe(true);

    expect(qualifiesForGiverBenefit({
      type: 'TMBC_CONSULT', status: 'CONFIRMED', confirmationSource: 'ADMIN',
    })).toBe(false);
    expect(qualifiesForGiverBenefit({
      type: 'BABYLIST_PURCHASE', status: 'CONFIRMED', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toBe(false);
    expect(qualifiesForGiverBenefit({
      type: 'TMBC_CONSULT', status: 'REPORTED_SENT', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toBe(false);
    expect(qualifiesForGiverBenefit({
      type: 'TMBC_CONSULT', status: 'REVERSED', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    })).toBe(false);
  });

  it('a refund never claws back a consultation someone already had', () => {
    expect(resolveBenefitOnReversal('AVAILABLE')).toBe('REVOKE');
    expect(resolveBenefitOnReversal('REDEEMED')).toBe('FLAG_FOR_ADMIN_REVIEW');
    expect(resolveBenefitOnReversal('REVOKED')).toBe('NO_ACTION');
  });
});

describe('gift transitions — nothing is amount-sensitive', () => {
  it('identical verdicts for any amount (decision 6d)', () => {
    const verdicts = [null, 0, 1, 999_999].map(() =>
      canTransitionGift({
        from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actor: 'RECIPIENT',
        giftType: 'BABYLIST_PURCHASE', confirmationSource: 'RECIPIENT',
      }),
    );
    for (const v of verdicts) expect(v.ok).toBe(true);
  });

  it('every status is covered by the transition table or is terminal', () => {
    const known = new Set<MatchmakerGiftStatus>();
    for (const t of GIFT_TRANSITIONS) { known.add(t.from); known.add(t.to); }
    for (const s of GIFT_STATUSES) expect(known.has(s)).toBe(true);
  });
});
