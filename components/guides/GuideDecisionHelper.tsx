import DecisionHelper from '@/components/guides/DecisionHelper';
import type { GuideHubDecisionItem } from '@/lib/guides/hubs';

export default function GuideDecisionHelper({
  id,
  title,
  description,
  items,
  variant = 'default',
  eyebrow,
  ctaLabel,
}: {
  id?: string;
  title: string;
  description?: string;
  items: GuideHubDecisionItem[];
  variant?: 'default' | 'stroller-hub';
  eyebrow?: string;
  ctaLabel?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <DecisionHelper
      id={id}
      eyebrow={eyebrow ?? 'Decision helper'}
      title={title}
      description={description}
      items={items.map((item) => ({
        question: item.title,
        optionLabel: variant === 'stroller-hub' ? 'Explore next' : 'Start here',
        result: item.description,
        href: item.href,
        icon: item.icon,
        ctaLabel: ctaLabel ?? 'Open guide',
      }))}
    />
  );
}
