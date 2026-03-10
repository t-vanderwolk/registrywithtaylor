'use client';

import { useEffect, useState } from 'react';

type BlogCardActionsProps = {
  slug: string;
  title: string;
};

const STORAGE_KEY = 'tmbc-saved-posts';

const buttonClassName =
  'inline-flex min-h-[40px] items-center rounded-full border border-[rgba(215,161,175,0.28)] bg-white px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--tmbc-blog-rose)] transition hover:border-[rgba(184,116,138,0.34)] hover:bg-[var(--tmbc-blog-blush-soft)] hover:text-[var(--tmbc-blog-charcoal)]';

export default function BlogCardActions({ slug, title }: BlogCardActionsProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedPosts = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      setSaved(savedPosts.includes(slug));
    } catch {
      setSaved(false);
    }
  }, [slug]);

  const handleSave = () => {
    try {
      const savedPosts = new Set<string>(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'));
      if (savedPosts.has(slug)) {
        savedPosts.delete(slug);
        setSaved(false);
      } else {
        savedPosts.add(slug);
        setSaved(true);
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedPosts]));
    } catch {
      setSaved((current) => !current);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard copy
      }
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => void handleShare()} className={buttonClassName}>
        Share
      </button>
      <button type="button" onClick={handleSave} className={buttonClassName}>
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}
