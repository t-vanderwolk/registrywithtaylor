-- CreateEnum
CREATE TYPE "AffiliateNetwork" AS ENUM ('CJ', 'IMPACT', 'AWIN', 'DIRECT');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'CPL', 'FLAT_FEE', 'VARIABLE');

-- Enable UUID generation for text-backed String ids that default to uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable
ALTER TABLE "AffiliatePartner"
ADD COLUMN "network" "AffiliateNetwork" NOT NULL DEFAULT 'DIRECT',
ADD COLUMN "advertiserId" TEXT,
ADD COLUMN "commissionType" "CommissionType" NOT NULL DEFAULT 'VARIABLE',
ADD COLUMN "commissionRate" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN "category" TEXT,
ADD COLUMN "threeMonthEpc" DOUBLE PRECISION,
ADD COLUMN "sevenDayEpc" DOUBLE PRECISION,
ADD COLUMN "notes" TEXT,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "AffiliatePartner"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

ALTER TABLE "AffiliatePartner"
DROP COLUMN "slug",
DROP COLUMN "description",
DROP COLUMN "logoUrl",
DROP COLUMN "websiteUrl",
DROP COLUMN "commission",
DROP COLUMN "assets";

ALTER TABLE "AffiliatePartner"
ALTER COLUMN "network" DROP DEFAULT,
ALTER COLUMN "commissionType" DROP DEFAULT,
ALTER COLUMN "commissionRate" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "AffiliatePartner_name_network_key" ON "AffiliatePartner"("name", "network");
