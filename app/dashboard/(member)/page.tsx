import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import {
  getAcademyPathTitle,
  getAcademyModuleTitle,
  isAcademyPathSlug,
  isAcademyModuleSlug,
} from '@/lib/academy/content';
import prisma from '@/lib/server/prisma';
import MemberDashboardClient from './components/MemberDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Dashboard | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

const PATH_TOTALS: Record<string, number> = {
  registry: 8, nursery: 6, gear: 9, postpartum: 6,
};

function getFirstName(
  learnerName: string | null | undefined,
  userName: string | null | undefined,
  email: string,
) {
  const name = learnerName ?? userName;
  if (name) return name.split(' ')[0] ?? name;
  return email.split('@')[0] ?? 'there';
}

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login?callbackUrl=/dashboard');
  if (session.user.role === 'ADMIN')    redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const email    = session.user.email ?? '';
  const userId   = session.user.id;

  const [learner, user, progressRows, recentRows, noteRows, registries, consultationCount] =
    await Promise.all([
      prisma.learner.findUnique({
        where:  { email },
        select: {
          id: true, name: true, partnerName: true,
          subscriptionTier: true, dueDate: true,
        },
      }),
      prisma.user.findUnique({
        where:  { id: userId },
        select: { name: true },
      }),
      // Per-path module counts
      prisma.lessonProgress.groupBy({
        by:    ['pathSlug'],
        where: { learner: { email } },
        _count: { moduleSlug: true },
      }),
      // Recent module visits for "Continue learning"
      prisma.lessonProgress.findMany({
        where:   { learner: { email } },
        orderBy: { lastSeenAt: 'desc' },
        take:    4,
        select:  { pathSlug: true, moduleSlug: true },
      }),
      // Saved workbook notes (ModuleNote)
      prisma.moduleNote.findMany({
        where:   { userId },
        orderBy: { updatedAt: 'desc' },
        select:  { pathSlug: true, moduleSlug: true, content: true, updatedAt: true },
      }),
      // Member registries
      prisma.registry.findMany({
        where:   { userId },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true, platform: true, name: true, url: true,
          itemCount: true, completedCount: true, notes: true,
          createdAt: true, updatedAt: true,
        },
      }),
      // Consultation count
      prisma.consultationRequest.count({
        where: { email },
      }).catch(() => 0),
    ]);

  // ── Derived data ────────────────────────────────────────────────────────────

  const tier       = learner?.subscriptionTier ?? null;
  const firstName  = getFirstName(learner?.name, user?.name, email);
  const partnerName  = learner?.partnerName ?? null;
  const dueDateIso   = learner?.dueDate?.toISOString() ?? null;

  const progressByPath: Record<string, number> = {};
  for (const row of progressRows) {
    progressByPath[row.pathSlug] = row._count.moduleSlug;
  }

  const totalModules    = Object.values(PATH_TOTALS).reduce((a, b) => a + b, 0); // 29
  const completedModules = Object.values(progressByPath).reduce((a, b) => a + b, 0);

  const recentModules = recentRows
    .filter((r) => isAcademyPathSlug(r.pathSlug) && isAcademyModuleSlug(r.moduleSlug))
    .map((r) => ({
      pathSlug:    r.pathSlug,
      moduleSlug:  r.moduleSlug,
      pathTitle:   isAcademyPathSlug(r.pathSlug)   ? getAcademyPathTitle(r.pathSlug)   : r.pathSlug,
      moduleTitle: isAcademyModuleSlug(r.moduleSlug) ? getAcademyModuleTitle(r.moduleSlug) : r.moduleSlug,
    }));

  const notePathTitles: Record<string, string> = {};
  const workbookNotes = noteRows
    .filter((n) => n.content.trim().length > 0)
    .map((n) => {
      if (isAcademyPathSlug(n.pathSlug)) {
        notePathTitles[n.pathSlug] = getAcademyPathTitle(n.pathSlug);
      }
      return {
        pathSlug:    n.pathSlug,
        moduleSlug:  n.moduleSlug,
        moduleTitle: isAcademyModuleSlug(n.moduleSlug) ? getAcademyModuleTitle(n.moduleSlug) : n.moduleSlug,
        content:     n.content,
        updatedAt:   n.updatedAt.toISOString(),
      };
    });

  const serializedRegistries = registries.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <MemberDashboardClient
      firstName={firstName}
      partnerName={partnerName}
      tier={tier}
      dueDateIso={dueDateIso}
      registries={serializedRegistries}
      progressByPath={progressByPath}
      pathTotals={PATH_TOTALS}
      totalModules={totalModules}
      completedModules={completedModules}
      recentModules={recentModules}
      workbookNotes={workbookNotes}
      notePathTitles={notePathTitles}
      consultationCount={consultationCount}
    />
  );
}
