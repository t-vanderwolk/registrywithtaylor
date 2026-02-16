'use client';

import { useEffect, useRef } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';

export default function AdminConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="admin-surface w-full max-w-md backdrop:bg-black/30" aria-label={title}>
      <div className="admin-stack gap-3">
        <h2 className="admin-h2">{title}</h2>
        {body ? <p className="admin-body">{body}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <AdminButton variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </dialog>
  );
}
