import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import { sendEmail, getAdminEmail } from '@/lib/email/sendEmail';
import {
  memberApprovalTemplate,
  adminApprovalBackupTemplate,
} from '@/lib/email/templates/memberApproval';

/**
 * POST /api/admin/members/[id]/approve
 *
 * Body (optional):
 *   { tier?: "free" | "academy" | "academy_plus" | "concierge" }
 *
 * Actions:
 *   1. Marks WaitlistEntry.status = "approved"
 *   2. Upserts a User row (role USER) with a random temp password
 *   3. Upserts a Learner row with the requested tier (default: "free")
 *
 * Returns the generated temp password so the admin can share it.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let tier = 'free';
  try {
    const body = await request.json();
    if (typeof body?.tier === 'string') tier = body.tier;
  } catch {
    // body is optional — proceed with default tier
  }

  const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
  if (!entry) {
    return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
  }
  if (entry.status === 'approved') {
    return NextResponse.json({ error: 'Already approved' }, { status: 409 });
  }

  // Generate a readable temporary password: e.g. "tmbc-a3f8k2"
  const tempPassword = `tmbc-${Math.random().toString(36).slice(2, 8)}`;
  const hashed = await bcrypt.hash(tempPassword, 12);

  await prisma.$transaction(async (tx) => {
    // 1. Mark waitlist entry approved
    await tx.waitlistEntry.update({
      where: { id },
      data:  { status: 'approved' },
    });

    // 2. Create/update the User account (login credentials)
    await tx.user.upsert({
      where:  { email: entry.email },
      update: { role: 'USER' },        // don't overwrite an existing password
      create: {
        email:    entry.email,
        password: hashed,
        role:     'USER',
        name:     entry.name ?? null,
      },
    });

    // 3. Create/update the Learner record (tier + metadata)
    await tx.learner.upsert({
      where:  { email: entry.email },
      update: { subscriptionTier: tier },
      create: {
        email:            entry.email,
        name:             entry.name ?? null,
        dueDate:          entry.dueDate ?? null,
        subscriptionTier: tier,
      },
    });
  });

  // 4. Send credentials email to member + backup copy to admin
  // Non-critical: don't fail the approval if email errors
  const siteUrl = (process.env.NEXTAUTH_URL ?? 'https://taylormadebabyco.com').replace(/\/$/, '');
  const loginUrl = `${siteUrl}/login`;

  await Promise.allSettled([
    sendEmail({
      to:      entry.email,
      subject: "You're in — Taylor-Made Baby Academy",
      html:    memberApprovalTemplate({
        name:         entry.name,
        email:        entry.email,
        tempPassword,
        loginUrl,
      }),
    }),
    sendEmail({
      to:      getAdminEmail(),
      subject: `Academy approval: ${entry.email}`,
      html:    adminApprovalBackupTemplate({
        name:         entry.name,
        email:        entry.email,
        tempPassword,
        tier,
      }),
    }),
  ]);

  return NextResponse.json({ ok: true, tempPassword, tier, email: entry.email });
}
