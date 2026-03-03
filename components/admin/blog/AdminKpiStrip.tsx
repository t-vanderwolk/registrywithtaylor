import AdminSurface from '@/components/admin/ui/AdminSurface';

export type AdminKpiItem = {
  label: string;
  value: number | string;
  hint?: string;
};

export default function AdminKpiStrip({ items }: { items: AdminKpiItem[] }) {
  return (
    <div className="admin-kpi-grid md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <AdminSurface key={item.label} className="admin-kpi-card admin-stack gap-2">
          <p className="admin-eyebrow">{item.label}</p>
          <p className="font-serif text-3xl tracking-[-0.03em] text-admin">{item.value}</p>
          {item.hint ? <p className="admin-micro">{item.hint}</p> : null}
        </AdminSurface>
      ))}
    </div>
  );
}
