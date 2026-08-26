# #BabylistItForward Matchmaker — Architecture Freeze (Phase 1)

**Status:** Frozen product contract. No schema, route, or UI changes have been made yet.
**Rollout state:** OFF (flag not yet created).
**Written:** 2026-08-25, audited against `main` @ `131c4aa` (working tree clean).
**v1.1 (2026-08-25):** Tot Squad Service Gifts addendum incorporated — fourth giving lane, extensible `EXTERNAL_SERVICE_GIFT` type, proof workflow, revised core loop and eligibility copy.
**v1.2 (2026-08-25, approved):** four hardening rules — stable provider keys, workflow-describing partner config, private structured proof (no media reuse), `REVERSED` gift status with non-destructive reversal handling — plus the equal-value principle.
**v1.3 (2026-08-25):** schema-review corrections — three new frozen policies (story publication, account deletion, Stripe metadata naming) added below as decisions 20–22.
**v1.4 (2026-08-25):** schema applied; five service-layer behaviors frozen as decisions 23–27.
**v1.5 (2026-08-25) — THREE LANES. SCHEMA REVISION 3 APPLIED.** TMBC Service Credit is **removed from V1 entirely**; the giving menu is three lanes. The TMBC consultation lane now carries the **Giver Consultation Benefit** (decisions 28–30). Old decision 27 (SERVICE_CREDIT denominations) is **withdrawn**. `GiftKind` was dropped rather than reduced to a single value, so **no existing table is altered by this migration at all**. Schema re-validated. **Migration `prisma/migrations/20260825_matchmaker_core/migration.sql` was generated and deployed to production in commit `dca2057`; `MATCHMAKER_MODE=off`.** The schema is closed for the MVP.
**Rule for this document:** Part A states only what was verified in the code this pass, with file paths. Parts B–H are the normative contract from Taylor's implementation brief (2026-08-25), adjusted only where the audit found the repo differs from the brief's assumptions — every such adjustment is marked **DELTA**.

---

## Product definition

**#BabylistItForward Matchmaker by Taylor-Made Baby Co.** — a moderated pay-it-forward registry discovery and gifting system inside the existing `registrywithtaylor` application.

> Real families. Reviewed registries. More intentional giving.

**Give — the three-lane menu:** browse approved family profiles, then help whichever way fits:

1. **Shop Their Babylist** — buy something directly from their reviewed registry.
2. **Gift a TMBC Consultation** — *"Give this family a private consultation with Taylor — and I'll gift you one too. Use yours for your own registry, or let me help you navigate their Babylist and understand the products before you choose what to send."*
3. **Gift Tot Squad Support** — help cover eligible Tot Squad services through a MotherFund or service gift card, once those mechanisms are verified and enabled.

A confirmed gift through **any** of the three lanes satisfies the gift-first requirement, equally.

The complimentary consultation the giver earns in lane 2 is a **benefit of that lane**, not a fourth lane and not itself a qualifying gift — the original confirmed `TMBC_CONSULT` gift is what satisfies eligibility. It gives the TMBC lane a legible exchange: *you give a family expert help, Taylor gives you expert help too* — and for a giver with no registry of their own, it becomes a personal Babylist translator before they spend a dollar.

**Join:** prove participation in the chain (or be nominated) → submit registry + short profile → manual TMBC review → appear in the public Matchmaker once approved → confirm gifts received → continue the chain.

**The core loop:** `HELP → CONFIRM → JOIN → RECEIVE → HELP AGAIN`. The qualifying act is helping another family — a $25 registry item, a stroller, a TMBC consultation, or practical support through Tot Squad all count equally once confirmed.

**Layer boundary:** TMBC is the trust, discovery, moderation, and concierge layer. Babylist remains the registry and third-party product-purchase layer. **TMBC never collects money intended for products on another family's Babylist registry.**

### Three non-negotiable principles
1. **Verification must be real.** If Taylor hasn't reviewed it, the public UI cannot call it reviewed or verified.
2. **Private information never becomes a UI concern.** The server decides what a public profile contains; React never receives secret fields to hide.
3. **This is a pay-it-forward network, not a fundraising marketplace.** No hardship ranking, no donation-platform visual language, no charity framing.

### The central modeling decision
There are no "member" and "mentor" sides. The same person can receive today and give tomorrow. `User.role` (`USER | ADMIN | REVIEWER`) stays a **security** enum only; Matchmaker participation is modeled as **states and events** (`MatchmakerProfile.status`, `MatchmakerGiftEvent`, `MatchmakerInvite`), never as auth roles.

---

# Part A — Current-state audit (verified 2026-08-25)

