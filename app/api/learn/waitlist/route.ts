import { NextRequest, NextResponse } from 'next/server';
import { isAcademyEnabled } from '@/lib/featureFlags';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/server/prisma').default as any;

export async function POST(request: NextRequest) {
  if (!isAcademyEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: { email?: string; name?: string; dueDate?: string; source?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      create: {
        email,
        name: body.name?.trim() || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        source: body.source || 'academy-waitlist',
      },
      update: {
        name: body.name?.trim() || undefined,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[waitlist signup]', error);
    return NextResponse.json({ error: 'Could not save your email. Please try again.' }, { status: 500 });
  }
}
