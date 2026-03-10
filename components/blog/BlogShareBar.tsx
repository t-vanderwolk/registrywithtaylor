'use client';

import { useState } from 'react';

type BlogShareBarProps = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  pinterestDescription: string;
  instagramCaption: string;
  redditSummary: string;
};

type ShareAction = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => Promise<void> | void;
  dataAttributes?: Record<string, string>;
};

const iconButtonClassName =
  'inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(215,161,175,0.28)] bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tmbc-blog-rose)] transition hover:-translate-y-0.5 hover:border-[rgba(184,116,138,0.34)] hover:bg-[var(--tmbc-blog-blush-soft)] hover:text-[var(--tmbc-blog-charcoal)]';

export default function BlogShareBar({
  title,
  description,
  url,
  imageUrl,
  pinterestDescription,
  instagramCaption,
  redditSummary,
}: BlogShareBarProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [instagramState, setInstagramState] = useState<'idle' | 'copied'>('idle');

  const shareActions: ShareAction[] = [
    {
      id: 'pinterest',
      label: 'Pinterest',
      href: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(pinterestDescription)}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`,
      dataAttributes: imageUrl
        ? {
            'data-pin-media': imageUrl,
            'data-pin-description': pinterestDescription,
          }
        : {
            'data-pin-description': pinterestDescription,
          },
    },
    {
      id: 'instagram',
      label: instagramState === 'copied' ? 'IG Copied' : 'Instagram',
      onClick: async () => {
        await navigator.clipboard.writeText(`${instagramCaption}\n\n${url}`);
        setInstagramState('copied');
        window.setTimeout(() => setInstagramState('idle'), 1800);
      },
    },
    {
      id: 'twitter',
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      id: 'reddit',
      label: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(redditSummary)}`,
    },
    {
      id: 'email',
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    },
    {
      id: 'copy',
      label: copyState === 'copied' ? 'Link Copied' : 'Copy Link',
      onClick: async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title, text: description, url });
            return;
          } catch {
            // fall through to clipboard copy when share is canceled or unsupported.
          }
        }

        await navigator.clipboard.writeText(url);
        setCopyState('copied');
        window.setTimeout(() => setCopyState('idle'), 1800);
      },
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {shareActions.map((action) =>
        action.href ? (
          <a
            key={action.id}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className={iconButtonClassName}
            {...action.dataAttributes}
          >
            {action.label}
          </a>
        ) : (
          <button key={action.id} type="button" onClick={() => void action.onClick?.()} className={iconButtonClassName}>
            {action.label}
          </button>
        ),
      )}
    </div>
  );
}
