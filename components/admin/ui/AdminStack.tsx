import type { CSSProperties, ReactNode } from 'react';
import { cn } from './cn';

type Gap = 'sm' | 'md' | 'lg' | 'xl';

const gapMap: Record<Gap, string> = {
  sm: 'var(--admin-stack-gap-sm)',
  md: 'var(--admin-stack-gap-md)',
  lg: 'var(--admin-stack-gap-lg)',
  xl: 'var(--admin-stack-gap-xl)',
};

export default function AdminStack({
  children,
  gap = 'lg',
  className,
}: {
  children: ReactNode;
  gap?: Gap;
  className?: string;
}) {
  return (
    <div
      className={cn('admin-stack', className)}
      style={{ '--admin-stack-gap': gapMap[gap] } as CSSProperties}
    >
      {children}
    </div>
  );
}
