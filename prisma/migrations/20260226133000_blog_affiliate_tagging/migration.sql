-- CreateTable
CREATE TABLE "BlogPostAffiliate" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPostAffiliate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostAffiliate_blogPostId_affiliateId_key" ON "BlogPostAffiliate"("blogPostId", "affiliateId");

-- AddForeignKey
ALTER TABLE "BlogPostAffiliate" ADD CONSTRAINT "BlogPostAffiliate_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostAffiliate" ADD CONSTRAINT "BlogPostAffiliate_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliatePartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
