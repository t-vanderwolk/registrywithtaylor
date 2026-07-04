'use client';

import type { ReactNode } from 'react';

/**
 * A submit button that asks for confirmation before letting its parent form's
 * server action run. Use for destructive actions (delete) inside a
 * `<form action={serverAction}>`.
 */
export default function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
