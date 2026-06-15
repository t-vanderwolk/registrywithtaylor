'use client';

import { useState } from 'react';
import Link from 'next/link';
import RegistryCard from './RegistryCard';
import RegistryForm from './RegistryForm';
import type { RegistryRecord } from './MemberDashboardClient';
import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';
import styles from './RegistrySection.module.scss';

type Props = {
  registries:          RegistryRecord[];
  onRegistriesChange:  (next: RegistryRecord[]) => void;
};

export default function RegistrySection({ registries, onRegistriesChange }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTarget, setEditTarget]  = useState<RegistryRecord | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleAdded(record: RegistryRecord) {
    onRegistriesChange([...registries, record]);
    setShowAddForm(false);
    trackEvent(AnalyticsEvents.REGISTRY_ADDED, {
      platform:       record.platform,
      has_item_count: record.itemCount != null,
    });
  }

  function handleUpdated(record: RegistryRecord) {
    onRegistriesChange(registries.map((r) => (r.id === record.id ? record : r)));
    setEditTarget(null);
    trackEvent(AnalyticsEvents.REGISTRY_UPDATED, {
      platform: record.platform,
    });
  }

  async function handleDelete(id: string) {
    const target = registries.find((r) => r.id === id);
    const res = await fetch(`/api/registry/${id}`, { method: 'DELETE' });
    if (res.ok) {
      onRegistriesChange(registries.filter((r) => r.id !== id));
      if (target) {
        trackEvent(AnalyticsEvents.REGISTRY_REMOVED, {
          platform: target.platform,
        });
      }
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your registries</p>
          <h2 className={styles.heading}>Baby Registries</h2>
        </div>
        {!showAddForm && !editTarget && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setShowAddForm(true)}
          >
            + Add registry
          </button>
        )}
      </div>

      {/* Subtext */}
      <p className={styles.subtext}>
        Track all your baby registries in one place. Add links, item counts, and
        notes so you can manage everything without switching tabs.{' '}
        <Link href="/learn/registry" className={styles.learnLink}>
          Registry strategy →
        </Link>
      </p>

      {/* Add form */}
      {showAddForm && (
        <RegistryForm
          mode="add"
          onSaved={handleAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit form */}
      {editTarget && (
        <RegistryForm
          mode="edit"
          initial={editTarget}
          onSaved={handleUpdated}
          onCancel={() => setEditTarget(null)}
        />
      )}

      {/* Registry list */}
      {registries.length === 0 && !showAddForm ? (
        <EmptyState onAdd={() => setShowAddForm(true)} />
      ) : (
        <ul className={styles.list}>
          {registries.map((r) => (
            <li key={r.id}>
              <RegistryCard
                record={r}
                onEdit={() => setEditTarget(r)}
                onDelete={() => handleDelete(r.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden>🎁</span>
      <h3 className={styles.emptyHeading}>No registries saved yet</h3>
      <p className={styles.emptyText}>
        Add your Babylist, Amazon, or Target registry so you can track everything
        in one place.
      </p>
      <button type="button" className={styles.emptyBtn} onClick={onAdd}>
        Add your first registry
      </button>
    </div>
  );
}
