-- Add status column to WaitlistEntry for admin approval workflow
ALTER TABLE "WaitlistEntry" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WaitlistEntry_status_idx" ON "WaitlistEntry"("status");
