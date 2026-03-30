export type BlogPostComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type PostCommentSubmission = {
  authorName: string;
  authorEmail: string;
  body: string;
};

export const POST_COMMENT_NAME_MIN_LENGTH = 2;
export const POST_COMMENT_NAME_MAX_LENGTH = 80;
export const POST_COMMENT_EMAIL_MAX_LENGTH = 254;
export const POST_COMMENT_BODY_MIN_LENGTH = 3;
export const POST_COMMENT_BODY_MAX_LENGTH = 2000;

export const isValidPostCommentEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function normalizePostCommentSubmission(input: PostCommentSubmission): PostCommentSubmission {
  return {
    authorName: input.authorName.replace(/\s+/g, ' ').trim(),
    authorEmail: input.authorEmail.trim().toLowerCase(),
    body: input.body.replace(/\r\n?/g, '\n').trim(),
  };
}

export function getPostCommentValidationError(input: PostCommentSubmission) {
  const normalized = normalizePostCommentSubmission(input);

  if (
    normalized.authorName.length < POST_COMMENT_NAME_MIN_LENGTH ||
    normalized.authorName.length > POST_COMMENT_NAME_MAX_LENGTH
  ) {
    return `Please enter your name using ${POST_COMMENT_NAME_MIN_LENGTH}-${POST_COMMENT_NAME_MAX_LENGTH} characters.`;
  }

  if (!normalized.authorEmail || normalized.authorEmail.length > POST_COMMENT_EMAIL_MAX_LENGTH || !isValidPostCommentEmail(normalized.authorEmail)) {
    return 'Please enter a valid email address.';
  }

  if (
    normalized.body.length < POST_COMMENT_BODY_MIN_LENGTH ||
    normalized.body.length > POST_COMMENT_BODY_MAX_LENGTH
  ) {
    return `Please keep your comment between ${POST_COMMENT_BODY_MIN_LENGTH} and ${POST_COMMENT_BODY_MAX_LENGTH} characters.`;
  }

  return null;
}
