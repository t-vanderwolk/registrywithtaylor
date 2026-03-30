import type { Prisma } from '@prisma/client';
import type { BlogPostComment } from '@/lib/blog/postComments';

export const publicPostCommentSelect = {
  id: true,
  authorName: true,
  body: true,
  createdAt: true,
} satisfies Prisma.PostCommentSelect;

export type PublicPostCommentRecord = Prisma.PostCommentGetPayload<{
  select: typeof publicPostCommentSelect;
}>;

export function toBlogPostComment(comment: PublicPostCommentRecord): BlogPostComment {
  return {
    id: comment.id,
    authorName: comment.authorName,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
  };
}
