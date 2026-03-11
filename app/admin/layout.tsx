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
          label: 'Overview',
          links: [{ label: 'Dashboard', href: '/admin' }],
        },
        {
          label: 'Consult',
          links: [
            { label: 'Consultations', href: '/admin/consultations' },
            { label: 'Inquiries', href: '/admin/inquiries' },
          ],
        },
        {
          label: 'Publish',
          links: [
            { label: 'Guides', href: '/admin/guides' },
            { label: 'Posts', href: '/admin/blog' },
            { label: 'Planner', href: '/admin/blog/planner' },
            { label: 'Categories', href: '/admin/blog/categories' },
          ],
        },
        {
          label: 'Monetize',
          links: [
            { label: 'Affiliate Canon', href: '/admin/affiliates' },
            { label: 'Partners', href: '/admin/partners' },
            { label: 'Short Links', href: '/admin/affiliate-links' },
          ],
        },
        {
          label: 'Measure',
          links: [
            { label: 'Analytics', href: '/admin/analytics' },
            { label: 'Guide Analytics', href: '/admin/guides/analytics' },
          ],
        },
      ]}
    >
      {children}
    </AdminShell>
  );
}
