import { NewsletterIssueStatus } from '@prisma/client';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import { createNewsletterIssue, updateNewsletterIssue } from './actions';

type IssueContent = {
  intro: string;
  highlights: string[];
  featuredLinks: string[];
  productPicks: string[];
  cta: {
    label: string;
    url: string;
  };
  signoff: string;
  internalNotes: string;
};

export type NewsletterIssueFormRecord = {
  id?: string | null;
  title: string;
  subject: string;
  previewText: string | null;
  slug: string | null;
  status: NewsletterIssueStatus;
  scheduledFor: Date | null;
  sentAt: Date | null;
  content: unknown;
};

const STATUS_OPTIONS = [
  NewsletterIssueStatus.DRAFT,
  NewsletterIssueStatus.READY,
  NewsletterIssueStatus.SCHEDULED,
  NewsletterIssueStatus.SENT,
  NewsletterIssueStatus.ARCHIVED,
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function normalizeIssueContent(value: unknown): IssueContent {
  if (!isRecord(value)) {
    return {
      intro: '',
      highlights: [],
      featuredLinks: [],
      productPicks: [],
      cta: { label: '', url: '' },
      signoff: '',
      internalNotes: '',
    };
  }

  const cta = isRecord(value.cta) ? value.cta : {};
  return {
    intro: typeof value.intro === 'string' ? value.intro : '',
    highlights: Array.isArray(value.highlights) ? value.highlights.filter((item): item is string => typeof item === 'string') : [],
    featuredLinks: Array.isArray(value.featuredLinks) ? value.featuredLinks.filter((item): item is string => typeof item === 'string') : [],
    productPicks: Array.isArray(value.productPicks) ? value.productPicks.filter((item): item is string => typeof item === 'string') : [],
    cta: {
      label: typeof cta.label === 'string' ? cta.label : '',
      url: typeof cta.url === 'string' ? cta.url : '',
    },
    signoff: typeof value.signoff === 'string' ? value.signoff : '',
    internalNotes: typeof value.internalNotes === 'string' ? value.internalNotes : '',
  };
}

const formatDateTimeValue = (value?: Date | null) => {
  if (!value) return '';
  const offsetMs = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offsetMs).toISOString().slice(0, 16);
};

const statusLabel = (status: NewsletterIssueStatus) =>
  status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function IssueForm({ issue }: { issue: NewsletterIssueFormRecord }) {
  const content = normalizeIssueContent(issue.content);
  const isEditing = Boolean(issue.id);

  return (
    <form action={isEditing ? updateNewsletterIssue : createNewsletterIssue} className="admin-stack gap-5">
      {issue.id ? <input type="hidden" name="id" value={issue.id} /> : null}

      <AdminSurface className="admin-stack gap-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminField label="Internal title" htmlFor="newsletter-title" help="Example: September week 3 registry reset.">
            <AdminInput id="newsletter-title" name="title" required defaultValue={issue.title} />
          </AdminField>

          <AdminField label="Slug" htmlFor="newsletter-slug" help="Optional internal slug. Auto-filled from title when blank.">
            <AdminInput id="newsletter-slug" name="slug" defaultValue={issue.slug ?? ''} />
          </AdminField>
        </div>

        <AdminField label="Subject line" htmlFor="newsletter-subject">
          <AdminInput id="newsletter-subject" name="subject" required defaultValue={issue.subject} />
        </AdminField>

        <AdminField label="Preview text" htmlFor="newsletter-preview" help="The short inbox line after the subject.">
          <AdminTextarea id="newsletter-preview" name="previewText" rows={2} defaultValue={issue.previewText ?? ''} />
        </AdminField>

        <div className="grid gap-4 lg:grid-cols-3">
          <AdminField label="Status" htmlFor="newsletter-status">
            <AdminSelect id="newsletter-status" name="status" defaultValue={issue.status}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="Scheduled for" htmlFor="newsletter-scheduled">
            <AdminInput
              id="newsletter-scheduled"
              name="scheduledFor"
              type="datetime-local"
              defaultValue={formatDateTimeValue(issue.scheduledFor)}
            />
          </AdminField>

          <AdminField label="Sent at" htmlFor="newsletter-sent">
            <AdminInput
              id="newsletter-sent"
              name="sentAt"
              type="datetime-local"
              defaultValue={formatDateTimeValue(issue.sentAt)}
            />
          </AdminField>
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <div className="admin-stack gap-1">
          <h2 className="admin-h2">Issue content</h2>
          <p className="admin-body">Write the reusable weekly issue blocks here. Sending can be connected after the content workflow feels right.</p>
        </div>

        <AdminField label="Opening note" htmlFor="newsletter-intro">
          <AdminTextarea id="newsletter-intro" name="intro" rows={6} defaultValue={content.intro} />
        </AdminField>

        <AdminField label="Highlights" htmlFor="newsletter-highlights" help="One highlight per line.">
          <AdminTextarea id="newsletter-highlights" name="highlights" rows={5} defaultValue={content.highlights.join('\n')} />
        </AdminField>

        <AdminField label="Featured links" htmlFor="newsletter-featured-links" help="One blog/tool/link per line.">
          <AdminTextarea
            id="newsletter-featured-links"
            name="featuredLinks"
            rows={5}
            defaultValue={content.featuredLinks.join('\n')}
          />
        </AdminField>

        <AdminField label="Product picks" htmlFor="newsletter-product-picks" help="One pick per line. Keep affiliate copy/editing here until the send workflow is built.">
          <AdminTextarea
            id="newsletter-product-picks"
            name="productPicks"
            rows={5}
            defaultValue={content.productPicks.join('\n')}
          />
        </AdminField>

        <div className="grid gap-4 lg:grid-cols-2">
          <AdminField label="CTA label" htmlFor="newsletter-cta-label">
            <AdminInput id="newsletter-cta-label" name="ctaLabel" defaultValue={content.cta.label} />
          </AdminField>
          <AdminField label="CTA URL" htmlFor="newsletter-cta-url">
            <AdminInput id="newsletter-cta-url" name="ctaUrl" defaultValue={content.cta.url} />
          </AdminField>
        </div>

        <AdminField label="Signoff" htmlFor="newsletter-signoff">
          <AdminTextarea id="newsletter-signoff" name="signoff" rows={3} defaultValue={content.signoff} />
        </AdminField>

        <AdminField label="Internal notes" htmlFor="newsletter-notes">
          <AdminTextarea id="newsletter-notes" name="internalNotes" rows={4} defaultValue={content.internalNotes} />
        </AdminField>
      </AdminSurface>

      <div className="flex flex-wrap justify-end gap-2">
        <AdminButton type="submit" variant="primary">
          {isEditing ? 'Save issue' : 'Create issue'}
        </AdminButton>
      </div>
    </form>
  );
}
