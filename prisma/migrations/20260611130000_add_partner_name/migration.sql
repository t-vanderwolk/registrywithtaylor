-- Add partnerName to Learner for dashboard personalization
-- Apply: psql "postgresql://taylorvanderwolk@localhost:5432/registrywithtaylor" \
--          -f prisma/migrations/20260611130000_add_partner_name/migration.sql
-- Then:  npx prisma migrate resolve --applied 20260611130000_add_partner_name
-- Then:  npx prisma generate

ALTER TABLE "Learner" ADD COLUMN IF NOT EXISTS "partnerName" TEXT;
