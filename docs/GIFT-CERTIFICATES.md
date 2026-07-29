# Gift Certificates (Phase 1)

Purchase a Registry Consult as a gift. Buyer pays $75 via Stripe Checkout, a
branded certificate + code is emailed, and the recipient self-redeems at `/redeem`
to book a **prepaid** (no-payment) Calendly session.

Self-booking is unchanged — only the gift path is new.

## Flow
1. `/gift` → toggle "myself" (→ `/book`) or "gift" → gift form.
2. `POST /api/gift/checkout` creates a `GiftCertificate` (PENDING_PAYMENT) + Stripe Checkout Session → redirects to Stripe.
3. Stripe → `POST /api/gift/webhook` (`checkout.session.completed`) marks it ISSUED and emails the certificate (recipient if "send now", else purchaser) + notifies admin.
4. `/gift/success` confirms; "self" delivery gets a "Download Certificate" link (`/gift/certificate/[code]`, print-to-PDF).
5. `/redeem` → `POST /api/gift/redeem` validates the code, marks REDEEMED, reveals the prepaid Calendly link.
6. Admin: `/admin/gifts` (Members & Consult nav) — list, resend, mark redeemed.

## Deploy steps
1. **Migrate**: run `prisma/migrations/add_gift_certificates/migration.sql` on the Heroku Postgres, then `npx prisma generate` (already in the build). This creates the `GiftCertificate` table + `GiftStatus` enum.
2. **Install**: `stripe` is in package.json; `npm install` on deploy picks it up. (Loaded via runtime dynamic import so builds don't require it present.)
3. **Env vars** (Heroku config):
   - `STRIPE_SECRET_KEY` — from the same Stripe account connected to Calendly.
   - `STRIPE_WEBHOOK_SECRET` — from the webhook endpoint you create (below).
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://www.taylormadebabyco.com` (optional; falls back to SITE_URL).
   - `NEXT_PUBLIC_CALENDLY_PREPAID_URL` — the **no-payment** "Prepaid Registry Consult" Calendly event (see below). Falls back to the paid event if unset.
   - (Already set) `SENDGRID_API_KEY`, `CONTACT_FROM_EMAIL`, `ADMIN_EMAIL`.
4. **Stripe webhook**: in the Stripe Dashboard → Developers → Webhooks → add endpoint
   `https://www.taylormadebabyco.com/api/gift/webhook`, event `checkout.session.completed`.
   Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
5. **Calendly prepaid event**: duplicate the $75 Registry Consult as a new event with **no payment / $0** collected, named e.g. "Prepaid Registry Consult". Put its inline URL in `NEXT_PUBLIC_CALENDLY_PREPAID_URL`. Keep it unlisted; it's only revealed after a valid code.

## Notes / caveats
- Calendly can't natively lock the free event to code-holders, so at V1 the prepaid link is "unlisted" (only shown after redemption). Phase 2 (a Calendly webhook to confirm the real booking + single-use enforcement) tightens this.
- The certificate "PDF" is a print-ready HTML page (`window.print()` → save as PDF), avoiding a heavy server PDF dependency.
- Amounts are in cents (`GIFT_AMOUNT_CENTS = 7500`). Change in `lib/gift/config.ts` if the price changes.

## Phase 2 / 3 (future)
- Calendly webhook → auto-mark REDEEMED on the actual booking.
- Scheduled delivery (send the certificate on a chosen date) via the scheduled-tasks infra.
- Multiple giftable consultation types / flexible amounts.
