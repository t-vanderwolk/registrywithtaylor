import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  countQualifyingGifts,
  entryMethodRequiresConfirmedGift,
  evaluateAdmissionEligibility,
  evaluateGiftEligibility,
  hasQualifyingGift,
  isQualifyingGift,
  QUALIFYING_GIFT_STATUS,
  type EligibilityGift,
} from '../eligibility';
import type { MatchmakerGiftStatus } from '../types';

const ALL_GIFT_STATUSES: MatchmakerGiftStatus[] = [
  'STARTED',
  'REPORTED_SENT',
  'AWAITING_RECIPIENT_CONFIRMATION',
  'CONFIRMED',
  'DISPUTED',
  'CANCELED',
  'REVERSED',
];

describe('eligibility — CONFIRMED and nothing else', () => {
  it('CONFIRMED qualifies', () => {
    expect(isQualifyingGift({ status: 'CONFIRMED' })).toBe(true);
    expect(QUALIFYING_GIFT_STATUS).toBe('CONFIRMED');
  });

  it('every other gift status does NOT qualify', () => {
    const others = ALL_GIFT_STATUSES.filter((s) => s !== 'CONFIRMED');
    expect(others).toHaveLength(6);
    for (const status of others) {
      expect(isQualifyingGift({ status })).toBe(false);
    }
  });

  it('REVERSED stops qualifying automatically (decision 6c)', () => {
    expect(isQualifyingGift({ status: 'REVERSED' })).toBe(false);
    expect(evaluateGiftEligibility([{ status: 'REVERSED' }]).eligible).toBe(false);
  });

  it('a click or a submitted claim is never a gift (decision 5)', () => {
    expect(evaluateGiftEligibility([{ status: 'STARTED' }]).eligible).toBe(false);
    expect(evaluateGiftEligibility([{ status: 'REPORTED_SENT' }]).eligible).toBe(false);
    expect(
      evaluateGiftEligibility([{ status: 'AWAITING_RECIPIENT_CONFIRMATION' }]).eligible,
    ).toBe(false);
  });

  it('counts only confirmed gifts across a mixed ledger', () => {
    const ledger: EligibilityGift[] = ALL_GIFT_STATUSES.map((status) => ({ status }));
    expect(countQualifyingGifts(ledger)).toBe(1);
    expect(hasQualifyingGift(ledger)).toBe(true);
    expect(evaluateGiftEligibility(ledger)).toEqual({
      eligible: true,
      qualifyingGiftCount: 1,
      reason: 'HAS_CONFIRMED_GIFT',
    });
  });

  it('an empty ledger is not eligible', () => {
    expect(evaluateGiftEligibility([])).toEqual({
      eligible: false,
      qualifyingGiftCount: 0,
      reason: 'NO_CONFIRMED_GIFT',
    });
  });
});

describe('eligibility — gift amount has zero effect (decision 6d)', () => {
  it('identical decisions regardless of amount, including 1 cent and null', () => {
    const amounts = [null, 0, 1, 99, 2_500, 100_000, Number.MAX_SAFE_INTEGER];
    const results = amounts.map((amountCents) => {
      const gift = { status: 'CONFIRMED' as MatchmakerGiftStatus, amountCents };
      return evaluateGiftEligibility([gift]);
    });

    for (const result of results) {
      expect(result).toEqual({
        eligible: true,
        qualifyingGiftCount: 1,
        reason: 'HAS_CONFIRMED_GIFT',
      });
    }
  });

  it('a large unconfirmed gift never beats a tiny confirmed one', () => {
    const huge = { status: 'REPORTED_SENT' as MatchmakerGiftStatus, amountCents: 5_000_000 };
    const tiny = { status: 'CONFIRMED' as MatchmakerGiftStatus, amountCents: 1 };
    expect(evaluateGiftEligibility([huge]).eligible).toBe(false);
    expect(evaluateGiftEligibility([tiny]).eligible).toBe(true);
  });

  it('the module source contains no monetary token at all (no minimum spend)', () => {
    const source = readFileSync(
      fileURLToPath(new URL('../eligibility.ts', import.meta.url)),
      'utf8',
    );
    // The header comment deliberately states there is no minimum-spend
    // threshold; the guard is about executable code, so start at the first export.
    const code = source.slice(source.indexOf('export const QUALIFYING_GIFT_STATUS'));
    for (const token of ['amountCents', 'minimum', 'threshold', 'currency', 'price', 'value']) {
      expect(code.toLowerCase().includes(token.toLowerCase())).toBe(false);
    }
  });
});

describe('admission — gift-first applies only to voluntary self-listing', () => {
  it('GIFTED_FIRST requires a confirmed gift', () => {
    expect(entryMethodRequiresConfirmedGift('GIFTED_FIRST')).toBe(true);
    expect(
      evaluateAdmissionEligibility({ entryMethod: 'GIFTED_FIRST', gifts: [] }).eligible,
    ).toBe(false);
    expect(
      evaluateAdmissionEligibility({
        entryMethod: 'GIFTED_FIRST',
        gifts: [{ status: 'CONFIRMED' }],
      }).eligible,
    ).toBe(true);
  });

  it('TMBC_NOMINATED bypasses gift-first (decision 7)', () => {
    expect(entryMethodRequiresConfirmedGift('TMBC_NOMINATED')).toBe(false);
    expect(
      evaluateAdmissionEligibility({ entryMethod: 'TMBC_NOMINATED', gifts: [] }),
    ).toEqual({
      eligible: true,
      qualifyingGiftCount: 0,
      reason: 'GIFT_NOT_REQUIRED_FOR_ENTRY_METHOD',
    });
  });

  it('a recipient is never obligated to give (decision 15)', () => {
    expect(
      evaluateAdmissionEligibility({
        entryMethod: 'RECEIVED_THROUGH_MATCHMAKER',
        gifts: [],
      }).eligible,
    ).toBe(true);
  });

  it('ADMIN_OVERRIDE does not require a gift', () => {
    expect(
      evaluateAdmissionEligibility({ entryMethod: 'ADMIN_OVERRIDE', gifts: [] }).eligible,
    ).toBe(true);
  });
});
