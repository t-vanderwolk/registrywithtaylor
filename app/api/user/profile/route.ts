import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

// ─── PUT /api/user/profile ────────────────────────────────────────────────────
// Updates the member's profile: name, partnerName, dueDate, email, password.
// Email change updates both User and Learner (they're linked by matching email).
// Password change verifies the current password before hashing the new one.

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await req.json() as {
      name?:        string;
      partnerName?: string;
      dueDate?:     string | null;   // ISO string or null to clear
      email?:       string;
      currentPassword?: string;
      newPassword?:     string;
    };

    const userId       = session.user.id;
    const currentEmail = session.user.email ?? '';

    // ── Password change ───────────────────────────────────────────────────────
    if (body.newPassword !== undefined) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new one.' },
          { status: 400 },
        );
      }
      if (body.newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters.' },
          { status: 400 },
        );
      }

      const user = await prisma.user.findUnique({
        where:  { id: userId },
        select: { password: true },
      });

      const valid = user && await bcrypt.compare(body.currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }

      const hashed = await bcrypt.hash(body.newPassword, 12);
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

      // If only changing password, return early
      if (
        body.name === undefined &&
        body.partnerName === undefined &&
        body.dueDate === undefined &&
        body.email === undefined
      ) {
        return NextResponse.json({ success: true, passwordChanged: true });
      }
    }

    // ── Email change ──────────────────────────────────────────────────────────
    let targetEmail = currentEmail;

    if (body.email !== undefined) {
      const newEmail = body.email.trim().toLowerCase();

      if (newEmail !== currentEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
          return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const taken = await prisma.user.findUnique({
          where:  { email: newEmail },
          select: { id: true },
        });
        if (taken && taken.id !== userId) {
          return NextResponse.json(
            { error: 'That email is already in use.' },
            { status: 409 },
          );
        }

        // Update User + Learner in a transaction (linked by matching email string)
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data:  { email: newEmail },
          }),
          prisma.learner.update({
            where: { email: currentEmail },
            data:  { email: newEmail },
          }),
        ]);

        targetEmail = newEmail;
      }
    }

    // ── Profile fields (name, partnerName, dueDate) ────────────────────────────
    const learnerData: Record<string, unknown> = {};
    const userData:    Record<string, unknown> = {};

    if (body.name !== undefined) {
      const trimmed = body.name.trim() || null;
      learnerData.name = trimmed;
      userData.name    = trimmed;
    }
    if (body.partnerName !== undefined) {
      learnerData.partnerName = body.partnerName.trim() || null;
    }
    if (body.dueDate !== undefined) {
      learnerData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    const updates: Promise<unknown>[] = [];

    if (Object.keys(userData).length > 0) {
      updates.push(prisma.user.update({ where: { id: userId }, data: userData }));
    }
    if (Object.keys(learnerData).length > 0) {
      updates.push(
        prisma.learner.update({
          where: { email: targetEmail },
          data:  learnerData,
        }),
      );
    }

    if (updates.length > 0) await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/user/profile]', err);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}

// ─── GET /api/user/profile ────────────────────────────────────────────────────
// Returns the current member's profile data for pre-filling the settings form.

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const email = session.user.email ?? '';

  const [user, learner] = await Promise.all([
    prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { name: true, email: true },
    }),
    prisma.learner.findUnique({
      where:  { email },
      select: { name: true, partnerName: true, dueDate: true },
    }),
  ]);

  return NextResponse.json({
    name:        learner?.name ?? user?.name ?? '',
    partnerName: learner?.partnerName ?? '',
    email:       user?.email ?? email,
    dueDate:     learner?.dueDate?.toISOString().split('T')[0] ?? '', // YYYY-MM-DD
  });
}
