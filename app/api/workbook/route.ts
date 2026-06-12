import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

// ─── GET /api/workbook?path=&module= ─────────────────────────────────────────
// Returns the saved note for this user × path × module, or null.

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ note: null }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const pathSlug   = searchParams.get('path');
  const moduleSlug = searchParams.get('module');

  if (!pathSlug || !moduleSlug) {
    return NextResponse.json({ error: 'path and module query params are required.' }, { status: 400 });
  }

  const note = await prisma.moduleNote.findUnique({
    where: {
      userId_pathSlug_moduleSlug: {
        userId:     session.user.id,
        pathSlug,
        moduleSlug,
      },
    },
    select: { content: true, updatedAt: true },
  });

  return NextResponse.json({ note: note ?? null });
}

// ─── POST /api/workbook ───────────────────────────────────────────────────────
// Upserts a ModuleNote for the logged-in user.

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pathSlug, moduleSlug, content } = body as {
      pathSlug?:   string;
      moduleSlug?: string;
      content?:    string;
    };

    if (!pathSlug || !moduleSlug) {
      return NextResponse.json(
        { error: 'pathSlug and moduleSlug are required.' },
        { status: 400 },
      );
    }

    const note = await prisma.moduleNote.upsert({
      where: {
        userId_pathSlug_moduleSlug: {
          userId:     session.user.id,
          pathSlug,
          moduleSlug,
        },
      },
      update: {
        content:   content ?? '',
        updatedAt: new Date(),
      },
      create: {
        userId:     session.user.id,
        pathSlug,
        moduleSlug,
        content:   content ?? '',
      },
      select: { updatedAt: true },
    });

    return NextResponse.json({ saved: true, updatedAt: note.updatedAt });
  } catch (err) {
    console.error('[POST /api/workbook]', err);
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 });
  }
}
