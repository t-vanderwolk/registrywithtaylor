import './admin.css';
import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminViewSession } from '@/lib/server/session';

export const metadata = {
  title: 'Admin • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

type NavLink = { label: string; href: string };
type NavSection = { label: string; links: NavLink[] };

// Academy and guides admin surfaces are hidden from the portal entirely — no
// nav links reference them. (The underlying routes/flags still exist if ever
// re-enabled, but they are intentionally unreachable from the simplified nav.)
const isAcademyLink = (href: string) => href.startsWith('/admin/academy') || href === '/academy';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminViewSession();
  const isReviewerMode = session.user.role === 'REVIEWER';

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
                  { label: 'Blog Overview', href: '/admin/blog' },
                  { label: 'Categories', href: '/admin/blog/categories' },
                ],
              },
              {
                label: 'Analytics',
                links: [
                  { label: 'Analytics Summary', href: '/admin/analytics' },
                ],
              },
              {
                label: 'Public Site',
                links: [
                  { label: 'Homepage', href: '/' },
                  { label: 'Services', href: '/services' },
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
                label: 'Databases',
                links: [
                  { label: 'Strollers', href: '/admin/strollers' },
                  { label: 'Car Seats', href: '/admin/car-seats' },
                  { label: 'Compatibility', href: '/admin/catalog/compatibility' },
                  { label: 'Affiliate Catalog', href: '/admin/catalog' },
                  { label: 'Catalog Health', href: '/admin/catalog/health' },
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
                label: 'Members & Consult',
                links: [
                  { label: 'Waitlist & Enrollment', href: '/admin/members' },
                  { label: 'Consultations', href: '/admin/consultations' },
                  { label: 'Inquiries', href: '/admin/inquiries' },
                ],
              },
              {
                label: 'Publish',
                links: [
                  { label: 'Posts', href: '/admin/blog' },
                  { label: 'Planner', href: '/admin/blog/planner' },
                  { label: 'Categories', href: '/admin/blog/categories' },
                ],
              },
              {
                label: 'Measure',
                links: [
                  { label: 'Analytics', href: '/admin/analytics' },
                ],
              },
            ];

  // Defense-in-depth: strip any academy links even if one slips into the arrays.
  const sections: NavSection[] = rawSections
    .map((section) => ({ ...section, links: section.links.filter((link) => !isAcademyLink(link.href)) }))
    .filter((section) => section.links.length > 0);

  return (
    <AdminShell brand="Taylor-Made Baby Co." isReviewerMode={isReviewerMode} sections={sections}>
      {children}
    </AdminShell>
  );
}
