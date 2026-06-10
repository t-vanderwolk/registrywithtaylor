import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    // Not logged in — silently ignore (guest / preview user)
    return NextResponse.json({ ok: true });
  }

  const { pathSlug, moduleSlug } = await req.json();
  if (!pathSlug || !moduleSlug) {
    return NextResponse.json({ error: 'Missing pathSlug or moduleSlug' }, { status: 400 });
  }

  const learner = await prisma.learner.findUnique({
    where:  { email: session.user.email },
    select: { id: true },
  });

  if (!learner) {
    // No Learner record (admin / reviewer visiting) — ignore
    return NextResponse.json({ ok: true });
  }

  await prisma.lessonProgress.upsert({
    where: {
      learnerId_pathSlug_moduleSlug: {
        learnerId:  learner.id,
        pathSlug,
        moduleSlug,
      },
    },
    update: {
      visitCount: { increment: 1 },
      lastSeenAt: new Date(),
    },
    create: {
      learnerId:  learner.id,
      pathSlug,
      moduleSlug,
    },
  });

  return NextResponse.json({ ok: true });
}
