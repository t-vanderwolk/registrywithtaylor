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

  const [waitlist, learners] = await Promise.all([
    prisma.waitlistEntry.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.learner.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

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
            subtitle="All Learner records — one per enrolled member regardless of approval source."
          />
          {learners.length === 0 ? (
            <p className="admin-micro">No enrolled members yet.</p>
          ) : (
            <EnrolledTable learners={learners} />
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
