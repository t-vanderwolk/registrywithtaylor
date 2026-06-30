export type InternalLinkKind = 'blog' | 'guide' | 'academy' | 'service' | 'tool';

export type InternalLinkCluster =
  | 'registry'
  | 'strollers'
  | 'car-seats'
  | 'nursery'
  | 'daily-gear'
  | 'travel'
  | 'postpartum'
  | 'general';

export type InternalLinkCard = {
  id: string;
  href: `/${string}`;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
  kind: InternalLinkKind;
  cluster: InternalLinkCluster;
};

export type ContextualInternalLink = InternalLinkCard & {
  anchors: string[];
  priority?: number;
};

export type InternalLinkMapEntry = {
  href: `/${string}`;
  title: string;
  kind: InternalLinkKind;
  cluster: InternalLinkCluster;
  outbound: InternalLinkCard[];
};
