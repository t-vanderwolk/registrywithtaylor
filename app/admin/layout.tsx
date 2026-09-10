import './admin.css';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminNavSections } from '@/lib/admin/navigation';
import { requireAdminViewSession } from '@/lib/server/session';

export const metadata = {
  title: 'Admin • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminViewSession();
  const isReviewerMode = session.user.role === 'REVIEWER';
  const sections = getAdminNavSections(isReviewerMode);

  return (
    <AdminShell brand="Taylor-Made Baby Co." isReviewerMode={isReviewerMode} sections={sections}>
      {children}
    </AdminShell>
  );
}
