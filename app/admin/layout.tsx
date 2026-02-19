import './admin.css';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminSession } from '@/lib/server/session';

export const metadata = {
  title: 'Admin • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return (
    <AdminShell
      brand="Taylor-Made Baby Co."
      links={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Blog Drafts', href: '/admin/blog' },
        { label: 'Analytics', href: '/admin/analytics' },
        { label: 'Affiliates', href: '/admin/affiliates' },
      ]}
    >
      {children}
    </AdminShell>
  );
}
