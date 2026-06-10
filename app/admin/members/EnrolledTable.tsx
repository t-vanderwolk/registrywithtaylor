'use client';

import AdminTable from '@/components/admin/ui/AdminTable';

type Learner = {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  dueDate: Date | null;
  createdAt: Date;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const TIER_CLASSES: Record<string, string> = {
  free:          'admin-chip',
  academy:       'admin-chip admin-chip--published',
  academy_plus:  'admin-chip admin-chip--published',
  concierge:     'admin-chip admin-chip--published',
};

export default function EnrolledTable({ learners }: { learners: Learner[] }) {
  return (
    <AdminTable
      density="comfortable"
      columns={[
        { key: 'email',   label: 'Email' },
        { key: 'name',    label: 'Name' },
        { key: 'tier',    label: 'Tier' },
        { key: 'due',     label: 'Due date' },
        { key: 'joined',  label: 'Enrolled' },
      ]}
    >
      {learners.map((learner) => (
        <tr key={learner.id} className="admin-row">
          <td className="text-admin">{learner.email}</td>
          <td className="admin-micro">{learner.name ?? '—'}</td>
          <td>
            <span className={TIER_CLASSES[learner.subscriptionTier] ?? 'admin-chip'}>
              {learner.subscriptionTier}
            </span>
          </td>
          <td className="admin-micro">
            {learner.dueDate ? formatDate(learner.dueDate) : '—'}
          </td>
          <td className="admin-micro">{formatDate(learner.createdAt)}</td>
        </tr>
      ))}
    </AdminTable>
  );
}
