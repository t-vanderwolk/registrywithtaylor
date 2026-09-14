import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { archiveNewsletterIssue } from '../actions';
import IssueForm, { normalizeIssueContent } from '../IssueForm';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Newsletter Issue · Admin',
  robots: { index: false, follow: false },
};

type PageParams = Promise<{ id: string }>;

const formatDateTime = (value?: Date | null) =>
  value
    ? value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

function ContentList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="admin-stack gap-2">
      <h3 className="text-admin font-medium">{title}</h3>
      <ul className="admin-stack gap-1">
        {items.map((item) => (
          <li key={item} className="admin-body">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function NewsletterIssuePage({ params }: { params: PageParams }) {
  const { id } = await params;
  await requireAdminSession(`/admin/newsletter/issues/${id}`);

  const issue = await prisma.newsletterIssue.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      subject: true,
      previewText: true,
      slug: true,
      status: true,
      scheduledFor: true,
      sentAt: true,
      content: true,
      updatedAt: true,
    },
  });

  if (!issue) {
    notFound();
  }

  const content = normalizeIssueContent(issue.content);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Newsletter"
        title={issue.title}
        subtitle={`Status: ${issue.status.toLowerCase()} · Updated ${formatDateTime(issue.updatedAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/newsletter/issues">Back to issues</Link>
            </AdminButton>
            {issue.status !== 'ARCHIVED' ? (
              <form action={archiveNewsletterIssue}>
                <input type="hidden" name="id" value={issue.id} />
                <AdminButton type="submit" variant="danger">
                  Archive
                </AdminButton>
              </form>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
        <IssueForm issue={issue} />

        <AdminSurface className="admin-stack gap-5 self-start">
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">Draft preview</p>
            <h2 className="admin-h2">{issue.subject}</h2>
            {issue.previewText ? <p className="admin-body">{issue.previewText}</p> : null}
          </div>

          {content.intro ? <p className="admin-body whitespace-pre-line">{content.intro}</p> : null}
          <ContentList title="Highlights" items={content.highlights} />
          <ContentList title="Featured links" items={content.featuredLinks} />
          <ContentList title="Product picks" items={content.productPicks} />

          {content.cta.label || content.cta.url ? (
            <div className="admin-stack gap-1">
              <h3 className="text-admin font-medium">CTA</h3>
              <p className="admin-body">{content.cta.label || 'CTA label not set'}</p>
              {content.cta.url ? <p className="admin-micro">{content.cta.url}</p> : null}
            </div>
          ) : null}

          {content.signoff ? <p className="admin-body whitespace-pre-line">{content.signoff}</p> : null}
          {content.internalNotes ? (
            <div className="admin-stack gap-1 border-t border-[rgba(47,36,48,0.12)] pt-4">
              <h3 className="text-admin font-medium">Internal notes</h3>
              <p className="admin-micro whitespace-pre-line">{content.internalNotes}</p>
            </div>
          ) : null}
        </AdminSurface>
      </div>
    </AdminStack>
  );
}
