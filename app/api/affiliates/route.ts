import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { Roles } from '@/lib/auth';
import { slugify } from '@/lib/slugify';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === Roles.ADMIN;
};

export async function GET(req: NextRequest) {
  const isAdmin = await requireAdmin(req);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const partners = await prisma.affiliatePartner.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin(req);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' && body.slug.trim()
    ? slugify(body.slug)
    : slugify(name);

  const partner = await prisma.affiliatePartner.create({
    data: {
      name,
      slug,
      description: typeof body.description === 'string' ? body.description.trim() || null : null,
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() || null : null,
      websiteUrl: typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() || null : null,
      commission: typeof body.commission === 'string' ? body.commission.trim() || null : null,
      assets: body.assets ?? null,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
