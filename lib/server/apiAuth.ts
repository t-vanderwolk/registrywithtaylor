import type { Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type AppToken = JWT & {
  id?: string;
  role?: Role;
};

export async function getRequestToken(req: NextRequest) {
  return (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as AppToken | null;
}

export async function requireAdmin(req: NextRequest) {
  const token = await getRequestToken(req);
  if (token?.role !== 'ADMIN') {
    return null;
  }

  return token;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
