'use client';

import { useState } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';

export default function AffiliateLinkCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <AdminButton type="button" variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? 'Copied' : 'Copy'}
    </AdminButton>
  );
}
