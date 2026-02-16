import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { slugify } from '@/lib/slugify';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

type PartnerAsset = {
  type: string;
  assetUrl?: string;
  embedCode?: string;
  createdAt: string;
};

async function createPartner(formData: FormData) {
  'use server';

  const name = asText(formData.get('name'));
  if (!name) throw new Error('Name required');

  await requireAdminSession();

  const description = asText(formData.get('description'));
  const logoUrl = asText(formData.get('logoUrl'));
  const websiteUrl = asText(formData.get('websiteUrl'));
  const commission = asText(formData.get('commission'));

  await prisma.affiliatePartner.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      logoUrl: logoUrl || null,
      websiteUrl: websiteUrl || null,
      commission: commission || null,
      assets: [],
    },
  });

  redirect('/admin/affiliates');
}

async function createAsset(formData: FormData) {
  'use server';

  const partnerId = asText(formData.get('partnerId'));
  const type = asText(formData.get('type'));

  if (!partnerId) throw new Error('Partner required');
  if (!type) throw new Error('Asset type required');

  await requireAdminSession();

  const partner = await prisma.affiliatePartner.findUnique({
    where: { id: partnerId },
    select: { assets: true },
  });

  if (!partner) throw new Error('Partner not found');

  const assetUrl = asText(formData.get('assetUrl'));
  const embedCode = asText(formData.get('embedCode'));

  const nextAsset: PartnerAsset = {
    type,
    createdAt: new Date().toISOString(),
    ...(assetUrl ? { assetUrl } : {}),
    ...(embedCode ? { embedCode } : {}),
  };

  const currentAssets = Array.isArray(partner.assets) ? (partner.assets as Prisma.JsonArray) : [];

  await prisma.affiliatePartner.update({
    where: { id: partnerId },
    data: { assets: [...currentAssets, nextAsset] as Prisma.JsonArray },
  });

  redirect('/admin/affiliates');
}

const parseAssets = (value: Prisma.JsonValue | null): PartnerAsset[] => {
  if (!Array.isArray(value)) return [];

  const parsed: PartnerAsset[] = [];
  for (const item of value) {
    if (
      item &&
      typeof item === 'object' &&
      'type' in item &&
      typeof item.type === 'string' &&
      'createdAt' in item &&
      typeof item.createdAt === 'string'
    ) {
      parsed.push({
        type: item.type,
        createdAt: item.createdAt,
        assetUrl: 'assetUrl' in item && typeof item.assetUrl === 'string' ? item.assetUrl : undefined,
        embedCode: 'embedCode' in item && typeof item.embedCode === 'string' ? item.embedCode : undefined,
      });
    }
  }

  return parsed;
};

export default async function AdminAffiliatesPage() {
  await requireAdminSession();

  const partners = await prisma.affiliatePartner.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Affiliate Partners"
        title="Manage partner asset library"
        subtitle="Centralize partner creatives, commission details, and embed resources."
      />

      <AdminSurface className="admin-stack" >
        <h2 className="admin-h2">New partner</h2>
        <form action={createPartner} className="admin-stack gap-3.5">
          <AdminField label="Partner name" htmlFor="partner-name">
            <AdminInput id="partner-name" name="name" required aria-required="true" />
          </AdminField>
          <AdminField label="Description" htmlFor="partner-description">
            <AdminTextarea id="partner-description" name="description" className="min-h-[100px]" />
          </AdminField>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminField label="Commission" htmlFor="partner-commission">
              <AdminInput id="partner-commission" name="commission" />
            </AdminField>
            <AdminField label="Website URL" htmlFor="partner-website-url">
              <AdminInput id="partner-website-url" name="websiteUrl" />
            </AdminField>
          </div>
          <AdminField label="Logo URL" htmlFor="partner-logo-url">
            <AdminInput id="partner-logo-url" name="logoUrl" />
          </AdminField>
          <div>
            <AdminButton type="submit" variant="primary">
              Save partner
            </AdminButton>
          </div>
        </form>
      </AdminSurface>

      <AdminStack gap="lg">
        {partners.length === 0 ? (
          <AdminSurface>
            <AdminEmptyState title="No partners yet" hint="Add your first partner to begin collecting assets." />
          </AdminSurface>
        ) : (
          partners.map((partner) => {
            const assets = parseAssets(partner.assets);
            return (
              <AdminSurface key={partner.id} className="admin-stack" >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="admin-h2">{partner.name}</h2>
                  <span className="admin-chip">{partner.commission ?? 'Commission TBD'}</span>
                </div>
                <p className="admin-body">{partner.description ?? 'No description yet.'}</p>
                <div className="admin-stack gap-1">
                  <p className="admin-micro">Slug: {partner.slug}</p>
                  <p className="admin-micro">Website: {partner.websiteUrl ?? 'Not provided'}</p>
                </div>

                <AdminSurface variant="muted" className="admin-stack" >
                  <h3 className="admin-h2 text-[1.2rem]">Add asset</h3>
                  <form action={createAsset} className="admin-stack gap-3">
                    <input type="hidden" name="partnerId" value={partner.id} />
                    <div className="grid gap-3 md:grid-cols-3">
                      <AdminField label="Asset type" htmlFor={`asset-type-${partner.id}`}>
                        <select id={`asset-type-${partner.id}`} name="type" className="admin-select" required>
                          <option value="">Select type</option>
                          <option value="banner">Banner</option>
                          <option value="text_link">Text link</option>
                          <option value="product_feed">Product feed</option>
                          <option value="script">Script</option>
                        </select>
                      </AdminField>
                      <AdminField label="Asset URL" htmlFor={`asset-url-${partner.id}`}>
                        <AdminInput id={`asset-url-${partner.id}`} name="assetUrl" />
                      </AdminField>
                      <AdminField label="Embed code" htmlFor={`embed-code-${partner.id}`}>
                        <AdminTextarea id={`embed-code-${partner.id}`} name="embedCode" className="min-h-[48px]" />
                      </AdminField>
                    </div>
                    <div>
                      <AdminButton type="submit" variant="secondary" size="sm">
                        Save asset
                      </AdminButton>
                    </div>
                  </form>
                </AdminSurface>

                <div className="admin-stack gap-1.5">
                  <h3 className="admin-eyebrow">Assets</h3>
                  {assets.length === 0 ? (
                    <p className="admin-micro">No assets yet.</p>
                  ) : (
                    assets.map((asset) => (
                      <p key={`${partner.id}-${asset.createdAt}-${asset.type}`} className="admin-micro">
                        <span className="font-semibold text-[var(--admin-color-text)]">{asset.type}</span> • {asset.assetUrl ?? 'No URL'} •{' '}
                        {asset.embedCode ? 'Embed provided' : 'No embed'}
                      </p>
                    ))
                  )}
                </div>
              </AdminSurface>
            );
          })
        )}
      </AdminStack>
    </AdminStack>
  );
}
