ALTER TABLE "AffiliatePartner"
ADD COLUMN IF NOT EXISTS "partnerType" TEXT NOT NULL DEFAULT 'retailer',
ADD COLUMN IF NOT EXISTS "affiliatePid" TEXT,
ADD COLUMN IF NOT EXISTS "baseUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "routingPriority" INTEGER NOT NULL DEFAULT 99,
ADD COLUMN IF NOT EXISTS "allowedContexts" JSONB NOT NULL DEFAULT '["blog"]'::jsonb;

UPDATE "AffiliatePartner"
SET
  "partnerType" = COALESCE(NULLIF("partnerType", ''), 'retailer'),
  "baseUrl" = COALESCE(NULLIF("baseUrl", ''), COALESCE("website", '')),
  "routingPriority" = CASE
    WHEN "network" = 'DIRECT' THEN 1
    WHEN "network" = 'IMPACT' THEN 2
    WHEN "network" = 'AWIN' THEN 3
    WHEN "network" = 'CJ' THEN 4
    ELSE COALESCE("routingPriority", 99)
  END,
  "allowedContexts" = CASE
    WHEN "allowedContexts" IS NULL OR "allowedContexts" = 'null'::jsonb THEN '["blog"]'::jsonb
    ELSE "allowedContexts"
  END;
