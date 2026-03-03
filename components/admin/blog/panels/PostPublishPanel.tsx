import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminToast from '@/components/admin/ui/AdminToast';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { BLOG_STAGE_LABELS, type BlogStageValue } from '@/lib/blog/postStage';

const formatDateTime = (value?: Date | string | null) => {
  if (!value) {
    return 'Not set';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toDateTimeLocal = (value?: Date | string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMinutes * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const statusHeading: Record<PostStatusValue, string> = {
  DRAFT: 'Draft mode',
  SCHEDULED: 'Scheduled to publish',
  PUBLISHED: 'Live on the blog',
  ARCHIVED: 'Archived from public view',
};

const statusCopy: Record<PostStatusValue, string> = {
  DRAFT: 'Keep drafting privately until you are ready to publish.',
  SCHEDULED: 'Set a future date and the post will become public automatically when that time arrives.',
  PUBLISHED: 'This article is visible on the public blog right now.',
  ARCHIVED: 'Archived posts stay in admin and preview, but disappear from public surfaces.',
};

export default function PostPublishPanel({
  hasPersistedPost,
  status,
  stage,
  publishedAt,
  scheduledFor,
  archivedAt,
  saveText,
  saveTone,
  isSaving,
  canPreview,
  scheduleError,
  onStatusChange,
  onStageChange,
  onScheduledForChange,
  onSave,
  onOpenPreview,
}: {
  hasPersistedPost: boolean;
  status: PostStatusValue;
  stage: BlogStageValue;
  publishedAt?: Date | string | null;
  scheduledFor?: Date | string | null;
  archivedAt?: Date | string | null;
  saveText: string;
  saveTone: 'default' | 'success' | 'warning';
  isSaving: boolean;
  canPreview: boolean;
  scheduleError?: string;
  onStatusChange: (value: PostStatusValue) => void;
  onStageChange: (value: BlogStageValue) => void;
  onScheduledForChange: (value: string) => void;
  onSave: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Publish</p>
        <h2 className="admin-h2">{statusHeading[status]}</h2>
        <p className="admin-body">{statusCopy[status]}</p>
      </div>

      <AdminField label="Status" htmlFor="post-status">
        <AdminSelect id="post-status" value={status} onChange={(event) => onStatusChange(event.target.value as PostStatusValue)}>
          {Object.entries(POST_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Stage" htmlFor="post-stage" help="Use the editorial stage to track planning and readiness.">
        <AdminSelect id="post-stage" value={stage} onChange={(event) => onStageChange(event.target.value as BlogStageValue)}>
          {Object.entries(BLOG_STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      {status === 'SCHEDULED' ? (
        <AdminField
          label="Scheduled for"
          htmlFor="post-scheduled-for"
          help="Use your local time. Scheduled posts stay private until this moment."
          error={scheduleError}
        >
          <AdminInput
            id="post-scheduled-for"
            type="datetime-local"
            value={toDateTimeLocal(scheduledFor)}
            min={toDateTimeLocal(new Date())}
            onChange={(event) => onScheduledForChange(event.target.value)}
          />
        </AdminField>
      ) : null}

      <AdminToast tone={saveTone}>{saveText}</AdminToast>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Published at: {formatDateTime(publishedAt)}</p>
        <p className="admin-micro">Scheduled for: {formatDateTime(scheduledFor)}</p>
        <p className="admin-micro">Archived at: {formatDateTime(archivedAt)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AdminButton variant="primary" size="sm" onClick={onSave} disabled={isSaving}>
          {hasPersistedPost ? (isSaving ? 'Saving...' : 'Save now') : isSaving ? 'Creating...' : 'Create draft'}
        </AdminButton>
        <AdminButton variant="secondary" size="sm" onClick={onOpenPreview} disabled={!canPreview || isSaving}>
          Preview
        </AdminButton>
      </div>

      <p className="admin-micro">Keyboard: press Cmd/Ctrl+S to save immediately.</p>
    </AdminSurface>
  );
}