## A1. Auth & routing guards
- NextAuth credentials; `Role` enum is `USER | ADMIN | REVIEWER` (`prisma/schema.prisma`).
- `middleware.ts` gates `/admin/*` by `token.role === 'ADMIN'` and `/dashboard/*` (except `/dashboard/reviewer`) by any authenticated token, redirecting by role (`ADMIN→/admin`, `REVIEWER→/dashboard/reviewer`, else `/dashboard`). **Consequence:** `/dashboard/matchmaker/*` inherits auth with zero middleware changes; `/babylist-it-forward/*` is public by default.
- Server helpers: `requireAdminSession` / `requireAdminViewSession` (`lib/server/session.ts`); token-based `requireAdmin`/`requireAdminMutation`/`requireAdminOrReviewer` (`lib/server/apiAuth.ts`).
- Structural reference for account-creating approval flows: `lib/email/templates/memberApproval.ts` + the admin member-approval route (transaction: create user + send credentials). **Copy must be rewritten for Matchmaker; do not reuse Academy language.**

## A2. Registry
- `model Registry`: `id, userId (→User, onDelete: Cascade), platform (Platform enum incl. BABYLIST), name?, url, itemCount?, completedCount?, notes?, isPublic (default false), createdAt, updatedAt`. Indexes on `userId`, `platform`.
- API: `app/api/registry/route.ts` — session-gated GET/POST, platform + URL validation.
- **Verified as Taylor described:** `lib/server/prismaRegistry.ts` is a temporary `(prisma as any).registry` delegate, self-documented as deletable once the client regenerates (postinstall now runs `prisma generate`). **DELTA/decision:** Matchmaker code uses `prisma.registry` directly — Phase 3's `prisma generate` makes it real. Delegate cleanup is a separate chore, not part of this project.
- **Relation rule (new):** `MatchmakerProfile.registryId → Registry` must be `onDelete: Restrict`. A user must not cascade-orphan a LIVE public profile by deleting their registry row; the service layer requires pausing/removing the profile first. (Lesson imported from the travel-system audit, where `Cascade` destroys dependent records silently.)

## A3. Member dashboard shell
- `app/dashboard/(member)/page.tsx` already: resolves session → redirects by role → loads `registries` (via delegate) + `consultationRequest.count({ where: { email } })` → renders `MemberDashboardClient`. `robots: noindex` set.
- Reusable now: layout + `RegistrySection/RegistryCard/RegistryForm/PlatformSelector`, `ProfileSettingsPanel`, `DashboardHero`, `DueDateCountdown`, `ChangePasswordForm`.
- Academy-coupled (retire **only after** Matchmaker is stable, per brief §7): `lessonProgress`/`moduleNote`/`Learner` queries, `ContinueLearning`, `PathCard`, `WorkbookPanel`, `AcademyProgressCard`, `(member)/academy/*`, `(member)/tools`.

## A4. Gift system (the foundation for §17–18)
Verified end-to-end in `app/api/gift/checkout/route.ts` (115 ln), `app/api/gift/webhook/route.ts` (110 ln), `app/api/gift/redeem/route.ts` (73 ln), `components/gift/GiftForm.tsx`, `lib/gift/config.ts`, `docs/GIFT-CERTIFICATES.md`:

- **Checkout:** rate-limited (12/min/IP) → validates purchaser/recipient fields → **creates `GiftCertificate` (`PENDING_PAYMENT`) before the Stripe session** → creates Stripe Checkout with `metadata: { giftId, code, kind: 'gift' }` (also on payment_intent) → stores `stripeSessionId` → rolls the pending row back if Stripe fails. Taylor's description confirmed exactly.
- **Webhook:** signature-verified; `checkout.session.completed` + `payment_status==='paid'` → idempotent via `status !== 'PENDING_PAYMENT'` check → marks `ISSUED` → emails recipient/purchaser/admin via SendGrid; email failure does not fail the webhook.
- **Redeem:** rate-limited; `mode: 'check' | 'redeem'`; `ISSUED → REDEEMED`; returns `CALENDLY_PREPAID_URL`.
- **Schema:** `GiftCertificate` already has `amountCents Int @default(7500)`, `currency`, `deliveryMode ('now'|'self')`, nullable `recipientEmail`, `stripeSessionId @unique`, `redeemedBookingRef`. `GiftStatus = PENDING_PAYMENT | ISSUED | REDEEMED | REFUNDED`.
- **DELTA:** `amountCents` already exists per-certificate, so a future variable-amount or multi-product gift needs only a discriminator column — not a re-architecture. `docs/GIFT-CERTIFICATES.md` Phase 2/3 already lists "Multiple giftable consultation types / flexible amounts" as intended future work. **V1 ships neither** (v1.5): the Matchmaker gift is the fixed $75 consultation, exactly as `/gift` works today.
- **Metadata extension point:** `kind: 'gift'` is already in Stripe metadata, and additional keys extend it cleanly. Per **decision 22**, Matchmaker adds `flow: 'matchmaker'` + `matchmakerProfileId` as new keys — `kind` is never overloaded, and the value `'matchmaker_consult'` is never used.

