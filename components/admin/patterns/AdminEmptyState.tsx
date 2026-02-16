import type { ReactNode } from 'react';

export default function AdminEmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-stack items-start gap-2 p-6">
      <h3 className="admin-h2">{title}</h3>
      {hint ? <p className="admin-body">{hint}</p> : null}
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
