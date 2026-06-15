import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';
import styles from './ToolsPage.module.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tools | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default async function DashboardToolsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/tools');
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const [strollers, carSeats] = await Promise.all([
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>Member Tools</p>
        <h1 className={styles.heading}>Travel System Compatibility</h1>
        <p className={styles.subtext}>
          Start with your stroller or infant car seat to see what pairs together —
          and where adapters start to matter.
        </p>
      </header>

      {/* ── Tool ───────────────────────────────────────────────────────────── */}
      <div className={styles.toolWrap}>
        <TravelSystemGenerator strollers={strollers} carSeats={carSeats} />
      </div>
    </div>
  );
}
