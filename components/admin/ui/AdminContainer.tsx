import type { ReactNode } from 'react';
import { cn } from './cn';

export default function AdminContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('admin-container', className)}>{children}</div>;
}
