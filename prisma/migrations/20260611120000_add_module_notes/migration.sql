-- CreateTable: ModuleNote
-- Dashboard workbook notes — one free-text note per user × path × module.
-- Apply with: psql "$DATABASE_URL" -f prisma/migrations/20260611120000_add_module_notes/migration.sql
-- Then:        npx prisma migrate resolve --applied 20260611120000_add_module_notes
-- Then:        npx prisma generate

CREATE TABLE IF NOT EXISTS "ModuleNote" (
  "id"         TEXT NOT NULL,
  "userId"     TEXT NOT NULL,
  "pathSlug"   TEXT NOT NULL,
  "moduleSlug" TEXT NOT NULL,
  "content"    TEXT NOT NULL DEFAULT '',
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ModuleNote_pkey" PRIMARY KEY ("id")
);

-- Unique: one note per user × path × module
CREATE UNIQUE INDEX IF NOT EXISTS "ModuleNote_userId_pathSlug_moduleSlug_key"
  ON "ModuleNote"("userId", "pathSlug", "moduleSlug");

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS "ModuleNote_userId_idx"   ON "ModuleNote"("userId");
CREATE INDEX IF NOT EXISTS "ModuleNote_pathSlug_idx" ON "ModuleNote"("pathSlug");

-- Foreign key: cascade delete when user is removed
ALTER TABLE "ModuleNote"
  ADD CONSTRAINT "ModuleNote_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
