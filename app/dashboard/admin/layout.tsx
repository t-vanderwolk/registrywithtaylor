import '../../admin/admin.css';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminSession } from '@/lib/server/session';

export const metadata = {
  title: 'Dashboard Admin • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default async function DashboardAdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return (
    <AdminShell
      brand="Taylor-Made Baby Co."
      links={[
        { label: 'Affiliate Canon', href: '/dashboard/admin/affiliates' },
        { label: 'Affiliate Links', href: '/dashboard/admin/affiliate-links' },
      ]}
    >
      {children}
    </AdminShell>
  );
}
