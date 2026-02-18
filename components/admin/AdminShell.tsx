'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminButton from '@/components/admin/ui/AdminButton';

type NavLink = { label: string; href: string };

function isActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
  brand,
  links,
}: {
  children: ReactNode;
  brand: string;
  links: NavLink[];
}) {
  const pathname = usePathname() ?? '/admin';

  return (
    <div className="admin-page">
      <AdminContainer className="admin-stack" >
        <AdminSurface variant="muted" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Admin Portal</p>
            <p className="admin-h2">{brand}</p>
          </div>
          <div className="flex items-center gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/">View site</Link>
            </AdminButton>
          </div>
        </AdminSurface>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <aside className="lg:col-span-3">
            <AdminSurface variant="muted" className="admin-stack lg:sticky lg:top-6" >
              <p className="admin-eyebrow">Navigation</p>
              <nav className="admin-stack gap-1.5" aria-label="Admin navigation">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`admin-nav-link ${isActive(pathname, link.href) ? 'is-active' : ''}`}
                    aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="admin-divider" />
              <p className="admin-micro">
                Local drafts live in <span className="font-mono text-admin-muted">/data/blog-drafts.json</span>.
              </p>
            </AdminSurface>
          </aside>

          <main className="lg:col-span-9">
            <div className="admin-stack gap-10">
              {children}
            </div>
          </main>
        </div>
      </AdminContainer>
    </div>
  );
}
