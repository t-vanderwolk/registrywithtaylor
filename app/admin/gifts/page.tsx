import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminButton from '@/components/admin/ui/AdminButton';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { markGiftRedeemed, resendGiftCertificate } from './actions';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type Gift = {
  id: string;
  code: string;
  status: string;
  amountCents: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  recipientEmail: string | null;
  deliveryMode: string;
  createdAt: Date;
  issuedAt: Date | null;
  redeemedAt: Date | null;
};

const fmt = (d?: Date | null) =>
  d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const STATUS_STYLES: Record<string, string> = {
  ISSUED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REDEEMED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  REFUNDED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default async function AdminGiftsPage() {
  await requireAdminSession('/admin/gifts');

  let gifts: Gift[] = [];
  try {
    gifts = await db.giftCertificate.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
  } catch {
    gifts = [];
  }

  const issued = gifts.filter((g) => g.status === 'ISSUED').length;
  const redeemed = gifts.filter((g) => g.status === 'REDEEMED').length;
  const revenue = gifts.filter((g) => g.status !== 'PENDING_PAYMENT' && g.status !== 'REFUNDED')
    .reduce((sum, g) => sum + g.amountCents, 0);

  return (
    <AdminStack className="gap-6">
      <AdminHeader
        title="Gift Certificates"
        subtitle="Prepaid Registry Consults purchased as gifts. Issued = paid & awaiting redemption."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-[var(--admin-color-border)] bg-white p-4">
          <p className="admin-micro">Awaiting redemption</p>
          <p className="mt-1 text-2xl font-semibold text-admin">{issued}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--admin-color-border)] bg-white p-4">
          <p className="admin-micro">Redeemed</p>
          <p className="mt-1 text-2xl font-semibold text-admin">{redeemed}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--admin-color-border)] bg-white p-4">
          <p className="admin-micro">Gift revenue</p>
          <p className="mt-1 text-2xl font-semibold text-admin">${(revenue / 100).toFixed(0)}</p>
        </div>
      </div>

      <AdminSurface>
        {gifts.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-500">No gift purchases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--admin-color-border)] text-[0.7rem] uppercase tracking-[0.12em] text-neutral-400">
                  <th className="px-3 py-2.5">Code</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Recipient</th>
                  <th className="px-3 py-2.5">Purchaser</th>
                  <th className="px-3 py-2.5">Delivery</th>
                  <th className="px-3 py-2.5">Purchased</th>
                  <th className="px-3 py-2.5">Redeemed</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((g) => (
                  <tr key={g.id} className="border-b border-[var(--admin-color-border)]/60 align-top">
                    <td className="px-3 py-3 font-mono text-[0.82rem] font-semibold text-neutral-800">{g.code}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold ${STATUS_STYLES[g.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                        {g.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-neutral-800">{g.recipientName}</div>
                      {g.recipientEmail ? <div className="text-[0.78rem] text-neutral-400">{g.recipientEmail}</div> : null}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-neutral-700">{g.purchaserName}</div>
                      <div className="text-[0.78rem] text-neutral-400">{g.purchaserEmail}</div>
                    </td>
                    <td className="px-3 py-3 text-neutral-600">{g.deliveryMode === 'now' ? 'Sent to recipient' : 'Self-delivered'}</td>
                    <td className="px-3 py-3 text-neutral-600">{fmt(g.issuedAt ?? g.createdAt)}</td>
                    <td className="px-3 py-3 text-neutral-600">{fmt(g.redeemedAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        {g.status !== 'PENDING_PAYMENT' ? (
                          <form action={resendGiftCertificate}>
                            <input type="hidden" name="id" value={g.id} />
                            <AdminButton type="submit" variant="secondary" size="sm">Resend</AdminButton>
                          </form>
                        ) : null}
                        {g.status === 'ISSUED' ? (
                          <form action={markGiftRedeemed}>
                            <input type="hidden" name="id" value={g.id} />
                            <AdminButton type="submit" variant="secondary" size="sm">Mark redeemed</AdminButton>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSurface>
    </AdminStack>
  );
}
