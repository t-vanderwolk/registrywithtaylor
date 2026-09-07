CREATE TYPE "AmazonProductSyncStatus" AS ENUM (
  'PENDING',
  'SYNCED',
  'ERROR',
  'ASSOCIATE_NOT_ELIGIBLE',
  'RATE_LIMITED'
);

CREATE TABLE "AmazonProductCache" (
    "asin" TEXT NOT NULL,
    "sourceUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "marketplace" TEXT NOT NULL DEFAULT 'www.amazon.com',
  "partnerTag" TEXT NOT NULL DEFAULT 'taylormadebab-20',
  "credentialVersion" TEXT,
  "detailPageUrl" TEXT,
  "title" TEXT,
  "byLineInfo" JSONB,
  "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "productInfo" JSONB,
  "primaryImageMediumUrl" TEXT,
  "primaryImageLargeUrl" TEXT,
  "priceAmount" DOUBLE PRECISION,
  "priceDisplay" TEXT,
  "currency" TEXT,
  "availability" TEXT,
  "dealDetails" JSONB,
  "parentAsin" TEXT,
  "requestedResources" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "rawItem" JSONB,
  "lastFetchedAt" TIMESTAMP(3),
  "offerFetchedAt" TIMESTAMP(3),
  "offerExpiresAt" TIMESTAMP(3),
  "productDataExpiresAt" TIMESTAMP(3),
  "syncStatus" "AmazonProductSyncStatus" NOT NULL DEFAULT 'PENDING',
  "syncError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AmazonProductCache_pkey" PRIMARY KEY ("asin")
);

CREATE INDEX "AmazonProductCache_syncStatus_idx" ON "AmazonProductCache"("syncStatus");
CREATE INDEX "AmazonProductCache_offerExpiresAt_idx" ON "AmazonProductCache"("offerExpiresAt");
CREATE INDEX "AmazonProductCache_productDataExpiresAt_idx" ON "AmazonProductCache"("productDataExpiresAt");
