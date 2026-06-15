'use client';

import { useState } from 'react';
import type { RegistryRecord } from './MemberDashboardClient';
import styles from './RegistryCard.module.scss';

const PLATFORM_ICONS: Record<string, string> = {
  BABYLIST:   '👶',
  AMAZON:     '📦',
  TARGET:     '🎯',
  BUYBUYBABY: '🍼',
  WALMART:    '🛒',
  OTHER:      '🔗',
};

const PLATFORM_LABELS: Record<string, string> = {
  BABYLIST:   'Babylist',
  AMAZON:     'Amazon',
  TARGET:     'Target',
  BUYBUYBABY: 'buybuy BABY',
  WALMART:    'Walmart',
  OTHER:      'Registry',
};

const PLATFORM_COLORS: Record<string, string> = {
  BABYLIST:   'rgba(95, 148, 211, 0.1)',
  AMAZON:     'rgba(255, 153, 0, 0.1)',
  TARGET:     'rgba(204, 0, 0, 0.1)',
  BUYBUYBABY: 'rgba(0, 87, 163, 0.1)',
  WALMART:    'rgba(0, 113, 206, 0.1)',
  OTHER:      'rgba(215, 161, 175, 0.12)',
};

type Props = {
  record:   RegistryRecord;
  onEdit:   () => void;
  onDelete: () => void;
};

export default function RegistryCard({ record, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  const icon       = PLATFORM_ICONS[record.platform]  ?? '🔗';
  const label      = PLATFORM_LABELS[record.platform] ?? 'Registry';
  const bg         = PLATFORM_COLORS[record.platform] ?? PLATFORM_COLORS.OTHER;
  const displayName = record.name ?? label;

  const pct = record.itemCount && record.completedCount != null
    ? Math.min(100, Math.round((record.completedCount / record.itemCount) * 100))
    : null;

  const domain = (() => {
    try { return new URL(record.url).hostname.replace(/^www\./, ''); }
    catch { return record.url; }
  })();

  return (
    <div className={styles.card} style={{ '--platform-bg': bg } as React.CSSProperties}>
      {/* ── Platform icon ──────────────────────────────────────────────────── */}
      <div className={styles.iconWrap} aria-hidden>
        <span className={styles.icon}>{icon}</span>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div>
            <span className={styles.platformLabel}>{label}</span>
            <h3 className={styles.name}>{displayName}</h3>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onEdit}
              aria-label="Edit registry"
            >
              Edit
            </button>
            {confirming ? (
              <div className={styles.confirmRow}>
                <span className={styles.confirmText}>Remove?</span>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.deleteConfirmBtn}`}
                  onClick={onDelete}
                >
                  Yes, remove
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => setConfirming(true)}
                aria-label="Remove registry"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* URL */}
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.url}
          aria-label={`Open ${displayName} registry on ${domain}`}
        >
          {domain} ↗
        </a>

        {/* Progress */}
        {record.itemCount != null && record.itemCount > 0 && (
          <div className={styles.progress}>
            <div className={styles.progressTrack} role="progressbar" aria-valuenow={pct ?? 0} aria-valuemin={0} aria-valuemax={100}>
              <div className={styles.progressFill} style={{ width: `${pct ?? 0}%` }} />
            </div>
            <span className={styles.progressLabel}>
              {record.completedCount ?? 0} of {record.itemCount} items
              {pct !== null ? ` · ${pct}%` : ''}
            </span>
          </div>
        )}

        {/* Notes */}
        {record.notes && (
          <p className={styles.notes}>{record.notes}</p>
        )}
      </div>
    </div>
  );
}
