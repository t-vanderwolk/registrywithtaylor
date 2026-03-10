import type { AffiliateNetwork } from '@prisma/client';
import type { BlogCategory } from '@/lib/blogCategories';
import type { PostAuthorAssignment } from '@/lib/blog/authors';
import type { CtaButton } from '@/lib/blog/ctaButtons';
import type { PostStatusValue } from '@/lib/blog/postStatus';
import type { BlogStageValue } from '@/lib/blog/postStage';

export type AffiliatePartnerOption = {
  id: string;
  slug: string;
  name: string;
  network: AffiliateNetwork;
  partnerType: string;
  logoUrl?: string | null;
  baseUrl?: string | null;
  website?: string | null;
  affiliatePid?: string | null;
  defaultDestinationUrl?: string | null;
  routingPriority: number;
  allowedContexts: string[];
};

export type AffiliateBrandOption = {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  networks: AffiliateNetwork[];
};

export type MediaRecord = {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date | string;
};

export type PostImageRecord = {
  id: number;
  url: string;
  alt: string | null;
  createdAt?: Date | string;
};

export type AuthorOption = {
  id: string;
  email: string;
  name: string;
  slug?: string | null;
  bio?: string | null;
  expertiseAreas: string[];
  avatarUrl?: string | null;
};

export type PersistedPostRecord = {
  id: string | null;
  title: string;
  slug: string;
  category: BlogCategory;
  stage: BlogStageValue;
  deck: string | null;
  excerpt: string | null;
  focusKeyword: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  readingTime: number | null;
  shareTitle: string | null;
  shareDescription: string | null;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featuredImageId: string | null;
  featuredImage: MediaRecord | null;
  content: string;
  mediaIds: string[];
  media: MediaRecord[];
  images: PostImageRecord[];
  status: PostStatusValue;
  publishedAt: Date | string | null;
  scheduledFor: Date | string | null;
  archivedAt: Date | string | null;
  featured: boolean;
  published: boolean;
  affiliateBrandIds: string[];
  authors: PostAuthorAssignment[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type EditorPostState = Omit<PersistedPostRecord, 'content'> & {
  body: string;
  ctaButtons: CtaButton[];
};

export type PostSavePayload = Pick<
  PersistedPostRecord,
  | 'title'
  | 'slug'
  | 'category'
  | 'stage'
  | 'deck'
  | 'excerpt'
  | 'focusKeyword'
  | 'seoTitle'
  | 'seoDescription'
  | 'canonicalUrl'
  | 'shareTitle'
  | 'shareDescription'
  | 'featuredImageUrl'
  | 'coverImage'
  | 'featuredImageId'
  | 'mediaIds'
  | 'status'
  | 'scheduledFor'
  | 'featured'
  | 'affiliateBrandIds'
> & {
  content: string;
  authors: PostAuthorAssignment[];
  images: Array<{
    url: string;
    alt: string | null;
  }>;
};
