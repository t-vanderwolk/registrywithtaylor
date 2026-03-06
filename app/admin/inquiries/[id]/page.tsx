import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';

type AdminInquiryDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

const SERVICE_LABELS: Record<string, string> = {
  consultation: 'Complimentary Consultation',
  'focused-edit': 'The Focused Edit',
  'signature-plan': 'The Signature Plan',
  'private-concierge': 'The Private Concierge',
};

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

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

const formatDate = (value?: Date | null) => {
  if (!value) return 'N/A';
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const toServiceLabel = (service: string | null) => {
  if (!service) {
    return 'General';
  }

  return SERVICE_LABELS[service] ?? service;
};

const toStatusLabel = (status: string | null) => {
  const normalizedStatus = status?.trim() || 'new';
  if (normalizedStatus === 'new') return 'New';
  if (normalizedStatus === 'reviewed') return 'Reviewed';
  if (normalizedStatus === 'completed') return 'Completed';
  return normalizedStatus;
};

async function updateInquiryStatusAction(formData: FormData) {
  'use server';

  await requireAdminSession();

  const inquiryId = Number.parseInt(asText(formData.get('inquiryId')), 10);
  const nextStatus = asText(formData.get('nextStatus'));
  const allowedStatuses = new Set(['new', 'reviewed', 'completed']);

  if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
    redirect('/admin/inquiries');
  }

  if (!allowedStatuses.has(nextStatus)) {
    redirect(`/admin/inquiries/${inquiryId}?error=status`);
  }

  await prisma.contactInquiry.update({
    where: { id: inquiryId },
    data: {
      status: nextStatus,
    },
  });

  redirect(`/admin/inquiries/${inquiryId}?saved=1`);
}

export const dynamic = 'force-dynamic';

export default async function AdminInquiryDetailPage({
  params,
  searchParams,
}: AdminInquiryDetailPageProps) {
  await requireAdminSession();

  const { id } = await params;
  const inquiryId = Number.parseInt(id, 10);
  if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
    notFound();
  }

  const query = searchParams ? await searchParams : undefined;

  const inquiry = await prisma.contactInquiry.findUnique({
    where: { id: inquiryId },
    select: {
      id: true,
      fullName: true,
      email: true,
      service: true,
      dueDate: true,
      registryLink: true,
      homeType: true,
      budgetRange: true,
      topConcerns: true,
      biggestStress: true,
      location: true,
      levelOfSupport: true,
      timeline: true,
      notes: true,
      referrer: true,
      sourceUrl: true,
      status: true,
      createdAt: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  const statusLabel = toStatusLabel(inquiry.status);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Inquiries"
        title={`Inquiry #${inquiry.id}`}
        subtitle={`Submitted ${formatDateTime(inquiry.createdAt)} | Status: ${statusLabel}`}
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/inquiries">Back to inbox</Link>
          </AdminButton>
        }
      />

      {(query?.saved === '1' || query?.error) && (
        <AdminSurface variant="muted">
          <p className={`admin-body ${query?.error ? 'text-admin-danger' : 'text-admin-success'}`}>
            {query?.saved === '1' && 'Inquiry status updated.'}
            {query?.error === 'status' && 'Invalid status update request.'}
          </p>
        </AdminSurface>
      )}

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Inquiry details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Name</p>
            <p className="admin-body text-admin">{inquiry.fullName}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Email</p>
            <p className="admin-body text-admin">{inquiry.email}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Service</p>
            <p className="admin-body text-admin">{toServiceLabel(inquiry.service)}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Due date</p>
            <p className="admin-body text-admin">{formatDate(inquiry.dueDate)}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Location</p>
            <p className="admin-body text-admin">{inquiry.location || 'N/A'}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Current status</p>
            <p className="admin-body text-admin">{statusLabel}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Home type</p>
            <p className="admin-body text-admin">{inquiry.homeType || 'N/A'}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Budget range</p>
            <p className="admin-body text-admin">{inquiry.budgetRange || 'N/A'}</p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Registry link</p>
            <p className="admin-body text-admin">
              {inquiry.registryLink ? (
                <a
                  href={inquiry.registryLink}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  {inquiry.registryLink}
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Source URL</p>
            <p className="admin-body text-admin">
              {inquiry.sourceUrl ? (
                <a href={inquiry.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {inquiry.sourceUrl}
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>

        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Top concerns</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{inquiry.topConcerns || 'N/A'}</p>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Biggest stress</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{inquiry.biggestStress || 'N/A'}</p>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Preferred level of support</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{inquiry.levelOfSupport || 'N/A'}</p>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Timeline</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{inquiry.timeline || 'N/A'}</p>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Notes</p>
          <p className="admin-body whitespace-pre-wrap text-admin">{inquiry.notes || 'N/A'}</p>
        </div>
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Referrer</p>
          <p className="admin-body text-admin">{inquiry.referrer || 'N/A'}</p>
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-4">
        <h2 className="admin-h2">Update status</h2>
        <div className="flex flex-wrap gap-2">
          <form action={updateInquiryStatusAction}>
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <input type="hidden" name="nextStatus" value="new" />
            <AdminButton type="submit" variant="secondary" disabled={inquiry.status === 'new'}>
              Mark new
            </AdminButton>
          </form>
          <form action={updateInquiryStatusAction}>
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <input type="hidden" name="nextStatus" value="reviewed" />
            <AdminButton type="submit" variant="secondary" disabled={inquiry.status === 'reviewed'}>
              Mark reviewed
            </AdminButton>
          </form>
          <form action={updateInquiryStatusAction}>
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <input type="hidden" name="nextStatus" value="completed" />
            <AdminButton type="submit" variant="primary" disabled={inquiry.status === 'completed'}>
              Mark completed
            </AdminButton>
          </form>
        </div>
      </AdminSurface>
    </AdminStack>
  );
}
