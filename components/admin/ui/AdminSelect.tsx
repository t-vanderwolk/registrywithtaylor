import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from './cn';

const AdminSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function AdminSelect(
  { className, ...props },
  ref,
) {
  return <select ref={ref} className={cn('admin-select', className)} {...props} />;
});

export default AdminSelect;
