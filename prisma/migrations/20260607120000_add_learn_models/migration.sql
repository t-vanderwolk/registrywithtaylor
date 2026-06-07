-- CreateTable
CREATE TABLE "Learner" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "dueDate" TIMESTAMP(3),
    "babyNumber" INTEGER,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkbookSession" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT,
    "guestToken" TEXT,
    "pathSlug" TEXT NOT NULL,
    "moduleSlug" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkbookSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkbookResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkbookResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Learner_email_key" ON "Learner"("email");

-- CreateIndex
CREATE INDEX "Learner_email_idx" ON "Learner"("email");

-- CreateIndex
CREATE INDEX "Learner_subscriptionTier_idx" ON "Learner"("subscriptionTier");

-- CreateIndex
CREATE UNIQUE INDEX "WorkbookSession_learnerId_pathSlug_moduleSlug_key" ON "WorkbookSession"("learnerId", "pathSlug", "moduleSlug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkbookSession_guestToken_pathSlug_moduleSlug_key" ON "WorkbookSession"("guestToken", "pathSlug", "moduleSlug");

-- CreateIndex
CREATE INDEX "WorkbookSession_learnerId_idx" ON "WorkbookSession"("learnerId");

-- CreateIndex
CREATE INDEX "WorkbookSession_guestToken_idx" ON "WorkbookSession"("guestToken");

-- CreateIndex
CREATE INDEX "WorkbookSession_pathSlug_idx" ON "WorkbookSession"("pathSlug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkbookResponse_sessionId_promptId_key" ON "WorkbookResponse"("sessionId", "promptId");

-- CreateIndex
CREATE INDEX "WorkbookResponse_sessionId_idx" ON "WorkbookResponse"("sessionId");

-- AddForeignKey
ALTER TABLE "WorkbookSession" ADD CONSTRAINT "WorkbookSession_learnerId_fkey"
    FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookResponse" ADD CONSTRAINT "WorkbookResponse_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "WorkbookSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
