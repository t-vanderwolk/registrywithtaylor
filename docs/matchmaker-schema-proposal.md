# Matchmaker Phase 3 — Schema Proposal, Revision 3 (APPLIED TO schema.prisma; NOT MIGRATED)
**Contract:** docs/BABYLIST-IT-FORWARD-MATCHMAKER.md **v1.5** · **Date:** 2026-08-25
**State:** `prisma/schema.prisma` carries Revision 3, rebuilt from the pristine pre-apply backup and re-validated. **No migration generated yet.** Supersedes revisions 1–2.

## Revision 3 — the three-lane correction

TMBC Service Credit is removed from V1. Giving lanes: `BABYLIST_PURCHASE`, `TMBC_CONSULT`, `EXTERNAL_SERVICE_GIFT` (+ `OTHER_APPROVED` as an internal escape hatch).

| Change | Detail |
|---|---|
| `TMBC_CREDIT` removed | from `MatchmakerGiftType` |
| **`GiftKind` dropped entirely** | With `SERVICE_CREDIT` gone it would hold a single value. Per instruction, a one-value enum was not worth adding — so `GiftCertificate.kind` is gone too, and **`GiftCertificate` receives only a virtual back-relation with no database column**. Net effect: **zero `ALTER TABLE` statements against any existing table.** If a second product kind ever arrives, adding the enum + column then is a trivial additive migration. |
| Service-credit config removed | `SERVICE_CREDIT_AMOUNT_OPTIONS_CENTS`, terms copy, and all denomination logic deleted from `lib/matchmaker/config.ts` |
| Giver Consultation Benefit added | `MatchmakerGiverBenefit` model + 3 enums (`MatchmakerGiverBenefitType`, `MatchmakerGiverBenefitStatus`, `MatchmakerGiverConsultUse`), back-relation on `MatchmakerGiftEvent` |
| Stripe metadata simplified | `giftKind` dropped — one Matchmaker product means one shape: `kind:'gift'` + `flow:'matchmaker'` + `matchmakerProfileId` |
| Contract | decision 27 withdrawn (number retained); decisions 28–30 added; copy, analytics, and Part I legal item updated |

### Giver Consultation Benefit invariants (service-enforced)
- Issued **only** when `type = TMBC_CONSULT` **and** `status = CONFIRMED` **and** `confirmationSource = FIRST_PARTY_WEBHOOK`.
- `giftEventId @unique` ⇒ a redelivered Stripe webhook cannot mint a second free consultation.
- `AVAILABLE → REDEEMED` on booking (`selectedUse` = `OWN_REGISTRY` | `GIFTER_CONCIERGE`, `bookingRef` recorded).
- On reversal of the originating gift: `AVAILABLE → REVOKED`; an already `REDEEMED` benefit is **never** undone, only flagged for admin review.
- Not a qualifying gift — chain eligibility remains the original confirmed gift. Non-transferable in V1.

---

## Revision 2 items (retained, unchanged)

## What changed in revision 2 — all eight review items

| # | Gap | Fix |
|---|---|---|
| 1 | Invite → admitted profile not traceable | `MatchmakerProfile.admissionInviteId String? @unique` + named relation `"MatchmakerAdmission"`, back-relation `MatchmakerInvite.admittedProfile`. Chain `CONFIRMED GIFT → INVITE → PROFILE` is now deterministic; reversal resolves an exact target instead of guessing via `usedByUserId`. `userId` deliberately left **non**-unique. |
| 2 | Duplicate registries not actually prevented | `registryCanonicalKey String @unique` — server-derived normalized Babylist URL (lowercased host, tracking params stripped, trailing slash + supported URL forms canonicalized). `Registry.url` left non-unique: site-wide registry semantics unchanged. |
| 3 | Visibility semantics incomplete | Added `showLastInitial`, `showDueMonth`, `showFamilyStage` (joining `showLocation`, `showPhoto`) — all default false. Story policy **frozen as contract decision 20**: the approved story is mandatory public content for a LIVE profile, so no `showStory` flag exists by design. |
| 4 | No consent evidence | `termsAcceptedAt`, `termsVersion`, `publicProfileConsentAt`, `consentSnapshot Json`. |
| 5 | Gift moderation unauditable | `MatchmakerModerationAction.giftEventId String?` (soft, indexed). Null = profile action; set = gift-event action. One audit system, two targets. |
| 6 | User→Registry cascade consequence | **No schema change** (per instruction). Frozen as contract decision 21 + a required regression test. |
| 7 | Photo threw away asset identity | `photoMediaId → Media` `SetNull` + `Media.matchmakerProfilePhotos` back-relation. **`photoUrl` removed entirely.** |
| 8 | Confirmation source unrecoverable | `MatchmakerConfirmationSource` enum + nullable `confirmationSource`, indexed. Eligibility still exactly `status === CONFIRMED`. |

