import { BLOG_STAGE_LABELS, getStageBadgeClassName, type BlogStageValue } from '@/lib/blog/postStage';

export default function StageBadge({ stage }: { stage: BlogStageValue }) {
  return <span className={getStageBadgeClassName(stage)}>{BLOG_STAGE_LABELS[stage]}</span>;
}
