import type { AffiliateNetwork } from '@prisma/client';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { getAffiliateCanonGroupedByNetwork } from '@/lib/server/affiliateCanon';

const NETWORK_LABEL: Record<AffiliateNetwork, string> = {
  CJ: 'CJ',
  IMPACT: 'Impact',
  AWIN: 'AWIN',
  DIRECT: 'Direct',
};

const formatEpc = (threeMonthEpc: number | null, sevenDayEpc: number | null) => {
  if (threeMonthEpc === null && sevenDayEpc === null) {
    return '—';
  }

  const threeMonth = threeMonthEpc !== null ? threeMonthEpc.toFixed(2) : '—';
  const sevenDay = sevenDayEpc !== null ? sevenDayEpc.toFixed(2) : '—';
  return `${threeMonth} / ${sevenDay}`;
};

export default async function AffiliateCanonPanel() {
  const groupedPartners = await getAffiliateCanonGroupedByNetwork();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Affiliate Canon"
        title="Affiliate partner registry"
        subtitle="Canonical partner data grouped by network for routing, analytics, and monetization operations."
      />

      {groupedPartners.length === 0 ? (
        <AdminSurface>
          <AdminEmptyState title="No affiliate partners found" hint="Run the affiliate canon seed script to load canonical partner data." />
        </AdminSurface>
      ) : (
        groupedPartners.map((group) => (
          <AdminSurface key={group.network} className="admin-stack">
            <div className="flex items-center justify-between gap-3">
              <h2 className="admin-h2">{NETWORK_LABEL[group.network]}</h2>
              <span className="admin-chip">{group.partners.length} partners</span>
            </div>

            <AdminTable
              density="comfortable"
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'network', label: 'Network' },
                { key: 'commission', label: 'Commission' },
                { key: 'epc', label: 'EPC (3M / 7D)' },
                { key: 'category', label: 'Category' },
                { key: 'status', label: 'Status', align: 'right' },
              ]}
            >
              {group.partners.map((partner) => (
                <tr key={partner.id} className="admin-row">
                  <td className="font-medium text-admin">{partner.name}</td>
                  <td>{NETWORK_LABEL[partner.network]}</td>
                  <td>{partner.commissionRate}</td>
                  <td>{formatEpc(partner.threeMonthEpc, partner.sevenDayEpc)}</td>
                  <td>{partner.category ?? '—'}</td>
                  <td className="text-right">
                    <span className={`admin-chip ${partner.isActive ? 'admin-chip--published' : 'admin-chip--draft'}`}>
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminSurface>
        ))
      )}
    </AdminStack>
  );
}
