import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/server/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    // ── Validation ────────────────────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Duplicate check ───────────────────────────────────────────────────────
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 },
      );
    }

    // ── Create User + Learner in a transaction ────────────────────────────────
    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email:    normalizedEmail,
          password: hashed,
          name:     name?.trim() || null,
          role:     'USER',
        },
      });

      // Upsert Learner so that if an existing waitlist record already has the
      // email we link them in rather than creating a duplicate.
      await tx.learner.upsert({
        where:  { email: normalizedEmail },
        update: {
          name: name?.trim() || undefined,
          // Don't downgrade tier if the record already has one
        },
        create: {
          email:            normalizedEmail,
          name:             name?.trim() || null,
          subscriptionTier: 'free',
        },
      });
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
