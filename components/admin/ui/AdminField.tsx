import type { ReactNode } from 'react';

export default function AdminField({
  label,
  htmlFor,
  help,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-stack gap-1.5">
      <label htmlFor={htmlFor} className="admin-label">
        {label}
      </label>
      {children}
      {error ? <p className="admin-help text-admin-danger">{error}</p> : null}
      {!error && help ? <p className="admin-help">{help}</p> : null}
    </div>
  );
}
