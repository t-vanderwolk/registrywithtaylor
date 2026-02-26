import { AffiliateNetwork, CommissionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { Roles } from '@/lib/auth';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === Roles.ADMIN;
};

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

const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      network: nextNetwork,
      advertiserId: hasOwn(body, 'advertiserId')
        ? asNullableText(body.advertiserId)
        : existing.advertiserId,
      commissionType: nextCommissionType,
      commissionRate: nextCommissionRate,
      category: hasOwn(body, 'category') ? asNullableText(body.category) : existing.category,
      threeMonthEpc: hasOwn(body, 'threeMonthEpc')
        ? asNullableFloat(body.threeMonthEpc)
        : existing.threeMonthEpc,
      sevenDayEpc: hasOwn(body, 'sevenDayEpc')
        ? asNullableFloat(body.sevenDayEpc)
        : existing.sevenDayEpc,
      notes: hasOwn(body, 'notes') ? asNullableText(body.notes) : existing.notes,
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
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.affiliatePartner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
