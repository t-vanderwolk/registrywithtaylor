import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './cn';

const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function AdminInput(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn('admin-input', className)} {...props} />;
});

export default AdminInput;
