-- Track when a member has visited an Academy module page.
CREATE TABLE "LessonProgress" (
    "id"         TEXT NOT NULL,
    "learnerId"  TEXT NOT NULL,
    "pathSlug"   TEXT NOT NULL,
    "moduleSlug" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "startedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LessonProgress_learnerId_pathSlug_moduleSlug_key"
    ON "LessonProgress"("learnerId", "pathSlug", "moduleSlug");

CREATE INDEX "LessonProgress_learnerId_idx"  ON "LessonProgress"("learnerId");
CREATE INDEX "LessonProgress_pathSlug_idx"   ON "LessonProgress"("pathSlug");
CREATE INDEX "LessonProgress_lastSeenAt_idx" ON "LessonProgress"("lastSeenAt");

ALTER TABLE "LessonProgress"
    ADD CONSTRAINT "LessonProgress_learnerId_fkey"
    FOREIGN KEY ("learnerId") REFERENCES "Learner"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
