'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ProfileSettingsPanel.module.scss';

type Tab = 'personal' | 'pregnancy' | 'account';

type Props = {
  onClose:     () => void;
  onSaved?:    (updates: { name?: string; partnerName?: string; dueDate?: string | null }) => void;
  initialTab?: Tab;
};

export default function ProfileSettingsPanel({ onClose, onSaved, initialTab }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'personal');

  // ── Field state ─────────────────────────────────────────────────────────────
  const [name,            setName]            = useState('');
  const [partnerName,     setPartnerName]     = useState('');
  const [dueDate,         setDueDate]         = useState('');
  const [email,           setEmail]           = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  // ── Load current values ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        setName(data.name ?? '');
        setPartnerName(data.partnerName ?? '');
        setDueDate(data.dueDate ?? '');
        setEmail(data.email ?? '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Close on Escape ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setError(null);
    setSuccess(null);

    // Validate password fields if filled
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters.');
        return;
      }
      if (!currentPassword) {
        setError('Enter your current password to change it.');
        return;
      }
    }

    setSaving(true);

    const body: Record<string, unknown> = {
      name,
      partnerName,
      dueDate: dueDate || null,
      email,
    };

    if (newPassword && currentPassword) {
      body.currentPassword = currentPassword;
      body.newPassword     = newPassword;
    }

    try {
      const res  = await fetch('/api/user/profile', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.');
      } else {
        setSuccess('Profile saved!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Bubble up changes so the hero re-renders without a full page reload
        onSaved?.({
          name:        name.trim() || undefined,
          partnerName: partnerName.trim() || undefined,
          dueDate:     dueDate || null,
        });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [name, partnerName, dueDate, email, currentPassword, newPassword, confirmPassword, onSaved]);

  return (
    <>
      {/* Backdrop */}
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Profile settings"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Profile settings</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {(['personal', 'pregnancy', 'account'] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`${styles.tab} ${tab === t ? styles.active : ''}`}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
            >
              {t === 'personal'  ? '👤 Personal'  : null}
              {t === 'pregnancy' ? '🤰 Pregnancy'  : null}
              {t === 'account'   ? '🔒 Account'    : null}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {loading ? (
            <p style={{ color: '#a3a3a3', fontSize: '0.88rem' }}>Loading…</p>
          ) : (
            <>
              {error   && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              {/* ── Personal tab ───────────────────────────────────────────── */}
              {tab === 'personal' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-name">Your name</label>
                    <input
                      id="ps-name"
                      type="text"
                      autoComplete="given-name"
                      className={styles.input}
                      placeholder="Taylor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-partner">
                      Partner&apos;s name{' '}
                      <span style={{ fontWeight: 400, color: '#a3a3a3' }}>(optional)</span>
                    </label>
                    <input
                      id="ps-partner"
                      type="text"
                      className={styles.input}
                      placeholder="Jordan"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                    />
                    <span className={styles.hint}>
                      Shown in your dashboard greeting when set.
                    </span>
                  </div>
                </>
              )}

              {/* ── Pregnancy tab ───────────────────────────────────────────── */}
              {tab === 'pregnancy' && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="ps-due">Due date</label>
                  <input
                    id="ps-due"
                    type="date"
                    className={styles.input}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <span className={styles.hint}>
                    Used for your countdown and to personalise your dashboard.
                    You can update this any time.
                  </span>
                </div>
              )}

              {/* ── Account tab ─────────────────────────────────────────────── */}
              {tab === 'account' && (
                <>
                  <p className={styles.sectionLabel}>Email</p>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-email">Email address</label>
                    <input
                      id="ps-email"
                      type="email"
                      autoComplete="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.divider} />

                  <p className={styles.sectionLabel}>Change password</p>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-cur-pw">Current password</label>
                    <input
                      id="ps-cur-pw"
                      type="password"
                      autoComplete="current-password"
                      className={styles.input}
                      placeholder="Your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-new-pw">New password</label>
                    <input
                      id="ps-new-pw"
                      type="password"
                      autoComplete="new-password"
                      className={styles.input}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ps-confirm-pw">Confirm new password</label>
                    <input
                      id="ps-confirm-pw"
                      type="password"
                      autoComplete="new-password"
                      className={styles.input}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </aside>
    </>
  );
}
