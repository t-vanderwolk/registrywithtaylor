import { getStatusPillClassName, POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';

export default function StatusPill({ status }: { status: PostStatusValue }) {
  return <span className={getStatusPillClassName(status)}>{POST_STATUS_LABELS[status]}</span>;
}
