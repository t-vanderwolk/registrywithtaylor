'use client';

import Link from 'next/link';
import AdminTable from '@/components/admin/ui/AdminTable';

type Learner = {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  dueDate: Date | null;
  createdAt: Date;
};

type PathProgress = {
  modules: number;
  lastSeenAt: string | null;
  workbookModules: number;
};

const PATH_TOTALS: Record<string, number> = {
  registry:   8,
  nursery:    6,
  gear:       9,
  postpartum: 6,
};

const TIER_CLASSES: Record<string, string> = {
  free:          'admin-chip',
  academy:       'admin-chip admin-chip--published',
  academy_plus:  'admin-chip admin-chip--published',
  concierge:     'admin-chip admin-chip--published',
};

function formatDate(d: Date | string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatRelative(iso: string | null) {
  if (!iso) return '—';
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return formatDate(iso);
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[0.72rem] tabular-nums text-neutral-500">
        {value}/{total}
      </span>
    </div>
  );
}

export default function EnrolledTable({
  learners,
  progressByLearner,
  registryCountByEmail,
  userIdByEmail,
}: {
  learners:              Learner[];
  progressByLearner:     Record<string, Record<string, PathProgress>>;
  registryCountByEmail:  Record<string, number>;
  userIdByEmail:         Record<string, string>;
}) {
  return (
    <AdminTable
      density="comfortable"
      columns={[
        { key: 'email',      label: 'Member' },
        { key: 'tier',       label: 'Tier' },
        { key: 'registries', label: 'Registries' },
        { key: 'registry',   label: 'Registry' },
        { key: 'nursery',    label: 'Nursery' },
        { key: 'gear',       label: 'Gear' },
        { key: 'postpartum', label: 'Postpartum' },
        { key: 'lastSeen',   label: 'Last active' },
        { key: 'enrolled',   label: 'Enrolled' },
      ]}
    >
      {learners.map((learner) => {
        const byPath         = progressByLearner[learner.id] ?? {};
        const registryCount  = registryCountByEmail[learner.email] ?? 0;
        const userId         = userIdByEmail[learner.email] ?? null;
        const lastSeenAt     = Object.values(byPath)
          .map((p) => p.lastSeenAt)
          .filter(Boolean)
          .sort()
          .at(-1) ?? null;

        return (
          <tr key={learner.id} className="admin-row">
            <td>
              <div className="text-admin">{learner.email}</div>
              {learner.name && (
                <div className="admin-micro mt-0.5 text-neutral-400">{learner.name}</div>
              )}
              {userId && (
                <Link
                  href={`/admin/members/${userId}`}
                  className="admin-micro mt-0.5 text-[var(--color-accent-dark)] underline hover:opacity-75"
                >
                  View details →
                </Link>
              )}
            </td>

            <td>
              <span className={TIER_CLASSES[learner.subscriptionTier] ?? 'admin-chip'}>
                {learner.subscriptionTier}
              </span>
            </td>

            {/* ── Registries column ─────────────────────────────────────────── */}
            <td>
              {registryCount > 0 ? (
                <span className="admin-chip admin-chip--published">
                  {registryCount} saved
                </span>
              ) : (
                <span className="admin-micro text-neutral-300">—</span>
              )}
            </td>

            {(['registry', 'nursery', 'gear', 'postpartum'] as const).map((path) => {
              const p     = byPath[path];
              const total = PATH_TOTALS[path] ?? 0;
              if (!p) {
                return (
                  <td key={path} className="admin-micro text-neutral-300">—</td>
                );
              }
              return (
                <td key={path}>
                  <ProgressBar value={p.modules} total={total} />
                  {p.workbookModules > 0 && (
                    <div className="mt-0.5 text-[0.68rem] text-neutral-400">
                      {p.workbookModules} workbook{p.workbookModules !== 1 ? 's' : ''}
                    </div>
                  )}
                </td>
              );
            })}

            <td className="admin-micro">{formatRelative(lastSeenAt)}</td>
            <td className="admin-micro">{formatDate(learner.createdAt)}</td>
          </tr>
        );
      })}
    </AdminTable>
  );
}
