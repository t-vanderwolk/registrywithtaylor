import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import { registryDelegate } from '@/lib/server/prismaRegistry';

const VALID_PLATFORMS = ['BABYLIST', 'AMAZON', 'TARGET', 'BUYBUYBABY', 'WALMART', 'OTHER'] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

function isValidPlatform(p: unknown): p is Platform {
  return VALID_PLATFORMS.includes(p as Platform);
}

function isValidUrl(s: unknown): boolean {
  if (typeof s !== 'string' || !s.trim()) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

// ─── GET /api/registry ────────────────────────────────────────────────────────

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registries = await registryDelegate.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id:             true,
      platform:       true,
      name:           true,
      url:            true,
      itemCount:      true,
      completedCount: true,
      notes:          true,
      createdAt:      true,
      updatedAt:      true,
    },
  });

  return NextResponse.json({ registries });
}

// ─── POST /api/registry ───────────────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { platform, name, url, itemCount, notes } = body as Record<string, unknown>;

  if (!isValidPlatform(platform)) {
    return NextResponse.json(
      { error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` },
      { status: 400 },
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: 'A valid URL (https://...) is required.' },
      { status: 400 },
    );
  }

  const registry = await registryDelegate.create({
    data: {
      userId:    session.user.id,
      platform:  platform as Platform,
      name:      typeof name === 'string' ? name.trim() || null : null,
      url:       (url as string).trim(),
      itemCount: typeof itemCount === 'number' && itemCount > 0 ? itemCount : null,
      notes:     typeof notes === 'string' ? notes.trim() || null : null,
    },
  });

  return NextResponse.json({ registry }, { status: 201 });
}
