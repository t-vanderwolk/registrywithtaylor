import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import type { AffiliateOption } from '@/components/admin/blog/postEditorTypes';

export default function PostAffiliatesPanel({
  affiliateOptions,
  selectedAffiliateIds,
  onToggleAffiliate,
}: {
  affiliateOptions: AffiliateOption[];
  selectedAffiliateIds: string[];
  onToggleAffiliate: (affiliateId: string, checked: boolean) => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Affiliates</p>
        <h2 className="admin-h2">Partner checklist</h2>
        <p className="admin-body">Check any partners referenced in the draft so disclosure stays aligned with the article.</p>
      </div>

      {affiliateOptions.length === 0 ? (
        <p className="admin-micro">No affiliate partners available.</p>
      ) : (
        <div className="space-y-3">
          {affiliateOptions.map((partner) => {
            const checked = selectedAffiliateIds.includes(partner.id);

            return (
              <label
                key={partner.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.02]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggleAffiliate(partner.id, event.target.checked)}
                  className="h-4 w-4 rounded border-[var(--admin-color-border)]"
                />
                <AffiliatePartnerIdentity name={partner.name} network={partner.network} size="sm" showNetwork />
              </label>
            );
          })}
        </div>
      )}
    </AdminSurface>
  );
}
