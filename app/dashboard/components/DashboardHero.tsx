import Link from 'next/link';
import styles from './DashboardHero.module.scss';

type Props = {
  firstName: string;
  tierLabel: string | null;
  tier: string | null;
  dueDateLabel: string | null;
};

export default function DashboardHero({ firstName, tierLabel, tier, dueDateLabel }: Props) {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Welcome back</p>
      <h1 className={styles.greeting}>{firstName}</h1>

      <div className={styles.meta}>
        {tierLabel && (
          <span className={styles.tierBadge}>{tierLabel}</span>
        )}
        {dueDateLabel && (
          <span className={styles.dueDate}>Due {dueDateLabel}</span>
        )}
      </div>

      {tier === 'free' && (
        <div className={styles.upgradeBanner}>
          <p>You&apos;re on the free preview. Upgrade to unlock all four Academy paths.</p>
          <Link href="/learn/pricing">View plans →</Link>
        </div>
      )}
    </header>
  );
}
