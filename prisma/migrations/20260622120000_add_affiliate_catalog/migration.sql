-- CreateEnum
CREATE TYPE "CatalogReviewStatus" AS ENUM ('AUTO_CATEGORIZED', 'NEEDS_REVIEW', 'REVIEWED', 'HIDDEN');

-- CreateTable
CREATE TABLE "AffiliateCatalogProduct" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'babylist_impact',
    "catalogId" TEXT NOT NULL DEFAULT '8981',
    "externalId" TEXT NOT NULL,
    "sku" TEXT,
    "gtin" TEXT,
    "brand" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rawCategory" TEXT,
    "productTypePath" TEXT,
    "price" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "imageUrl" TEXT,
    "productUrl" TEXT,
    "affiliateUrl" TEXT,
    "availability" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "itemGroupId" TEXT,
    "color" TEXT,
    "material" TEXT,
    "size" TEXT,
    "gender" TEXT,
    "ageGroup" TEXT,
    "retailer" TEXT NOT NULL DEFAULT 'Babylist',
    "rawPayload" JSONB,
    "feedHash" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChangedAt" TIMESTAMP(3),
    "isActiveInFeed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AffiliateCatalogProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEnrichment" (
    "id" TEXT NOT NULL,
    "rawProductId" TEXT NOT NULL,
    "canonicalBrand" TEXT,
    "canonicalName" TEXT,
    "slug" TEXT,
    "tmbcCategory" TEXT,
    "tmbcSubcategory" TEXT,
    "productType" TEXT,
    "parentJourney" TEXT,
    "registryPriority" TEXT,
    "lifecycleStage" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'auto',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isTaylorPick" BOOLEAN NOT NULL DEFAULT false,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isWorthKnowing" BOOLEAN NOT NULL DEFAULT false,
    "isSkipForMost" BOOLEAN NOT NULL DEFAULT false,
    "needsReview" BOOLEAN NOT NULL DEFAULT true,
    "reviewStatus" "CatalogReviewStatus" NOT NULL DEFAULT 'AUTO_CATEGORIZED',
    "confidenceScore" DOUBLE PRECISION,
    "editorialSummary" TEXT,
    "taylorsNote" TEXT,
    "internalNotes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "useCaseTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lifestyleTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "compatibilityTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "ProductEnrichment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateCatalogProduct_provider_externalId_key" ON "AffiliateCatalogProduct"("provider", "externalId");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_brand_idx" ON "AffiliateCatalogProduct"("brand");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_title_idx" ON "AffiliateCatalogProduct"("title");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_sku_idx" ON "AffiliateCatalogProduct"("sku");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_productTypePath_idx" ON "AffiliateCatalogProduct"("productTypePath");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_isActiveInFeed_idx" ON "AffiliateCatalogProduct"("isActiveInFeed");

-- CreateIndex
CREATE INDEX "AffiliateCatalogProduct_lastSyncedAt_idx" ON "AffiliateCatalogProduct"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEnrichment_rawProductId_key" ON "ProductEnrichment"("rawProductId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEnrichment_slug_key" ON "ProductEnrichment"("slug");

-- CreateIndex
CREATE INDEX "ProductEnrichment_tmbcCategory_idx" ON "ProductEnrichment"("tmbcCategory");

-- CreateIndex
CREATE INDEX "ProductEnrichment_productType_idx" ON "ProductEnrichment"("productType");

-- CreateIndex
CREATE INDEX "ProductEnrichment_parentJourney_idx" ON "ProductEnrichment"("parentJourney");

-- CreateIndex
CREATE INDEX "ProductEnrichment_reviewStatus_idx" ON "ProductEnrichment"("reviewStatus");

-- CreateIndex
CREATE INDEX "ProductEnrichment_needsReview_idx" ON "ProductEnrichment"("needsReview");

-- CreateIndex
CREATE INDEX "ProductEnrichment_isTaylorPick_idx" ON "ProductEnrichment"("isTaylorPick");

-- CreateIndex
CREATE INDEX "ProductEnrichment_isPublic_idx" ON "ProductEnrichment"("isPublic");

-- AddForeignKey
ALTER TABLE "ProductEnrichment" ADD CONSTRAINT "ProductEnrichment_rawProductId_fkey" FOREIGN KEY ("rawProductId") REFERENCES "AffiliateCatalogProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
