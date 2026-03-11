import type { GuideAffiliateModule, GuideFaqItem } from '@/lib/guides/types';
import type { GuideStatusValue } from '@/lib/guides/status';
import type { AffiliatePartnerOption, AuthorOption } from '@/components/admin/blog/postEditorTypes';

export type { AffiliatePartnerOption, AuthorOption };

export type RelatedGuideOption = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: GuideStatusValue;
};

export type PersistedGuideRecord = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  intro: string | null;
  content: string;
  conclusion: string | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  authorId: string;
  authorLabel?: string;
  category: string;
  topicCluster: string | null;
  status: GuideStatusValue;
  publishedAt: Date | string | null;
  scheduledFor: Date | string | null;
  archivedAt: Date | string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  canonicalUrl: string | null;
  targetKeyword: string | null;
  secondaryKeywords: string[];
  internalLinkNotes: string | null;
  tableOfContentsEnabled: boolean;
  faqItems: GuideFaqItem[];
  affiliateDisclosureEnabled: boolean;
  affiliateDisclosureText: string | null;
  affiliateDisclosurePlacement: string | null;
  affiliateModules: GuideAffiliateModule[];
  consultationCtaEnabled: boolean;
  consultationCtaLabel: string | null;
  newsletterCtaEnabled: boolean;
  newsletterCtaLabel: string | null;
  newsletterCtaDescription: string | null;
  newsletterCtaHref: string | null;
  nextStepCtaLabel: string | null;
  nextStepCtaHref: string | null;
  founderSignatureEnabled: boolean;
  founderSignatureText: string | null;
  relatedGuideIds: string[];
  views: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type GuideSavePayload = Omit<PersistedGuideRecord, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'authorLabel'> & {
  sourceRoute?: string;
};

export type GuideEditorTabId = 'core' | 'seo' | 'structure' | 'commerce' | 'conversion';

