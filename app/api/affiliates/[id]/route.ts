import { AffiliateNetwork, CommissionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {
  getDefaultRetailerFallbacks,
  inferAffiliatePaymentRisk,
  inferAffiliateTier,
  normalizeAffiliateContexts,
  normalizeAffiliateTier,
  normalizeRetailerFallbacks,
} from '@/lib/affiliatePartners';
import { forbiddenResponse, requireAdmin, requireAdminMutation, unauthorizedResponse } from '@/lib/server/apiAuth';
import { generateUniqueAffiliateSlug } from '@/lib/server/affiliateSlug';
import prisma from '@/lib/server/prisma';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

const asNullableFloat = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

const asNetwork = (value: unknown): AffiliateNetwork | null => {
  if (typeof value !== 'string') return null;
  return Object.values(AffiliateNetwork).includes(value as AffiliateNetwork)
    ? (value as AffiliateNetwork)
    : null;
};

const asCommissionType = (value: unknown): CommissionType | null => {
  if (typeof value !== 'string') return null;
  return Object.values(CommissionType).includes(value as CommissionType)
    ? (value as CommissionType)
    : null;
};

const asRoutingPriority = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 99;
  }

  return 99;
};

const asBoolean = (value: unknown) => (typeof value === 'boolean' ? value : null);

const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  let token;
  try {
    token = await requireAdminMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  if (!token) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const partner = await prisma.affiliatePartner.findUnique({ where: { id } });

  if (!partner) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(partner);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  let token;
  try {
    token = await requireAdminMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  if (!token) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const existing = await prisma.affiliatePartner.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const nextName = hasOwn(body, 'name') ? asText(body.name) : existing.name;
  const nextNetwork = hasOwn(body, 'network') ? asNetwork(body.network) : existing.network;
  const nextCommissionType = hasOwn(body, 'commissionType')
    ? asCommissionType(body.commissionType)
    : existing.commissionType;
  const nextCommissionRate = hasOwn(body, 'commissionRate') ? asText(body.commissionRate) : existing.commissionRate;
  const slugInput = hasOwn(body, 'slug') ? asText(body.slug) : existing.slug;
  const nextPartnerType = hasOwn(body, 'partnerType') ? asText(body.partnerType) || 'retailer' : existing.partnerType;
  const nextNotes = hasOwn(body, 'notes') ? asNullableText(body.notes) : existing.notes;
  const nextRoutingPriority = hasOwn(body, 'routingPriority')
    ? asRoutingPriority(body.routingPriority)
    : existing.routingPriority;
  const nextAffiliateTier = hasOwn(body, 'affiliateTier')
    ? normalizeAffiliateTier(
        body.affiliateTier,
        inferAffiliateTier({
          name: nextName,
          notes: nextNotes,
          routingPriority: nextRoutingPriority,
        }),
      )
    : normalizeAffiliateTier(existing.affiliateTier);
  const nextPaymentRisk = hasOwn(body, 'paymentRisk')
    ? asBoolean(body.paymentRisk) ?? existing.paymentRisk
    : existing.paymentRisk;
  const nextRetailerFallback = hasOwn(body, 'retailerFallback')
    ? normalizeRetailerFallbacks(body.retailerFallback, getDefaultRetailerFallbacks(nextPartnerType))
    : normalizeRetailerFallbacks(existing.retailerFallback, getDefaultRetailerFallbacks(nextPartnerType));

  if (hasOwn(body, 'slug') && !slugInput) {
    return NextResponse.json({ error: 'slug cannot be empty' }, { status: 400 });
  }

  if (!nextName || !nextNetwork || !nextCommissionType || !nextCommissionRate) {
    return NextResponse.json(
      { error: 'name, network, commissionType, and commissionRate are required' },
      { status: 400 },
    );
  }

  const partner = await prisma.affiliatePartner.update({
    where: { id },
    data: {
      name: nextName,
      slug: await generateUniqueAffiliateSlug(slugInput || nextName, id),
      network: nextNetwork,
      advertiserId: hasOwn(body, 'advertiserId')
        ? asNullableText(body.advertiserId)
        : existing.advertiserId,
      partnerType: nextPartnerType,
      affiliatePid: hasOwn(body, 'affiliatePid') ? asNullableText(body.affiliatePid) : existing.affiliatePid,
      commissionType: nextCommissionType,
      commissionRate: nextCommissionRate,
      baseUrl: hasOwn(body, 'baseUrl')
        ? asText(body.baseUrl) || asText(body.website)
        : existing.baseUrl,
      affiliateTier: nextAffiliateTier,
      paymentRisk: nextPaymentRisk,
      retailerFallback: nextRetailerFallback,
      logoUrl: hasOwn(body, 'logoUrl') ? asNullableText(body.logoUrl) : existing.logoUrl,
      website: hasOwn(body, 'website') ? asNullableText(body.website) : existing.website,
      affiliateLink: hasOwn(body, 'affiliateLink') ? asNullableText(body.affiliateLink) : existing.affiliateLink,
      category: hasOwn(body, 'category') ? asNullableText(body.category) : existing.category,
      threeMonthEpc: hasOwn(body, 'threeMonthEpc')
        ? asNullableFloat(body.threeMonthEpc)
        : existing.threeMonthEpc,
      sevenDayEpc: hasOwn(body, 'sevenDayEpc')
        ? asNullableFloat(body.sevenDayEpc)
        : existing.sevenDayEpc,
      notes: nextNotes,
      routingPriority: nextRoutingPriority,
      allowedContexts: hasOwn(body, 'allowedContexts')
        ? normalizeAffiliateContexts(body.allowedContexts)
        : normalizeAffiliateContexts(existing.allowedContexts),
      isActive: hasOwn(body, 'isActive') && typeof body.isActive === 'boolean'
        ? body.isActive
        : existing.isActive,
    },
  });

  return NextResponse.json(partner);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  let token;
  try {
    token = await requireAdminMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  if (!token) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  await prisma.affiliatePartner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
