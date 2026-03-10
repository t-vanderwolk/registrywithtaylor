ALTER TABLE "AffiliateProgram"
ADD COLUMN "averageOrderValue" DOUBLE PRECISION,
ADD COLUMN "commissionRate" DOUBLE PRECISION;

ALTER TABLE "AffiliateClick"
ADD COLUMN "postId" TEXT;

UPDATE "AffiliateClick" AS click
SET "postId" = link."blogPostId"
FROM "AffiliateLink" AS link
WHERE click."linkId" = link."id"
  AND click."postId" IS NULL
  AND link."blogPostId" IS NOT NULL;

CREATE INDEX "idx_affiliateclick_postid" ON "AffiliateClick"("postId");
CREATE INDEX "idx_postanalytics_postid" ON "PostAnalytics"("postId");

ALTER TABLE "AffiliateClick"
ADD CONSTRAINT "AffiliateClick_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "Post"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
