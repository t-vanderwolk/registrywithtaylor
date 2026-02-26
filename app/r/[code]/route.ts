import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const getClientIpAddress = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return null;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;

  const link = await prisma.affiliateLink.findUnique({
    where: { shortCode: code },
    select: {
      id: true,
      destinationUrl: true,
    },
  });

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ipAddress = getClientIpAddress(request);
  const userAgent = request.headers.get('user-agent');
  const referrer = request.headers.get('referer');

  try {
    await prisma.affiliateClick.create({
      data: {
        affiliateLinkId: link.id,
        ipAddress,
        userAgent,
        referrer,
      },
    });
  } catch {
    // Do not block redirect when analytics logging fails.
  }

  return NextResponse.redirect(link.destinationUrl, { status: 302 });
}
