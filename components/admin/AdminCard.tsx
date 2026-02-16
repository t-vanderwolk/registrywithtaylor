import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';

export default function AdminCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return <AdminKpiCard label={title} value={value} hint={hint} />;
}
