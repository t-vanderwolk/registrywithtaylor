-- AlterTable
ALTER TABLE "AffiliatePartner"
ADD COLUMN "slug" TEXT,
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "website" TEXT,
ADD COLUMN "affiliateLink" TEXT;

-- Backfill slug values for existing rows.
WITH normalized AS (
  SELECT
    id,
    COALESCE(
      NULLIF(
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'partner'
    ) AS base_slug
  FROM "AffiliatePartner"
),
ranked AS (
  SELECT
    id,
    base_slug,
    ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS slug_rank
  FROM normalized
)
UPDATE "AffiliatePartner" AS partner
SET "slug" = CASE
  WHEN ranked.slug_rank = 1 THEN ranked.base_slug
  ELSE ranked.base_slug || '-' || ranked.slug_rank::TEXT
END
FROM ranked
WHERE partner.id = ranked.id
  AND partner."slug" IS NULL;

-- Backfill website from allowedDomains when possible.
UPDATE "AffiliatePartner"
SET "website" = CASE
  WHEN "website" IS NOT NULL AND "website" <> '' THEN "website"
  WHEN COALESCE(array_length("allowedDomains", 1), 0) > 0 THEN
    CASE
      WHEN "allowedDomains"[1] ~ '^https?://' THEN "allowedDomains"[1]
      ELSE 'https://' || "allowedDomains"[1]
    END
  ELSE NULL
END;

-- Backfill a default logo path.
UPDATE "AffiliatePartner"
SET "logoUrl" = COALESCE("logoUrl", '/assets/logos/partnericon.png');

-- Enforce required slug after backfill.
ALTER TABLE "AffiliatePartner"
ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AffiliatePartner_slug_key" ON "AffiliatePartner"("slug");
