import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export default function AdminBlogLoading() {
  return (
    <AdminStack gap="xl">
      <div className="admin-stack gap-3">
        <div className="h-3 w-20 rounded-full bg-black/10" />
        <div className="h-10 w-64 rounded-full bg-black/10" />
        <div className="h-4 w-96 max-w-full rounded-full bg-black/10" />
      </div>

      <div className="admin-kpi-grid md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AdminSurface key={index} className="admin-kpi-card">
            <div className="admin-stack gap-2">
              <div className="h-3 w-20 rounded-full bg-black/10" />
              <div className="h-8 w-16 rounded-full bg-black/10" />
            </div>
          </AdminSurface>
        ))}
      </div>

      <AdminSurface className="admin-stack gap-4">
        <div className="grid gap-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 rounded-[24px] bg-black/[0.06]" />
          ))}
        </div>
        <div className="h-[420px] rounded-[28px] border border-[var(--admin-color-border)] bg-white/70" />
      </AdminSurface>
    </AdminStack>
  );
}
