-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "intro" TEXT,
    "content" TEXT NOT NULL,
    "conclusion" TEXT,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT,
    "authorId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Strollers',
    "topicCluster" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImageUrl" TEXT,
    "ogImageAlt" TEXT,
    "canonicalUrl" TEXT,
    "targetKeyword" TEXT,
    "secondaryKeywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "internalLinkNotes" TEXT,
    "tableOfContentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "faqItems" JSONB NOT NULL DEFAULT '[]',
    "affiliateDisclosureEnabled" BOOLEAN NOT NULL DEFAULT true,
    "affiliateDisclosureText" TEXT,
    "affiliateDisclosurePlacement" TEXT DEFAULT 'before_affiliates',
    "affiliateModules" JSONB NOT NULL DEFAULT '[]',
    "consultationCtaEnabled" BOOLEAN NOT NULL DEFAULT true,
    "consultationCtaLabel" TEXT,
    "newsletterCtaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "newsletterCtaLabel" TEXT,
    "newsletterCtaDescription" TEXT,
    "newsletterCtaHref" TEXT,
    "nextStepCtaLabel" TEXT,
    "nextStepCtaHref" TEXT,
    "founderSignatureEnabled" BOOLEAN NOT NULL DEFAULT false,
    "founderSignatureText" TEXT,
    "relatedGuideIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideAnalytics" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "sourceRoute" TEXT,
    "visitorHash" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "GuideAnalytics_guideId_idx" ON "GuideAnalytics"("guideId");

-- CreateIndex
CREATE INDEX "GuideAnalytics_guideId_event_createdAt_idx" ON "GuideAnalytics"("guideId", "event", "createdAt");

-- CreateIndex
CREATE INDEX "GuideAnalytics_event_createdAt_idx" ON "GuideAnalytics"("event", "createdAt");

-- CreateIndex
CREATE INDEX "GuideAnalytics_visitorHash_createdAt_idx" ON "GuideAnalytics"("visitorHash", "createdAt");

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideAnalytics" ADD CONSTRAINT "GuideAnalytics_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
