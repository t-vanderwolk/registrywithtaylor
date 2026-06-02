import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {
  getPostCommentValidationError,
  normalizePostCommentSubmission,
} from '@/lib/blog/postComments';
import { isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { forbiddenResponse, rejectReviewerMutation } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { publicPostCommentSelect, toBlogPostComment } from '@/lib/server/postComments';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const getRequestIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first?.trim()) {
      return first.trim();
    }
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) {
    return realIp.trim();
  }

  return 'unknown';
};

const hasSchemaCompatibilityMessage = (message: string) => {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes('column') && normalized.includes('does not exist')) ||
    (normalized.includes('relation') && normalized.includes('does not exist')) ||
    (normalized.includes('table') && normalized.includes('does not exist'))
  );
};

const isSchemaCompatibilityError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2021' || error.code === 'P2022';
  }

  if (error instanceof Error) {
    return hasSchemaCompatibilityMessage(error.message);
  }

  return false;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await rejectReviewerMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/blog/comments',
    ip,
    limit: 5,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many comments submitted. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
  }

  if (asText(formData.get('website')).length > 0) {
    return NextResponse.json({ success: true });
  }

  const { id } = await context.params;
  const normalized = normalizePostCommentSubmission({
    authorName: asText(formData.get('authorName')),
    authorEmail: asText(formData.get('authorEmail')),
    body: asText(formData.get('body')),
  });
  const validationError = getPostCommentValidationError(normalized);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        scheduledFor: true,
        published: true,
      },
    });

    if (!post || !isPostPubliclyVisible(post.status, post.scheduledFor, new Date(), post.published)) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: post.id,
        authorName: normalized.authorName,
        authorEmail: normalized.authorEmail,
        body: normalized.body,
      },
      select: publicPostCommentSelect,
    });

    return NextResponse.json(
      {
        success: true,
        comment: toBlogPostComment(comment),
      },
      { status: 201 },
    );
  } catch (error) {
    if (isSchemaCompatibilityError(error)) {
      return NextResponse.json({ error: 'Comments are temporarily unavailable.' }, { status: 503 });
    }

    throw error;
  }
}
