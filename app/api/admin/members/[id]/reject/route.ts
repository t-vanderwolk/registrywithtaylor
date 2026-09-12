import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { forbiddenResponse, requireAdminMutation, unauthorizedResponse } from '@/lib/server/apiAuth';

/**
 * POST /api/admin/members/[id]/reject
 * Marks a waitlist entry as rejected. Reversible — admin can approve later.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let token;
  try {
    token = await requireAdminMutation(request);
  } catch (error) {
    return forbiddenResponse(error);
  }
  if (!token) return unauthorizedResponse();

  const { id } = await params;

  const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
  if (!entry) {
    return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
  }

  await prisma.waitlistEntry.update({
    where: { id },
    data:  { status: 'rejected' },
  });

  return NextResponse.json({ ok: true });
}
