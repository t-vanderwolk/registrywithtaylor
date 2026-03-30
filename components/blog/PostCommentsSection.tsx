'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  getPostCommentValidationError,
  normalizePostCommentSubmission,
  type BlogPostComment,
} from '@/lib/blog/postComments';

type SubmitState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const inputClassName =
  'w-full rounded-[22px] border border-[rgba(215,161,175,0.24)] bg-white px-4 py-3 text-[0.98rem] text-[var(--tmbc-blog-charcoal)] shadow-[0_16px_32px_rgba(82,62,68,0.03)] transition focus:border-[rgba(184,116,138,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(232,154,174,0.18)]';

const formatCommentDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export default function PostCommentsSection({
  postId,
  comments: initialComments,
}: {
  postId: string;
  comments: BlogPostComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const authorNameValue = formData.get('authorName');
    const authorEmailValue = formData.get('authorEmail');
    const bodyValue = formData.get('body');
    const normalized = normalizePostCommentSubmission({
      authorName: typeof authorNameValue === 'string' ? authorNameValue : '',
      authorEmail: typeof authorEmailValue === 'string' ? authorEmailValue : '',
      body: typeof bodyValue === 'string' ? bodyValue : '',
    });
    const validationError = getPostCommentValidationError(normalized);

    if (validationError) {
      setSubmitState({ type: 'error', message: validationError });
      return;
    }

    formData.set('authorName', normalized.authorName);
    formData.set('authorEmail', normalized.authorEmail);
    formData.set('body', normalized.body);
    setSubmitState({ type: 'submitting' });

    try {
      const response = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; comment?: BlogPostComment }
        | null;

      if (!response.ok || !payload?.comment) {
        throw new Error(payload?.error || 'Something went wrong while saving your comment.');
      }

      form.reset();
      setComments((currentComments) => [...currentComments, payload.comment as BlogPostComment]);
      setSubmitState({
        type: 'success',
        message:
          comments.length === 0
            ? 'Your comment is live. You officially started the conversation.'
            : 'Your comment is live.',
      });
    } catch (error) {
      setSubmitState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong while saving your comment.',
      });
    }
  };

  return (
    <section className="blog-section-soft px-4 py-6 sm:px-6 sm:py-7">
      <div className="space-y-4">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Reader Notes</p>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.55rem)] leading-[1.08] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
          Leave a Comment
        </h2>
        <p className="max-w-3xl text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">
          Ask a question, add your experience, or leave the kind of note you would have wanted to find while figuring this
          out yourself.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="space-y-4">
          <div className="tmbc-blog-soft-card px-5 py-5 sm:px-6">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--tmbc-blog-soft-text)]">
              Your email stays private. Your name and comment will appear publicly.
            </p>
          </div>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <article key={comment.id} className="tmbc-blog-soft-card px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base font-medium text-[var(--tmbc-blog-charcoal)]">{comment.authorName}</p>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                  <time className="text-sm text-[var(--tmbc-blog-soft-text)]" dateTime={comment.createdAt}>
                    {formatCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                  {comment.body}
                </p>
              </article>
            ))
          ) : (
            <div className="tmbc-blog-soft-card px-5 py-6 sm:px-6">
              <p className="text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                No comments yet. Be the first to add something helpful.
              </p>
            </div>
          )}
        </div>

        <form className="tmbc-blog-soft-card space-y-5 px-5 py-5 sm:px-6" noValidate onSubmit={handleSubmit}>
          <input type="text" name="website" value="" tabIndex={-1} autoComplete="off" readOnly className="hidden" />

          <div className="space-y-2">
            <label htmlFor="post-comment-name" className="text-sm font-medium text-[var(--tmbc-blog-charcoal)]">
              Name
            </label>
            <input
              id="post-comment-name"
              name="authorName"
              type="text"
              maxLength={80}
              required
              className={inputClassName}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="post-comment-email" className="text-sm font-medium text-[var(--tmbc-blog-charcoal)]">
              Email
            </label>
            <input
              id="post-comment-email"
              name="authorEmail"
              type="email"
              maxLength={254}
              required
              className={inputClassName}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="post-comment-body" className="text-sm font-medium text-[var(--tmbc-blog-charcoal)]">
              Comment
            </label>
            <textarea
              id="post-comment-body"
              name="body"
              required
              minLength={3}
              maxLength={2000}
              rows={7}
              className={`${inputClassName} resize-y`}
              placeholder="Share your question or experience here."
            />
          </div>

          <p className="text-sm leading-7 text-[var(--tmbc-blog-soft-text)]">
            Keep it kind, clear, and useful. The internet has enough chaos already.
          </p>

          {submitState.type === 'submitting' ? (
            <p aria-live="polite" className="text-sm leading-7 text-[var(--tmbc-blog-soft-text)]">
              Posting your comment...
            </p>
          ) : submitState.type !== 'idle' ? (
            <p
              aria-live="polite"
              className={
                submitState.type === 'error'
                  ? 'text-sm leading-7 text-[color:#8f4a5d]'
                  : 'text-sm leading-7 text-[var(--tmbc-blog-soft-text)]'
              }
            >
              {submitState.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitState.type === 'submitting'}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--tmbc-blog-charcoal)] px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[color:#4d3a40] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitState.type === 'submitting' ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </section>
  );
}
