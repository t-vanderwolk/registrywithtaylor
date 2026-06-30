import './admin.css';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { isAcademyAdminEnabled } from '@/lib/featureFlags';
import { requireAdminViewSession } from '@/lib/server/session';

export const metadata = {
  title: 'Admin • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

type NavLink = { label: string; href: string };
type NavSection = { label: string; links: NavLink[] };

// Academy/guides admin surfaces are temporarily hidden. Re-enable by setting
// ACADEMY_ADMIN_ENABLED=true (no code change needed).
const isAcademyLink = (href: string) => href.startsWith('/admin/academy') || href === '/academy';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminViewSession();
  const isReviewerMode = session.user.role === 'REVIEWER';
  const academyAdminEnabled = isAcademyAdminEnabled();

  const rawSections: NavSection[] =
        isReviewerMode
          ? [
              {
                label: 'Reviewer',
                links: [
                  { label: 'Reviewer Home', href: '/dashboard/reviewer' },
                  { label: 'Admin Preview', href: '/admin' },
                ],
              },
              {
                label: 'Content',
                links: [
                  { label: 'Academy Structure', href: '/admin/academy' },
                  { label: 'Blog Overview', href: '/admin/blog' },
                  { label: 'Categories', href: '/admin/blog/categories' },
                ],
              },
              {
                label: 'Analytics',
                links: [
                  { label: 'Analytics Summary', href: '/admin/analytics' },
                  { label: 'Academy Analytics', href: '/admin/academy/analytics' },
                ],
              },
              {
                label: 'Public Site',
                links: [
                  { label: 'Homepage', href: '/' },
                  { label: 'Services', href: '/services' },
                  { label: 'Academy', href: '/academy' },
                  { label: 'Blog', href: '/blog' },
                ],
              },
            ]
          : [
              {
                label: 'Overview',
                links: [{ label: 'Dashboard', href: '/admin' }],
              },
              {
                label: 'Members',
                links: [
                  { label: 'Waitlist & Enrollment', href: '/admin/members' },
                ],
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
                  { label: 'Academy', href: '/admin/academy' },
                  { label: 'Posts', href: '/admin/blog' },
                  { label: 'Planner', href: '/admin/blog/planner' },
                  { label: 'Categories', href: '/admin/blog/categories' },
                ],
              },
              {
                label: 'Monetize',
                links: [
                  { label: 'Catalog', href: '/admin/catalog' },
                  { label: 'Catalog Health', href: '/admin/catalog/health' },
                  { label: 'Affiliate Canon', href: '/admin/affiliates' },
                  { label: 'Partners', href: '/admin/partners' },
                  { label: 'Short Links', href: '/admin/affiliate-links' },
                ],
              },
              {
                label: 'Measure',
                links: [
                  { label: 'Analytics', href: '/admin/analytics' },
                  { label: 'Academy Analytics', href: '/admin/academy/analytics' },
                ],
              },
            ];

  const sections: NavSection[] = academyAdminEnabled
    ? rawSections
    : rawSections
        .map((section) => ({ ...section, links: section.links.filter((link) => !isAcademyLink(link.href)) }))
        .filter((section) => section.links.length > 0);

  return (
    <AdminShell
      brand="Taylor-Made Baby Co."
      isReviewerMode={isReviewerMode}
      academyAdminEnabled={academyAdminEnabled}
      sections={sections}
    >
      {children}
    </AdminShell>
  );
}
