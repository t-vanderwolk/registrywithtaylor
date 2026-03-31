import { NextRequest, NextResponse } from 'next/server';
import { adminNotificationTemplate } from '@/lib/email/templates/adminNotification';
import { contactConfirmationTemplate } from '@/lib/email/templates/contactConfirmation';
import { getAdminEmail, sendEmail } from '@/lib/email/sendEmail';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asOptionalText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

const asOptionalDate = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  if (!text) {
    return { value: null, error: false } as const;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return { value: null, error: true } as const;
  }

  return { value: parsed, error: false } as const;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const formatDateLabel = (value: Date | null) => {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
};

const buildAdminMessage = (entries: Array<string | null>) => {
  const sections = entries.map((entry) => entry?.trim()).filter(Boolean);
  return sections.length > 0 ? sections.join('\n\n') : 'No additional message was provided.';
};

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

  return null;
};

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/contact',
    ip: ip ?? 'unknown',
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many inquiries submitted. Please try again shortly.' },
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

  // Honeypot field for basic spam filtering.
  if (asText(formData.get('company')).length > 0) {
    return NextResponse.json({ success: true });
  }

  const fullName = asText(formData.get('fullName'));
  const email = asText(formData.get('email'));
  const dueDate = asOptionalDate(formData.get('dueDate'));
  const service = asOptionalText(formData.get('service'));
  const registryLink = asOptionalText(formData.get('registryLink'));
  const homeType = asOptionalText(formData.get('homeType'));
  const budgetRange = asOptionalText(formData.get('budgetRange'));
  const topConcerns = asOptionalText(formData.get('topConcerns'));
  const biggestStress = asOptionalText(formData.get('biggestStress'));
  const location = asOptionalText(formData.get('location'));
  const levelOfSupport = asOptionalText(formData.get('levelOfSupport'));
  const timeline = asOptionalText(formData.get('timeline'));
  const notes = asOptionalText(formData.get('notes'));
  const referrer = asOptionalText(formData.get('referrer'));
  const sourceUrl = asOptionalText(formData.get('sourceUrl'));

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (dueDate.error) {
    return NextResponse.json({ error: 'Please provide a valid due date.' }, { status: 400 });
  }

  const inquiry = await prisma.contactInquiry.create({
    data: {
      fullName,
      email,
      service,
      dueDate: dueDate.value,
      registryLink,
      homeType,
      budgetRange,
      topConcerns,
      biggestStress,
      location,
      levelOfSupport,
      timeline,
      notes,
      referrer,
      sourceUrl,
    },
    select: { id: true },
  });

  const dueDateLabel = formatDateLabel(dueDate.value);
  const adminMessage = buildAdminMessage([
    notes,
    topConcerns ? `Top concerns: ${topConcerns}` : null,
    biggestStress ? `Biggest stress: ${biggestStress}` : null,
    timeline ? `Timeline: ${timeline}` : null,
  ]);

  const emailResults = await Promise.allSettled([
    sendEmail({
      to: email,
      subject: 'We received your message — Taylor-Made Baby Co.',
      html: contactConfirmationTemplate({ name: fullName }),
    }),
    sendEmail({
      to: getAdminEmail(),
      replyTo: email,
      subject: 'New TMBC Inquiry',
      html: adminNotificationTemplate({
        name: fullName,
        email,
        type: 'contact',
        message: adminMessage,
        details: [
          ...(service ? [{ label: 'Service', value: service }] : []),
          ...(dueDateLabel ? [{ label: 'Due Date', value: dueDateLabel }] : []),
          ...(location ? [{ label: 'Location', value: location }] : []),
          ...(levelOfSupport ? [{ label: 'Support', value: levelOfSupport }] : []),
          ...(registryLink ? [{ label: 'Registry', value: registryLink }] : []),
        ],
      }),
    }),
  ]);

  emailResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error('Contact inquiry email failed to send.', {
        inquiryId: inquiry.id,
        emailType: index === 0 ? 'user_confirmation' : 'admin_notification',
        error: result.reason,
      });
    }
  });

  return NextResponse.json({ success: true, inquiryId: inquiry.id });
}
