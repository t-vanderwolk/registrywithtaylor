import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { AFFILIATE_CONTEXT_OPTIONS, normalizeAffiliateContexts } from '@/lib/affiliatePartners';
import { AFFILIATE_NETWORK_LABELS } from '@/lib/affiliateBrands';
import { MAX_MEDIA_FILE_SIZE_BYTES, isAllowedMediaMimeType } from '@/lib/media';
import { listAdminAffiliatePartners } from '@/lib/server/affiliatePartners';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { isStorageConfigured, uploadToStorage } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asNullableText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text || null;
};

const asPriority = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  if (!text) {
    return 99;
  }

  const parsed = Number.parseInt(text, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 99;
};

const parseAllowedContexts = (value: FormDataEntryValue | null) =>
  normalizeAffiliateContexts(
    asText(value)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

async function resolveLogoUrl(formData: FormData) {
  const file = formData.get('logoFile');
  if (!(file instanceof File) || file.size <= 0) {
    return asNullableText(formData.get('logoUrl'));
  }

  if (!isStorageConfigured()) {
    throw new Error('Logo upload is not configured. Provide a hosted logo URL instead.');
  }

  if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
    throw new Error('Logo file is too large. Upload files up to 10 MB.');
  }

  if (!isAllowedMediaMimeType(file.type)) {
    throw new Error('Unsupported logo file type. Upload JPG, PNG, WEBP, or PDF files only.');
  }

  const uploaded = await uploadToStorage({
    fileName: file.name,
    fileType: file.type,
    fileBuffer: Buffer.from(await file.arrayBuffer()),
  });

  return uploaded.url;
}

async function updatePartner(formData: FormData) {
  'use server';

  await requireAdminSession();

  const id = asText(formData.get('id'));
  if (!id) {
    redirect('/admin/partners');
  }

  const existing = await prisma.affiliatePartner.findUnique({
    where: { id },
    select: {
      id: true,
      logoUrl: true,
    },
  });

  if (!existing) {
    redirect('/admin/partners');
  }

  const logoUrl = (await resolveLogoUrl(formData)) ?? existing.logoUrl ?? null;

  await prisma.affiliatePartner.update({
    where: { id },
    data: {
      affiliatePid: asNullableText(formData.get('affiliatePid')),
      baseUrl: asText(formData.get('baseUrl')),
      commissionRate: asText(formData.get('commissionRate')) || 'Pending',
      partnerType: asText(formData.get('partnerType')) || 'retailer',
      routingPriority: asPriority(formData.get('routingPriority')),
      allowedContexts: parseAllowedContexts(formData.get('allowedContexts')),
      logoUrl,
      isActive: formData.get('isActive') === 'on',
    },
  });

  revalidatePath('/admin/partners');
  revalidatePath('/admin/affiliates');
  redirect('/admin/partners');
}

export default async function AdminPartnersPage() {
  await requireAdminSession();

  const uploadsEnabled = isStorageConfigured();
  const partners = await listAdminAffiliatePartners();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Monetize"
        title="Affiliate partners"
        subtitle="Admin-only control for direct monetization metadata used by the blog editor, CTA renderer, and affiliate canon."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((partner) => (
          <AdminSurface key={partner.id} className="admin-stack gap-4">
            <div className="flex items-start justify-between gap-4">
              <AffiliatePartnerIdentity
                name={partner.name}
                network={partner.network}
                logoUrl={partner.logoUrl}
                showNetwork
                meta={`${partner.partnerType} • ${partner.isActive ? 'Active' : 'Inactive'}`}
              />
              <span className="admin-chip">Priority {partner.routingPriority}</span>
            </div>

            <form action={updatePartner} className="admin-stack gap-3.5">
              <input type="hidden" name="id" value={partner.id} />

              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="Affiliate PID" htmlFor={`partner-pid-${partner.id}`}>
                  <AdminInput
                    id={`partner-pid-${partner.id}`}
                    name="affiliatePid"
                    defaultValue={partner.affiliatePid ?? ''}
                    placeholder="4762"
                  />
                </AdminField>

                <AdminField label="Partner type" htmlFor={`partner-type-${partner.id}`}>
                  <AdminInput
                    id={`partner-type-${partner.id}`}
                    name="partnerType"
                    defaultValue={partner.partnerType}
                    placeholder="brand"
                  />
                </AdminField>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="Base URL" htmlFor={`partner-base-url-${partner.id}`}>
                  <AdminInput
                    id={`partner-base-url-${partner.id}`}
                    name="baseUrl"
                    type="url"
                    defaultValue={partner.baseUrl ?? ''}
                    placeholder="https://www.partner.com"
                  />
                </AdminField>

                <AdminField label="Commission rate" htmlFor={`partner-commission-${partner.id}`}>
                  <AdminInput
                    id={`partner-commission-${partner.id}`}
                    name="commissionRate"
                    defaultValue={partner.commissionRate}
                    placeholder="15%"
                  />
                </AdminField>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="Routing priority" htmlFor={`partner-routing-${partner.id}`}>
                  <AdminInput
                    id={`partner-routing-${partner.id}`}
                    name="routingPriority"
                    type="number"
                    min="0"
                    defaultValue={String(partner.routingPriority)}
                  />
                </AdminField>

                <AdminField label="Allowed contexts" htmlFor={`partner-contexts-${partner.id}`}>
                  <AdminInput
                    id={`partner-contexts-${partner.id}`}
                    name="allowedContexts"
                    defaultValue={partner.allowedContexts.join(', ')}
                    placeholder={AFFILIATE_CONTEXT_OPTIONS.join(', ')}
                  />
                </AdminField>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="Logo URL" htmlFor={`partner-logo-url-${partner.id}`}>
                  <AdminInput
                    id={`partner-logo-url-${partner.id}`}
                    name="logoUrl"
                    defaultValue={partner.logoUrl ?? ''}
                    placeholder="/images/partners/partner.png"
                  />
                </AdminField>

                <AdminField label={uploadsEnabled ? 'Upload logo (optional)' : 'Upload logo'} htmlFor={`partner-logo-file-${partner.id}`}>
                  <input
                    id={`partner-logo-file-${partner.id}`}
                    name="logoFile"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-black/5 file:px-3 file:py-2"
                    disabled={!uploadsEnabled}
                  />
                </AdminField>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[var(--admin-color-border)] bg-white p-3">
                <div className="admin-stack gap-1">
                  <p className="admin-micro">
                    {AFFILIATE_NETWORK_LABELS[partner.network]} • Suggested CTA: {partner.suggestedCta}
                  </p>
                  <p className="admin-micro">Contexts: {partner.allowedContexts.join(', ') || 'all'}</p>
                </div>

                <label className="flex items-center gap-2 text-sm text-admin">
                  <input type="checkbox" name="isActive" defaultChecked={partner.isActive} />
                  Active
                </label>
              </div>

              <div>
                <AdminButton type="submit" variant="primary">
                  Save partner
                </AdminButton>
              </div>
            </form>
          </AdminSurface>
        ))}
      </div>
    </AdminStack>
  );
}
