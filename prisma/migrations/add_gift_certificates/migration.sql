-- Gift certificates: prepaid Registry Consults purchased for someone else.
-- Deploy-only migration (run on the Heroku Postgres before/at release).

DO $$ BEGIN
  CREATE TYPE "GiftStatus" AS ENUM ('PENDING_PAYMENT', 'ISSUED', 'REDEEMED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "GiftCertificate" (
  "id"                    TEXT NOT NULL,
  "code"                  TEXT NOT NULL,
  "status"                "GiftStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "amountCents"           INTEGER NOT NULL DEFAULT 7500,
  "currency"              TEXT NOT NULL DEFAULT 'usd',
  "purchaserName"         TEXT NOT NULL,
  "purchaserEmail"        TEXT NOT NULL,
  "recipientName"         TEXT NOT NULL,
  "recipientEmail"        TEXT,
  "giftMessage"           TEXT,
  "deliveryMode"          TEXT NOT NULL DEFAULT 'now',
  "stripeSessionId"       TEXT,
  "stripePaymentIntentId" TEXT,
  "issuedAt"              TIMESTAMP(3),
  "redeemedAt"            TIMESTAMP(3),
  "redeemedBookingRef"    TEXT,
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GiftCertificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GiftCertificate_code_key" ON "GiftCertificate"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "GiftCertificate_stripeSessionId_key" ON "GiftCertificate"("stripeSessionId");
CREATE INDEX IF NOT EXISTS "GiftCertificate_status_idx" ON "GiftCertificate"("status");
CREATE INDEX IF NOT EXISTS "GiftCertificate_purchaserEmail_idx" ON "GiftCertificate"("purchaserEmail");
CREATE INDEX IF NOT EXISTS "GiftCertificate_recipientEmail_idx" ON "GiftCertificate"("recipientEmail");
CREATE INDEX IF NOT EXISTS "GiftCertificate_createdAt_idx" ON "GiftCertificate"("createdAt");
