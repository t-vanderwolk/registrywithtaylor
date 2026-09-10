'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import type { AdminNavSection } from '@/lib/admin/navigation';

function isActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
  brand,
  sections,
  isReviewerMode = false,
}: {
  children: ReactNode;
  brand: string;
  sections: AdminNavSection[];
  isReviewerMode?: boolean;
}) {
  const pathname = usePathname() ?? '/admin';
  const activeHref = sections
    .flatMap((section) => section.links)
    .map((link) => link.href)
    .filter((href) => isActive(pathname, href))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <div className="admin-page">
      <AdminContainer className="admin-stack" >
        {isReviewerMode ? (
          <div className="admin-reviewer-banner" role="status">
            <span>Reviewer Mode · Read-only Access</span>
            <span>No create, edit, publish, delete, invite, assign, sync, or send actions are available.</span>
          </div>
        ) : null}

        <AdminSurface variant="muted" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">{isReviewerMode ? 'Reviewer Portal' : 'Admin Portal'}</p>
            <p className="admin-h2">{brand}</p>
          </div>
          <div className="admin-shell-actions">
            {!isReviewerMode ? (
              <>
                <AdminNotificationBell />
                <AdminButton asChild variant="primary">
                  <Link href="/admin/catalog/compatibility">Compatibility</Link>
                </AdminButton>
                <AdminButton asChild variant="secondary">
                  <Link href="/admin/checklist">Checklist</Link>
                </AdminButton>
                <AdminButton asChild variant="secondary">
                  <Link href="/admin/blog/new">New Post</Link>
                </AdminButton>
              </>
            ) : (
              <AdminButton asChild variant="primary">
                <Link href="/dashboard/reviewer">Reviewer Home</Link>
              </AdminButton>
            )}
            <AdminButton asChild variant="secondary">
              <Link href="/">View site</Link>
            </AdminButton>
          </div>
        </AdminSurface>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <aside className="lg:col-span-3">
            <AdminSurface variant="muted" className="admin-stack lg:sticky lg:top-6" >
              <p className="admin-eyebrow">Navigation</p>
              <div className="admin-stack gap-4">
                {sections.map((section) => {
                  if (section.links.length === 0) {
                    return null;
                  }

                  return (
                    <div key={section.label} className="admin-stack gap-1.5">
                      <p className="admin-eyebrow">{section.label}</p>
                      {section.summary ? <p className="admin-nav-summary">{section.summary}</p> : null}
                      <nav className="admin-stack gap-1.5" aria-label={`${section.label} navigation`}>
                        {section.links.map((link) => {
                          const active = link.href === activeHref;

                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`admin-nav-link ${active ? 'is-active' : ''}`}
                              aria-current={active ? 'page' : undefined}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  );
                })}
              </div>
              <div className="admin-divider" />
              <p className="admin-micro">
                {isReviewerMode
                  ? 'Reviewer access is built for inspection only. Production data changes stay off the table.'
                  : 'Manage the stroller and car-seat databases, affiliate links, and posts. Edits here are human-owned and never overwritten by feed syncs.'}
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
