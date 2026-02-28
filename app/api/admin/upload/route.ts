import { NextRequest, NextResponse } from 'next/server';
import { isAllowedMediaMimeType, MAX_MEDIA_FILE_SIZE_BYTES } from '@/lib/media';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { uploadToStorage } from '@/lib/server/storage';

export const runtime = 'nodejs';

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

export async function POST(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const rateLimit = consumeRateLimit({
    route: '/api/admin/upload',
    ip: getRequestIp(req),
    limit: 20,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many uploads attempted. Please wait and try again.' },
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
    return NextResponse.json({ error: 'Invalid upload payload.' }, { status: 400 });
  }

  const entry = formData.get('file');
  if (!(entry instanceof File)) {
    return NextResponse.json({ error: 'No file was provided.' }, { status: 400 });
  }

  if (entry.size <= 0) {
    return NextResponse.json({ error: 'The uploaded file is empty.' }, { status: 400 });
  }

  if (entry.size > MAX_MEDIA_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File is too large. Upload files up to 10 MB.' },
      { status: 413 },
    );
  }

  if (!isAllowedMediaMimeType(entry.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Upload JPG, PNG, WEBP, or PDF files only.' },
      { status: 415 },
    );
  }

  try {
    const fileBuffer = Buffer.from(await entry.arrayBuffer());
    const uploaded = await uploadToStorage({
      fileName: entry.name,
      fileType: entry.type,
      fileBuffer,
    });

    const media = await prisma.media.create({
      data: {
        url: uploaded.url,
        fileName: entry.name,
        fileType: entry.type,
        fileSize: entry.size,
      },
      select: {
        id: true,
        url: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        createdAt: true,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to upload file.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
