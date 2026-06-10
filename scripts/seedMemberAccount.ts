/**
 * Creates the member@taylormadebabyco.com account.
 * Run with: tsx scripts/seedMemberAccount.ts
 *
 * Creates:
 *   - User row   (role: USER, password: karma)
 *   - Learner row (subscriptionTier: academy)
 */

import bcrypt from 'bcryptjs';
import prisma from '@/lib/server/prisma';

const EMAIL = 'member@taylormadebabyco.com';
const PLAIN_PASSWORD = 'karma';
const NAME = 'Member';
const SUBSCRIPTION_TIER = 'academy';

async function main() {
  const hashed = await bcrypt.hash(PLAIN_PASSWORD, 12);

  // ── User (auth) ──────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where:  { email: EMAIL },
    update: { password: hashed, role: 'USER', name: NAME },
    create: { email: EMAIL, password: hashed, role: 'USER', name: NAME },
  });

  console.log(`✓ User:    ${user.email}  (id: ${user.id})`);

  // ── Learner (enrollment) ─────────────────────────────────────────────────
  const learner = await prisma.learner.upsert({
    where:  { email: EMAIL },
    update: { subscriptionTier: SUBSCRIPTION_TIER, name: NAME },
    create: { email: EMAIL, name: NAME, subscriptionTier: SUBSCRIPTION_TIER },
  });

  console.log(`✓ Learner: ${learner.email}  tier: ${learner.subscriptionTier}`);
  console.log('\nDone. Login at /login with:');
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PLAIN_PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
