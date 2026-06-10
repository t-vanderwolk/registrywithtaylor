import prisma from '@/lib/server/prisma';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';
import WaitlistTable from './WaitlistTable';
import EnrolledTable from './EnrolledTable';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Members · Admin',
  robots: { index: false, follow: false },
};

export default async function AdminMembersPage() {
  await requireAdminSession('/admin/members');

  const [waitlist, learners, progressRows, workbookRows] = await Promise.all([
    prisma.waitlistEntry.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.learner.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    // Module visits per learner × path
    prisma.lessonProgress.groupBy({
      by: ['learnerId', 'pathSlug'],
      _count:  { moduleSlug: true },
      _max:    { lastSeenAt: true },
    }),
    // Workbook engagement per learner × path
    prisma.workbookSession.groupBy({
      by: ['learnerId', 'pathSlug'],
      where: { learnerId: { not: null } },
      _count: { moduleSlug: true },
    }),
  ]);

  // Build a map: learnerId → { pathSlug → { modules, lastSeenAt } }
  type PathProgress = { modules: number; lastSeenAt: Date | null; workbookModules: number };
  const progressMap = new Map<string, Map<string, PathProgress>>();

  for (const row of progressRows) {
    if (!progressMap.has(row.learnerId)) progressMap.set(row.learnerId, new Map());
    progressMap.get(row.learnerId)!.set(row.pathSlug, {
      modules:      row._count.moduleSlug,
      lastSeenAt:   row._max.lastSeenAt ?? null,
      workbookModules: 0,
    });
  }
  for (const row of workbookRows) {
    if (!row.learnerId) continue;
    const byPath = progressMap.get(row.learnerId);
    if (byPath?.has(row.pathSlug)) {
      byPath.get(row.pathSlug)!.workbookModules = row._count.moduleSlug;
    }
  }

  // Convert to serialisable shape for the client component
  const progressByLearner: Record<string, Record<string, { modules: number; lastSeenAt: string | null; workbookModules: number }>> = {};
  for (const [learnerId, byPath] of progressMap) {
    progressByLearner[learnerId] = {};
    for (const [pathSlug, data] of byPath) {
      progressByLearner[learnerId][pathSlug] = {
        modules:         data.modules,
        lastSeenAt:      data.lastSeenAt?.toISOString() ?? null,
        workbookModules: data.workbookModules,
      };
    }
  }

  const pending  = waitlist.filter((e) => e.status === 'pending');
  const approved = waitlist.filter((e) => e.status === 'approved');
  const rejected = waitlist.filter((e) => e.status === 'rejected');

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        <AdminHeader
          eyebrow="Academy"
          title="Members"
          subtitle="Approve waitlist submissions to create login credentials and set enrollment tier."
        />

        {/* ── Pending approval ─────────────────────────────────────────── */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow={`${pending.length} pending`}
            title="Waitlist — Pending Approval"
            subtitle="Approving a submission creates a User login and a Learner enrollment record. A temporary password is generated and shown once."
          />
          {pending.length === 0 ? (
            <p className="admin-micro">No pending submissions.</p>
          ) : (
            <WaitlistTable entries={pending} />
          )}
        </AdminSurface>

        {/* ── Enrolled members ─────────────────────────────────────────── */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow={`${learners.length} enrolled`}
            title="Enrolled Members"
            subtitle="Module visits recorded automatically when a member opens a lesson. Workbook = modules with saved responses."
          />
          {learners.length === 0 ? (
            <p className="admin-micro">No enrolled members yet.</p>
          ) : (
            <EnrolledTable learners={learners} progressByLearner={progressByLearner} />
          )}
        </AdminSurface>

        {/* ── Approved / rejected archive ───────────────────────────────── */}
        {(approved.length > 0 || rejected.length > 0) && (
          <AdminSurface className="admin-stack">
            <AdminHeader
              eyebrow="Archive"
              title="Processed Waitlist Entries"
              subtitle={`${approved.length} approved · ${rejected.length} rejected`}
            />
            <WaitlistTable entries={[...approved, ...rejected]} readOnly />
          </AdminSurface>
        )}
      </AdminContainer>
    </main>
  );
}
