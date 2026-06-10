#!/bin/bash
# Run from project root:
#   bash scripts/setup-member-and-migrate.sh
set -e

cd "$(dirname "$0")/.."

DB_URL="postgresql://taylorvanderwolk@localhost:5432/registrywithtaylor"

echo ""
echo "1/3  Generating Prisma client from schema..."
npx prisma generate

echo ""
echo "2/3  Applying migration (adds status column to WaitlistEntry)..."
# migrate dev is unusable here: migration history has un-prefixed entries that
# break shadow-DB replay ordering. Apply the SQL directly then resolve.
psql "$DB_URL" -f prisma/migrations/20260607140000_add_waitlist_status/migration.sql
npx prisma migrate resolve --applied 20260607140000_add_waitlist_status

echo ""
echo "3/3  Seeding member account..."
npx tsx scripts/seedMemberAccount.ts

echo ""
echo "✓ Done. member@taylormadebabyco.com can now log in at /login"
