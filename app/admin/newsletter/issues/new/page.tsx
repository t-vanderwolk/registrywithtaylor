import Link from 'next/link';
import { NewsletterIssueStatus } from '@prisma/client';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { requireAdminSession } from '@/lib/server/session';
import IssueForm from '../IssueForm';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'New Newsletter Issue · Admin',
  robots: { index: false, follow: false },
};

export default async function NewNewsletterIssuePage() {
  await requireAdminSession('/admin/newsletter/issues/new');

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Newsletter"
        title="New weekly issue"
        subtitle="Create a local newsletter draft. This does not send anything."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/newsletter/issues">Back to issues</Link>
          </AdminButton>
        }
      />

      <IssueForm
        issue={{
          id: null,
          title: '',
          subject: '',
          previewText: '',
          slug: '',
          status: NewsletterIssueStatus.DRAFT,
          scheduledFor: null,
          sentAt: null,
          content: {},
        }}
      />
    </AdminStack>
  );
}
