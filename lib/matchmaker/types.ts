/**
 * #BabylistItForward Matchmaker — shared pure-domain types.
 *
 * PURITY CONTRACT (Step 1):
 *  - No Prisma client instantiation, no I/O, no network, no filesystem.
 *  - No `Date.now()` and no randomness: every function that needs "now" or a
 *    shuffle takes it as an explicit argument, so results are reproducible.
 *  - Prisma enums are imported as TYPES ONLY (`import type`), so this layer has
 *    zero runtime dependency on `@prisma/client`.
 *
 * Enum member names below were read from the generated client's DMMF at
 * commit 47fd278, not from memory.
 */

import type {
  MatchmakerConfirmationSource,
  MatchmakerEntryMethod,
  MatchmakerGiftStatus,
  MatchmakerGiftType,
  MatchmakerGiverBenefitStatus,
  MatchmakerProfileStatus,
} from '@prisma/client';

export type {
  MatchmakerConfirmationSource,
  MatchmakerEntryMethod,
  MatchmakerGiftStatus,
  MatchmakerGiftType,
  MatchmakerGiverBenefitStatus,
  MatchmakerProfileStatus,
};

/**
 * Who is requesting a profile state change.
 * Contract decision 9 ("Never auto-publish") is enforced by making SYSTEM
 * structurally incapable of reaching LIVE — see `profileStatus.ts`.
 */
export type MatchmakerProfileActor = 'APPLICANT' | 'ADMIN' | 'SYSTEM';

/**
 * Who is requesting a gift state change.
 * GIVER is deliberately distinct from RECIPIENT so that "I sent it" can never
 * be mistaken for "I received it" (contract decision 5).
 */
export type MatchmakerGiftActor =
  | 'GIVER'
  | 'RECIPIENT'
  | 'ADMIN'
  | 'SYSTEM'
  | 'FIRST_PARTY_WEBHOOK';

export type DomainOk<T> = { readonly ok: true; readonly value: T };

export type DomainErr<C extends string = string> = {
  readonly ok: false;
  readonly code: C;
  readonly message: string;
};

export type DomainResult<T, C extends string = string> = DomainOk<T> | DomainErr<C>;

export function domainOk<T>(value: T): DomainOk<T> {
  return { ok: true, value };
}

export function domainErr<C extends string>(code: C, message: string): DomainErr<C> {
  return { ok: false, code, message };
}

export function isOk<T, C extends string>(r: DomainResult<T, C>): r is DomainOk<T> {
  return r.ok;
}
