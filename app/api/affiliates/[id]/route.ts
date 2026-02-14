import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { Roles } from '@/lib/auth';
import { slugify } from '@/lib/slugify';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === Roles.ADMIN;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const isAdmin = await requireAdmin(req);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const partner = await prisma.affiliatePartner.findUnique({
    where: { id },
  });

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

  const body = await req.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const { id } = await context.params;
  const partner = await prisma.affiliatePartner.update({
    where: { id },
    data: {
      name,
      slug:
        typeof body.slug === 'string' && body.slug.trim()
          ? slugify(body.slug)
          : slugify(name),
      description: typeof body.description === 'string' ? body.description.trim() || null : null,
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() || null : null,
      websiteUrl: typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() || null : null,
      commission: typeof body.commission === 'string' ? body.commission.trim() || null : null,
      assets: body.assets ?? null,
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
