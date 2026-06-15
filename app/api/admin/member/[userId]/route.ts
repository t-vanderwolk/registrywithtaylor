import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

type RouteContext = { params: Promise<{ userId: string }> };

// ─── GET /api/admin/member/[userId] ──────────────────────────────────────────

export async function GET(_req: Request, { params: paramsPromise }: RouteContext) {
  const { userId } = await paramsPromise;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [user, learner, registries, progressRows, workbookRows, consultations] = await Promise.all([
    prisma.user.findUnique({
      where:  { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.learner.findFirst({
      where:  { user: { id: userId } },
      select: {
        id: true, email: true, name: true, partnerName: true,
        dueDate: true, subscriptionTier: true, createdAt: true,
        lessonProgress: {
          select: { pathSlug: true, moduleSlug: true, visitCount: true, lastSeenAt: true },
          orderBy: { lastSeenAt: 'desc' },
        },
        workbookSessions: {
          select: {
            pathSlug: true, moduleSlug: true,
            _count: { select: { responses: true } },
          },
        },
      },
    }).catch(() => null),
    prisma.registry.findMany({
      where:   { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, platform: true, name: true, url: true,
        itemCount: true, completedCount: true, notes: true, createdAt: true,
      },
    }),
    prisma.lessonProgress.groupBy({
      by:    ['pathSlug'],
      where: { learner: { user: { id: userId } } },
      _count: { moduleSlug: true },
      _max:   { lastSeenAt: true },
    }),
    prisma.workbookSession.groupBy({
      by:    ['pathSlug'],
      where: { learner: { user: { id: userId } } },
      _count: { moduleSlug: true },
    }),
    prisma.consultationRequest.findMany({
      where:   { email: '' }, // will be replaced by user email below
      orderBy: { createdAt: 'desc' },
      select:  { id: true, status: true, createdAt: true, dueDate: true },
      take:    10,
    }).catch(() => []),
  ]);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch consultations by email (ConsultationRequest has no userId FK)
  const consultationsByEmail = await prisma.consultationRequest.findMany({
    where:   { email: user.email },
    orderBy: { createdAt: 'desc' },
    select:  { id: true, status: true, createdAt: true, dueDate: true, message: true },
    take:    10,
  }).catch(() => []);

  const progressByPath: Record<string, { modules: number; lastSeenAt: string | null }> = {};
  for (const row of progressRows) {
    progressByPath[row.pathSlug] = {
      modules:     row._count.moduleSlug,
      lastSeenAt:  row._max.lastSeenAt?.toISOString() ?? null,
    };
  }

  const workbookByPath: Record<string, number> = {};
  for (const row of workbookRows) {
    workbookByPath[row.pathSlug] = row._count.moduleSlug;
  }

  return NextResponse.json({
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
    },
    learner: learner
      ? {
          ...learner,
          dueDate:   learner.dueDate?.toISOString() ?? null,
          createdAt: learner.createdAt.toISOString(),
          lessonProgress: learner.lessonProgress.map((p) => ({
            ...p,
            lastSeenAt: p.lastSeenAt.toISOString(),
          })),
          workbookSessions: learner.workbookSessions.map((s) => ({
            pathSlug:        s.pathSlug,
            moduleSlug:      s.moduleSlug,
            responseCount:   s._count.responses,
          })),
        }
      : null,
    registries: registries.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    progressByPath,
    workbookByPath,
    consultations: consultationsByEmail.map((c) => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
      dueDate:   c.dueDate   ? new Date(c.dueDate).toISOString()   : null,
    })),
  });
}
