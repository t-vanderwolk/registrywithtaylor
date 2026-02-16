import type { ReactNode } from 'react';
import AdminHeader from '@/components/admin/ui/AdminHeader';

export default function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return <AdminHeader eyebrow={eyebrow} title={title} subtitle={subtitle} actions={actions} />;
}
