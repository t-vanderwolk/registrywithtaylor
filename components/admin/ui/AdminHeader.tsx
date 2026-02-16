import type { ReactNode } from 'react';
import { cn } from './cn';

export default function AdminHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="admin-stack gap-2">
        {eyebrow ? <p className="admin-eyebrow">{eyebrow}</p> : null}
        <h1 className="admin-h1">{title}</h1>
        {subtitle ? <p className="admin-body max-w-3xl">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
