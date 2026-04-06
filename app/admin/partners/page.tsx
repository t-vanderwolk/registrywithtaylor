import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminToolbar from '@/components/admin/patterns/AdminToolbar';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import {
  AFFILIATE_CONTEXT_OPTIONS,
  AFFILIATE_TIER_OPTIONS,
  normalizeAffiliateContexts,
  normalizeAffiliateTier,
  normalizeRetailerFallbacks,
} from '@/lib/affiliatePartners';
import { AFFILIATE_NETWORK_LABELS, AFFILIATE_NETWORK_ORDER } from '@/lib/affiliateBrands';
import { MAX_MEDIA_FILE_SIZE_BYTES, isAllowedMediaMimeType } from '@/lib/media';
import { listAdminAffiliatePartners } from '@/lib/server/affiliatePartners';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { isStorageConfigured, uploadToStorage } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');
const asSearchText = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : Array.isArray(value) ? value[0]?.trim() ?? '' : '';

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

const parseRetailerFallbacks = (value: FormDataEntryValue | null) =>
  normalizeRetailerFallbacks(
    asText(value)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

const normalizeChoice = <T extends string>(value: string, options: readonly T[], fallback: T | 'all' = 'all') =>
  options.includes(value as T) ? (value as T) : fallback;

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
      affiliateTier: normalizeAffiliateTier(formData.get('affiliateTier')),
      paymentRisk: formData.get('paymentRisk') === 'on',
      retailerFallback: parseRetailerFallbacks(formData.get('retailerFallback')),
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

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  await requireAdminSession();

  const uploadsEnabled = isStorageConfigured();
  const partners = await listAdminAffiliatePartners();
  const params = searchParams ? await searchParams : undefined;

  const query = asSearchText(params?.q).toLowerCase();
  const tierFilter = normalizeChoice(asSearchText(params?.tier).toUpperCase(), AFFILIATE_TIER_OPTIONS);
  const networkFilter = normalizeChoice(asSearchText(params?.network).toUpperCase(), AFFILIATE_NETWORK_ORDER);
  const typeFilter = normalizeChoice(asSearchText(params?.type).toLowerCase(), ['brand', 'retailer', 'service'] as const);
  const riskFilter = normalizeChoice(asSearchText(params?.risk).toLowerCase(), ['risk', 'stable'] as const);
  const activeFilter = normalizeChoice(asSearchText(params?.active).toLowerCase(), ['active', 'inactive'] as const);
  const fallbackFilter = normalizeChoice(asSearchText(params?.fallback).toLowerCase(), ['has', 'none'] as const);

  const filteredPartners = partners.filter((partner) => {
    const haystack = [
      partner.name,
      partner.slug,
      partner.network,
      partner.partnerType,
      partner.affiliateTier,
      partner.retailerFallback.join(' '),
    ].join(' ').toLowerCase();

    if (query && !haystack.includes(query)) {
      return false;
    }

    if (tierFilter !== 'all' && partner.affiliateTier !== tierFilter) {
      return false;
    }

    if (networkFilter !== 'all' && partner.network !== networkFilter) {
      return false;
    }

    if (typeFilter !== 'all' && partner.partnerType !== typeFilter) {
      return false;
    }

    if (riskFilter === 'risk' && !partner.paymentRisk) {
      return false;
    }

    if (riskFilter === 'stable' && partner.paymentRisk) {
      return false;
    }

    if (activeFilter === 'active' && !partner.isActive) {
      return false;
    }

    if (activeFilter === 'inactive' && partner.isActive) {
      return false;
    }

    if (fallbackFilter === 'has' && partner.retailerFallback.length === 0) {
      return false;
    }

    if (fallbackFilter === 'none' && partner.retailerFallback.length > 0) {
      return false;
    }

    return true;
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Monetize"
        title="Affiliate partners"
        subtitle="Admin-only control for direct monetization metadata used by the blog editor, CTA renderer, and affiliate canon."
      />

      <AdminSurface className="admin-stack gap-4">
        <AdminToolbar
          left={
            <>
              <span className="admin-chip">{filteredPartners.length} shown</span>
              <span className="admin-chip">{partners.length} total</span>
            </>
          }
          right={
            <AdminButton asChild variant="ghost" size="sm">
              <Link href="/admin/partners">Clear filters</Link>
            </AdminButton>
          }
        />

        <form method="get" className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <AdminField label="Search" htmlFor="partners-search">
            <AdminInput id="partners-search" name="q" defaultValue={asSearchText(params?.q)} placeholder="Name, slug, fallback" />
          </AdminField>

          <AdminField label="Tier" htmlFor="partners-tier">
            <AdminSelect id="partners-tier" name="tier" defaultValue={tierFilter}>
              <option value="all">All tiers</option>
              {AFFILIATE_TIER_OPTIONS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="Network" htmlFor="partners-network">
            <AdminSelect id="partners-network" name="network" defaultValue={networkFilter}>
              <option value="all">All networks</option>
              {AFFILIATE_NETWORK_ORDER.map((network) => (
                <option key={network} value={network}>
                  {AFFILIATE_NETWORK_LABELS[network]}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="Partner type" htmlFor="partners-type">
            <AdminSelect id="partners-type" name="type" defaultValue={typeFilter}>
              <option value="all">All types</option>
              <option value="brand">Brand</option>
              <option value="retailer">Retailer</option>
              <option value="service">Service</option>
            </AdminSelect>
          </AdminField>

          <AdminField label="Risk" htmlFor="partners-risk">
            <AdminSelect id="partners-risk" name="risk" defaultValue={riskFilter}>
              <option value="all">All risk states</option>
              <option value="risk">Risk-monitored</option>
              <option value="stable">Stable only</option>
            </AdminSelect>
          </AdminField>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
            <AdminField label="Active state" htmlFor="partners-active">
              <AdminSelect id="partners-active" name="active" defaultValue={activeFilter}>
                <option value="all">All states</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </AdminSelect>
            </AdminField>

            <AdminField label="Fallbacks" htmlFor="partners-fallback">
              <AdminSelect id="partners-fallback" name="fallback" defaultValue={fallbackFilter}>
                <option value="all">All fallback states</option>
                <option value="has">Has fallbacks</option>
                <option value="none">No fallbacks</option>
              </AdminSelect>
            </AdminField>
          </div>

          <div className="md:col-span-2 xl:col-span-6 flex items-center gap-2">
            <AdminButton type="submit" variant="secondary" size="sm">
              Apply filters
            </AdminButton>
          </div>
        </form>
      </AdminSurface>

      {filteredPartners.length === 0 ? (
        <AdminSurface>
          <AdminEmptyState
            title="No affiliate partners match those filters"
            hint="Loosen the filters or reset back to the full canon."
          />
        </AdminSurface>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPartners.map((partner) => (
          <AdminSurface key={partner.id} className="admin-stack gap-4">
            <div className="flex items-start justify-between gap-4">
              <AffiliatePartnerIdentity
                name={partner.name}
                network={partner.network}
                logoUrl={partner.logoUrl}
                showNetwork
                meta={`${partner.partnerType} • ${partner.isActive ? 'Active' : 'Inactive'}`}
              />
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="admin-chip">{partner.affiliateTier}</span>
                {partner.paymentRisk ? <span className="admin-chip admin-chip--draft">Risk</span> : null}
                <span className="admin-chip">Priority {partner.routingPriority}</span>
              </div>
            </div>

            <form action={updatePartner} className="admin-stack gap-3.5">
              <input type="hidden" name="id" value={partner.id} />

              <div className="grid gap-3 md:grid-cols-3">
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

              <div className="grid gap-3 md:grid-cols-3">
                <AdminField label="Affiliate tier" htmlFor={`partner-tier-${partner.id}`}>
                  <AdminSelect
                    id={`partner-tier-${partner.id}`}
                    name="affiliateTier"
                    defaultValue={partner.affiliateTier}
                  >
                    {AFFILIATE_TIER_OPTIONS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>

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
                <AdminField label="Retailer fallbacks" htmlFor={`partner-fallback-${partner.id}`}>
                  <AdminInput
                    id={`partner-fallback-${partner.id}`}
                    name="retailerFallback"
                    defaultValue={partner.retailerFallback.join(', ')}
                    placeholder="MacroBaby, ANB Baby, Albee Baby"
                  />
                </AdminField>

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
                  <p className="admin-micro">
                    Retailer fallbacks: {partner.retailerFallback.join(', ') || 'none'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-admin">
                    <input type="checkbox" name="paymentRisk" defaultChecked={partner.paymentRisk} />
                    Risk-monitored
                  </label>

                  <label className="flex items-center gap-2 text-sm text-admin">
                    <input type="checkbox" name="isActive" defaultChecked={partner.isActive} />
                    Active
                  </label>
                </div>
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
      )}
    </AdminStack>
  );
}
