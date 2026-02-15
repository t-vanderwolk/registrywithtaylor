import type { ReactNode } from 'react';
import AdminPortalNav from '@/components/AdminPortalNav';
import { requireAdminSession } from '@/lib/server/session';

export const metadata = {
  title: 'Admin — Taylor-Made Baby Planning',
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return (
    <div className="site admin-shell">
      <AdminPortalNav />
      <main className="container admin-main">{children}</main>
    </div>
  );
}
