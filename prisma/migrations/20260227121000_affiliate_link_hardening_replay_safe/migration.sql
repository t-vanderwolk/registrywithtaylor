-- Replay-safe hardening for affiliate link tracking tables.
-- Handles legacy shape from 20260226193503_affiliate_link_tracking_phase0
-- and preserves idempotency if partially applied.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF to_regclass('"AffiliateClick"') IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateClick_affiliateLinkId_fkey') THEN
      EXECUTE 'ALTER TABLE "AffiliateClick" DROP CONSTRAINT "AffiliateClick_affiliateLinkId_fkey"';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliateLink"') IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateLink_affiliateId_fkey') THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" DROP CONSTRAINT "AffiliateLink_affiliateId_fkey"';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateLink_blogPostId_fkey') THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" DROP CONSTRAINT "AffiliateLink_blogPostId_fkey"';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliateClick"') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateClick' AND column_name = 'affiliateLinkId'
    ) AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateClick' AND column_name = 'linkId'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateClick" RENAME COLUMN "affiliateLinkId" TO "linkId"';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateClick' AND column_name = 'ipAddress'
    ) AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateClick' AND column_name = 'ipHash'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateClick" RENAME COLUMN "ipAddress" TO "ipHash"';
    END IF;

    EXECUTE 'ALTER TABLE "AffiliateClick" ADD COLUMN IF NOT EXISTS "path" TEXT';
    EXECUTE 'ALTER TABLE "AffiliateClick" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliateLink"') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'affiliateId'
    ) AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'partnerId'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" RENAME COLUMN "affiliateId" TO "partnerId"';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'shortCode'
    ) AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'code'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" RENAME COLUMN "shortCode" TO "code"';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'context'
    ) AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'label'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" RENAME COLUMN "context" TO "label"';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'AffiliateLink' AND column_name = 'partnerId'
    ) THEN
      EXECUTE 'ALTER TABLE "AffiliateLink" ALTER COLUMN "partnerId" DROP NOT NULL';
    END IF;

    EXECUTE 'ALTER TABLE "AffiliateLink" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP';
    EXECUTE 'ALTER TABLE "AffiliateLink" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliatePartner"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE "AffiliatePartner" ADD COLUMN IF NOT EXISTS "allowedDomains" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]';
  END IF;
END $$;

DROP INDEX IF EXISTS "AffiliateLink_shortCode_key";

DO $$
BEGIN
  IF to_regclass('"AffiliateLink"') IS NOT NULL THEN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS "AffiliateLink_code_key" ON "AffiliateLink"("code")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "AffiliateLink_partnerId_idx" ON "AffiliateLink"("partnerId")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "AffiliateLink_createdAt_idx" ON "AffiliateLink"("createdAt")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "AffiliateLink_blogPostId_idx" ON "AffiliateLink"("blogPostId")';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliateClick"') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "AffiliateClick_linkId_createdAt_idx" ON "AffiliateClick"("linkId", "createdAt")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt")';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"AffiliateLink"') IS NOT NULL
    AND to_regclass('"AffiliatePartner"') IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateLink_partnerId_fkey')
  THEN
    EXECUTE 'ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "AffiliatePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE';
  END IF;

  IF to_regclass('"AffiliateLink"') IS NOT NULL
    AND to_regclass('"Post"') IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateLink_blogPostId_fkey')
  THEN
    EXECUTE 'ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE';
  END IF;

  IF to_regclass('"AffiliateClick"') IS NOT NULL
    AND to_regclass('"AffiliateLink"') IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateClick_linkId_fkey')
  THEN
    EXECUTE 'ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE';
  END IF;
END $$;
