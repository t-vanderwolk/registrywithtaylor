import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';

type AdminConsultationDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string; completed?: string; error?: string }>;
};

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asOptionalText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

const formatDateTime = (value?: Date | null) => {
  if (!value) return 'N/A';
  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toDateTimeLocalValue = (value?: Date | null) => {
  if (!value) return '';
  const timezoneOffsetMs = value.getTimezoneOffset() * 60 * 1000;
  return new Date(value.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

async function saveConsultationResponseAction(formData: FormData) {
  'use server';

  await requireAdminSession();

  const consultationId = Number.parseInt(asText(formData.get('consultationId')), 10);
  const adminMessage = asText(formData.get('adminMessage'));
  const meetingLink = asOptionalText(formData.get('meetingLink'));
  const scheduledTimeInput = asOptionalText(formData.get('scheduledTime'));

  if (!Number.isFinite(consultationId) || consultationId <= 0) {
    redirect('/admin/consultations');
  }

  if (!adminMessage) {
    redirect(`/admin/consultations/${consultationId}?error=message`);
  }

  if (meetingLink && !isValidHttpUrl(meetingLink)) {
    redirect(`/admin/consultations/${consultationId}?error=meeting-link`);
  }

  const scheduledTime = scheduledTimeInput ? new Date(scheduledTimeInput) : null;
  if (scheduledTimeInput && (!scheduledTime || Number.isNaN(scheduledTime.getTime()))) {
    redirect(`/admin/consultations/${consultationId}?error=scheduled-time`);
  }

  const existingRequest = await prisma.consultationRequest.findUnique({
    where: { id: consultationId },
    select: { status: true },
  });

  if (!existingRequest) {
    redirect('/admin/consultations');
  }

  const existingResponse = await prisma.consultationResponse.findUnique({
    where: { consultationId },
    select: { id: true },
  });

  if (existingResponse) {
    await prisma.consultationResponse.update({
      where: { consultationId },
      data: {
        adminMessage,
        meetingLink,
        scheduledTime,
      },
    });
  } else {
    await prisma.consultationResponse.create({
      data: {
        consultationId,
        adminMessage,
        meetingLink,
        scheduledTime,
      },
    });
  }

  await prisma.consultationRequest.update({
    where: { id: consultationId },
    data: {
      status:
        existingRequest.status === 'completed'
          ? 'completed'
          : meetingLink || scheduledTime
            ? 'scheduled'
            : 'responded',
    },
  });

  redirect(`/admin/consultations/${consultationId}?saved=1`);
}

async function markConsultationCompleteAction(formData: FormData) {
  'use server';

  await requireAdminSession();

  const consultationId = Number.parseInt(asText(formData.get('consultationId')), 10);
  if (!Number.isFinite(consultationId) || consultationId <= 0) {
    redirect('/admin/consultations');
  }

  await prisma.consultationRequest.update({
    where: { id: consultationId },
    data: {
      status: 'completed',
    },
  });

  redirect(`/admin/consultations/${consultationId}?completed=1`);
}

export const dynamic = 'force-dynamic';

export default async function AdminConsultationDetailPage({
  params,
  searchParams,
}: AdminConsultationDetailPageProps) {
  await requireAdminSession();

  const { id } = await params;
  const consultationId = Number.parseInt(id, 10);
  if (!Number.isFinite(consultationId) || consultationId <= 0) {
    notFound();
  }

  const query = searchParams ? await searchParams : undefined;

  const consultation = await prisma.consultationRequest.findUnique({
    where: { id: consultationId },
    select: {
      id: true,
      name: true,
      email: true,
      dueDate: true,
      city: true,
      babyNumber: true,
      message: true,
      status: true,
      createdAt: true,
      response: {
        select: {
          adminMessage: true,
          meetingLink: true,
          scheduledTime: true,
          createdAt: true,
        },
      },
    },
  });

  if (!consultation) {
    notFound();
  }

  const statusValue = consultation.status?.trim() || 'new';
  const statusLabel = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Consultations"
        title={`Request #${consultation.id}`}
        subtitle={`Submitted ${formatDateTime(consultation.createdAt)} | Status: ${statusLabel}`}
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/consultations">Back to consultations</Link>
          </AdminButton>
        }
      />

      {(query?.saved === '1' || query?.completed === '1' || query?.error) && (
        <AdminSurface variant="muted">
          <p className={`admin-body ${query?.error ? 'text-admin-danger' : 'text-admin-success'}`}>
            {query?.saved === '1' && 'Response saved and consultation status updated.'}
            {query?.completed === '1' && 'Consultation marked as completed.'}
            {query?.error === 'message' && 'Response message is required.'}
            {query?.error === 'meeting-link' && 'Meeting link must be a valid http(s) URL.'}
            {query?.error === 'scheduled-time' && 'Scheduled time must be a valid date/time.'}
          </p>
        </AdminSurface>
      )}

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Request details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Name</p>
            <p className="admin-body text-admin">{consultation.name}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Email</p>
            <p className="admin-body text-admin">{consultation.email}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Due date</p>
            <p className="admin-body text-admin">{formatDateTime(consultation.dueDate)}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">City</p>
            <p className="admin-body text-admin">{consultation.city || 'N/A'}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Baby number</p>
            <p className="admin-body text-admin">{consultation.babyNumber || 'N/A'}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Current status</p>
            <p className="admin-body text-admin">{statusLabel}</p>
          </div>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Message</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{consultation.message || 'No message provided.'}</p>
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Admin response</h2>
        <form action={saveConsultationResponseAction} className="admin-stack gap-4">
          <input type="hidden" name="consultationId" value={consultation.id} />

          <AdminField label="Response message" htmlFor="consultation-admin-message">
            <AdminTextarea
              id="consultation-admin-message"
              name="adminMessage"
              rows={5}
              required
              defaultValue={consultation.response?.adminMessage ?? ''}
              placeholder="Thanks for reaching out. Here are your next steps..."
            />
          </AdminField>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Meeting link (Zoom or Google Meet)" htmlFor="consultation-meeting-link">
              <AdminInput
                id="consultation-meeting-link"
                name="meetingLink"
                type="url"
                placeholder="https://"
                defaultValue={consultation.response?.meetingLink ?? ''}
              />
            </AdminField>

            <AdminField label="Scheduled time" htmlFor="consultation-scheduled-time">
              <AdminInput
                id="consultation-scheduled-time"
                name="scheduledTime"
                type="datetime-local"
                defaultValue={toDateTimeLocalValue(consultation.response?.scheduledTime)}
              />
            </AdminField>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AdminButton type="submit" variant="primary">
              Save response
            </AdminButton>
          </div>
        </form>

        {consultation.status !== 'completed' ? (
          <form action={markConsultationCompleteAction}>
            <input type="hidden" name="consultationId" value={consultation.id} />
            <AdminButton type="submit" variant="secondary">
              Mark completed
            </AdminButton>
          </form>
        ) : null}
      </AdminSurface>

      {consultation.response ? (
        <AdminSurface variant="muted" className="admin-stack gap-2">
          <p className="admin-eyebrow">Latest response</p>
          <p className="admin-body text-admin whitespace-pre-wrap">{consultation.response.adminMessage}</p>
          <p className="admin-micro">Saved {formatDateTime(consultation.response.createdAt)}</p>
        </AdminSurface>
      ) : null}
    </AdminStack>
  );
}
