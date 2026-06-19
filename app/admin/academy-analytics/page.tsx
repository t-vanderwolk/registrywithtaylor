import { redirect } from 'next/navigation';

// Canonical Academy analytics lives at /admin/academy/analytics.
// This alias catches the legacy / hyphenated /admin/academy-analytics URL
// so any old bookmarks or links resolve instead of 404ing.
export const dynamic = 'force-dynamic';

export default function AcademyAnalyticsAliasPage() {
  redirect('/admin/academy/analytics');
}
