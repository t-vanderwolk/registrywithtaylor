import type { ElementType, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'default' | 'muted';

export default function AdminSurface<T extends ElementType = 'section'>({
  as,
  children,
  className,
  variant = 'default',
}: {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: Variant;
}) {
  const Comp = as ?? 'section';

  return <Comp className={cn(variant === 'muted' ? 'admin-surface-muted' : 'admin-surface', className)}>{children}</Comp>;
}