Plus, no schema change required: **Stripe metadata naming reserved now** as contract decision 22 — `kind:'gift'` (legacy) + `giftKind` + `flow:'matchmaker'` + `matchmakerProfileId`; the string `'matchmaker_consult'` is never used.

## Two additions I made beyond the eight — flagging explicitly

1. **`photoApprovedAt` / `photoApprovedById` on the profile.** Verified against the repo: `Media` has only `id/url/fileName/fileType/fileSize/createdAt` — **no approval or moderation state at all**. So "reuse Media + manual approval" cannot record the approval on `Media` without altering a shared model. Approval state therefore lives on the Matchmaker side. Publish rule: `showPhoto && photoApprovedAt != null`.
2. **`@@index([confirmationSource])`** so the confirmation-mix analytics you described don't table-scan.

## Diff summary (Revision 3)
- **12 new enums**, **6 new models**.
- **4 existing models gain back-relation fields only** — `User`, `Registry`, `Media`, `GiftCertificate`. All four are Prisma-level virtual fields; **none creates a database column.**
- **56 SQL statements:** 12 `CREATE TYPE`, 6 `CREATE TABLE`, 28 `CREATE INDEX`, 10 `ADD CONSTRAINT … FOREIGN KEY`.
- **Zero `ALTER TABLE` against any existing table. Zero destructive operations.** `/gift` and `GiftCertificate` are entirely untouched.

## Validation performed
The **on-disk** `prisma/schema.prisma` parses clean through Prisma's own engine (`@prisma/internals` `getDMMF`, v5.17.0 — matching the repo's pin). Asserted: 6 Matchmaker models, 12 enums, `GiftKind` absent, `GiftCertificate` scalar count **18 — identical to the pristine base**, `MatchmakerGiverBenefit.giftEventId` unique, benefit→event `Restrict`, back-relation present, and **no `Cascade` anywhere inside Matchmaker**. Native `prisma migrate diff` still cannot run here (Prisma's engine CDN is blocked from both sandboxes), so `matchmaker-migration-preview.sql` is hand-written to Prisma 5 codegen conventions — treat it as the expected shape and flag any divergence from what `migrate dev` produces.

## Schema invariants (the reviewable contract)
1. **No `Cascade` anywhere inside Matchmaker.** Hard FKs only where integrity is load-bearing: profile→registry `Restrict`, profile→user `SetNull`, profile→media `SetNull`, profile→admissionInvite `SetNull`, event→profile `Restrict`, event→certificate `SetNull`, invite→originGiftEvent `SetNull`, report/action→profile `Restrict`.
2. **Actor references stay soft** (`reviewedById`, `giverUserId`, `nominatedById`, `usedByUserId`, `resolvedById`, `actorUserId`, `photoApprovedById`) — indexed columns, no FK, so ledger/audit history survives account deletion. `giftEventId` on moderation actions is soft for the same reason.
3. **Eligibility primitive:** exactly `status === 'CONFIRMED'`. `confirmedAt` is canonical; `confirmationSource` records how; per-source timestamps preserved for audit.
4. **`REVERSED` mechanics:** CONFIRMED→REVERSED sets `reversedAt` + `reversalReason`; unused originated invite gets `revokedAt`; an already-redeemed invite resolves through `admissionInviteId` to set `profile.needsAdminReview = true` + a logged `REVERSAL_REVIEW` action. Nothing auto-deleted.
5. **Stable keys only** in `externalProvider`/`externalGiftKind`, validated against `lib/matchmaker/config.ts`. Labels never persist.
6. **Proof is structured fields only** — no file/media columns anywhere on gift events (contract Part G).
7. **No value ranking:** `amountCents` informational; no minimum-amount constraint exists.
8. **Server-generated identity:** `publicSlug`, `registryCanonicalKey`, `tokenHash`. Raw invite tokens never stored.
9. **One invite per originating gift; one certificate per event; one profile per admission invite** (`@unique` on each).
10. **Public output only via the allowlist serializer**, reading the `show*` flags + the photo publish rule.

## Two consequences worth deciding out loud (service-layer, not schema)
- **`registryCanonicalKey @unique` is global across all statuses.** A family whose profile is REMOVED/ARCHIVED still holds their key, so a re-application cannot insert a second row. Intended behavior: re-application **revives the existing profile record** rather than creating a duplicate — which is also the better product answer, since it preserves their gift history. Flagged so it's a decision, not a surprise.
- **Changing a registry URL recomputes the key**, which can collide with another profile. The service must reject that update with a clear duplicate error rather than throwing a raw Prisma unique violation.

## How this gets applied (on your approval)
1. ✅ Done — `prisma/schema.prisma` rebuilt from the pristine pre-apply backup with 3 back-relation lines + the Revision 3 models block, then re-validated.
2. **You run locally:** `npx prisma migrate dev --name matchmaker_core`, then `npx prisma generate`.
3. Nothing deploys until you push (Heroku `release:` runs `migrate deploy`).
4. Own migration directory, separate from any travel-system migration.
