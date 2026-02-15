'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/affiliates', label: 'Affiliates' },
];

export default function AdminPortalNav() {
  const pathname = usePathname();

  return (
    <header className="admin-portal-header">
      <div className="admin-portal-header__row">
        <Link href="/admin" className="brand">
          Admin Portal
        </Link>
        <nav className="admin-portal-nav" aria-label="Admin portal navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-portal-link ${pathname === link.href ? 'is-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className="admin-portal-link">
            View Site
          </Link>
          <button
            type="button"
            className="admin-portal-logout"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
