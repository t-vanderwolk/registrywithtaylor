'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AdminButton from '@/components/admin/ui/AdminButton';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/affiliates', label: 'Affiliates' },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminPortalNav() {
  const pathname = usePathname() ?? '/admin';

  return (
    <header className="admin-surface-muted admin-page">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link href="/admin" className="admin-h2">
          Admin Portal
        </Link>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Admin portal navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link ${isActive(pathname, link.href) ? 'is-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <AdminButton asChild size="sm">
            <Link href="/">View site</Link>
          </AdminButton>
          <AdminButton size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: '/login' })}>
            Logout
          </AdminButton>
        </nav>
      </div>
    </header>
  );
}
