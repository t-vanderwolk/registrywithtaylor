CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "Brand" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "website" TEXT,
  "logoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

CREATE TABLE "AffiliateProgram" (
  "id" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "network" "AffiliateNetwork" NOT NULL,
  "campaignId" TEXT,
  "commission" TEXT,
  "cookieLength" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AffiliateProgram_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AffiliateProgram_campaignId_key" ON "AffiliateProgram"("campaignId");
CREATE INDEX "AffiliateProgram_brandId_idx" ON "AffiliateProgram"("brandId");
CREATE UNIQUE INDEX "AffiliateProgram_brandId_network_key" ON "AffiliateProgram"("brandId", "network");

ALTER TABLE "AffiliateProgram"
ADD CONSTRAINT "AffiliateProgram_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "Brand"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE TABLE "_PostAffiliateBrands" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_PostAffiliateBrands_AB_unique" ON "_PostAffiliateBrands"("A", "B");
CREATE INDEX "_PostAffiliateBrands_B_index" ON "_PostAffiliateBrands"("B");

ALTER TABLE "_PostAffiliateBrands"
ADD CONSTRAINT "_PostAffiliateBrands_A_fkey"
FOREIGN KEY ("A") REFERENCES "Brand"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "_PostAffiliateBrands"
ADD CONSTRAINT "_PostAffiliateBrands_B_fkey"
FOREIGN KEY ("B") REFERENCES "Post"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "AffiliatePartner"
ADD COLUMN "brandId" TEXT,
ADD COLUMN "programId" TEXT;

CREATE INDEX "AffiliatePartner_brandId_idx" ON "AffiliatePartner"("brandId");
CREATE INDEX "AffiliatePartner_programId_idx" ON "AffiliatePartner"("programId");

ALTER TABLE "AffiliatePartner"
ADD CONSTRAINT "AffiliatePartner_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "Brand"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "AffiliatePartner"
ADD CONSTRAINT "AffiliatePartner_programId_fkey"
FOREIGN KEY ("programId") REFERENCES "AffiliateProgram"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "AffiliateLink"
ADD COLUMN "programId" TEXT,
ADD COLUMN "name" TEXT,
ADD COLUMN "url" TEXT;

ALTER TABLE "AffiliateLink"
ALTER COLUMN "destinationUrl" DROP NOT NULL,
ALTER COLUMN "code" DROP NOT NULL;

CREATE INDEX "AffiliateLink_programId_idx" ON "AffiliateLink"("programId");

ALTER TABLE "AffiliateLink"
ADD CONSTRAINT "AffiliateLink_programId_fkey"
FOREIGN KEY ("programId") REFERENCES "AffiliateProgram"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

INSERT INTO "Brand" ("id", "name", "website", "logoUrl", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  partner."name",
  partner."website",
  partner."logoUrl",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "AffiliatePartner" AS partner
LEFT JOIN "Brand" AS brand
  ON LOWER(brand."name") = LOWER(partner."name")
WHERE brand."id" IS NULL;

UPDATE "AffiliatePartner" AS partner
SET "brandId" = brand."id"
FROM "Brand" AS brand
WHERE partner."brandId" IS NULL
  AND LOWER(brand."name") = LOWER(partner."name");

INSERT INTO "AffiliateProgram" ("id", "brandId", "network", "campaignId", "commission", "cookieLength", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  partner."brandId",
  partner."network",
  partner."advertiserId",
  partner."commissionRate",
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "AffiliatePartner" AS partner
LEFT JOIN "AffiliateProgram" AS program
  ON program."brandId" = partner."brandId"
 AND program."network" = partner."network"
WHERE partner."brandId" IS NOT NULL
  AND program."id" IS NULL;

UPDATE "AffiliatePartner" AS partner
SET "programId" = program."id"
FROM "AffiliateProgram" AS program
WHERE partner."programId" IS NULL
  AND partner."brandId" = program."brandId"
  AND partner."network" = program."network";

UPDATE "AffiliateLink" AS link
SET
  "programId" = COALESCE(link."programId", partner."programId"),
  "name" = COALESCE(link."name", NULLIF(link."label", ''), partner."name"),
  "url" = COALESCE(link."url", link."destinationUrl", partner."affiliateLink", partner."website")
FROM "AffiliatePartner" AS partner
WHERE link."partnerId" = partner."id";

INSERT INTO "_PostAffiliateBrands" ("A", "B")
SELECT DISTINCT
  partner."brandId",
  tagging."blogPostId"
FROM "BlogPostAffiliate" AS tagging
INNER JOIN "AffiliatePartner" AS partner
  ON partner."id" = tagging."affiliateId"
WHERE partner."brandId" IS NOT NULL
ON CONFLICT DO NOTHING;
