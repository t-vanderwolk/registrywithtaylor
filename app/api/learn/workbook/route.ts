import { NextRequest, NextResponse } from 'next/server';
import prismaBase from '@/lib/server/prisma';

/**
 * The Prisma client type doesn't yet include WorkbookSession / WorkbookResponse
 * because `prisma generate` hasn't been run against the updated schema.
 *
 * Run these commands after pulling these changes:
 *   npx prisma generate
 *   npx prisma db push   (or npx prisma migrate dev --name add-learn-models)
 *
 * The `any` cast below is a temporary bridge until the types are regenerated.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = prismaBase as any;

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkbookSaveBody = {
  pathSlug: string;
  moduleSlug: string;
  promptId: string;
  response: string;
  /** Stable client-side token for unauthenticated (guest) saves. */
  guestToken?: string;
  /** Learner ID once auth is wired up. */
  learnerId?: string;
};

// ─── POST /api/learn/workbook ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: WorkbookSaveBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { pathSlug, moduleSlug, promptId, response, guestToken, learnerId } = body;

  if (!pathSlug || !moduleSlug || !promptId) {
    return NextResponse.json(
      { error: 'pathSlug, moduleSlug, and promptId are required' },
      { status: 400 },
    );
  }

  if (!learnerId && !guestToken) {
    return NextResponse.json(
      { error: 'Either learnerId or guestToken is required' },
      { status: 400 },
    );
  }

  try {
    // Upsert the session (get or create)
    const sessionWhere = learnerId
      ? { learnerId_pathSlug_moduleSlug: { learnerId, pathSlug, moduleSlug } }
      : { guestToken_pathSlug_moduleSlug: { guestToken: guestToken!, pathSlug, moduleSlug } };

    const session = await prisma.workbookSession.upsert({
      where: sessionWhere,
      create: {
        learnerId: learnerId ?? null,
        guestToken: guestToken ?? null,
        pathSlug,
        moduleSlug,
      },
      update: {
        updatedAt: new Date(),
      },
    });

    // Upsert the individual response
    const saved = await prisma.workbookResponse.upsert({
      where: {
        sessionId_promptId: { sessionId: session.id, promptId },
      },
      create: {
        sessionId: session.id,
        promptId,
        response: response ?? '',
      },
      update: {
        response: response ?? '',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, responseId: saved.id }, { status: 200 });
  } catch (error) {
    console.error('[workbook save]', error);
    return NextResponse.json({ error: 'Failed to save workbook response' }, { status: 500 });
  }
}

// ─── GET /api/learn/workbook?pathSlug=&moduleSlug=&guestToken= ────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathSlug = searchParams.get('pathSlug');
  const moduleSlug = searchParams.get('moduleSlug');
  const guestToken = searchParams.get('guestToken');
  const learnerId = searchParams.get('learnerId');

  if (!pathSlug || !moduleSlug || (!guestToken && !learnerId)) {
    return NextResponse.json({ responses: {} });
  }

  try {
    const sessionWhere = learnerId
      ? { learnerId_pathSlug_moduleSlug: { learnerId, pathSlug, moduleSlug } }
      : { guestToken_pathSlug_moduleSlug: { guestToken: guestToken!, pathSlug, moduleSlug } };

    const session = await prisma.workbookSession.findUnique({
      where: sessionWhere,
      include: { responses: true },
    });

    if (!session) {
      return NextResponse.json({ responses: {} });
    }

    const responses: Record<string, string> = {};
    for (const r of session.responses) {
      responses[r.promptId] = r.response;
    }

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('[workbook fetch]', error);
    return NextResponse.json({ responses: {} });
  }
}
