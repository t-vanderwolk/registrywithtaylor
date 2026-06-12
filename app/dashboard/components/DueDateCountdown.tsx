'use client';

import styles from './DueDateCountdown.module.scss';

type Props = {
  dueDateIso: string | null; // ISO string from server
  onAddDueDate?: () => void; // opens profile panel
};

function getTrimester(daysUntil: number): string {
  // Approximate: dueDate = 40 weeks. Work backwards.
  const weeksLeft = daysUntil / 7;
  const weeksIn   = 40 - weeksLeft;
  if (weeksIn < 0)   return '';
  if (weeksIn < 13)  return '1st trimester';
  if (weeksIn < 27)  return '2nd trimester';
  return '3rd trimester';
}

function getPregnancyPct(daysUntil: number): number {
  // 280 days = 40 weeks full pregnancy
  const total     = 280;
  const daysIn    = total - daysUntil;
  return Math.min(100, Math.max(0, Math.round((daysIn / total) * 100)));
}

export default function DueDateCountdown({ dueDateIso, onAddDueDate }: Props) {
  if (!dueDateIso) {
    return (
      <div className={styles.wrap}>
        <div className={styles.prompt}>
          <p className={styles.promptText}>
            Add your due date to see a personalised countdown.{' '}
            {onAddDueDate && (
              <button type="button" onClick={onAddDueDate}>
                Add due date →
              </button>
            )}
          </p>
        </div>
      </div>
    );
  }

  const dueDate   = new Date(dueDateIso);
  const now       = new Date();
  now.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const msLeft    = dueDate.getTime() - now.getTime();
  const daysLeft  = Math.round(msLeft / 86_400_000);

  // Baby has arrived
  if (daysLeft < 0) {
    const daysAgo = Math.abs(daysLeft);
    return (
      <div className={styles.wrap}>
        <div className={styles.arrived}>
          <span className={styles.arrivedEmoji} aria-hidden="true">🎉</span>
          <div className={styles.arrivedText}>
            <strong>Congratulations!</strong>
            <span>
              {daysAgo === 0
                ? 'Your due date is today!'
                : `Your due date was ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago.`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const weeksLeft  = Math.floor(daysLeft / 7);
  const extraDays  = daysLeft % 7;
  const trimester  = getTrimester(daysLeft);
  const pct        = getPregnancyPct(daysLeft);

  const dueDateStr = dueDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const weeksStr = weeksLeft > 0
    ? `${weeksLeft} week${weeksLeft !== 1 ? 's' : ''}${extraDays > 0 ? ` and ${extraDays} day${extraDays !== 1 ? 's' : ''}` : ''}`
    : `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;

  return (
    <div className={styles.wrap} role="region" aria-label="Due date countdown">
      <div className={styles.countBlock}>
        <span className={styles.days}>{daysLeft}</span>
        <span className={styles.daysLabel}>days to go</span>
      </div>

      <div className={styles.detail}>
        <p className={styles.headline}>
          {weeksStr} until your due date
        </p>
        <p className={styles.sub}>
          {dueDateStr}
          {trimester ? ` · ${trimester}` : ''}
          {` · ${pct}% of the way there`}
        </p>
        <div className={styles.trackWrap}>
          <div className={styles.trackFill} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
