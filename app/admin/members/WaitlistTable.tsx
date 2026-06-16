'use client';

import { useState } from 'react';
import AdminTable from '@/components/admin/ui/AdminTable';

type Entry = {
  id: string;
  email: string;
  name: string | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
};

const TIER_OPTIONS = ['free', 'academy', 'academy_plus', 'concierge'] as const;
type Tier = (typeof TIER_OPTIONS)[number];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'admin-chip' },
  approved: { label: 'Approved', className: 'admin-chip admin-chip--published' },
  rejected: { label: 'Rejected', className: 'admin-chip admin-chip--draft' },
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function WaitlistTable({
  entries,
  readOnly = false,
}: {
  entries: Entry[];
  readOnly?: boolean;
}) {
  // Per-row state: selected tier + async action state
  const [tiers, setTiers]     = useState<Record<string, Tier>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, { tempPassword?: string; error?: string }>>({});
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  function getTier(id: string): Tier {
    return tiers[id] ?? 'free';
  }

  async function handleApprove(entry: Entry) {
    setLoading((p) => ({ ...p, [entry.id]: true }));
    setResults((p) => ({ ...p, [entry.id]: {} }));
    try {
      const res = await fetch(`/api/admin/members/${entry.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: getTier(entry.id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Approval failed');
      setResults((p) => ({ ...p, [entry.id]: { tempPassword: data.tempPassword } }));
    } catch (err) {
      setResults((p) => ({
        ...p,
        [entry.id]: { error: err instanceof Error ? err.message : 'Unknown error' },
      }));
    } finally {
      setLoading((p) => ({ ...p, [entry.id]: false }));
    }
  }

  async function handleReject(entry: Entry) {
    setLoading((p) => ({ ...p, [entry.id]: true }));
    try {
      const res = await fetch(`/api/admin/members/${entry.id}/reject`, { method: 'POST' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Reject failed');
      }
      // Dismiss the row after a short delay
      setTimeout(() => setDismissed((p) => new Set([...p, entry.id])), 600);
    } catch (err) {
      setResults((p) => ({
        ...p,
        [entry.id]: { error: err instanceof Error ? err.message : 'Unknown error' },
      }));
    } finally {
      setLoading((p) => ({ ...p, [entry.id]: false }));
    }
  }

  const visible = entries.filter((e) => !dismissed.has(e.id));
  if (visible.length === 0) return <p className="admin-micro">No entries.</p>;

  return (
    <AdminTable
      density="comfortable"
      columns={[
        { key: 'email',     label: 'Email' },
        { key: 'name',      label: 'Name' },
        { key: 'joined',    label: 'Joined' },
        { key: 'status',    label: 'Status' },
        ...(readOnly ? [] : [{ key: 'tier', label: 'Tier' }, { key: 'actions', label: '' }]),
      ]}
    >
      {visible.map((entry) => {
        const result  = results[entry.id];
        const busy    = loading[entry.id] ?? false;
        const statusMeta = STATUS_LABELS[entry.status] ?? STATUS_LABELS.pending;

        return (
          <tr key={entry.id} className="admin-row">
            <td className="text-admin">{entry.email}</td>
            <td className="admin-micro">{entry.name ?? '—'}</td>
            <td className="admin-micro">{formatDate(entry.createdAt)}</td>
            <td>
              <span className={statusMeta.className}>{statusMeta.label}</span>
            </td>

            {!readOnly && (
              <>
                <td>
                  <select
                    value={getTier(entry.id)}
                    onChange={(e) =>
                      setTiers((p) => ({ ...p, [entry.id]: e.target.value as Tier }))
                    }
                    disabled={busy || !!result?.tempPassword}
                    className="rounded-[0.6rem] border border-[var(--admin-color-border)] bg-white px-2 py-1.5 text-[0.8rem] text-admin focus:outline-none"
                  >
                    {TIER_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>

                <td>
                  {result?.tempPassword ? (
                    // Approval succeeded — login email was sent automatically
                    <div className="admin-stack gap-1">
                      <p className="text-[0.72rem] font-medium text-[var(--admin-color-success,#3a7a52)]">
                        Approved ✓ — login email sent
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-neutral-100 px-2 py-0.5 text-[0.78rem] font-mono text-neutral-700">
                          {result.tempPassword}
                        </code>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(result.tempPassword!)}
                          className="text-[0.72rem] text-[var(--color-accent-dark)] underline underline-offset-2 hover:opacity-70"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[0.7rem] text-neutral-400">
                        Backup copy emailed to you.
                      </p>
                    </div>
                  ) : result?.error ? (
                    <p className="text-[0.8rem] text-red-600">{result.error}</p>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(entry)}
                        disabled={busy}
                        className="rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[0.75rem] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                      >
                        {busy ? 'Working…' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(entry)}
                        disabled={busy}
                        className="rounded-full border border-[var(--admin-color-border)] px-3.5 py-1.5 text-[0.75rem] font-semibold text-neutral-600 transition-opacity hover:opacity-70 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </>
            )}
          </tr>
        );
      })}
    </AdminTable>
  );
}
