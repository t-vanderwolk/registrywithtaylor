import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function AdminTextarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn('admin-textarea', className)} {...props} />;
});

export default AdminTextarea;
