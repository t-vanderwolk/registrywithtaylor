'use client';

import { useState } from 'react';
import PlatformSelector, { type Platform } from './PlatformSelector';
import type { RegistryRecord } from './MemberDashboardClient';
import styles from './RegistryForm.module.scss';

type AddProps = {
  mode:     'add';
  initial?: undefined;
  onSaved:  (record: RegistryRecord) => void;
  onCancel: () => void;
};

type EditProps = {
  mode:    'edit';
  initial: RegistryRecord;
  onSaved: (record: RegistryRecord) => void;
  onCancel: () => void;
};

type Props = AddProps | EditProps;

export default function RegistryForm({ mode, initial, onSaved, onCancel }: Props) {
  const [platform,       setPlatform]       = useState<Platform | ''>(
    (initial?.platform as Platform) ?? '',
  );
  const [url,            setUrl]            = useState(initial?.url ?? '');
  const [name,           setName]           = useState(initial?.name ?? '');
  const [itemCount,      setItemCount]      = useState<string>(
    initial?.itemCount != null ? String(initial.itemCount) : '',
  );
  const [completedCount, setCompletedCount] = useState<string>(
    initial?.completedCount != null ? String(initial.completedCount) : '',
  );
  const [notes,          setNotes]          = useState(initial?.notes ?? '');
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!platform) {
      setError('Please select a platform.');
      return;
    }
    if (!url.trim()) {
      setError('Registry URL is required.');
      return;
    }

    const payload: Record<string, unknown> = {
      platform,
      url:   url.trim(),
      name:  name.trim() || null,
      notes: notes.trim() || null,
    };

    const parsedItems     = parseInt(itemCount, 10);
    const parsedCompleted = parseInt(completedCount, 10);
    if (!isNaN(parsedItems)     && parsedItems > 0)     payload.itemCount      = parsedItems;
    if (!isNaN(parsedCompleted) && parsedCompleted >= 0) payload.completedCount = parsedCompleted;

    setSaving(true);

    try {
      const res = await fetch(
        mode === 'edit' ? `/api/registry/${initial!.id}` : '/api/registry',
        {
          method:  mode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        },
      );

      const data = await res.json() as { registry?: RegistryRecord; error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.registry) {
        onSaved(data.registry);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {mode === 'add' ? 'Add a registry' : 'Edit registry'}
        </h3>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>

      {/* Platform */}
      <div className={styles.field}>
        <label className={styles.label}>Registry platform *</label>
        <PlatformSelector value={platform} onChange={setPlatform} />
      </div>

      {/* URL */}
      <div className={styles.field}>
        <label htmlFor="reg-url" className={styles.label}>
          Registry URL *
        </label>
        <input
          id="reg-url"
          type="url"
          className={styles.input}
          placeholder="https://www.babylist.com/list/your-registry"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      {/* Name (optional) */}
      <div className={styles.field}>
        <label htmlFor="reg-name" className={styles.label}>
          Custom label <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="reg-name"
          type="text"
          className={styles.input}
          placeholder="e.g. Taylor & Jordan's Registry"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
        />
      </div>

      {/* Item counts */}
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="reg-items" className={styles.label}>
            Total items <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="reg-items"
            type="number"
            min={1}
            className={styles.input}
            placeholder="e.g. 75"
            value={itemCount}
            onChange={(e) => setItemCount(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="reg-purchased" className={styles.label}>
            Items purchased <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="reg-purchased"
            type="number"
            min={0}
            className={styles.input}
            placeholder="e.g. 32"
            value={completedCount}
            onChange={(e) => setCompletedCount(e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className={styles.field}>
        <label htmlFor="reg-notes" className={styles.label}>
          Notes <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="reg-notes"
          className={`${styles.input} ${styles.textarea}`}
          placeholder="e.g. Primary registry, shared with family"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={400}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">{error}</p>
      )}

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving
            ? (mode === 'add' ? 'Saving…' : 'Updating…')
            : (mode === 'add' ? 'Add registry' : 'Save changes')}
        </button>
      </div>
    </form>
  );
}
