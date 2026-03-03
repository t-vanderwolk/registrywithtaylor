import type { AffiliateNetwork } from '@prisma/client';
import type { BlogCategory } from '@/lib/blogCategories';
import type { CtaButton } from '@/lib/blog/ctaButtons';
import type { PostStatusValue } from '@/lib/blog/postStatus';

export type AffiliateOption = {
  id: string;
  name: string;
  network: AffiliateNetwork;
};

export type MediaRecord = {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date | string;
};

export type PersistedPostRecord = {
  id: string | null;
  title: string;
  slug: string;
  category: BlogCategory;
  deck: string | null;
  excerpt: string | null;
  coverImage: string | null;
  featuredImageId: string | null;
  featuredImage: MediaRecord | null;
  content: string;
  mediaIds: string[];
  media: MediaRecord[];
  status: PostStatusValue;
  publishedAt: Date | string | null;
  scheduledFor: Date | string | null;
  archivedAt: Date | string | null;
  featured: boolean;
  published: boolean;
  affiliateIds: string[];
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
  | 'deck'
  | 'excerpt'
  | 'coverImage'
  | 'featuredImageId'
  | 'mediaIds'
  | 'status'
  | 'scheduledFor'
  | 'featured'
  | 'affiliateIds'
> & {
  content: string;
};