## A5. Consultations & Calendly
- `ConsultationRequest` (keyed by email — how the dashboard counts them), `ConsultationResponse`, `BookingEvent` (generic: `type, sourcePage, service, utm*, ipHash`) for booking analytics.
- Calendly is URL-config only: `CALENDLY_URL`, `CALENDLY_PREPAID_URL` (`lib/gift/config.ts`). **Keep URL-based for MVP** (brief §20). Gifter Concierge adds `NEXT_PUBLIC_CALENDLY_GIFTER_CONCIERGE_URL` — the Calendly event itself must be created by Taylor.
- Three distinct service states with distinct labels (brief §20): NORMAL PAID CONSULT / GIFTED CONSULT / GIFTER CONCIERGE.

## A6. Email
- Transport: **SendGrid only** (`lib/email/sendEmail.ts`; Microsoft Graph env vars exist but hold placeholder values). `getAdminEmail()` fallback chain exists.
- Template convention: `lib/email/templates/*.ts` exporting render functions, shared partials in `shared.ts`. Matchmaker namespace: `lib/email/templates/matchmaker/`.
- **Environment caveat:** local `.env` has `SENDGRID_API_KEY=your_key_here` — local sends throw; production is configured (per gift docs). Email-sending paths need graceful failure in dev.

## A7. Analytics
- `lib/analytics.ts`: central event→category map; the `academy_*` family shows the naming convention a `matchmaker_*` family should follow. `AnalyticsEvents` consts in `lib/analytics/events.ts`.
- **`OutboundClick` is ready-made for §11:** it already has `retailer, url, source, pageType, path, product, visitorHash`. Babylist clicks from profiles: `retailer='Babylist'`, `source='matchmaker'`, `product=<publicSlug>`. No schema change needed for outbound tracking.
- `/api/tools/event` exists as the client event sink; `/api/affiliate/click` as the outbound pattern.

## A8. Rate limiting & safety plumbing
- `lib/server/rateLimit.ts`: in-memory token bucket keyed `route:ip` (used by gift checkout/redeem, contact, comments, uploads). **Caveat:** per-process memory — resets on dyno restart, not shared across dynos. Acceptable at current scale; Matchmaker reuses it, and this limitation is accepted for MVP.
- `getRequestIp` in `lib/server/viewTracking.ts`; `visitorHash` pattern exists for dedupe.
- Upload path exists: `app/api/admin/upload/route.ts` (rate-limited) + `Media` model — photo handling can build on this (admin-side approval flow) rather than inventing storage.

## A9. Admin UI kit
- Established components used across `/admin/catalog/*`: `AdminField`, `AdminSelect`, `AdminInput`, `AdminTextarea`, admin toggles, `<details>` row accordions, bulk-select lists (`CatalogBulkList`), Server Actions with `requireAdminSession` per action. `/admin/matchmaker` uses this kit — no new design language.

## A10. Feature flags
- Convention (`lib/featureFlags.ts`): env string `=== 'true'`; `NEXT_PUBLIC_*` is **inlined at build time → changing it requires a rebuild/deploy**.
- **DELTA/decision:** a tri-state build-time public flag would make PRIVATE_BETA↔PUBLIC transitions a deploy. Design: `MATCHMAKER_MODE` (server-read: `off | private_beta | public`) drives all server rendering and APIs; a `NEXT_PUBLIC_MATCHMAKER_ENABLED` mirror is used **only** for nav visibility. In `private_beta`, access = admin session **or** valid invite/approved-profile session — checked server-side per request, so individual invitees can be admitted without rebuilds.

## A11. Tooling / environment constraints (affects how phases execute)
1. **Git writes from the sandboxed VM will fail.** The mounted repo forbids file deletion, and git's commit path unlinks `.git/index.lock` (a stale lock warning already appears on `git status`). → Taylor runs all commits; reads from the VM are unaffected. **Current baseline: the Matchmaker foundation landed in commit `dca2057`** (schema, migration `20260825_matchmaker_core`, rollout controls, three-lane config), deployed to production with `MATCHMAKER_MODE=off`.
2. **MIGRATION POLICY — `prisma migrate dev` is NOT used on this project.** Taylor's local shadow database is unreliable, so that command is intentionally avoided. The policy is:
   - **Never run `prisma migrate dev`.**
   - **`npx prisma generate` is safe to run locally** — it only regenerates the Prisma client from the schema and touches no database.
   - **Committed migrations deploy via Heroku's `release` phase, which runs `prisma migrate deploy`.**
   - The schema is closed for the MVP; do not author another Matchmaker migration without first raising a blocking issue.
