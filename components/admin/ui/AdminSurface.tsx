import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'default' | 'muted';

export default function AdminSurface<T extends ElementType = 'section'>({
  as,
  children,
  className,
  variant = 'default',
  ...rest
}: {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: Variant;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>) {
  const Comp = as ?? 'section';

  return (
    <Comp
      className={cn(variant === 'muted' ? 'admin-surface-muted' : 'admin-surface', className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
