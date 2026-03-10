import { AffiliateNetwork, CommissionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { normalizeAffiliateContexts } from '@/lib/affiliatePartners';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
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

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const partners = await prisma.affiliatePartner.findMany({
    orderBy: [{ routingPriority: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = asText(body.name);
  const network = asNetwork(body.network);
  const commissionType = asCommissionType(body.commissionType);
  const commissionRate = asText(body.commissionRate);
  const slugInput = asText(body.slug);

  if (!name || !network || !commissionType || !commissionRate) {
    return NextResponse.json(
      { error: 'name, network, commissionType, and commissionRate are required' },
      { status: 400 },
    );
  }

  const partner = await prisma.affiliatePartner.create({
    data: {
      name,
      slug: await generateUniqueAffiliateSlug(slugInput || name),
      network,
      advertiserId: asNullableText(body.advertiserId),
      partnerType: asText(body.partnerType) || 'retailer',
      affiliatePid: asNullableText(body.affiliatePid),
      commissionType,
      commissionRate,
      baseUrl: asText(body.baseUrl) || asText(body.website),
      logoUrl: asNullableText(body.logoUrl),
      website: asNullableText(body.website),
      affiliateLink: asNullableText(body.affiliateLink),
      category: asNullableText(body.category),
      threeMonthEpc: asNullableFloat(body.threeMonthEpc),
      sevenDayEpc: asNullableFloat(body.sevenDayEpc),
      notes: asNullableText(body.notes),
      routingPriority: asRoutingPriority(body.routingPriority),
      allowedContexts: normalizeAffiliateContexts(body.allowedContexts),
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
