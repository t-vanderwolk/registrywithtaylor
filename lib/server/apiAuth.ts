import type { Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const REVIEWER_READ_ONLY_ERROR = 'Reviewer access is read-only.';

export type AuthUser = {
  id?: string;
  role?: Role;
};

type AppToken = JWT & AuthUser & {
  id?: string;
  role?: Role;
};

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export async function getRequestToken(req: NextRequest) {
  return (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as AppToken | null;
}

export function isReviewerRole(role: Role | null | undefined) {
  return role === 'REVIEWER';
}

export function canAccessAdminView(role: Role | null | undefined) {
  return role === 'ADMIN' || role === 'REVIEWER';
}

export function assertCanMutate(user: AuthUser | null | undefined) {
  if (isReviewerRole(user?.role)) {
    throw new ForbiddenError(REVIEWER_READ_ONLY_ERROR);
  }
}

export function isForbiddenError(error: unknown): error is ForbiddenError {
  return error instanceof ForbiddenError;
}

export async function requireAdmin(req: NextRequest) {
  const token = await getRequestToken(req);
  if (token?.role !== 'ADMIN') {
    return null;
  }

  return token;
}

export async function requireAdminMutation(req: NextRequest) {
  const token = await getRequestToken(req);
  assertCanMutate(token);

  if (token?.role !== 'ADMIN') {
    return null;
  }

  return token;
}

export async function requireAdminOrReviewer(req: NextRequest) {
  const token = await getRequestToken(req);
  if (!canAccessAdminView(token?.role)) {
    return null;
  }

  return token;
}

export async function rejectReviewerMutation(req: NextRequest) {
  const token = await getRequestToken(req);
  assertCanMutate(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function reviewerReadOnlyResponse() {
  return NextResponse.json({ error: REVIEWER_READ_ONLY_ERROR }, { status: 403 });
}

export function forbiddenResponse(error: unknown) {
  if (isForbiddenError(error)) {
    return reviewerReadOnlyResponse();
  }

  throw error;
}
