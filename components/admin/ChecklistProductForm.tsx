'use client';

import { useRef, useState, type ComponentProps } from 'react';
import { checklistProductLinkError } from '@/lib/checklist/productLinkForm';

export default function ChecklistProductForm({ children, ...props }: ComponentProps<'form'>) {
  const [error, setError] = useState<string | null>(null);
  const message = useRef<HTMLParagraphElement>(null);
  return (
    <form {...props} onSubmit={(event) => {
      const nextError = checklistProductLinkError(new FormData(event.currentTarget));
      setError(nextError);
      if (nextError) {
        event.preventDefault();
        requestAnimationFrame(() => message.current?.focus());
      }
    }}>
      {children}
      {error ? <p ref={message} tabIndex={-1} role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
    </form>
  );
}
