import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE } from '@/lib/server/guideStorage';

export default function GuideStorageNotice({
  backHref = '/admin',
  backLabel = 'Back to admin',
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-2">
        <p className="admin-eyebrow">Guide Setup Required</p>
        <h2 className="admin-h2">The guide workspace is waiting on its database tables.</h2>
        <p className="admin-body">{GUIDE_STORAGE_UNAVAILABLE_MESSAGE}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <AdminButton asChild variant="secondary">
          <Link href={backHref}>{backLabel}</Link>
        </AdminButton>
      </div>
    </AdminSurface>
  );
}
