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
      sections={[
        {
          label: 'Publish',
          links: [
            { label: 'Posts', href: '/admin/blog' },
            { label: 'Media', href: '/admin/media' },
          ],
        },
        {
          label: 'Monetize',
          links: [
            { label: 'Partners', href: '/admin/affiliates' },
            { label: 'Short Links', href: '/admin/affiliate-links' },
          ],
        },
        {
          label: 'Measure',
          links: [{ label: 'Analytics', href: '/admin/analytics' }],
        },
      ]}
    >
      {children}
    </AdminShell>
  );
}
