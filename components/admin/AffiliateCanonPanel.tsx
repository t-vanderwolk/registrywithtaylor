import type { AffiliateNetwork } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { formatAffiliateNetworks, AFFILIATE_NETWORK_LABELS } from '@/lib/affiliateBrands';
import { MAX_MEDIA_FILE_SIZE_BYTES, isAllowedMediaMimeType } from '@/lib/media';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { isStorageConfigured, uploadToStorage } from '@/lib/server/storage';

const NETWORK_OPTIONS: AffiliateNetwork[] = ['CJ', 'IMPACT', 'AWIN', 'DIRECT'];

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asNullableText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text || null;
};

const asNullableFloat = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeNetwork = (value: FormDataEntryValue | null) => {
  const text = asText(value).toUpperCase();
  return NETWORK_OPTIONS.find((network) => network === text) ?? null;
};

async function resolveLogoUrl(formData: FormData) {
  const file = formData.get('logoFile');
  if (!(file instanceof File) || file.size <= 0) {
    return asNullableText(formData.get('logoUrl'));
  }

  if (!isStorageConfigured()) {
    throw new Error('Logo upload is not configured. Provide a logo URL instead.');
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

async function createBrand(formData: FormData) {
  'use server';

  await requireAdminSession();

  const name = asText(formData.get('name'));
  const website = asNullableText(formData.get('website'));
  if (!name) {
    redirect('/admin/affiliates');
  }

  const logoUrl = await resolveLogoUrl(formData);

  const brand = await prisma.brand.upsert({
    where: { name },
    update: {
      website,
      logoUrl,
    },
    create: {
      name,
      website,
      logoUrl,
    },
  });

  await prisma.affiliatePartner.updateMany({
    where: {
      name,
    },
    data: {
      brandId: brand.id,
    },
  });

  revalidatePath('/admin/affiliates');
  redirect('/admin/affiliates');
}

async function createAffiliateProgram(formData: FormData) {
  'use server';

  await requireAdminSession();

  const brandId = asText(formData.get('brandId'));
  const network = normalizeNetwork(formData.get('network'));
  const campaignId = asNullableText(formData.get('campaignId'));
  const commission = asNullableText(formData.get('commission'));
  const averageOrderValue = asNullableFloat(formData.get('averageOrderValue'));
  const commissionRate = asNullableFloat(formData.get('commissionRate'));
  const cookieLength = asNullableText(formData.get('cookieLength'));

  if (!brandId || !network) {
    redirect('/admin/affiliates');
  }

  const existing =
    (campaignId
      ? await prisma.affiliateProgram.findUnique({
          where: { campaignId },
          select: { id: true },
        })
      : null) ??
    (await prisma.affiliateProgram.findFirst({
      where: {
        brandId,
        network,
      },
      select: { id: true },
    }));

  const program = existing
    ? await prisma.affiliateProgram.update({
        where: { id: existing.id },
        data: {
          brandId,
          network,
          campaignId,
          commission,
          averageOrderValue,
          commissionRate,
          cookieLength,
        },
      })
    : await prisma.affiliateProgram.create({
        data: {
          brandId,
          network,
          campaignId,
          commission,
          averageOrderValue,
          commissionRate,
          cookieLength,
        },
      });

  await prisma.affiliatePartner.updateMany({
    where: {
      brandId,
      network,
    },
    data: {
      programId: program.id,
    },
  });

  revalidatePath('/admin/affiliates');
  redirect('/admin/affiliates');
}

async function createAffiliateProgramLink(formData: FormData) {
  'use server';

  await requireAdminSession();

  const programId = asText(formData.get('programId'));
  const partnerId = asNullableText(formData.get('partnerId'));
  const name = asText(formData.get('name'));
  const url = asText(formData.get('url'));

  if (!programId || !name || !url) {
    redirect('/admin/affiliates');
  }

  const existing = await prisma.affiliateLink.findFirst({
    where: {
      programId,
      name,
      code: null,
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.affiliateLink.update({
      where: { id: existing.id },
      data: {
        partnerId,
        name,
        url,
        destinationUrl: url,
      },
    });
  } else {
    await prisma.affiliateLink.create({
      data: {
        programId,
        partnerId,
        name,
        url,
        destinationUrl: url,
      },
    });
  }

  revalidatePath('/admin/affiliates');
  redirect('/admin/affiliates');
}

const formatDateTime = (value: Date | null | undefined) => {
  if (!value) {
    return '—';
  }

  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== 'number') {
    return null;
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
};

const formatCommissionRate = (value: number | null | undefined) => {
  if (typeof value !== 'number') {
    return null;
  }

  return `${(value * 100).toFixed(value < 0.1 ? 1 : 0)}%`;
};

export default async function AffiliateCanonPanel() {
  const uploadsEnabled = isStorageConfigured();

  const [brands, brandOptions, programOptions, partnerOptions] = await Promise.all([
    prisma.brand.findMany({
      orderBy: [{ name: 'asc' }],
      include: {
        programs: {
          orderBy: [{ network: 'asc' }, { createdAt: 'asc' }],
          include: {
            links: {
              where: {
                code: null,
              },
              orderBy: [{ createdAt: 'asc' }],
            },
          },
        },
        legacyPartners: {
          orderBy: [{ network: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            network: true,
            commissionRate: true,
            isActive: true,
            logoUrl: true,
            affiliateLink: true,
          },
        },
      },
    }),
    prisma.brand.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.affiliateProgram.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        network: true,
        brand: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.affiliatePartner.findMany({
      where: { isActive: true },
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        network: true,
      },
    }),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Affiliate Partners"
        title="Brand and network management"
        subtitle="Manage canonical brands, affiliate programs, and reusable destination links without losing legacy redirect tracking."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Create Brand</p>
            <h2 className="admin-h2">Brand profile</h2>
            <p className="admin-body">Use one brand record across Impact, AWIN, CJ, direct, blog disclosures, and routing.</p>
          </div>

          <form action={createBrand} className="admin-stack gap-3.5">
            <AdminField label="Brand name" htmlFor="affiliate-brand-name">
              <AdminInput id="affiliate-brand-name" name="name" required placeholder="Newton Baby" />
            </AdminField>

            <AdminField label="Website" htmlFor="affiliate-brand-website">
              <AdminInput id="affiliate-brand-website" name="website" type="url" placeholder="https://www.newtonbaby.com" />
            </AdminField>

            <AdminField label="Logo URL" htmlFor="affiliate-brand-logo-url">
              <AdminInput
                id="affiliate-brand-logo-url"
                name="logoUrl"
                type="url"
                placeholder="https://cdn.example.com/logo.png"
              />
            </AdminField>

            <AdminField label={uploadsEnabled ? 'Upload logo (optional)' : 'Upload logo'} htmlFor="affiliate-brand-logo-file">
              <input
                id="affiliate-brand-logo-file"
                name="logoFile"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-black/5 file:px-3 file:py-2"
                disabled={!uploadsEnabled}
              />
            </AdminField>

            {!uploadsEnabled ? (
              <p className="admin-micro">Storage upload is not configured in this environment. Provide a hosted logo URL instead.</p>
            ) : null}

            <div>
              <AdminButton type="submit" variant="primary">
                Save brand
              </AdminButton>
            </div>
          </form>
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Add Program</p>
            <h2 className="admin-h2">Network enrollment</h2>
            <p className="admin-body">Attach one or more affiliate networks to the same brand and store campaign metadata centrally.</p>
          </div>

          <form action={createAffiliateProgram} className="admin-stack gap-3.5">
            <AdminField label="Brand" htmlFor="affiliate-program-brand">
              <select id="affiliate-program-brand" name="brandId" className="admin-select" required>
                <option value="">Select brand</option>
                {brandOptions.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </AdminField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminField label="Network" htmlFor="affiliate-program-network">
                <select id="affiliate-program-network" name="network" className="admin-select" required>
                  <option value="">Select network</option>
                  {NETWORK_OPTIONS.map((network) => (
                    <option key={network} value={network}>
                      {AFFILIATE_NETWORK_LABELS[network]}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField label="Campaign ID" htmlFor="affiliate-program-campaign-id">
                <AdminInput id="affiliate-program-campaign-id" name="campaignId" placeholder="83865" />
              </AdminField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminField label="Commission" htmlFor="affiliate-program-commission">
                <AdminInput id="affiliate-program-commission" name="commission" placeholder="0-5%" />
              </AdminField>

              <AdminField label="Cookie length" htmlFor="affiliate-program-cookie-length">
                <AdminInput id="affiliate-program-cookie-length" name="cookieLength" placeholder="30 days" />
              </AdminField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminField label="Average order value" htmlFor="affiliate-program-aov">
                <AdminInput
                  id="affiliate-program-aov"
                  name="averageOrderValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1100"
                />
              </AdminField>

              <AdminField label="Commission rate (decimal)" htmlFor="affiliate-program-commission-rate">
                <AdminInput
                  id="affiliate-program-commission-rate"
                  name="commissionRate"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.07"
                />
              </AdminField>
            </div>

            <p className="admin-micro">Use decimal commission assumptions, for example `0.07` for 7%.</p>

            <div>
              <AdminButton type="submit" variant="primary">
                Save program
              </AdminButton>
            </div>
          </form>
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Add Link</p>
            <h2 className="admin-h2">Canonical affiliate URL</h2>
            <p className="admin-body">Store reusable destination links once, then route blog or campaign clicks through short links as needed.</p>
          </div>

          <form action={createAffiliateProgramLink} className="admin-stack gap-3.5">
            <AdminField label="Program" htmlFor="affiliate-link-program">
              <select id="affiliate-link-program" name="programId" className="admin-select" required>
                <option value="">Select program</option>
                {programOptions.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.brand.name} ({AFFILIATE_NETWORK_LABELS[program.network]})
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Legacy partner mapping (optional)" htmlFor="affiliate-link-partner">
              <select id="affiliate-link-partner" name="partnerId" className="admin-select">
                <option value="">None</option>
                {partnerOptions.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} ({AFFILIATE_NETWORK_LABELS[partner.network]})
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Link label" htmlFor="affiliate-link-name">
              <AdminInput id="affiliate-link-name" name="name" required placeholder="Shop" />
            </AdminField>

            <AdminField label="Affiliate URL" htmlFor="affiliate-link-url">
              <AdminInput
                id="affiliate-link-url"
                name="url"
                type="url"
                required
                placeholder="https://partner.example.com/product?aff_id=..."
              />
            </AdminField>

            <div>
              <AdminButton type="submit" variant="primary">
                Save link
              </AdminButton>
            </div>
          </form>
        </AdminSurface>
      </section>

      {brands.length === 0 ? (
        <AdminSurface>
          <AdminEmptyState title="No affiliate brands yet" hint="Create a brand, attach a program, and add a canonical link to start the new affiliate architecture." />
        </AdminSurface>
      ) : (
        <AdminSurface className="admin-stack">
          <div className="flex items-center justify-between gap-3">
            <div className="admin-stack gap-1">
              <p className="admin-eyebrow">Directory</p>
              <h2 className="admin-h2">Affiliate brand catalog</h2>
            </div>
            <span className="admin-chip">{brands.length} brands</span>
          </div>

          <AdminTable
            density="comfortable"
            columns={[
              { key: 'brand', label: 'Brand' },
              { key: 'programs', label: 'Programs' },
              { key: 'links', label: 'Links' },
              { key: 'legacy', label: 'Legacy partner map' },
              { key: 'updated', label: 'Updated', align: 'right' },
            ]}
          >
            {brands.map((brand) => {
              const programNetworks = brand.programs.map((program) => program.network);

              return (
                <tr key={brand.id} className="admin-row">
                  <td>
                    <div className="admin-stack gap-2">
                      <AffiliatePartnerIdentity
                        name={brand.name}
                        logoUrl={brand.logoUrl}
                        meta={brand.website ? brand.website.replace(/^https?:\/\//, '') : null}
                      />
                      {programNetworks.length > 0 ? (
                        <p className="admin-micro">{formatAffiliateNetworks(programNetworks)}</p>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className="admin-stack gap-2">
                      {brand.programs.length === 0 ? (
                        <span className="admin-micro">No programs</span>
                      ) : (
                        brand.programs.map((program) => (
                          <div key={program.id} className="admin-stack gap-1">
                            <p className="text-admin">
                              {AFFILIATE_NETWORK_LABELS[program.network]}
                              {program.campaignId ? ` • ${program.campaignId}` : ''}
                            </p>
                            <p className="admin-micro">
                              {program.commission ?? 'Commission pending'}
                              {program.cookieLength ? ` • ${program.cookieLength}` : ''}
                            </p>
                            {program.averageOrderValue || program.commissionRate ? (
                              <p className="admin-micro">
                                {formatCurrency(program.averageOrderValue) ?? 'AOV pending'}
                                {program.commissionRate ? ` • ${formatCommissionRate(program.commissionRate)}` : ''}
                              </p>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-stack gap-2">
                      {brand.programs.flatMap((program) => program.links).length === 0 ? (
                        <span className="admin-micro">No canonical links</span>
                      ) : (
                        brand.programs.flatMap((program) =>
                          program.links.map((link) => (
                            <div key={link.id} className="admin-stack gap-1">
                              <p className="text-admin">{link.name ?? 'Shop'}</p>
                              <p className="admin-micro break-all">{link.url ?? link.destinationUrl ?? '—'}</p>
                            </div>
                          )),
                        )
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-stack gap-2">
                      {brand.legacyPartners.length === 0 ? (
                        <span className="admin-micro">No legacy partner mappings</span>
                      ) : (
                        brand.legacyPartners.map((partner) => (
                          <div key={partner.id} className="admin-stack gap-1">
                            <AffiliatePartnerIdentity
                              name={partner.name}
                              network={partner.network}
                              logoUrl={partner.logoUrl}
                              size="sm"
                              showNetwork
                              meta={partner.isActive ? partner.commissionRate : 'Inactive'}
                            />
                            {partner.affiliateLink ? (
                              <p className="admin-micro break-all">{partner.affiliateLink}</p>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="text-right admin-micro">{formatDateTime(brand.updatedAt)}</td>
                </tr>
              );
            })}
          </AdminTable>
        </AdminSurface>
      )}
    </AdminStack>
  );
}
