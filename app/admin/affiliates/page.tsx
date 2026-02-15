import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { slugify } from '@/lib/slugify';

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
  if (!name) {
    throw new Error('Name required');
  }

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

  if (!partnerId) {
    throw new Error('Partner required');
  }

  if (!type) {
    throw new Error('Asset type required');
  }

  await requireAdminSession();

  const partner = await prisma.affiliatePartner.findUnique({
    where: { id: partnerId },
    select: { assets: true },
  });

  if (!partner) {
    throw new Error('Partner not found');
  }

  const assetUrl = asText(formData.get('assetUrl'));
  const embedCode = asText(formData.get('embedCode'));
  const nextAsset: PartnerAsset = {
    type,
    createdAt: new Date().toISOString(),
    ...(assetUrl ? { assetUrl } : {}),
    ...(embedCode ? { embedCode } : {}),
  };

  const currentAssets = Array.isArray(partner.assets)
    ? (partner.assets as Prisma.JsonArray)
    : [];
  await prisma.affiliatePartner.update({
    where: { id: partnerId },
    data: {
      assets: [...currentAssets, nextAsset] as Prisma.JsonArray,
    },
  });

  redirect('/admin/affiliates');
}

const parseAssets = (value: Prisma.JsonValue | null): PartnerAsset[] => {
  if (!Array.isArray(value)) {
    return [];
  }

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
        assetUrl:
          'assetUrl' in item && typeof item.assetUrl === 'string'
            ? item.assetUrl
            : undefined,
        embedCode:
          'embedCode' in item && typeof item.embedCode === 'string'
            ? item.embedCode
            : undefined,
      });
    }
  }

  return parsed;
};

export default async function AdminAffiliatesPage() {
  await requireAdminSession();

  const partners = await prisma.affiliatePartner.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <Hero
        eyebrow="Affiliate Partners"
        title="Manage partner asset library"
        subtitle="Centralize partner creatives, commission details, and embed resources."
        image="/assets/hero/hero-02.jpg"
      />

      <form action={createPartner} className="card space-y-3">
        <h2>New partner</h2>
        <div className="form-field">
          <label className="form-field__label" htmlFor="name">
            Partner name
          </label>
          <input id="name" name="name" className="form-field__input" required />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="description">
            Description
          </label>
          <textarea id="description" name="description" className="form-field__textarea" rows={2} />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="commission">
            Commission
          </label>
          <input id="commission" name="commission" className="form-field__input" />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="websiteUrl">
            Website URL
          </label>
          <input id="websiteUrl" name="websiteUrl" className="form-field__input" />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="logoUrl">
            Logo URL
          </label>
          <input id="logoUrl" name="logoUrl" className="form-field__input" />
        </div>
        <button type="submit" className="btn btn--primary">
          Save partner
        </button>
      </form>

      <section className="space-y-4">
        {partners.map((partner) => {
          const assets = parseAssets(partner.assets);
          return (
            <article key={partner.id} className="card space-y-3">
              <div className="admin-row-between">
                <h2>{partner.name}</h2>
                <span>{partner.commission ?? 'Commission TBD'}</span>
              </div>
              <p className="body-copy">{partner.description ?? 'No description yet'}</p>
              <p className="micro-text">Slug: {partner.slug}</p>
              <p className="micro-text">Website: {partner.websiteUrl ?? 'Not provided'}</p>

              <form action={createAsset} className="space-y-2">
                <input type="hidden" name="partnerId" value={partner.id} />
                <div className="form-field">
                  <label className="form-field__label" htmlFor={`asset-type-${partner.id}`}>
                    Asset type
                  </label>
                  <select id={`asset-type-${partner.id}`} name="type" className="form-field__select" required>
                    <option value="">Select type</option>
                    <option value="banner">Banner</option>
                    <option value="text_link">Text link</option>
                    <option value="product_feed">Product feed</option>
                    <option value="script">Script</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-field__label" htmlFor={`asset-url-${partner.id}`}>
                    Asset URL
                  </label>
                  <input id={`asset-url-${partner.id}`} name="assetUrl" className="form-field__input" />
                </div>
                <div className="form-field">
                  <label className="form-field__label" htmlFor={`embed-code-${partner.id}`}>
                    Embed code
                  </label>
                  <textarea
                    id={`embed-code-${partner.id}`}
                    name="embedCode"
                    className="form-field__textarea"
                    rows={2}
                  />
                </div>
                <button type="submit" className="btn btn--secondary">
                  Save asset
                </button>
              </form>

              <div className="space-y-1">
                {assets.length === 0 && <div className="micro-text">No assets yet</div>}
                {assets.map((asset) => (
                  <div key={`${partner.id}-${asset.createdAt}-${asset.type}`} className="micro-text">
                    <strong>{asset.type}</strong> • {asset.assetUrl ?? 'No URL'} •{' '}
                    {asset.embedCode ? 'Embed provided' : 'No embed'}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
