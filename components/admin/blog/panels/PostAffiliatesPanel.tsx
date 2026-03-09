import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import type { AffiliateBrandOption } from '@/components/admin/blog/postEditorTypes';
import { formatAffiliateNetworks } from '@/lib/affiliateBrands';

export default function PostAffiliatesPanel({
  affiliateBrandOptions,
  selectedAffiliateBrandIds,
  onToggleAffiliateBrand,
}: {
  affiliateBrandOptions: AffiliateBrandOption[];
  selectedAffiliateBrandIds: string[];
  onToggleAffiliateBrand: (brandId: string, checked: boolean) => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Affiliate Brands</p>
        <h2 className="admin-h2">Brand checklist</h2>
        <p className="admin-body">Attach the brands referenced in the draft so disclosures, logos, and shop links stay aligned.</p>
      </div>

      {affiliateBrandOptions.length === 0 ? (
        <p className="admin-micro">No affiliate brands available.</p>
      ) : (
        <div className="space-y-3">
          {affiliateBrandOptions.map((brand) => {
            const checked = selectedAffiliateBrandIds.includes(brand.id);
            const networkMeta = formatAffiliateNetworks(brand.networks) || null;

            return (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.02]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggleAffiliateBrand(brand.id, event.target.checked)}
                  className="h-4 w-4 rounded border-[var(--admin-color-border)]"
                />
                <AffiliatePartnerIdentity name={brand.name} logoUrl={brand.logoUrl} size="sm" meta={networkMeta} />
              </label>
            );
          })}
        </div>
      )}
    </AdminSurface>
  );
}