3. **vitest `4.1.11` is installed** (`devDependencies`) and **verified on Taylor's Mac** — `npx vitest run --passWithNoTests` exited successfully with code 0. §36's suite is written as vitest specs. Note: vitest 4 uses rolldown, whose native binding is platform-specific; only the `darwin-arm64` binding is installed, so the suite runs on Taylor's Mac but cannot execute inside the `linux-arm64` sandbox. Typechecking is unaffected.
4. **Sequencing with the travel-system refactor:** both projects touch `prisma/schema.prisma`. Matchmaker migrations and travel-system migrations must be separate migration directories, landed independently (either order), never combined — same principle as brief §38's Academy-cleanup rule.

---

# Part B — Frozen decisions (normative)

1. **No new auth roles.** Participation = states/events. (§1)
2. **Flag rollout:** OFF → PRIVATE_BETA → PUBLIC via `MATCHMAKER_MODE` (A10). No public launch during construction. (§2)
3. **Registry stays the registry-URL record;** Matchmaker state lives in `MatchmakerProfile` related 1:1 via `registryId @unique`. (§3)
4. **No `isVerified` boolean.** Review is decomposed (`registryReviewed`, `ownershipReviewed`, reviewer, timestamps) and auditable. (§3, §15)
5. **Gifts are a durable event ledger** (`MatchmakerGiftEvent`); only `CONFIRMED` events count toward eligibility. A click is never a gift; a submitted claim is never a gift; only a confirmed gift counts. (§4, Addendum)
6. **Confirmation is source-agnostic.** The eligibility rule reads exactly `gift.status === 'CONFIRMED'`; a gift may reach CONFIRMED via recipient confirmation (external Babylist purchases), admin review of submitted proof (external service gifts such as Tot Squad), or a trusted first-party webhook (TMBC Stripe gifts auto-confirm; no recipient confirmation needed). (§4, §17, Addendum)
6a. **Partners are config, not schema — and the config describes the workflow.** External partners never become enum members. The type is `EXTERNAL_SERVICE_GIFT`; the database persists **stable identifier keys only** (`externalProvider: 'tot-squad'`, `externalGiftKind: 'motherfund' | 'service_gift_card'`) — never display labels, so a partner rebrand is a config edit, not a data migration. The allowlist in `lib/matchmaker/config.ts` owns, per provider and per gift kind: `displayName`/`label`, `enabled`, `destinationUrl`, `confirmationMethods` (`RECIPIENT | ADMIN_PROOF | FIRST_PARTY_WEBHOOK`), and `requiresRecipientRelay`. **Both Tot Squad kinds ship `enabled: false`** until their operating mechanics are verified (Part I #8) — the UI can be built now against disabled entries. No route-level `if (provider === …)` branching, ever. (Addendum, v1.2 #1–2)
6c. **`REVERSED` is a first-class outcome.** `MatchmakerGiftStatus` includes `REVERSED`: a previously confirmed gift later refunded, charged back, invalidated, or administratively reversed. Eligibility stays exactly `gift.status === 'CONFIRMED'`, so a reversed gift automatically stops being qualifying evidence. Reversal handling is **never destructive**: an unused invite originated by the gift is revoked; an already-redeemed invite flags the resulting profile for admin review (`needsAdminReview` + a logged `REVERSAL_REVIEW` moderation action) — a Stripe refund must never cascade into automatic account or profile deletion. (v1.2 #4)
6d. **Equal value of giving (frozen).** *A genuine confirmed act of giving qualifies. Gift value does not determine a family's worth or a giver's standing in the program.* There is no minimum-spend threshold anywhere in schema, service logic, or copy; `amountCents` is informational only. Admin may still reject obviously abusive attempts under moderation rules. (v1.2)
6b. **External-gift privacy.** A third-party purchase never exposes the family's email, phone, or other private profile data. There is no "reveal recipient email" control, ever. If a partner's process needs recipient information that cannot flow through a server-side integration, the UI instead tells the giver exactly what to obtain/provide through the approved gifting process, and deliverables (e.g. gift-card codes) are relayed to the family privately by TMBC. (Addendum)
7. **Invites** (`MatchmakerInvite`, hashed token, single-use, expiring) gate applications; `TMBC_NOMINATED` bypasses the gift-first requirement. GIVE → CONFIRMED → UNLOCK → SUBMIT → REVIEW → LIVE. (§5)
8. **Auth flow for new applicants:** email verified by one-time Matchmaker token → normal `USER` created → password setup → profile associated. Matchmaker-specific copy. (§6)
9. **Never auto-publish.** Submission lands `UNDER_REVIEW`; admin checklist (§33) must be completed; every moderation decision logged with actor + timestamp. (§14–15)
10. **Public output is allowlist-serialized** (`toPublicMatchmakerProfile()`); never spread a Prisma row into public API/props. Forbidden-fields list per §23. (§23)
11. **Babylist is the commerce layer:** open the exact reviewed URL; no scraping, no duplication, no checkout recreation, no shipping addresses, no product funds. (§11)
12. **Verification language:** "Registry reviewed by TMBC" / "Registry ownership reviewed" — never "identity verified", never "scam-free". (§9, §22)
13. **No hardship ranking; no donation-platform UI.** Directory default order randomized/rotating within recently-active. Filters only on voluntarily shared, non-ranking facts. (§30–31)
14. **Indexing:** landing `index,follow`; profile pages `noindex,nofollow` during beta (dashboard already models the noindex pattern). (§24)
15. **Recipient is never obligated** to give; gift-first applies only to voluntary self-listing. Public application copy (frozen, replaces "buy another family a registry gift first"): *"Start by helping another family. Purchase something from a reviewed Babylist registry, gift them a consultation with Taylor, or give eligible Tot Squad support. Once your gift is confirmed, you'll be invited to apply to join the Matchmaker yourself."* (§29, Addendum; amended v1.5)
16. **Anonymity:** public anonymity and recipient-facing anonymity supported; TMBC always retains giver email privately; no fully untraceable submissions. (§28)
17. **Profiles expire into re-review** (`lastConfirmedActiveAt`, `nextReviewAt`; LIVE→PAUSED→ARCHIVED on non-response; self-pause anytime). (§26)
18. **Legal:** Terms/Privacy get Matchmaker sections (independent program, no Babylist affiliation, no gift guarantees, not tax-deductible, not a charity). Same independence language for every external service partner: Tot Squad purchases occur on Tot Squad's platform; TMBC does not control their fulfillment, terms, or refunds, and no official affiliation is implied unless separately established. Ship before PRIVATE_BETA admits non-TMBC families. (§32, Addendum)
19. **Beta order:** seed 10–25 `TMBC_NOMINATED` families with explicit consent → controlled gifter beta → only then open applications. (§34–35)
20. **The approved short story is mandatory public content for any LIVE profile.** Publishing a story is inherent to being listed, so there is deliberately **no `showStory` flag**. Applicants consent to publication of the *approved* story when they submit for listing; the story is still reviewed and editable, and a family that does not want any story public does not list. Every *other* public field is opt-in via its own flag (`showLastInitial`, `showLocation`, `showDueMonth`, `showFamilyStage`, `showPhoto`), all defaulting to false. (v1.3)
21. **Matchmaker-linked accounts are never hard-deleted.** The pre-existing chain is `User → Registry (Cascade) → MatchmakerProfile (Restrict)`, so a raw `user.delete()` on a participant would attempt to cascade into their Registry and be blocked by the profile — failing the whole deletion. This is **intentional and left unchanged**: existing Registry semantics are not altered by this project. Instead, account removal for a participant means **deactivation/anonymization**, and hard deletion is permitted only after the profile is ARCHIVED/REMOVED and its registry relationship deliberately resolved. Enforced by a service-layer guard and an explicit regression test, so the constraint is discovered by us, not by someone's deletion request. *(Verified: no `user.delete()` call site exists in the codebase today — this is preventive.)* (v1.3)
22. **Stripe metadata: `kind` is not overloaded.** Matchmaker checkout sessions send `kind: 'gift'` (legacy, preserved for the existing webhook path), `flow: 'matchmaker'` (the entry path), and `matchmakerProfileId`. No value like `'matchmaker_consult'` is ever used — it would masquerade as an enum member. With SERVICE_CREDIT removed there is only one Matchmaker product, so **no `giftKind` field ships in V1**; it is the field to add if a second product kind ever arrives. No schema change; this is an integration contract. (v1.3, amended v1.5)
23. **Re-application revives, never duplicates.** A new application whose registry canonicalizes to an existing `registryCanonicalKey` **revives that profile row**. The existing `id`, gift history, moderation history, consent records, and audit trail are preserved; only the fields and statuses the re-application workflow intentionally updates are reset. A second profile for the same canonical registry is never inserted. (v1.4)
24. **Duplicate-registry errors are domain errors.** A registry-URL update that canonicalizes to another profile's key returns a clean, user/admin-facing duplicate-registry error. A raw Prisma unique-constraint violation must never reach a user, an admin, or an API response. (v1.4)
25. **Photo publication requires all three conditions:** `showPhoto === true` **and** `photoMediaId != null` with the `Media` relation actually resolving **and** `photoApprovedAt != null`. If the Media row is later deleted, `photoMediaId` goes null via `SetNull` — a stale `photoApprovedAt` must never make anything public on its own. The serializer evaluates the live relation, not the timestamp alone. (v1.4)
26. **Cross-record integrity for soft references.** Any `MatchmakerModerationAction` carrying a `giftEventId` must be validated at write time to confirm that gift event belongs to the same `profileId`. Because the reference is intentionally soft (no FK, so audit rows survive), this integrity lives in service validation and is covered by tests. (v1.4)
27. ~~**SERVICE_CREDIT is fixed-denomination in V1.**~~ **WITHDRAWN in v1.5** — TMBC Service Credit is removed from V1 entirely. Number retained so decision references in commits and reviews stay stable.
28. **The Giver Consultation Benefit.** A `TMBC_CONSULT` gift that reaches `CONFIRMED` **via the trusted Stripe webhook** earns the giver one complimentary TMBC consultation, recorded as a `MatchmakerGiverBenefit` row. The giver chooses `OWN_REGISTRY` (their own registry/planning) or `GIFTER_CONCIERGE` (understanding the chosen family's Babylist and products before deciding what to send). It is a thank-you entitlement, **not a giving lane and not a qualifying gift** — chain eligibility comes from the original confirmed gift. **Non-transferable in V1** unless Taylor changes that policy explicitly. (v1.5)
29. **Benefit issuance is idempotent and single-use.** `giftEventId @unique` on the benefit means a redelivered Stripe webhook can never mint a second free consultation. Issuance requires `type = TMBC_CONSULT` **and** `status = CONFIRMED` **and** `confirmationSource = FIRST_PARTY_WEBHOOK`; no other path creates one. (v1.5)
30. **Benefit reversal is non-destructive.** If the originating gift is later `REVERSED`: an `AVAILABLE` benefit becomes `REVOKED`; an already-`REDEEMED` benefit is **never** undone — it is flagged for admin review alongside the existing reversal workflow (decision 6c). A refund never claws back a consultation someone already had. (v1.5)

---

# Part C — Data model (Phase 3; additive only)

New enums: `MatchmakerProfileStatus (DRAFT SUBMITTED UNDER_REVIEW NEEDS_INFO APPROVED LIVE PAUSED REJECTED REMOVED ARCHIVED)`, `MatchmakerEntryMethod (TMBC_NOMINATED GIFTED_FIRST RECEIVED_THROUGH_MATCHMAKER ADMIN_OVERRIDE)`, `MatchmakerGiftType (BABYLIST_PURCHASE TMBC_CONSULT EXTERNAL_SERVICE_GIFT OTHER_APPROVED)` — `OTHER_APPROVED` is an internal/admin escape hatch, never publicly offered, `MatchmakerProofStatus (NOT_PROVIDED SUBMITTED ADMIN_REVIEWED)`, `MatchmakerGiftStatus (STARTED REPORTED_SENT AWAITING_RECIPIENT_CONFIRMATION CONFIRMED DISPUTED CANCELED REVERSED)`, `MatchmakerInviteReason (GIFTED_FIRST RECEIVED_GIFT TMBC_NOMINATION ADMIN_INVITE)`, `MatchmakerGiverBenefitType (COMPLIMENTARY_TMBC_CONSULT)`, `MatchmakerGiverBenefitStatus (AVAILABLE REDEEMED REVOKED)`, `MatchmakerGiverConsultUse (OWN_REGISTRY GIFTER_CONCIERGE)`. **No `GiftKind` enum** — with SERVICE_CREDIT removed it would carry a single value, so it was dropped rather than added; `GiftCertificate` is therefore completely untouched by this migration.

Models per the brief's §3–5 sketches, adjusted to repo conventions (cuid ids, explicit relations, indexes on every FK and status column), plus:

- `MatchmakerProfile` — relations `user User? (SetNull)`, `registry Registry (Restrict)`, `photoMedia Media? (SetNull)`, `admissionInvite MatchmakerInvite? (SetNull, @unique)`; `lastConfirmedActiveAt` + `nextReviewAt` (§26). `publicSlug` and `registryCanonicalKey` are server-generated, never user-supplied. **`registryCanonicalKey @unique`** is the real duplicate-enrollment guard: `registryId @unique` only stops two profiles sharing one `Registry` **row**, not two Registry rows holding the same Babylist URL — the key is a normalized form of the reviewed URL (lowercased host, tracking params stripped, trailing slash and supported Babylist URL forms canonicalized). **Consent evidence** (`termsAcceptedAt`, `termsVersion`, `publicProfileConsentAt`, `consentSnapshot Json`) answers "what exactly did this person agree to, and when" without depending on whatever the form says later. **Per-field publication flags** all default false (decision 20). Photo approval state lives here (`photoApprovedAt`, `photoApprovedById`) because `Media` carries none of its own; a photo is publishable only when `showPhoto` **and** `photoApprovedAt` are set.
- `MatchmakerGiftEvent` — as specified, with relations to profile (`Restrict`), optional `giftCertificate` and giver `User`; index `(recipientProfileId, status)`. External-gift fields (used when `type = EXTERNAL_SERVICE_GIFT`): `externalProvider String?` and `externalGiftKind String?` hold **stable keys** (`tot-squad`, `motherfund`) validated at the service layer against the config allowlist (decision 6a), never labels and never free-form; `externalOrderRef String?`, `proofPurchaseDate DateTime?`, `proofNote String?` (private explanation), `proofStatus MatchmakerProofStatus @default(NOT_PROVIDED)`. Reversal fields: `reversedAt DateTime?`, `reversalReason String?`. `reportedAt` / `recipientConfirmedAt` / `adminConfirmedAt` cover the confirmation timestamps, with a canonical `confirmedAt` stamped whenever status reaches CONFIRMED and **`confirmationSource MatchmakerConfirmationSource?`** (`RECIPIENT | ADMIN | FIRST_PARTY_WEBHOOK`) recording *how*. Source-agnostic eligibility does not mean source-less audit: the enum gives clean confirmation-mix analytics without reconstructing history from nullable timestamps. Eligibility remains exactly `status === CONFIRMED`.
- `MatchmakerInvite` — `tokenHash` (never the raw token), `email`, `reason`, `originGiftEventId? @unique`, `expiresAt`, `usedAt?`, `usedByUserId?`, `revokedAt?`, `nominatedById?`, `intendedAction`, plus the back-relation `admittedProfile`. The **admission chain `CONFIRMED GIFT → INVITE → PROFILE` is now deterministic**: reversal handling resolves the exact profile through `admissionInviteId`, rather than guessing via `usedByUserId` (which cannot guarantee one profile per user).
- `MatchmakerReport` (§25) — profileId, reason enum, freetext, reporter contact?, status, resolution; auto-pause threshold is service logic, never auto-delete.
- `MatchmakerModerationAction` (§15/§33) — `profileId` (hard FK), **`giftEventId?` (soft, indexed)**, `actorUserId`, `action`, checklist snapshot (Json), note, createdAt. One audit system, two targets: `giftEventId = null` is profile moderation; set means gift-event moderation (Confirm / Request info / Dispute / Cancel / reversal review) from the gifts queue — so "which exact gift did Taylor confirm" is answerable.
- `MatchmakerGiverBenefit` — `giftEventId @unique` → `MatchmakerGiftEvent` (`Restrict`), `giverUserId?`, `giverEmail`, `type`, `status`, `selectedUse?`, `issuedAt`, `redeemedAt?`, `bookingRef?`, `revokedAt?`. Indexed on `(giverEmail, status)`, `(giverUserId, status)`, `status`.
- `GiftCertificate` receives **only a virtual back-relation** (`matchmakerGiftEvent MatchmakerGiftEvent?`) — a Prisma-level field with no database column, since the FK lives on the gift-event side. **Zero `ALTER TABLE` statements against any existing table.**

---

# Part D — Routes & APIs

Public (server-rendered reads; no open JSON directory API): `/babylist-it-forward`, `/families`, `/families/[slug]`, `/give`, `/apply`, `/concierge`.
Participant (auth inherited from middleware): `/dashboard` + `/dashboard/matchmaker{,/profile,/registry,/gifts,/pay-it-forward}`.
Admin: `/admin/matchmaker{,/profiles,/profiles/[id],/gifts,/reports,/analytics}` — Server Actions + `requireAdminSession`, per the admin kit.
APIs per brief §41 (`/api/matchmaker/*`, `/api/admin/matchmaker/*`), all flag-gated, rate-limited, and calling Part E services.
Gift context: `/gift?matchmaker=<slug>` accepted, immediately exchanged server-side for a short signed context token; **recipient email is resolved server-side only** (§17, §37).

# Part E — Service layout (brief §39, adopted verbatim)

`lib/matchmaker/` (pure domain: types, config, eligibility, publicProfile serializer, profileStatus, giftStatus, invite, privacy) and `lib/server/matchmaker/` (Prisma-touching: profiles, applications, gifts, moderation, invites, analytics). Routes stay thin.

# Part F — Integration contracts

- **Gift-a-Consult (§17):** entered via profile → GiftForm shows public name only, recipient locked. Checkout metadata follows decision 22 — `kind: 'gift'` (legacy, untouched), `flow: 'matchmaker'`, `matchmakerProfileId` — never `'matchmaker_consult'`. The webhook, after marking ISSUED, confirms the linked `MatchmakerGiftEvent` with `confirmationSource = FIRST_PARTY_WEBHOOK`, then issues the giver's `MatchmakerGiverBenefit` in the same idempotent guard (decisions 28–29). `/gift` standalone behavior unchanged — regression-tested.
- **Outbound clicks (§11):** existing OutboundClick pipeline, `source='matchmaker'` — `retailer='Babylist'` for registry clicks, `retailer='Tot Squad'` for the service-gift lane, `product=<publicSlug>`.
- **Tot Squad lane (Addendum):** operationally identical to the Babylist lane until a direct integration exists — external transaction, reported then confirmed: choose "Gift Tot Squad Support" → open the **approved** Tot Squad gifting destination (from the config allowlist, never a user-supplied URL) → giver purchases with Tot Squad → returns → "I sent this family Tot Squad support" → submits kind (MotherFund vs service gift card), optional amount + order reference → recipient confirms **or** Taylor reviews the proof → `CONFIRMED` → giver qualifies. The report form is the same generalized "I sent this family something" flow as Babylist, with the provider preselected by the lane clicked.
- **Admin gift verification (Addendum):** `/admin/matchmaker/gifts` lists every event with family, giver, provider, external gift kind, amount (if supplied), reported date, order/reference, recipient-confirmation state, proof/review status, and final status. Actions: **Confirm · Request more information · Dispute · Cancel** — each logged to `MatchmakerModerationAction`.
- **Concierge (§19–20):** free 15–20 min Calendly event, `?family=<slug>` context retained, tracked as its own event family — never conflated with the recipient's $75 consult.
- **Emails (§21):** 15-template namespace `lib/email/templates/matchmaker/` on the SendGrid helper; all cross-party communication routes through TMBC; no automatic email disclosure between strangers.
- **Analytics (§27 + Addendum):** `matchmaker_*` event family registered in `lib/analytics.ts` + funnel/admin panel; no public gamification. Every gift event carries a **provider dimension** (`Babylist`, `TMBC`, `Tot Squad`, …) usable as a source/filter, and the admin panel gets a **value-mix breakdown** — products (Babylist) vs planning help (TMBC consultations) vs support services (external partners) — per family and program-wide.

# Part G — Privacy & safety contract

- Serializer allowlist is the only path to public data (§23 forbidden list adopted verbatim: no email/phone/addresses/DOB/hospital/medical/financial/notes/receipts/auth data/exact due date without approval).
- §37 security regression: `/gift?matchmaker=<slug>` must never expose recipientEmail/userId/notes/phone in HTML, RSC payload, props, API, analytics URLs, or Stripe success URL. The same regression extends to the Tot Squad lane: the external-gift flow and report form must never surface private profile data (decision 6b), and there is no recipient-contact reveal anywhere in the giving UI.
- §22 controls: rate limits, dupe profile/registry detection, Babylist-host validation, sanitization + length limits, manual photo approval, audit trail, report + pause + dispute workflows.
- **External gift proof is private moderation material and may never use a publicly addressable profile-media workflow. V1 collects structured proof fields only** (order/reference number, purchase date, amount, optional private explanation) **— no receipt-image uploads. Receipt/file uploads are deferred until private-file storage is defined.** Family photos may use the `Media` pipeline; proof may not — a receipt can carry purchaser identity, order numbers, partial card data, and billing details. Taylor requests additional evidence manually when needed. (v1.2 #3)

# Part H — Phase plan & gates

Per brief §38, amended by A11:

```
P1 ✅ this document
P2 flag (MATCHMAKER_MODE)                 — code only
P3 schema + additive migration            — ✅ DONE (20260825_matchmaker_core, commit dca2057).
                                            Migrations are authored in-repo and deployed by Heroku's
                                            release phase (`prisma migrate deploy`). `prisma migrate dev`
                                            is never used; `npx prisma generate` refreshes the local
                                            client. Separate migration dir from travel-system work.
P4 services + serializer + APIs           — with unit tests (vitest, once installed)
P5 admin UI → P6 participant UI → seed test data → validate
P7 public read routes → PRIVATE_BETA on
P8 gift/Stripe integration + giver benefit + concierge (§42: after profiles/privacy proven)
P9 emails, analytics, safety, full §36–37 suite
P10 TMBC_NOMINATED beta seed → gifter beta → §43 checklist → PUBLIC recommendation
```

Academy retirement and destructive cleanup remain separate later projects. The §43 launch checklist is the gate for recommending PUBLIC; nothing is called finished without the automated coverage in §36–37.

# Part I — Open items needing Taylor

1. **Commit workflow:** grant repo delete-permission so I can run git, or you commit each phase (A11.1).
2. `npm i -D vitest` (A11.3 — also unblocks the travel-system suite).
3. Create the **Gifter Concierge Calendly event** → `NEXT_PUBLIC_CALENDLY_GIFTER_CONCIERGE_URL`.
4. ~~Service-credit terms~~ — **moot in v1.5** (SERVICE_CREDIT removed). Replaced by: **confirm the Giver Consultation Benefit has no expiry**, or set one; and confirm it is non-transferable in V1 as frozen in decision 28.
5. **Photo storage decision:** reuse `Media` + admin upload with manual approval (recommended), or defer photos from MVP.
6. **Beta seed list:** the 10–25 TMBC families for §34.
7. Confirm Phase 2+3 go-ahead, and whether travel-system hardening lands before or after (they're independent; migrations must just stay separate).
8. **Tot Squad operational details (launch-configuration blockers, not build blockers — both gift kinds ship `enabled: false` in config until resolved):** (a) the approved gifting destination URL(s) for MotherFund and service gift cards; (b) delivery mechanics — how a purchased gift reaches the family without exposing their contact info (likely: code relayed through TMBC, since TMBC holds the private email — confirm with Tot Squad); (c) whether MotherFund purchases can be directed to a named third-party family at all, verified with Tot Squad before the lane is shown publicly.
