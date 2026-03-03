import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export default function PlannerLoading() {
  return (
    <AdminStack gap="xl">
      <div className="admin-stack gap-3">
        <div className="h-3 w-20 rounded-full bg-black/[0.08]" />
        <div className="h-10 w-64 rounded-full bg-black/[0.08]" />
        <div className="h-4 w-96 max-w-full rounded-full bg-black/[0.08]" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <AdminSurface key={index} className="admin-stack gap-4">
            <div className="h-6 w-28 rounded-full bg-black/[0.08]" />
            <div className="admin-stack gap-3">
              <div className="h-28 rounded-[24px] bg-black/[0.05]" />
              <div className="h-28 rounded-[24px] bg-black/[0.05]" />
            </div>
          </AdminSurface>
        ))}
      </div>
    </AdminStack>
  );
}
