import { normalizePostStatus, requiresLiveContent, toLegacyPublished, type PostStatusValue } from '@/lib/blog/postStatus';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

function parseOptionalDate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return { value: null as Date | null, invalid: false };
  }

  const parsed = value instanceof Date ? value : new Date(asText(value));
  if (Number.isNaN(parsed.getTime())) {
    return { value: null as Date | null, invalid: true };
  }

  return { value: parsed, invalid: false };
}

type ExistingLifecycleFields = {
  status: PostStatusValue;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
};

type ResolveLifecycleInput = {
  status: unknown;
  published: unknown;
  scheduledFor: unknown;
  content: string;
  existing?: ExistingLifecycleFields;
  now?: Date;
};

type ResolveLifecycleResult =
  | {
      ok: true;
      status: PostStatusValue;
      publishedAt: Date | null;
      scheduledFor: Date | null;
      archivedAt: Date | null;
      published: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export function resolveRequestedStatus(
  statusInput: unknown,
  publishedInput: unknown,
  fallback: PostStatusValue = 'DRAFT',
) {
  if (typeof statusInput === 'string' && statusInput.trim()) {
    return normalizePostStatus(statusInput, fallback);
  }

  if (typeof publishedInput === 'boolean') {
    return publishedInput ? 'PUBLISHED' : 'DRAFT';
  }

  return fallback;
}

export function resolvePostLifecycle({
  status,
  published,
  scheduledFor,
  content,
  existing,
  now = new Date(),
}: ResolveLifecycleInput): ResolveLifecycleResult {
  const nextStatus = resolveRequestedStatus(status, published, existing?.status ?? 'DRAFT');
  const scheduledDateResult = parseOptionalDate(scheduledFor);

  if (scheduledDateResult.invalid) {
    return { ok: false, error: 'Enter a valid schedule date and time.' };
  }

  const nextScheduledFor =
    scheduledFor === undefined ? existing?.scheduledFor ?? null : scheduledDateResult.value;

  if (requiresLiveContent(nextStatus) && !content.trim()) {
    return { ok: false, error: 'Content is required before publishing or scheduling.' };
  }

  if (nextStatus === 'SCHEDULED') {
    if (!nextScheduledFor) {
      return { ok: false, error: 'A future schedule date is required before scheduling.' };
    }

    if (nextScheduledFor.getTime() <= now.getTime()) {
      return { ok: false, error: 'Scheduled posts must use a future date and time.' };
    }

    return {
      ok: true,
      status: nextStatus,
      publishedAt: null,
      scheduledFor: nextScheduledFor,
      archivedAt: null,
      published: toLegacyPublished(nextStatus),
    };
  }

  if (nextStatus === 'PUBLISHED') {
    return {
      ok: true,
      status: nextStatus,
      publishedAt: existing?.publishedAt ?? now,
      scheduledFor: null,
      archivedAt: null,
      published: toLegacyPublished(nextStatus),
    };
  }

  if (nextStatus === 'ARCHIVED') {
    return {
      ok: true,
      status: nextStatus,
      publishedAt: existing?.publishedAt ?? null,
      scheduledFor: null,
      archivedAt: existing?.archivedAt ?? now,
      published: toLegacyPublished(nextStatus),
    };
  }

  return {
    ok: true,
    status: 'DRAFT',
    publishedAt: null,
    scheduledFor: null,
    archivedAt: null,
    published: false,
  };
}
